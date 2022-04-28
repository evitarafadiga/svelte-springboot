var app = (function () {
	'use strict';

	function noop() {}

	function assign(tar, src) {
		for (const k in src) tar[k] = src[k];
		return tar;
	}

	function is_promise(value) {
		return value && typeof value.then === 'function';
	}

	function add_location(element, file, line, column, char) {
		element.__svelte_meta = {
			loc: { file, line, column, char }
		};
	}

	function run(fn) {
		return fn();
	}

	function blank_object() {
		return Object.create(null);
	}

	function run_all(fns) {
		fns.forEach(run);
	}

	function is_function(thing) {
		return typeof thing === 'function';
	}

	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	function create_slot(definition, ctx, fn) {
		if (definition) {
			const slot_ctx = get_slot_context(definition, ctx, fn);
			return definition[0](slot_ctx);
		}
	}

	function get_slot_context(definition, ctx, fn) {
		return definition[1]
			? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
			: ctx.$$scope.ctx;
	}

	function get_slot_changes(definition, ctx, changed, fn) {
		return definition[1]
			? assign({}, assign(ctx.$$scope.changed || {}, definition[1](fn ? fn(changed) : {})))
			: ctx.$$scope.changed || {};
	}

	function append(target, node) {
		target.appendChild(node);
	}

	function insert(target, node, anchor) {
		target.insertBefore(node, anchor);
	}

	function detach(node) {
		node.parentNode.removeChild(node);
	}

	function destroy_each(iterations, detaching) {
		for (let i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d(detaching);
		}
	}

	function element(name) {
		return document.createElement(name);
	}

	function text(data) {
		return document.createTextNode(data);
	}

	function space() {
		return text(' ');
	}

	function empty() {
		return text('');
	}

	function listen(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	function children(element) {
		return Array.from(element.childNodes);
	}

	function set_data(text, data) {
		data = '' + data;
		if (text.data !== data) text.data = data;
	}

	function set_style(node, key, value) {
		node.style.setProperty(key, value);
	}

	let current_component;

	function set_current_component(component) {
		current_component = component;
	}

	const dirty_components = [];

	const resolved_promise = Promise.resolve();
	let update_scheduled = false;
	const binding_callbacks = [];
	const render_callbacks = [];
	const flush_callbacks = [];

	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			resolved_promise.then(flush);
		}
	}

	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}

	function flush() {
		const seen_callbacks = new Set();

		do {
			// first, call beforeUpdate functions
			// and update components
			while (dirty_components.length) {
				const component = dirty_components.shift();
				set_current_component(component);
				update(component.$$);
			}

			while (binding_callbacks.length) binding_callbacks.shift()();

			// then, once components are updated, call
			// afterUpdate functions. This may cause
			// subsequent updates...
			while (render_callbacks.length) {
				const callback = render_callbacks.pop();
				if (!seen_callbacks.has(callback)) {
					callback();

					// ...so guard against infinite loops
					seen_callbacks.add(callback);
				}
			}
		} while (dirty_components.length);

		while (flush_callbacks.length) {
			flush_callbacks.pop()();
		}

		update_scheduled = false;
	}

	function update($$) {
		if ($$.fragment) {
			$$.update($$.dirty);
			run_all($$.before_render);
			$$.fragment.p($$.dirty, $$.ctx);
			$$.dirty = null;

			$$.after_render.forEach(add_render_callback);
		}
	}

	let outros;

	function group_outros() {
		outros = {
			remaining: 0,
			callbacks: []
		};
	}

	function check_outros() {
		if (!outros.remaining) {
			run_all(outros.callbacks);
		}
	}

	function on_outro(callback) {
		outros.callbacks.push(callback);
	}

	function handle_promise(promise, info) {
		const token = info.token = {};

		function update(type, index, key, value) {
			if (info.token !== token) return;

			info.resolved = key && { [key]: value };

			const child_ctx = assign(assign({}, info.ctx), info.resolved);
			const block = type && (info.current = type)(child_ctx);

			if (info.block) {
				if (info.blocks) {
					info.blocks.forEach((block, i) => {
						if (i !== index && block) {
							group_outros();
							on_outro(() => {
								block.d(1);
								info.blocks[i] = null;
							});
							block.o(1);
							check_outros();
						}
					});
				} else {
					info.block.d(1);
				}

				block.c();
				if (block.i) block.i(1);
				block.m(info.mount(), info.anchor);

				flush();
			}

			info.block = block;
			if (info.blocks) info.blocks[index] = block;
		}

		if (is_promise(promise)) {
			promise.then(value => {
				update(info.then, 1, info.value, value);
			}, error => {
				update(info.catch, 2, info.error, error);
			});

			// if we previously had a then/catch block, destroy it
			if (info.current !== info.pending) {
				update(info.pending, 0);
				return true;
			}
		} else {
			if (info.current !== info.then) {
				update(info.then, 1, info.value, promise);
				return true;
			}

			info.resolved = { [info.value]: promise };
		}
	}

	function mount_component(component, target, anchor) {
		const { fragment, on_mount, on_destroy, after_render } = component.$$;

		fragment.m(target, anchor);

		// onMount happens after the initial afterUpdate. Because
		// afterUpdate callbacks happen in reverse order (inner first)
		// we schedule onMount callbacks before afterUpdate callbacks
		add_render_callback(() => {
			const new_on_destroy = on_mount.map(run).filter(is_function);
			if (on_destroy) {
				on_destroy.push(...new_on_destroy);
			} else {
				// Edge case - component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});

		after_render.forEach(add_render_callback);
	}

	function destroy(component, detaching) {
		if (component.$$) {
			run_all(component.$$.on_destroy);
			component.$$.fragment.d(detaching);

			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			component.$$.on_destroy = component.$$.fragment = null;
			component.$$.ctx = {};
		}
	}

	function make_dirty(component, key) {
		if (!component.$$.dirty) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty = {};
		}
		component.$$.dirty[key] = true;
	}

	function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
		const parent_component = current_component;
		set_current_component(component);

		const props = options.props || {};

		const $$ = component.$$ = {
			fragment: null,
			ctx: null,

			// state
			props: prop_names,
			update: noop,
			not_equal: not_equal$$1,
			bound: blank_object(),

			// lifecycle
			on_mount: [],
			on_destroy: [],
			before_render: [],
			after_render: [],
			context: new Map(parent_component ? parent_component.$$.context : []),

			// everything else
			callbacks: blank_object(),
			dirty: null
		};

		let ready = false;

		$$.ctx = instance
			? instance(component, props, (key, value) => {
				if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
					if ($$.bound[key]) $$.bound[key](value);
					if (ready) make_dirty(component, key);
				}
			})
			: props;

		$$.update();
		ready = true;
		run_all($$.before_render);
		$$.fragment = create_fragment($$.ctx);

		if (options.target) {
			if (options.hydrate) {
				$$.fragment.l(children(options.target));
			} else {
				$$.fragment.c();
			}

			if (options.intro && component.$$.fragment.i) component.$$.fragment.i();
			mount_component(component, options.target, options.anchor);
			flush();
		}

		set_current_component(parent_component);
	}

	class SvelteComponent {
		$destroy() {
			destroy(this, true);
			this.$destroy = noop;
		}

		$on(type, callback) {
			const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
			callbacks.push(callback);

			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		$set() {
			// overridden by instance, if it has props
		}
	}

	class SvelteComponentDev extends SvelteComponent {
		constructor(options) {
			if (!options || (!options.target && !options.$$inline)) {
				throw new Error(`'target' is a required option`);
			}

			super();
		}

		$destroy() {
			super.$destroy();
			this.$destroy = () => {
				console.warn(`Component was already destroyed`); // eslint-disable-line no-console
			};
		}
	}

	function writable(value, start = noop) {
		let stop;
		const subscribers = [];

		function set(new_value) {
			if (safe_not_equal(value, new_value)) {
				value = new_value;
				if (!stop) return; // not ready
				subscribers.forEach(s => s[1]());
				subscribers.forEach(s => s[0](value));
			}
		}

		function update(fn) {
			set(fn(value));
		}

		function subscribe(run, invalidate = noop) {
			const subscriber = [run, invalidate];
			subscribers.push(subscriber);
			if (subscribers.length === 1) stop = start(set) || noop;
			run(value);

			return () => {
				const index = subscribers.indexOf(subscriber);
				if (index !== -1) subscribers.splice(index, 1);
				if (subscribers.length === 0) stop();
			};
		}

		return { set, update, subscribe };
	}

	const hash = writable('');

	hashSetter();

	window.onhashchange = () => hashSetter();

	function hashSetter() {
	  hash.set(
	    location.hash.length >= 2 
	    ? location.hash.substring(2) 
	    : ''
	  );
	}

	/* src/app/lib/objects/Rectangle.svelte generated by Svelte v3.1.0 */

	const file = "src/app/lib/objects/Rectangle.svelte";

	function create_fragment(ctx) {
		var div1, button, div0, current;

		const default_slot_1 = ctx.$$slots.default;
		const default_slot = create_slot(default_slot_1, ctx, null);

		return {
			c: function create() {
				div1 = element("div");
				button = element("button");
				div0 = element("div");

				if (default_slot) default_slot.c();

				div0.className = "content";
				add_location(div0, file, 6, 8, 90);
				button.className = "wrapper svelte-rtth4s";
				add_location(button, file, 5, 4, 57);
				div1.className = "container svelte-rtth4s";
				add_location(div1, file, 4, 0, 29);
			},

			l: function claim(nodes) {
				if (default_slot) default_slot.l(div0_nodes);
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div1, anchor);
				append(div1, button);
				append(button, div0);

				if (default_slot) {
					default_slot.m(div0, null);
				}

				current = true;
			},

			p: function update(changed, ctx) {
				if (default_slot && default_slot.p && changed.$$scope) {
					default_slot.p(get_slot_changes(default_slot_1, ctx, changed,), get_slot_context(default_slot_1, ctx, null));
				}
			},

			i: function intro(local) {
				if (current) return;
				if (default_slot && default_slot.i) default_slot.i(local);
				current = true;
			},

			o: function outro(local) {
				if (default_slot && default_slot.o) default_slot.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(div1);
				}

				if (default_slot) default_slot.d(detaching);
			}
		};
	}

	function instance($$self, $$props, $$invalidate) {
		let { $$slots = {}, $$scope } = $$props;

		$$self.$set = $$props => {
			if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
		};

		return { $$slots, $$scope };
	}

	class Rectangle extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance, create_fragment, safe_not_equal, []);
		}
	}

	/* src/app/lib/component/Perfil.svelte generated by Svelte v3.1.0 */

	const file$1 = "src/app/lib/component/Perfil.svelte";

	// (9:0) <Rectangle>
	function create_default_slot(ctx) {
		var div2, figure, img, t0, div1, t1, t2, div0;

		return {
			c: function create() {
				div2 = element("div");
				figure = element("figure");
				img = element("img");
				t0 = space();
				div1 = element("div");
				t1 = text(ctx.username);
				t2 = space();
				div0 = element("div");
				div0.textContent = "Carreiras";
				img.src = src;
				img.alt = "Profile default";
				img.className = "svelte-1wc7zi5";
				add_location(img, file$1, 11, 12, 213);
				figure.className = "svelte-1wc7zi5";
				add_location(figure, file$1, 10, 8, 192);
				div0.className = "carreiras";
				add_location(div0, file$1, 15, 12, 321);
				add_location(div1, file$1, 13, 8, 280);
				div2.className = "wrapper svelte-1wc7zi5";
				add_location(div2, file$1, 9, 4, 162);
			},

			m: function mount(target, anchor) {
				insert(target, div2, anchor);
				append(div2, figure);
				append(figure, img);
				append(div2, t0);
				append(div2, div1);
				append(div1, t1);
				append(div1, t2);
				append(div1, div0);
			},

			p: function update(changed, ctx) {
				if (changed.username) {
					set_data(t1, ctx.username);
				}
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(div2);
				}
			}
		};
	}

	function create_fragment$1(ctx) {
		var current;

		var rectangle = new Rectangle({
			props: {
			$$slots: { default: [create_default_slot] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		return {
			c: function create() {
				rectangle.$$.fragment.c();
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				mount_component(rectangle, target, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				var rectangle_changes = {};
				if (changed.$$scope || changed.username) rectangle_changes.$$scope = { changed, ctx };
				rectangle.$set(rectangle_changes);
			},

			i: function intro(local) {
				if (current) return;
				rectangle.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				rectangle.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				rectangle.$destroy(detaching);
			}
		};
	}

	let src = '../src/app/public/profile-picture.png';

	function instance$1($$self, $$props, $$invalidate) {
		let { username } = $$props;

		$$self.$set = $$props => {
			if ('username' in $$props) $$invalidate('username', username = $$props.username);
		};

		return { username };
	}

	class Perfil extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$1, create_fragment$1, safe_not_equal, ["username"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.username === undefined && !('username' in props)) {
				console.warn("<Perfil> was created without expected prop 'username'");
			}
		}

		get username() {
			throw new Error("<Perfil>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set username(value) {
			throw new Error("<Perfil>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/app/lib/objects/Box.svelte generated by Svelte v3.1.0 */

	const file$2 = "src/app/lib/objects/Box.svelte";

	function create_fragment$2(ctx) {
		var div1, button, div0, h1, t, dispose;

		return {
			c: function create() {
				div1 = element("div");
				button = element("button");
				div0 = element("div");
				h1 = element("h1");
				t = text(ctx.topic);
				h1.className = "svelte-vgqem4";
				add_location(h1, file$2, 9, 12, 175);
				div0.className = "content svelte-vgqem4";
				add_location(div0, file$2, 8, 8, 141);
				button.className = "wrapper svelte-vgqem4";
				add_location(button, file$2, 7, 4, 92);
				div1.className = "container svelte-vgqem4";
				add_location(div1, file$2, 6, 0, 64);
				dispose = listen(button, "click", ctx.func);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div1, anchor);
				append(div1, button);
				append(button, div0);
				append(div0, h1);
				append(h1, t);
			},

			p: function update(changed, ctx) {
				if (changed.topic) {
					set_data(t, ctx.topic);
				}
			},

			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(div1);
				}

				dispose();
			}
		};
	}

	function instance$2($$self, $$props, $$invalidate) {
		let { topic, func } = $$props;

		$$self.$set = $$props => {
			if ('topic' in $$props) $$invalidate('topic', topic = $$props.topic);
			if ('func' in $$props) $$invalidate('func', func = $$props.func);
		};

		return { topic, func };
	}

	class Box extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$2, create_fragment$2, safe_not_equal, ["topic", "func"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.topic === undefined && !('topic' in props)) {
				console.warn("<Box> was created without expected prop 'topic'");
			}
			if (ctx.func === undefined && !('func' in props)) {
				console.warn("<Box> was created without expected prop 'func'");
			}
		}

		get topic() {
			throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set topic(value) {
			throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get func() {
			throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set func(value) {
			throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/app/lib/component/GetList.svelte generated by Svelte v3.1.0 */

	const file$3 = "src/app/lib/component/GetList.svelte";

	function get_each_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.element = list[i];
		return child_ctx;
	}

	// (22:0) {:catch error}
	function create_catch_block(ctx) {
		var p, t_value = ctx.error.message, t;

		return {
			c: function create() {
				p = element("p");
				t = text(t_value);
				set_style(p, "color", "red");
				add_location(p, file$3, 22, 1, 370);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
				append(p, t);
			},

			p: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(p);
				}
			}
		};
	}

	// (18:0) {:then response}
	function create_then_block(ctx) {
		var each_1_anchor;

		var each_value = ctx.response;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
		}

		return {
			c: function create() {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each_1_anchor = empty();
			},

			m: function mount(target, anchor) {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(target, anchor);
				}

				insert(target, each_1_anchor, anchor);
			},

			p: function update(changed, ctx) {
				if (changed.promise) {
					each_value = ctx.response;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}
			},

			d: function destroy(detaching) {
				destroy_each(each_blocks, detaching);

				if (detaching) {
					detach(each_1_anchor);
				}
			}
		};
	}

	// (19:1) {#each response as element}
	function create_each_block(ctx) {
		var p, t0, t1_value = ctx.element, t1;

		return {
			c: function create() {
				p = element("p");
				t0 = text("The number is ");
				t1 = text(t1_value);
				add_location(p, file$3, 19, 3, 314);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
				append(p, t0);
				append(p, t1);
			},

			p: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(p);
				}
			}
		};
	}

	// (16:16)   <p>...carregando</p> {:then response}
	function create_pending_block(ctx) {
		var p;

		return {
			c: function create() {
				p = element("p");
				p.textContent = "...carregando";
				add_location(p, file$3, 16, 1, 244);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
			},

			p: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(p);
				}
			}
		};
	}

	function create_fragment$3(ctx) {
		var await_block_anchor, promise_1;

		let info = {
			ctx,
			current: null,
			pending: create_pending_block,
			then: create_then_block,
			catch: create_catch_block,
			value: 'response',
			error: 'error'
		};

		handle_promise(promise_1 = ctx.promise, info);

		return {
			c: function create() {
				await_block_anchor = empty();

				info.block.c();
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, await_block_anchor, anchor);

				info.block.m(target, info.anchor = anchor);
				info.mount = () => await_block_anchor.parentNode;
				info.anchor = await_block_anchor;
			},

			p: function update(changed, new_ctx) {
				ctx = new_ctx;
				info.ctx = ctx;

				if (promise_1 !== (promise_1 = ctx.promise) && handle_promise(promise_1, info)) ; else {
					info.block.p(changed, assign(assign({}, ctx), info.resolved));
				}
			},

			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(await_block_anchor);
				}

				info.block.d(detaching);
				info = null;
			}
		};
	}

	async function getList() {
	    const res = await fetch(`list`);
		const text = await res.json();

		if (res.ok) {
			return text;
		} else {
			throw new Error(text);
		} 
	  }

	function instance$3($$self) {
		let promise = getList();

		return { promise };
	}

	class GetList extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$3, create_fragment$3, safe_not_equal, []);
		}
	}

	/* src/app/lib/component/Trends.svelte generated by Svelte v3.1.0 */

	const file$4 = "src/app/lib/component/Trends.svelte";

	function create_fragment$4(ctx) {
		var div1, div0, current;

		var getlist = new GetList({ $$inline: true });

		return {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				getlist.$$.fragment.c();
				div0.className = "wrapper svelte-exjxrr";
				add_location(div0, file$4, 6, 4, 96);
				div1.className = "container svelte-exjxrr";
				add_location(div1, file$4, 5, 0, 68);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div1, anchor);
				append(div1, div0);
				mount_component(getlist, div0, null);
				current = true;
			},

			p: noop,

			i: function intro(local) {
				if (current) return;
				getlist.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				getlist.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(div1);
				}

				getlist.$destroy();
			}
		};
	}

	class Trends extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$4, safe_not_equal, []);
		}
	}

	/* src/app/pages/Homepage.svelte generated by Svelte v3.1.0 */

	const file$5 = "src/app/pages/Homepage.svelte";

	function create_fragment$5(ctx) {
		var div3, div2, div0, t0, t1, div1, t2, t3, current;

		var perfil = new Perfil({ $$inline: true });

		var trends = new Trends({ $$inline: true });

		var box0 = new Box({
			props: { topic: "Assuntos", func: crudAssunto },
			$$inline: true
		});

		var box1 = new Box({
			props: { topic: "Roadmaps", func: crudRoadmap },
			$$inline: true
		});

		var box2 = new Box({
			props: { topic: "Tendências", func: viewTrends },
			$$inline: true
		});

		return {
			c: function create() {
				div3 = element("div");
				div2 = element("div");
				div0 = element("div");
				perfil.$$.fragment.c();
				t0 = space();
				trends.$$.fragment.c();
				t1 = space();
				div1 = element("div");
				box0.$$.fragment.c();
				t2 = space();
				box1.$$.fragment.c();
				t3 = space();
				box2.$$.fragment.c();
				div0.className = "content svelte-103ds7h";
				add_location(div0, file$5, 23, 4, 495);
				div1.className = "content svelte-103ds7h";
				add_location(div1, file$5, 28, 4, 571);
				div2.className = "wrapper svelte-103ds7h";
				add_location(div2, file$5, 22, 2, 469);
				div3.className = "container svelte-103ds7h";
				add_location(div3, file$5, 21, 0, 443);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div3, anchor);
				append(div3, div2);
				append(div2, div0);
				mount_component(perfil, div0, null);
				append(div0, t0);
				mount_component(trends, div0, null);
				append(div2, t1);
				append(div2, div1);
				mount_component(box0, div1, null);
				append(div1, t2);
				mount_component(box1, div1, null);
				append(div1, t3);
				mount_component(box2, div1, null);
				current = true;
			},

			p: function update(changed, ctx) {
				var box0_changes = {};
				if (changed.crudAssunto) box0_changes.func = crudAssunto;
				box0.$set(box0_changes);

				var box1_changes = {};
				if (changed.crudRoadmap) box1_changes.func = crudRoadmap;
				box1.$set(box1_changes);

				var box2_changes = {};
				if (changed.viewTrends) box2_changes.func = viewTrends;
				box2.$set(box2_changes);
			},

			i: function intro(local) {
				if (current) return;
				perfil.$$.fragment.i(local);

				trends.$$.fragment.i(local);

				box0.$$.fragment.i(local);

				box1.$$.fragment.i(local);

				box2.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				perfil.$$.fragment.o(local);
				trends.$$.fragment.o(local);
				box0.$$.fragment.o(local);
				box1.$$.fragment.o(local);
				box2.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(div3);
				}

				perfil.$destroy();

				trends.$destroy();

				box0.$destroy();

				box1.$destroy();

				box2.$destroy();
			}
		};
	}

	function crudAssunto(event) {
	  console.log("Assunto.");
	}

	function crudRoadmap(event) {
	  console.log("Roadmaps.");
	}

	function viewTrends(event) {
	  console.log("Tendências.");
	  
	}

	class Homepage extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$5, safe_not_equal, []);
		}
	}

	/* src/app/pages/Notfound.svelte generated by Svelte v3.1.0 */

	const file$6 = "src/app/pages/Notfound.svelte";

	function create_fragment$6(ctx) {
		var h1;

		return {
			c: function create() {
				h1 = element("h1");
				h1.textContent = "Conteúdo não encontrado.";
				add_location(h1, file$6, 0, 0, 0);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, h1, anchor);
			},

			p: noop,
			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(h1);
				}
			}
		};
	}

	class Notfound extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$6, safe_not_equal, []);
		}
	}

	/* src/app/lib/component/GetListAssunto.svelte generated by Svelte v3.1.0 */

	const file$7 = "src/app/lib/component/GetListAssunto.svelte";

	function get_each_context$1(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.element = list[i];
		return child_ctx;
	}

	// (25:2) {:catch error}
	function create_catch_block$1(ctx) {
		var p, t_value = ctx.error.message, t;

		return {
			c: function create() {
				p = element("p");
				t = text(t_value);
				set_style(p, "color", "red");
				add_location(p, file$7, 25, 6, 611);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
				append(p, t);
			},

			p: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(p);
				}
			}
		};
	}

	// (18:2) {:then response}
	function create_then_block$1(ctx) {
		var each_1_anchor;

		var each_value = ctx.response;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
		}

		return {
			c: function create() {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each_1_anchor = empty();
			},

			m: function mount(target, anchor) {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(target, anchor);
				}

				insert(target, each_1_anchor, anchor);
			},

			p: function update(changed, ctx) {
				if (changed.promise) {
					each_value = ctx.response;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$1(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block$1(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}
			},

			d: function destroy(detaching) {
				destroy_each(each_blocks, detaching);

				if (detaching) {
					detach(each_1_anchor);
				}
			}
		};
	}

	// (19:6) {#each response as element}
	function create_each_block$1(ctx) {
		var div, p0, t0, t1_value = ctx.element.descricao, t1, t2, t3_value = ctx.element.id, t3, t4, p1, t5, t6_value = ctx.element.criadoEm, t6, t7, t8_value = ctx.element.fonte, t8, t9;

		return {
			c: function create() {
				div = element("div");
				p0 = element("p");
				t0 = text("Assunto: ");
				t1 = text(t1_value);
				t2 = text(" id:");
				t3 = text(t3_value);
				t4 = space();
				p1 = element("p");
				t5 = text("criado em:");
				t6 = text(t6_value);
				t7 = text(" Fonte: ");
				t8 = text(t8_value);
				t9 = space();
				add_location(p0, file$7, 20, 8, 440);
				add_location(p1, file$7, 21, 8, 500);
				add_location(div, file$7, 19, 8, 426);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, p0);
				append(p0, t0);
				append(p0, t1);
				append(p0, t2);
				append(p0, t3);
				append(div, t4);
				append(div, p1);
				append(p1, t5);
				append(p1, t6);
				append(p1, t7);
				append(p1, t8);
				append(div, t9);
			},

			p: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(div);
				}
			}
		};
	}

	// (16:18)        <p>...carregando</p>   {:then response}
	function create_pending_block$1(ctx) {
		var p;

		return {
			c: function create() {
				p = element("p");
				p.textContent = "...carregando";
				add_location(p, file$7, 16, 6, 344);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
			},

			p: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(p);
				}
			}
		};
	}

	function create_fragment$7(ctx) {
		var await_block_anchor, promise_1;

		let info = {
			ctx,
			current: null,
			pending: create_pending_block$1,
			then: create_then_block$1,
			catch: create_catch_block$1,
			value: 'response',
			error: 'error'
		};

		handle_promise(promise_1 = ctx.promise, info);

		return {
			c: function create() {
				await_block_anchor = empty();

				info.block.c();
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, await_block_anchor, anchor);

				info.block.m(target, info.anchor = anchor);
				info.mount = () => await_block_anchor.parentNode;
				info.anchor = await_block_anchor;
			},

			p: function update(changed, new_ctx) {
				ctx = new_ctx;
				info.ctx = ctx;

				if (promise_1 !== (promise_1 = ctx.promise) && handle_promise(promise_1, info)) ; else {
					info.block.p(changed, assign(assign({}, ctx), info.resolved));
				}
			},

			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(await_block_anchor);
				}

				info.block.d(detaching);
				info = null;
			}
		};
	}

	async function getListAssunto() {
	    const res = await fetch(`listaassuntos`);
	        const text = await res.json();

	        if (res.ok) {
	            return text;
	        } else {
	            throw new Error(text);
	        } 
	  }

	function instance$4($$self) {
		let promise = getListAssunto();

		return { promise };
	}

	class GetListAssunto extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$4, create_fragment$7, safe_not_equal, []);
		}
	}

	/* src/app/pages/ListaAssuntos.svelte generated by Svelte v3.1.0 */

	const file$8 = "src/app/pages/ListaAssuntos.svelte";

	function create_fragment$8(ctx) {
		var h1, t_1, current;

		var getlistassunto = new GetListAssunto({ $$inline: true });

		return {
			c: function create() {
				h1 = element("h1");
				h1.textContent = "Lista de Assuntos";
				t_1 = space();
				getlistassunto.$$.fragment.c();
				add_location(h1, file$8, 4, 0, 91);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, h1, anchor);
				insert(target, t_1, anchor);
				mount_component(getlistassunto, target, anchor);
				current = true;
			},

			p: noop,

			i: function intro(local) {
				if (current) return;
				getlistassunto.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				getlistassunto.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(h1);
					detach(t_1);
				}

				getlistassunto.$destroy(detaching);
			}
		};
	}

	class ListaAssuntos extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$8, safe_not_equal, []);
		}
	}

	/* src/app/pages/Assuntos.svelte generated by Svelte v3.1.0 */

	const file$9 = "src/app/pages/Assuntos.svelte";

	function create_fragment$9(ctx) {
		var p;

		return {
			c: function create() {
				p = element("p");
				p.textContent = "Assuntos";
				add_location(p, file$9, 4, 0, 21);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
			},

			p: noop,
			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(p);
				}
			}
		};
	}

	class Assuntos extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$9, safe_not_equal, []);
		}
	}

	/* src/app/pages/Roadmaps.svelte generated by Svelte v3.1.0 */

	function create_fragment$a(ctx) {
		return {
			c: noop,

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: noop,
			p: noop,
			i: noop,
			o: noop,
			d: noop
		};
	}

	class Roadmaps extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$a, safe_not_equal, []);
		}
	}

	/* src/app/pages/Tendencias.svelte generated by Svelte v3.1.0 */

	function create_fragment$b(ctx) {
		return {
			c: noop,

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: noop,
			p: noop,
			i: noop,
			o: noop,
			d: noop
		};
	}

	class Tendencias extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$b, safe_not_equal, []);
		}
	}

	/* src/app/lib/component/GetListRoadmaps.svelte generated by Svelte v3.1.0 */

	const file$a = "src/app/lib/component/GetListRoadmaps.svelte";

	function get_each_context$2(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.element = list[i];
		return child_ctx;
	}

	// (26:2) {:catch error}
	function create_catch_block$2(ctx) {
		var p, t_value = ctx.error.message, t;

		return {
			c: function create() {
				p = element("p");
				t = text(t_value);
				set_style(p, "color", "red");
				add_location(p, file$a, 26, 6, 773);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
				append(p, t);
			},

			p: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(p);
				}
			}
		};
	}

	// (18:2) {:then response}
	function create_then_block$2(ctx) {
		var each_1_anchor;

		var each_value = ctx.response;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
		}

		return {
			c: function create() {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each_1_anchor = empty();
			},

			m: function mount(target, anchor) {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(target, anchor);
				}

				insert(target, each_1_anchor, anchor);
			},

			p: function update(changed, ctx) {
				if (changed.promise) {
					each_value = ctx.response;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$2(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block$2(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}
			},

			d: function destroy(detaching) {
				destroy_each(each_blocks, detaching);

				if (detaching) {
					detach(each_1_anchor);
				}
			}
		};
	}

	// (19:6) {#each response as element}
	function create_each_block$2(ctx) {
		var div, p0, t0, t1_value = ctx.element.nome, t1, t2, t3_value = ctx.element.id, t3, t4, t5_value = ctx.element.qtdFavoritos, t5, t6, t7_value = ctx.element.qtdCompartilhamento, t7, t8, p1, t9, t10_value = ctx.element.criadoEm, t10, t11, t12_value = ctx.element.atualizadoEm, t12, t13, t14_value = ctx.element.fonte, t14, t15, p2, t16, t17_value = ctx.element.descricao, t17, t18;

		return {
			c: function create() {
				div = element("div");
				p0 = element("p");
				t0 = text("Roadmap: ");
				t1 = text(t1_value);
				t2 = text(" id:");
				t3 = text(t3_value);
				t4 = text(" favoritos: ");
				t5 = text(t5_value);
				t6 = text(" compartilhamentos: ");
				t7 = text(t7_value);
				t8 = space();
				p1 = element("p");
				t9 = text("criado em:");
				t10 = text(t10_value);
				t11 = text(" atualizado em:");
				t12 = text(t12_value);
				t13 = text(" Fonte: ");
				t14 = text(t14_value);
				t15 = space();
				p2 = element("p");
				t16 = text("descrição:");
				t17 = text(t17_value);
				t18 = space();
				add_location(p0, file$a, 20, 8, 442);
				add_location(p1, file$a, 21, 8, 580);
				add_location(p2, file$a, 22, 8, 684);
				add_location(div, file$a, 19, 8, 428);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, p0);
				append(p0, t0);
				append(p0, t1);
				append(p0, t2);
				append(p0, t3);
				append(p0, t4);
				append(p0, t5);
				append(p0, t6);
				append(p0, t7);
				append(div, t8);
				append(div, p1);
				append(p1, t9);
				append(p1, t10);
				append(p1, t11);
				append(p1, t12);
				append(p1, t13);
				append(p1, t14);
				append(div, t15);
				append(div, p2);
				append(p2, t16);
				append(p2, t17);
				append(div, t18);
			},

			p: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(div);
				}
			}
		};
	}

	// (16:18)        <p>...carregando</p>   {:then response}
	function create_pending_block$2(ctx) {
		var p;

		return {
			c: function create() {
				p = element("p");
				p.textContent = "...carregando";
				add_location(p, file$a, 16, 6, 346);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
			},

			p: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(p);
				}
			}
		};
	}

	function create_fragment$c(ctx) {
		var await_block_anchor, promise_1;

		let info = {
			ctx,
			current: null,
			pending: create_pending_block$2,
			then: create_then_block$2,
			catch: create_catch_block$2,
			value: 'response',
			error: 'error'
		};

		handle_promise(promise_1 = ctx.promise, info);

		return {
			c: function create() {
				await_block_anchor = empty();

				info.block.c();
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, await_block_anchor, anchor);

				info.block.m(target, info.anchor = anchor);
				info.mount = () => await_block_anchor.parentNode;
				info.anchor = await_block_anchor;
			},

			p: function update(changed, new_ctx) {
				ctx = new_ctx;
				info.ctx = ctx;

				if (promise_1 !== (promise_1 = ctx.promise) && handle_promise(promise_1, info)) ; else {
					info.block.p(changed, assign(assign({}, ctx), info.resolved));
				}
			},

			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(await_block_anchor);
				}

				info.block.d(detaching);
				info = null;
			}
		};
	}

	async function GetListRoadmaps() {
	    const res = await fetch(`listaroadmaps`);
	        const text = await res.json();

	        if (res.ok) {
	            return text;
	        } else {
	            throw new Error(text);
	        } 
	  }

	function instance$5($$self) {
		let promise = GetListRoadmaps();

		return { promise };
	}

	class GetListRoadmaps_1 extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$5, create_fragment$c, safe_not_equal, []);
		}
	}

	/* src/app/pages/ListaRoadmaps.svelte generated by Svelte v3.1.0 */

	const file$b = "src/app/pages/ListaRoadmaps.svelte";

	function create_fragment$d(ctx) {
		var h1, t_1, current;

		var getlistroadmaps = new GetListRoadmaps_1({ $$inline: true });

		return {
			c: function create() {
				h1 = element("h1");
				h1.textContent = "Lista de Roadmaps";
				t_1 = space();
				getlistroadmaps.$$.fragment.c();
				add_location(h1, file$b, 4, 0, 101);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, h1, anchor);
				insert(target, t_1, anchor);
				mount_component(getlistroadmaps, target, anchor);
				current = true;
			},

			p: noop,

			i: function intro(local) {
				if (current) return;
				getlistroadmaps.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				getlistroadmaps.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(h1);
					detach(t_1);
				}

				getlistroadmaps.$destroy(detaching);
			}
		};
	}

	class ListaRoadmaps extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$d, safe_not_equal, []);
		}
	}

	/* src/app/lib/component/TitleArea.svelte generated by Svelte v3.1.0 */

	const file$c = "src/app/lib/component/TitleArea.svelte";

	function create_fragment$e(ctx) {
		var main, h2, t0, t1;

		return {
			c: function create() {
				main = element("main");
				h2 = element("h2");
				t0 = text(ctx.title);
				t1 = text("Oi");
				h2.className = "svelte-1ab2d3s";
				add_location(h2, file$c, 6, 4, 49);
				main.className = "svelte-1ab2d3s";
				add_location(main, file$c, 5, 0, 38);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, main, anchor);
				append(main, h2);
				append(h2, t0);
				append(h2, t1);
			},

			p: function update(changed, ctx) {
				if (changed.title) {
					set_data(t0, ctx.title);
				}
			},

			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(main);
				}
			}
		};
	}

	function instance$6($$self, $$props, $$invalidate) {
		let { title } = $$props;

		$$self.$set = $$props => {
			if ('title' in $$props) $$invalidate('title', title = $$props.title);
		};

		return { title };
	}

	class TitleArea extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$6, create_fragment$e, safe_not_equal, ["title"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.title === undefined && !('title' in props)) {
				console.warn("<TitleArea> was created without expected prop 'title'");
			}
		}

		get title() {
			throw new Error("<TitleArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set title(value) {
			throw new Error("<TitleArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/app/lib/objects/Card.svelte generated by Svelte v3.1.0 */

	const file$d = "src/app/lib/objects/Card.svelte";

	// (9:4) <Rectangle>
	function create_default_slot$1(ctx) {
		var t0, h3, t1, current;

		var titlearea = new TitleArea({ $$inline: true });

		return {
			c: function create() {
				titlearea.$$.fragment.c();
				t0 = space();
				h3 = element("h3");
				t1 = text(ctx.desc);
				add_location(h3, file$d, 10, 4, 182);
			},

			m: function mount(target, anchor) {
				mount_component(titlearea, target, anchor);
				insert(target, t0, anchor);
				insert(target, h3, anchor);
				append(h3, t1);
				current = true;
			},

			p: function update(changed, ctx) {
				if (!current || changed.desc) {
					set_data(t1, ctx.desc);
				}
			},

			i: function intro(local) {
				if (current) return;
				titlearea.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				titlearea.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				titlearea.$destroy(detaching);

				if (detaching) {
					detach(t0);
					detach(h3);
				}
			}
		};
	}

	function create_fragment$f(ctx) {
		var main, current;

		var rectangle = new Rectangle({
			props: {
			$$slots: { default: [create_default_slot$1] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		return {
			c: function create() {
				main = element("main");
				rectangle.$$.fragment.c();
				main.className = "svelte-1irt93d";
				add_location(main, file$d, 7, 0, 136);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, main, anchor);
				mount_component(rectangle, main, null);
				current = true;
			},

			p: function update(changed, ctx) {
				var rectangle_changes = {};
				if (changed.$$scope || changed.desc) rectangle_changes.$$scope = { changed, ctx };
				rectangle.$set(rectangle_changes);
			},

			i: function intro(local) {
				if (current) return;
				rectangle.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				rectangle.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(main);
				}

				rectangle.$destroy();
			}
		};
	}

	function instance$7($$self, $$props, $$invalidate) {
		

	let { desc } = $$props;

		$$self.$set = $$props => {
			if ('desc' in $$props) $$invalidate('desc', desc = $$props.desc);
		};

		return { desc };
	}

	class Card extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$7, create_fragment$f, safe_not_equal, ["desc"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.desc === undefined && !('desc' in props)) {
				console.warn("<Card> was created without expected prop 'desc'");
			}
		}

		get desc() {
			throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set desc(value) {
			throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/app/pages/PerfilDeUsuario.svelte generated by Svelte v3.1.0 */

	const file$e = "src/app/pages/PerfilDeUsuario.svelte";

	function create_fragment$g(ctx) {
		var main, current;

		var card = new Card({ $$inline: true });

		return {
			c: function create() {
				main = element("main");
				card.$$.fragment.c();
				add_location(main, file$e, 5, 0, 68);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, main, anchor);
				mount_component(card, main, null);
				current = true;
			},

			p: noop,

			i: function intro(local) {
				if (current) return;
				card.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				card.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(main);
				}

				card.$destroy();
			}
		};
	}

	class PerfilDeUsuario extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$g, safe_not_equal, []);
		}
	}

	/* src/app/routing/Router.svelte generated by Svelte v3.1.0 */

	const file$f = "src/app/routing/Router.svelte";

	function create_fragment$h(ctx) {
		var main, current;

		var switch_value = ctx.value;

		function switch_props(ctx) {
			return { $$inline: true };
		}

		if (switch_value) {
			var switch_instance = new switch_value(switch_props(ctx));
		}

		return {
			c: function create() {
				main = element("main");
				if (switch_instance) switch_instance.$$.fragment.c();
				main.className = "svelte-1arjn8m";
				add_location(main, file$f, 51, 0, 1257);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, main, anchor);

				if (switch_instance) {
					mount_component(switch_instance, main, null);
				}

				current = true;
			},

			p: function update(changed, ctx) {
				if (switch_value !== (switch_value = ctx.value)) {
					if (switch_instance) {
						group_outros();
						const old_component = switch_instance;
						on_outro(() => {
							old_component.$destroy();
						});
						old_component.$$.fragment.o(1);
						check_outros();
					}

					if (switch_value) {
						switch_instance = new switch_value(switch_props(ctx));

						switch_instance.$$.fragment.c();
						switch_instance.$$.fragment.i(1);
						mount_component(switch_instance, main, null);
					} else {
						switch_instance = null;
					}
				}
			},

			i: function intro(local) {
				if (current) return;
				if (switch_instance) switch_instance.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				if (switch_instance) switch_instance.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(main);
				}

				if (switch_instance) switch_instance.$destroy();
			}
		};
	}

	function instance$8($$self, $$props, $$invalidate) {
		

	  let value = Notfound;

	  hash.subscribe( valu => {
	    switch(valu) {
	      case '':
	        $$invalidate('value', value = Homepage);
	        break;
	      case 'lista-assuntos':
	        $$invalidate('value', value = ListaAssuntos);
	        break;
	      case 'lista-roadmaps':
	        $$invalidate('value', value = ListaRoadmaps);
	        break;
	      case 'assuntos':
	        $$invalidate('value', value = Assuntos);
	        break;
	      case 'roadmaps':
	        $$invalidate('value', value = Roadmaps);
	        break;
	      case 'perfil':
	        $$invalidate('value', value = PerfilDeUsuario);
	        break;
	      case 'tendencias':
	        $$invalidate('value', value = Tendencias);
	        break;
	      default:
	        $$invalidate('value', value = Notfound);
	    }
	  });

		return { value };
	}

	class Router extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$8, create_fragment$h, safe_not_equal, []);
		}
	}

	/* src/app/lib/component/RouterLink.svelte generated by Svelte v3.1.0 */

	const file$g = "src/app/lib/component/RouterLink.svelte";

	function create_fragment$i(ctx) {
		var a, a_href_value, current;

		const default_slot_1 = ctx.$$slots.default;
		const default_slot = create_slot(default_slot_1, ctx, null);

		return {
			c: function create() {
				a = element("a");

				if (default_slot) default_slot.c();

				a.href = a_href_value = "#/" + ctx.url;
				a.className = "svelte-1b10eml";
				add_location(a, file$g, 10, 0, 102);
			},

			l: function claim(nodes) {
				if (default_slot) default_slot.l(a_nodes);
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, a, anchor);

				if (default_slot) {
					default_slot.m(a, null);
				}

				current = true;
			},

			p: function update(changed, ctx) {
				if (default_slot && default_slot.p && changed.$$scope) {
					default_slot.p(get_slot_changes(default_slot_1, ctx, changed,), get_slot_context(default_slot_1, ctx, null));
				}

				if ((!current || changed.url) && a_href_value !== (a_href_value = "#/" + ctx.url)) {
					a.href = a_href_value;
				}
			},

			i: function intro(local) {
				if (current) return;
				if (default_slot && default_slot.i) default_slot.i(local);
				current = true;
			},

			o: function outro(local) {
				if (default_slot && default_slot.o) default_slot.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(a);
				}

				if (default_slot) default_slot.d(detaching);
			}
		};
	}

	function instance$9($$self, $$props, $$invalidate) {
		let { url } = $$props;

		let { $$slots = {}, $$scope } = $$props;

		$$self.$set = $$props => {
			if ('url' in $$props) $$invalidate('url', url = $$props.url);
			if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
		};

		return { url, $$slots, $$scope };
	}

	class RouterLink extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$9, create_fragment$i, safe_not_equal, ["url"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.url === undefined && !('url' in props)) {
				console.warn("<RouterLink> was created without expected prop 'url'");
			}
		}

		get url() {
			throw new Error("<RouterLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set url(value) {
			throw new Error("<RouterLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/app/lib/component/Sidenav.svelte generated by Svelte v3.1.0 */

	const file$h = "src/app/lib/component/Sidenav.svelte";

	// (10:10) <RouterLink url=''>
	function create_default_slot_3(ctx) {
		var h1;

		return {
			c: function create() {
				h1 = element("h1");
				h1.textContent = "Líbero";
				h1.className = "svelte-1jrrcn0";
				add_location(h1, file$h, 9, 29, 176);
			},

			m: function mount(target, anchor) {
				insert(target, h1, anchor);
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(h1);
				}
			}
		};
	}

	// (13:10) <RouterLink url='perfil'>
	function create_default_slot_2(ctx) {
		var t;

		return {
			c: function create() {
				t = text("Perfil");
			},

			m: function mount(target, anchor) {
				insert(target, t, anchor);
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(t);
				}
			}
		};
	}

	// (16:10) <RouterLink url='lista-roadmaps'>
	function create_default_slot_1(ctx) {
		var t;

		return {
			c: function create() {
				t = text("Lista de Roadmaps");
			},

			m: function mount(target, anchor) {
				insert(target, t, anchor);
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(t);
				}
			}
		};
	}

	// (19:10) <RouterLink url='lista-assuntos'>
	function create_default_slot$2(ctx) {
		var t;

		return {
			c: function create() {
				t = text("Lista de Assuntos");
			},

			m: function mount(target, anchor) {
				insert(target, t, anchor);
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(t);
				}
			}
		};
	}

	function create_fragment$j(ctx) {
		var nav, div1, div0, ul, li0, t0, li1, t1, li2, t2, li3, current;

		var routerlink0 = new RouterLink({
			props: {
			url: "",
			$$slots: { default: [create_default_slot_3] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		var routerlink1 = new RouterLink({
			props: {
			url: "perfil",
			$$slots: { default: [create_default_slot_2] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		var routerlink2 = new RouterLink({
			props: {
			url: "lista-roadmaps",
			$$slots: { default: [create_default_slot_1] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		var routerlink3 = new RouterLink({
			props: {
			url: "lista-assuntos",
			$$slots: { default: [create_default_slot$2] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		return {
			c: function create() {
				nav = element("nav");
				div1 = element("div");
				div0 = element("div");
				ul = element("ul");
				li0 = element("li");
				routerlink0.$$.fragment.c();
				t0 = space();
				li1 = element("li");
				routerlink1.$$.fragment.c();
				t1 = space();
				li2 = element("li");
				routerlink2.$$.fragment.c();
				t2 = space();
				li3 = element("li");
				routerlink3.$$.fragment.c();
				li0.className = "svelte-1jrrcn0";
				add_location(li0, file$h, 8, 8, 142);
				li1.className = "svelte-1jrrcn0";
				add_location(li1, file$h, 11, 8, 227);
				li2.className = "svelte-1jrrcn0";
				add_location(li2, file$h, 14, 8, 309);
				li3.className = "svelte-1jrrcn0";
				add_location(li3, file$h, 17, 8, 410);
				ul.className = "svelte-1jrrcn0";
				add_location(ul, file$h, 7, 6, 129);
				div0.className = "content svelte-1jrrcn0";
				add_location(div0, file$h, 6, 4, 101);
				div1.className = "wrapper svelte-1jrrcn0";
				add_location(div1, file$h, 5, 2, 75);
				nav.className = "svelte-1jrrcn0";
				add_location(nav, file$h, 4, 0, 67);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, nav, anchor);
				append(nav, div1);
				append(div1, div0);
				append(div0, ul);
				append(ul, li0);
				mount_component(routerlink0, li0, null);
				append(ul, t0);
				append(ul, li1);
				mount_component(routerlink1, li1, null);
				append(ul, t1);
				append(ul, li2);
				mount_component(routerlink2, li2, null);
				append(ul, t2);
				append(ul, li3);
				mount_component(routerlink3, li3, null);
				current = true;
			},

			p: function update(changed, ctx) {
				var routerlink0_changes = {};
				if (changed.$$scope) routerlink0_changes.$$scope = { changed, ctx };
				routerlink0.$set(routerlink0_changes);

				var routerlink1_changes = {};
				if (changed.$$scope) routerlink1_changes.$$scope = { changed, ctx };
				routerlink1.$set(routerlink1_changes);

				var routerlink2_changes = {};
				if (changed.$$scope) routerlink2_changes.$$scope = { changed, ctx };
				routerlink2.$set(routerlink2_changes);

				var routerlink3_changes = {};
				if (changed.$$scope) routerlink3_changes.$$scope = { changed, ctx };
				routerlink3.$set(routerlink3_changes);
			},

			i: function intro(local) {
				if (current) return;
				routerlink0.$$.fragment.i(local);

				routerlink1.$$.fragment.i(local);

				routerlink2.$$.fragment.i(local);

				routerlink3.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				routerlink0.$$.fragment.o(local);
				routerlink1.$$.fragment.o(local);
				routerlink2.$$.fragment.o(local);
				routerlink3.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(nav);
				}

				routerlink0.$destroy();

				routerlink1.$destroy();

				routerlink2.$destroy();

				routerlink3.$destroy();
			}
		};
	}

	class Sidenav extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$j, safe_not_equal, []);
		}
	}

	/* src/App.svelte generated by Svelte v3.1.0 */

	const file$i = "src/App.svelte";

	function create_fragment$k(ctx) {
		var div, t, current;

		var sidenav = new Sidenav({
			props: { class: "sidenav" },
			$$inline: true
		});

		var router = new Router({ $$inline: true });

		return {
			c: function create() {
				div = element("div");
				sidenav.$$.fragment.c();
				t = space();
				router.$$.fragment.c();
				div.className = "app-shell svelte-1gelsrc";
				add_location(div, file$i, 16, 0, 264);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				mount_component(sidenav, div, null);
				append(div, t);
				mount_component(router, div, null);
				current = true;
			},

			p: noop,

			i: function intro(local) {
				if (current) return;
				sidenav.$$.fragment.i(local);

				router.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				sidenav.$$.fragment.o(local);
				router.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(div);
				}

				sidenav.$destroy();

				router.$destroy();
			}
		};
	}

	class App extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$k, safe_not_equal, []);
		}
	}

	const app = new App({
		target: document.body.querySelector('#app')
	});

	return app;

}());
//# sourceMappingURL=bundle.js.map
