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

	function svg_element(name) {
		return document.createElementNS('http://www.w3.org/2000/svg', name);
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

	function stop_propagation(fn) {
		return function(event) {
			event.stopPropagation();
			return fn.call(this, event);
		};
	}

	function attr(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else node.setAttribute(attribute, value);
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

	function toggle_class(element, name, toggle) {
		element.classList[toggle ? 'add' : 'remove'](name);
	}

	let current_component;

	function set_current_component(component) {
		current_component = component;
	}

	function get_current_component() {
		if (!current_component) throw new Error(`Function called outside component initialization`);
		return current_component;
	}

	function onDestroy(fn) {
		get_current_component().$$.on_destroy.push(fn);
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

	function add_binding_callback(fn) {
		binding_callbacks.push(fn);
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
				add_location(div0, file, 6, 8, 89);
				button.className = "wrapper svelte-14fzp8j";
				add_location(button, file, 5, 4, 56);
				div1.className = "container svelte-14fzp8j";
				add_location(div1, file, 4, 0, 28);
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

	// (9:4) <Rectangle>
	function create_default_slot(ctx) {
		var div2, figure, img, t0, div0, t1, t2, t3, t4, div1;

		return {
			c: function create() {
				div2 = element("div");
				figure = element("figure");
				img = element("img");
				t0 = space();
				div0 = element("div");
				t1 = text("Bem vindo(a), ");
				t2 = text(ctx.username);
				t3 = text(".");
				t4 = space();
				div1 = element("div");
				div1.textContent = "Carreiras";
				img.src = src;
				img.alt = "Profile default";
				img.className = "svelte-pixrvo";
				add_location(img, file$1, 11, 16, 218);
				figure.className = "svelte-pixrvo";
				add_location(figure, file$1, 10, 12, 193);
				add_location(div0, file$1, 13, 12, 293);
				div1.className = "carreiras";
				add_location(div1, file$1, 16, 12, 372);
				div2.className = "wrapper svelte-pixrvo";
				add_location(div2, file$1, 9, 8, 159);
			},

			m: function mount(target, anchor) {
				insert(target, div2, anchor);
				append(div2, figure);
				append(figure, img);
				append(div2, t0);
				append(div2, div0);
				append(div0, t1);
				append(div0, t2);
				append(div0, t3);
				append(div2, t4);
				append(div2, div1);
			},

			p: function update(changed, ctx) {
				if (changed.username) {
					set_data(t2, ctx.username);
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
		var main, current;

		var rectangle = new Rectangle({
			props: {
			$$slots: { default: [create_default_slot] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		return {
			c: function create() {
				main = element("main");
				rectangle.$$.fragment.c();
				add_location(main, file$1, 7, 0, 128);
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
				if (detaching) {
					detach(main);
				}

				rectangle.$destroy();
			}
		};
	}

	let src = '/profile-picture.png';

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
				h1.className = "svelte-x92jmi";
				add_location(h1, file$2, 9, 12, 175);
				div0.className = "content svelte-x92jmi";
				add_location(div0, file$2, 8, 8, 141);
				button.className = "wrapper svelte-x92jmi";
				add_location(button, file$2, 7, 4, 92);
				div1.className = "container svelte-x92jmi";
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
				p.className = "svelte-1lzq4yo";
				add_location(p, file$3, 22, 1, 356);
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
		var p, t_value = ctx.element, t;

		return {
			c: function create() {
				p = element("p");
				t = text(t_value);
				p.className = "svelte-1lzq4yo";
				add_location(p, file$3, 19, 3, 314);
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

	// (16:16)   <p>...carregando</p> {:then response}
	function create_pending_block(ctx) {
		var p;

		return {
			c: function create() {
				p = element("p");
				p.textContent = "...carregando";
				p.className = "svelte-1lzq4yo";
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
		var div1, div0, h2, t_1, current;

		var getlist = new GetList({ $$inline: true });

		return {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				h2 = element("h2");
				h2.textContent = "Mais estudados";
				t_1 = space();
				getlist.$$.fragment.c();
				h2.className = "svelte-bts383";
				add_location(h2, file$4, 6, 8, 121);
				div0.className = "wrapper svelte-bts383";
				add_location(div0, file$4, 5, 4, 91);
				div1.className = "container svelte-bts383";
				add_location(div1, file$4, 4, 0, 63);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div1, anchor);
				append(div1, div0);
				append(div0, h2);
				append(div0, t_1);
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

	/* src/app/lib/objects/Searchbox.svelte generated by Svelte v3.1.0 */

	const file$5 = "src/app/lib/objects/Searchbox.svelte";

	function create_fragment$5(ctx) {
		var main, div, form, textarea, t, figure, img;

		return {
			c: function create() {
				main = element("main");
				div = element("div");
				form = element("form");
				textarea = element("textarea");
				t = space();
				figure = element("figure");
				img = element("img");
				textarea.placeholder = "Pesquisar...";
				textarea.className = "svelte-1vkex0q";
				add_location(textarea, file$5, 7, 8, 84);
				add_location(form, file$5, 6, 4, 69);
				img.src = src$1;
				img.alt = "Search tool";
				img.className = "svelte-1vkex0q";
				add_location(img, file$5, 10, 8, 166);
				figure.className = "svelte-1vkex0q";
				add_location(figure, file$5, 9, 4, 149);
				add_location(div, file$5, 5, 4, 59);
				main.className = "svelte-1vkex0q";
				add_location(main, file$5, 4, 0, 48);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, main, anchor);
				append(main, div);
				append(div, form);
				append(form, textarea);
				append(div, t);
				append(div, figure);
				append(figure, img);
			},

			p: noop,
			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(main);
				}
			}
		};
	}

	let src$1 = '/search.png';

	class Searchbox extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$5, safe_not_equal, []);
		}
	}

	/* src/app/lib/component/Modal.svelte generated by Svelte v3.1.0 */

	const file$6 = "src/app/lib/component/Modal.svelte";

	function create_fragment$6(ctx) {
		var div2, div1, svg, circle, line0, line1, t, div0, current, dispose;

		const default_slot_1 = ctx.$$slots.default;
		const default_slot = create_slot(default_slot_1, ctx, null);

		return {
			c: function create() {
				div2 = element("div");
				div1 = element("div");
				svg = svg_element("svg");
				circle = svg_element("circle");
				line0 = svg_element("line");
				line1 = svg_element("line");
				t = space();
				div0 = element("div");

				if (default_slot) default_slot.c();
				attr(circle, "cx", "6");
				attr(circle, "cy", "6");
				attr(circle, "r", "6");
				attr(circle, "class", "svelte-1y5ynw3");
				add_location(circle, file$6, 63, 3, 1586);
				attr(line0, "x1", "3");
				attr(line0, "y1", "3");
				attr(line0, "x2", "9");
				attr(line0, "y2", "9");
				attr(line0, "class", "svelte-1y5ynw3");
				add_location(line0, file$6, 64, 3, 1614);
				attr(line1, "x1", "9");
				attr(line1, "y1", "3");
				attr(line1, "x2", "3");
				attr(line1, "y2", "9");
				attr(line1, "class", "svelte-1y5ynw3");
				add_location(line1, file$6, 65, 3, 1646);
				attr(svg, "id", "close");
				attr(svg, "viewBox", "0 0 12 12");
				attr(svg, "class", "svelte-1y5ynw3");
				add_location(svg, file$6, 62, 2, 1523);

				div0.id = "modal-content";
				div0.className = "svelte-1y5ynw3";
				add_location(div0, file$6, 67, 2, 1686);
				div1.id = "modal";
				div1.className = "svelte-1y5ynw3";
				add_location(div1, file$6, 61, 1, 1470);
				div2.id = "topModal";
				div2.className = "svelte-1y5ynw3";
				toggle_class(div2, "visible", ctx.visible);
				add_location(div2, file$6, 60, 0, 1393);

				dispose = [
					listen(svg, "click", ctx.click_handler),
					listen(div1, "click", stop_propagation(click_handler_1)),
					listen(div2, "click", ctx.click_handler_2)
				];
			},

			l: function claim(nodes) {
				if (default_slot) default_slot.l(div0_nodes);
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div2, anchor);
				append(div2, div1);
				append(div1, svg);
				append(svg, circle);
				append(svg, line0);
				append(svg, line1);
				append(div1, t);
				append(div1, div0);

				if (default_slot) {
					default_slot.m(div0, null);
				}

				add_binding_callback(() => ctx.div2_binding(div2, null));
				current = true;
			},

			p: function update(changed, ctx) {
				if (default_slot && default_slot.p && changed.$$scope) {
					default_slot.p(get_slot_changes(default_slot_1, ctx, changed,), get_slot_context(default_slot_1, ctx, null));
				}

				if (changed.items) {
					ctx.div2_binding(null, div2);
					ctx.div2_binding(div2, null);
				}

				if (changed.visible) {
					toggle_class(div2, "visible", ctx.visible);
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
					detach(div2);
				}

				if (default_slot) default_slot.d(detaching);
				ctx.div2_binding(null, div2);
				run_all(dispose);
			}
		};
	}

	let onTop;   //keeping track of which open modal is on top
	const modals={};  //all modals get registered here for easy future access

	// 	returns an object for the modal specified by `id`, which contains the API functions (`open` and `close` )
	function getModal(id=''){
		return modals[id]
	}

	function click_handler_1() {}

	function instance$4($$self, $$props, $$invalidate) {
		let topDiv;
	let visible=false;
	let prevOnTop;
	let closeCallback;

	let { id='' } = $$props;

	function keyPress(ev){
		//only respond if the current modal is the top one
		if(ev.key=="Escape" && onTop==topDiv) close(); //ESC
	}

	/**  API **/
	function open(callback){
		$$invalidate('closeCallback', closeCallback=callback);
		if(visible) return
		$$invalidate('prevOnTop', prevOnTop=onTop);
		onTop=topDiv;
		window.addEventListener("keydown",keyPress);
		
		//this prevents scrolling of the main window on larger screens
		document.body.style.overflow="hidden"; 

		$$invalidate('visible', visible=true);
		//Move the modal in the DOM to be the last child of <BODY> so that it can be on top of everything
		document.body.appendChild(topDiv);
	}
		
	function close(retVal){
		if(!visible) return
		window.removeEventListener("keydown",keyPress);
		onTop=prevOnTop;
		if(onTop==null) document.body.style.overflow="";
		$$invalidate('visible', visible=false);
		if(closeCallback) closeCallback(retVal);
	}
		
	//expose the API
	modals[id]={open,close};
		
	onDestroy(()=>{
		delete modals[id];
		window.removeEventListener("keydown",keyPress);
	});

		let { $$slots = {}, $$scope } = $$props;

		function click_handler() {
			return close();
		}

		function div2_binding($$node, check) {
			topDiv = $$node;
			$$invalidate('topDiv', topDiv);
		}

		function click_handler_2() {
			return close();
		}

		$$self.$set = $$props => {
			if ('id' in $$props) $$invalidate('id', id = $$props.id);
			if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
		};

		return {
			topDiv,
			visible,
			id,
			close,
			click_handler,
			div2_binding,
			click_handler_2,
			$$slots,
			$$scope
		};
	}

	class Modal extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$4, create_fragment$6, safe_not_equal, ["id"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.id === undefined && !('id' in props)) {
				console.warn("<Modal> was created without expected prop 'id'");
			}
		}

		get id() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set id(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/app/lib/component/AssuntoDialog.svelte generated by Svelte v3.1.0 */

	/* src/app/lib/objects/PageCard.svelte generated by Svelte v3.1.0 */

	const file$7 = "src/app/lib/objects/PageCard.svelte";

	// (8:4) {#if name === 'new'}
	function create_if_block_1(ctx) {
		var div;

		return {
			c: function create() {
				div = element("div");
				div.textContent = "Adicionar novo Asssunto\n\n        +";
				add_location(div, file$7, 8, 4, 131);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(div);
				}
			}
		};
	}

	// (15:4) {#if name === ''}
	function create_if_block(ctx) {
		var div;

		return {
			c: function create() {
				div = element("div");
				div.textContent = "Assunto 1";
				add_location(div, file$7, 15, 4, 228);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(div);
				}
			}
		};
	}

	// (7:0) <Rectangle>
	function create_default_slot$1(ctx) {
		var t, if_block1_anchor;

		var if_block0 = (ctx.name === 'new') && create_if_block_1(ctx);

		var if_block1 = (ctx.name === '') && create_if_block(ctx);

		return {
			c: function create() {
				if (if_block0) if_block0.c();
				t = space();
				if (if_block1) if_block1.c();
				if_block1_anchor = empty();
			},

			m: function mount(target, anchor) {
				if (if_block0) if_block0.m(target, anchor);
				insert(target, t, anchor);
				if (if_block1) if_block1.m(target, anchor);
				insert(target, if_block1_anchor, anchor);
			},

			p: function update(changed, ctx) {
				if (ctx.name === 'new') {
					if (!if_block0) {
						if_block0 = create_if_block_1(ctx);
						if_block0.c();
						if_block0.m(t.parentNode, t);
					}
				} else if (if_block0) {
					if_block0.d(1);
					if_block0 = null;
				}

				if (ctx.name === '') {
					if (!if_block1) {
						if_block1 = create_if_block(ctx);
						if_block1.c();
						if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
					}
				} else if (if_block1) {
					if_block1.d(1);
					if_block1 = null;
				}
			},

			d: function destroy(detaching) {
				if (if_block0) if_block0.d(detaching);

				if (detaching) {
					detach(t);
				}

				if (if_block1) if_block1.d(detaching);

				if (detaching) {
					detach(if_block1_anchor);
				}
			}
		};
	}

	function create_fragment$7(ctx) {
		var current;

		var rectangle = new Rectangle({
			props: {
			$$slots: { default: [create_default_slot$1] },
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
				if (changed.$$scope || changed.name) rectangle_changes.$$scope = { changed, ctx };
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

	function instance$5($$self, $$props, $$invalidate) {
		let { name } = $$props;

		$$self.$set = $$props => {
			if ('name' in $$props) $$invalidate('name', name = $$props.name);
		};

		return { name };
	}

	class PageCard extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$5, create_fragment$7, safe_not_equal, ["name"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.name === undefined && !('name' in props)) {
				console.warn("<PageCard> was created without expected prop 'name'");
			}
		}

		get name() {
			throw new Error("<PageCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set name(value) {
			throw new Error("<PageCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/app/pages/Homepage.svelte generated by Svelte v3.1.0 */

	const file$8 = "src/app/pages/Homepage.svelte";

	// (67:1) {#if selection}
	function create_if_block$1(ctx) {
		var p, t0, t1;

		return {
			c: function create() {
				p = element("p");
				t0 = text("Your selection was: ");
				t1 = text(ctx.selection);
				add_location(p, file$8, 67, 1, 1679);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
				append(p, t0);
				append(p, t1);
			},

			p: function update(changed, ctx) {
				if (changed.selection) {
					set_data(t1, ctx.selection);
				}
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(p);
				}
			}
		};
	}

	// (56:0) <Modal>
	function create_default_slot$2(ctx) {
		var h1, t1, button0, t2, button1, t4, if_block_anchor, dispose;

		var if_block = (ctx.selection) && create_if_block$1(ctx);

		return {
			c: function create() {
				h1 = element("h1");
				h1.textContent = "Criar assunto";
				t1 = space();
				button0 = element("button");
				t2 = space();
				button1 = element("button");
				button1.textContent = "Open Nested Popup";
				t4 = space();
				if (if_block) if_block.c();
				if_block_anchor = empty();
				add_location(h1, file$8, 56, 1, 1486);
				add_location(button0, file$8, 59, 2, 1513);
				add_location(button1, file$8, 63, 1, 1568);

				dispose = [
					listen(button0, "click", ctx.click_handler),
					listen(button1, "click", ctx.click_handler_1)
				];
			},

			m: function mount(target, anchor) {
				insert(target, h1, anchor);
				insert(target, t1, anchor);
				insert(target, button0, anchor);
				insert(target, t2, anchor);
				insert(target, button1, anchor);
				insert(target, t4, anchor);
				if (if_block) if_block.m(target, anchor);
				insert(target, if_block_anchor, anchor);
			},

			p: function update(changed, ctx) {
				if (ctx.selection) {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block$1(ctx);
						if_block.c();
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(h1);
					detach(t1);
					detach(button0);
					detach(t2);
					detach(button1);
					detach(t4);
				}

				if (if_block) if_block.d(detaching);

				if (detaching) {
					detach(if_block_anchor);
				}

				run_all(dispose);
			}
		};
	}

	function create_fragment$8(ctx) {
		var div3, div2, t0, div0, t1, t2, div1, t3, t4, t5, current;

		var searchbox = new Searchbox({ $$inline: true });

		var pagecard0 = new PageCard({
			props: { name: 'new' },
			$$inline: true
		});

		var pagecard1 = new PageCard({
			props: { name: '' },
			$$inline: true
		});

		var box0 = new Box({
			props: {
			topic: "+ Assunto",
			func: crudAssunto
		},
			$$inline: true
		});

		var box1 = new Box({
			props: {
			topic: "+ Roadmap",
			func: crudRoadmap
		},
			$$inline: true
		});

		var box2 = new Box({
			props: {
			topic: "Tendências",
			func: viewTrends
		},
			$$inline: true
		});

		var modal = new Modal({
			props: {
			$$slots: { default: [create_default_slot$2] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		return {
			c: function create() {
				div3 = element("div");
				div2 = element("div");
				searchbox.$$.fragment.c();
				t0 = space();
				div0 = element("div");
				pagecard0.$$.fragment.c();
				t1 = space();
				pagecard1.$$.fragment.c();
				t2 = space();
				div1 = element("div");
				box0.$$.fragment.c();
				t3 = space();
				box1.$$.fragment.c();
				t4 = space();
				box2.$$.fragment.c();
				t5 = space();
				modal.$$.fragment.c();
				div0.className = "content svelte-1fkfhod";
				add_location(div0, file$8, 38, 4, 1123);
				div1.className = "content svelte-1fkfhod";
				add_location(div1, file$8, 43, 4, 1224);
				div2.className = "wrapper svelte-1fkfhod";
				add_location(div2, file$8, 36, 2, 1079);
				div3.className = "container svelte-1fkfhod";
				add_location(div3, file$8, 35, 0, 1053);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div3, anchor);
				append(div3, div2);
				mount_component(searchbox, div2, null);
				append(div2, t0);
				append(div2, div0);
				mount_component(pagecard0, div0, null);
				append(div0, t1);
				mount_component(pagecard1, div0, null);
				append(div2, t2);
				append(div2, div1);
				mount_component(box0, div1, null);
				append(div1, t3);
				mount_component(box1, div1, null);
				append(div1, t4);
				mount_component(box2, div1, null);
				insert(target, t5, anchor);
				mount_component(modal, target, anchor);
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

				var modal_changes = {};
				if (changed.$$scope || changed.selection) modal_changes.$$scope = { changed, ctx };
				modal.$set(modal_changes);
			},

			i: function intro(local) {
				if (current) return;
				searchbox.$$.fragment.i(local);

				pagecard0.$$.fragment.i(local);

				pagecard1.$$.fragment.i(local);

				box0.$$.fragment.i(local);

				box1.$$.fragment.i(local);

				box2.$$.fragment.i(local);

				modal.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				searchbox.$$.fragment.o(local);
				pagecard0.$$.fragment.o(local);
				pagecard1.$$.fragment.o(local);
				box0.$$.fragment.o(local);
				box1.$$.fragment.o(local);
				box2.$$.fragment.o(local);
				modal.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(div3);
				}

				searchbox.$destroy();

				pagecard0.$destroy();

				pagecard1.$destroy();

				box0.$destroy();

				box1.$destroy();

				box2.$destroy();

				if (detaching) {
					detach(t5);
				}

				modal.$destroy(detaching);
			}
		};
	}

	function crudAssunto(event) {
	  console.log("Chamado cadastro de assunto");
	  getModal().open();
	}

	function crudRoadmap(event) {
	  console.log("Chamado cadastro de roadmap");
	}

	function viewTrends(event) {
	  console.log("Chamado pesquisa e tendências.");
	  
	}

	function instance$6($$self, $$props, $$invalidate) {
		

		let selection;
		
		// Callback function provided to the `open` function, it receives the value given to the `close` function call, or `undefined` if the Modal was closed with escape or clicking the X, etc.
		function setSelection(res){
			$$invalidate('selection', selection=res);
		}

		function click_handler() {
			return crudAssunto();
		}

		function click_handler_1() {
			return getModal('second').open(setSelection);
		}

		return {
			selection,
			setSelection,
			click_handler,
			click_handler_1
		};
	}

	class Homepage extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$6, create_fragment$8, safe_not_equal, []);
		}
	}

	/* src/app/pages/Notfound.svelte generated by Svelte v3.1.0 */

	const file$9 = "src/app/pages/Notfound.svelte";

	function create_fragment$9(ctx) {
		var h1;

		return {
			c: function create() {
				h1 = element("h1");
				h1.textContent = "Conteúdo não encontrado.";
				add_location(h1, file$9, 0, 0, 0);
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
			init(this, options, null, create_fragment$9, safe_not_equal, []);
		}
	}

	/* src/app/lib/component/AssuntoCard.svelte generated by Svelte v3.1.0 */

	const file$a = "src/app/lib/component/AssuntoCard.svelte";

	// (9:4) <Rectangle>
	function create_default_slot_1(ctx) {
		var p, t0, t1, t2;

		return {
			c: function create() {
				p = element("p");
				t0 = text(ctx.title);
				t1 = space();
				t2 = text(ctx.descricao);
				p.className = "svelte-18yi7k2";
				add_location(p, file$a, 9, 8, 185);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
				append(p, t0);
				insert(target, t1, anchor);
				insert(target, t2, anchor);
			},

			p: function update(changed, ctx) {
				if (changed.title) {
					set_data(t0, ctx.title);
				}

				if (changed.descricao) {
					set_data(t2, ctx.descricao);
				}
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(p);
					detach(t1);
					detach(t2);
				}
			}
		};
	}

	// (15:0) <Modal>
	function create_default_slot$3(ctx) {
		var h1, t;

		return {
			c: function create() {
				h1 = element("h1");
				t = text(ctx.title);
				add_location(h1, file$a, 15, 1, 257);
			},

			m: function mount(target, anchor) {
				insert(target, h1, anchor);
				append(h1, t);
			},

			p: function update(changed, ctx) {
				if (changed.title) {
					set_data(t, ctx.title);
				}
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(h1);
				}
			}
		};
	}

	function create_fragment$a(ctx) {
		var main, t, current;

		var rectangle = new Rectangle({
			props: {
			$$slots: { default: [create_default_slot_1] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		var modal = new Modal({
			props: {
			$$slots: { default: [create_default_slot$3] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		return {
			c: function create() {
				main = element("main");
				rectangle.$$.fragment.c();
				t = space();
				modal.$$.fragment.c();
				main.className = "svelte-18yi7k2";
				add_location(main, file$a, 7, 0, 154);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, main, anchor);
				mount_component(rectangle, main, null);
				insert(target, t, anchor);
				mount_component(modal, target, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				var rectangle_changes = {};
				if (changed.$$scope || changed.descricao || changed.title) rectangle_changes.$$scope = { changed, ctx };
				rectangle.$set(rectangle_changes);

				var modal_changes = {};
				if (changed.$$scope || changed.title) modal_changes.$$scope = { changed, ctx };
				modal.$set(modal_changes);
			},

			i: function intro(local) {
				if (current) return;
				rectangle.$$.fragment.i(local);

				modal.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				rectangle.$$.fragment.o(local);
				modal.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(main);
				}

				rectangle.$destroy();

				if (detaching) {
					detach(t);
				}

				modal.$destroy(detaching);
			}
		};
	}

	function instance$7($$self, $$props, $$invalidate) {
		

	    let { title, id, descricao } = $$props;

		$$self.$set = $$props => {
			if ('title' in $$props) $$invalidate('title', title = $$props.title);
			if ('id' in $$props) $$invalidate('id', id = $$props.id);
			if ('descricao' in $$props) $$invalidate('descricao', descricao = $$props.descricao);
		};

		return { title, id, descricao };
	}

	class AssuntoCard extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$7, create_fragment$a, safe_not_equal, ["title", "id", "descricao"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.title === undefined && !('title' in props)) {
				console.warn("<AssuntoCard> was created without expected prop 'title'");
			}
			if (ctx.id === undefined && !('id' in props)) {
				console.warn("<AssuntoCard> was created without expected prop 'id'");
			}
			if (ctx.descricao === undefined && !('descricao' in props)) {
				console.warn("<AssuntoCard> was created without expected prop 'descricao'");
			}
		}

		get title() {
			throw new Error("<AssuntoCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set title(value) {
			throw new Error("<AssuntoCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get id() {
			throw new Error("<AssuntoCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set id(value) {
			throw new Error("<AssuntoCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get descricao() {
			throw new Error("<AssuntoCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set descricao(value) {
			throw new Error("<AssuntoCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/app/lib/component/GetListAssunto.svelte generated by Svelte v3.1.0 */

	const file$b = "src/app/lib/component/GetListAssunto.svelte";

	function get_each_context$1(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.element = list[i];
		return child_ctx;
	}

	// (26:0) {:catch error}
	function create_catch_block$1(ctx) {
		var p, t_value = ctx.error.message, t;

		return {
			c: function create() {
				p = element("p");
				t = text(t_value);
				set_style(p, "color", "red");
				add_location(p, file$b, 26, 4, 578);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
				append(p, t);
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

	// (20:0) {:then response}
	function create_then_block$1(ctx) {
		var each_1_anchor, current;

		var each_value = ctx.response;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
		}

		function outro_block(i, detaching, local) {
			if (each_blocks[i]) {
				if (detaching) {
					on_outro(() => {
						each_blocks[i].d(detaching);
						each_blocks[i] = null;
					});
				}

				each_blocks[i].o(local);
			}
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
				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.promise) {
					each_value = ctx.response;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$1(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
							each_blocks[i].i(1);
						} else {
							each_blocks[i] = create_each_block$1(child_ctx);
							each_blocks[i].c();
							each_blocks[i].i(1);
							each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
						}
					}

					group_outros();
					for (; i < each_blocks.length; i += 1) outro_block(i, 1, 1);
					check_outros();
				}
			},

			i: function intro(local) {
				if (current) return;
				for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

				current = true;
			},

			o: function outro(local) {
				each_blocks = each_blocks.filter(Boolean);
				for (let i = 0; i < each_blocks.length; i += 1) outro_block(i, 0);

				current = false;
			},

			d: function destroy(detaching) {
				destroy_each(each_blocks, detaching);

				if (detaching) {
					detach(each_1_anchor);
				}
			}
		};
	}

	// (22:4) <AssuntoCard title={element.descricao} id={element.id}>
	function create_default_slot$4(ctx) {
		return {
			c: noop,
			m: noop,
			d: noop
		};
	}

	// (21:4) {#each response as element}
	function create_each_block$1(ctx) {
		var current;

		var assuntocard = new AssuntoCard({
			props: {
			title: ctx.element.descricao,
			id: ctx.element.id,
			$$slots: { default: [create_default_slot$4] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		return {
			c: function create() {
				assuntocard.$$.fragment.c();
			},

			m: function mount(target, anchor) {
				mount_component(assuntocard, target, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				var assuntocard_changes = {};
				if (changed.promise) assuntocard_changes.title = ctx.element.descricao;
				if (changed.promise) assuntocard_changes.id = ctx.element.id;
				if (changed.$$scope) assuntocard_changes.$$scope = { changed, ctx };
				assuntocard.$set(assuntocard_changes);
			},

			i: function intro(local) {
				if (current) return;
				assuntocard.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				assuntocard.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				assuntocard.$destroy(detaching);
			}
		};
	}

	// (18:16)      <p>...carregando</p> {:then response}
	function create_pending_block$1(ctx) {
		var p;

		return {
			c: function create() {
				p = element("p");
				p.textContent = "...carregando";
				add_location(p, file$b, 18, 4, 391);
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

	function create_fragment$b(ctx) {
		var await_block_anchor, promise_1, current;

		let info = {
			ctx,
			current: null,
			pending: create_pending_block$1,
			then: create_then_block$1,
			catch: create_catch_block$1,
			value: 'response',
			error: 'error',
			blocks: Array(3)
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

				current = true;
			},

			p: function update(changed, new_ctx) {
				ctx = new_ctx;
				info.ctx = ctx;

				if (promise_1 !== (promise_1 = ctx.promise) && handle_promise(promise_1, info)) ; else {
					info.block.p(changed, assign(assign({}, ctx), info.resolved));
				}
			},

			i: function intro(local) {
				if (current) return;
				info.block.i();
				current = true;
			},

			o: function outro(local) {
				for (let i = 0; i < 3; i += 1) {
					const block = info.blocks[i];
					if (block) block.o();
				}

				current = false;
			},

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

	function instance$8($$self) {
		let promise = getListAssunto();

		return { promise };
	}

	class GetListAssunto extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$8, create_fragment$b, safe_not_equal, []);
		}
	}

	/* src/app/pages/ListaAssuntos.svelte generated by Svelte v3.1.0 */

	const file$c = "src/app/pages/ListaAssuntos.svelte";

	function create_fragment$c(ctx) {
		var div1, h1, t_1, div0, current;

		var getlistassunto = new GetListAssunto({ props: { id: "assunto" }, $$inline: true });

		return {
			c: function create() {
				div1 = element("div");
				h1 = element("h1");
				h1.textContent = "Todos os assuntos criados";
				t_1 = space();
				div0 = element("div");
				getlistassunto.$$.fragment.c();
				add_location(h1, file$c, 8, 4, 178);
				div0.className = "wrapper svelte-10dhq9v";
				add_location(div0, file$c, 9, 4, 217);
				div1.className = "container svelte-10dhq9v";
				add_location(div1, file$c, 7, 0, 150);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div1, anchor);
				append(div1, h1);
				append(div1, t_1);
				append(div1, div0);
				mount_component(getlistassunto, div0, null);
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
					detach(div1);
				}

				getlistassunto.$destroy();
			}
		};
	}

	class ListaAssuntos extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$c, safe_not_equal, []);
		}
	}

	/* src/app/pages/Assuntos.svelte generated by Svelte v3.1.0 */

	const file$d = "src/app/pages/Assuntos.svelte";

	function create_fragment$d(ctx) {
		var p, t_1, current;

		var assuntocard = new AssuntoCard({ $$inline: true });

		return {
			c: function create() {
				p = element("p");
				p.textContent = "Assuntos";
				t_1 = space();
				assuntocard.$$.fragment.c();
				add_location(p, file$d, 4, 0, 83);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
				insert(target, t_1, anchor);
				mount_component(assuntocard, target, anchor);
				current = true;
			},

			p: noop,

			i: function intro(local) {
				if (current) return;
				assuntocard.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				assuntocard.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(p);
					detach(t_1);
				}

				assuntocard.$destroy(detaching);
			}
		};
	}

	class Assuntos extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$d, safe_not_equal, []);
		}
	}

	/* src/app/pages/Roadmaps.svelte generated by Svelte v3.1.0 */

	const file$e = "src/app/pages/Roadmaps.svelte";

	function create_fragment$e(ctx) {
		var p;

		return {
			c: function create() {
				p = element("p");
				p.textContent = "Roadmaps";
				add_location(p, file$e, 4, 0, 21);
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

	class Roadmaps extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$e, safe_not_equal, []);
		}
	}

	/* src/app/pages/Tendencias.svelte generated by Svelte v3.1.0 */

	function create_fragment$f(ctx) {
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
			init(this, options, null, create_fragment$f, safe_not_equal, []);
		}
	}

	/* src/app/lib/component/MiniProfile.svelte generated by Svelte v3.1.0 */

	const file$f = "src/app/lib/component/MiniProfile.svelte";

	function create_fragment$g(ctx) {
		var main, div1, figure, img, t0, div0, h4, t1, t2;

		return {
			c: function create() {
				main = element("main");
				div1 = element("div");
				figure = element("figure");
				img = element("img");
				t0 = space();
				div0 = element("div");
				h4 = element("h4");
				t1 = text("Criado por: ");
				t2 = text(ctx.username);
				img.src = src$2;
				img.alt = "Profile default";
				img.className = "svelte-1fbah4t";
				add_location(img, file$f, 10, 16, 230);
				figure.className = "svelte-1fbah4t";
				add_location(figure, file$f, 9, 12, 205);
				h4.className = "svelte-1fbah4t";
				add_location(h4, file$f, 13, 16, 327);
				add_location(div0, file$f, 12, 12, 305);
				div1.className = "wrapper svelte-1fbah4t";
				add_location(div1, file$f, 8, 8, 171);
				add_location(main, file$f, 7, 4, 156);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, main, anchor);
				append(main, div1);
				append(div1, figure);
				append(figure, img);
				append(div1, t0);
				append(div1, div0);
				append(div0, h4);
				append(h4, t1);
				append(h4, t2);
			},

			p: function update(changed, ctx) {
				if (changed.username) {
					set_data(t2, ctx.username);
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

	let src$2 = '/profile-picture.png';

	function instance$9($$self, $$props, $$invalidate) {
		let { username } = $$props;

		$$self.$set = $$props => {
			if ('username' in $$props) $$invalidate('username', username = $$props.username);
		};

		return { username };
	}

	class MiniProfile extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$9, create_fragment$g, safe_not_equal, ["username"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.username === undefined && !('username' in props)) {
				console.warn("<MiniProfile> was created without expected prop 'username'");
			}
		}

		get username() {
			throw new Error("<MiniProfile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set username(value) {
			throw new Error("<MiniProfile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/app/lib/component/TitleArea.svelte generated by Svelte v3.1.0 */

	const file$g = "src/app/lib/component/TitleArea.svelte";

	function create_fragment$h(ctx) {
		var main, p, t;

		return {
			c: function create() {
				main = element("main");
				p = element("p");
				t = text(ctx.title);
				p.className = "svelte-1uc05iz";
				add_location(p, file$g, 6, 4, 49);
				main.className = "svelte-1uc05iz";
				add_location(main, file$g, 5, 0, 38);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, main, anchor);
				append(main, p);
				append(p, t);
			},

			p: function update(changed, ctx) {
				if (changed.title) {
					set_data(t, ctx.title);
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

	function instance$a($$self, $$props, $$invalidate) {
		let { title } = $$props;

		$$self.$set = $$props => {
			if ('title' in $$props) $$invalidate('title', title = $$props.title);
		};

		return { title };
	}

	class TitleArea extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$a, create_fragment$h, safe_not_equal, ["title"]);

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

	/* src/app/lib/objects/RoadmapCard.svelte generated by Svelte v3.1.0 */

	const file$h = "src/app/lib/objects/RoadmapCard.svelte";

	// (11:4) <Rectangle>
	function create_default_slot$5(ctx) {
		var div0, t0, div10, div9, div1, h30, t2, t3, t4, div2, t5, div3, h31, t7, t8, t9, div4, h32, t11, t12, t13, div5, h33, t15, div6, h34, t17, h40, t18, t19, t20, br, t21, h41, t22, t23, t24, h42, t25, t26, t27, div7, h35, t29, t30, t31, div8, h36, current;

		var titlearea = new TitleArea({
			props: { title: ctx.nome },
			$$inline: true
		});

		var miniprofile = new MiniProfile({ $$inline: true });

		return {
			c: function create() {
				div0 = element("div");
				titlearea.$$.fragment.c();
				t0 = space();
				div10 = element("div");
				div9 = element("div");
				div1 = element("div");
				h30 = element("h3");
				h30.textContent = "Descrição";
				t2 = space();
				t3 = text(ctx.desc);
				t4 = space();
				div2 = element("div");
				miniprofile.$$.fragment.c();
				t5 = space();
				div3 = element("div");
				h31 = element("h3");
				h31.textContent = "Compartilhamentos";
				t7 = space();
				t8 = text(ctx.comp);
				t9 = space();
				div4 = element("div");
				h32 = element("h3");
				h32.textContent = "Favoritos";
				t11 = space();
				t12 = text(ctx.fav);
				t13 = space();
				div5 = element("div");
				h33 = element("h3");
				h33.textContent = "Assuntos";
				t15 = space();
				div6 = element("div");
				h34 = element("h3");
				h34.textContent = "Assuntos";
				t17 = space();
				h40 = element("h4");
				t18 = text("ID: ");
				t19 = text(ctx.id);
				t20 = space();
				br = element("br");
				t21 = space();
				h41 = element("h4");
				t22 = text("Criado em: ");
				t23 = text(ctx.criado);
				t24 = space();
				h42 = element("h4");
				t25 = text("Atualizado em: ");
				t26 = text(ctx.att);
				t27 = space();
				div7 = element("div");
				h35 = element("h3");
				h35.textContent = "Fonte";
				t29 = space();
				t30 = text(ctx.fonte);
				t31 = space();
				div8 = element("div");
				h36 = element("h3");
				h36.textContent = "Assuntos relacionados";
				div0.className = "svelte-11bz4rc";
				add_location(div0, file$h, 11, 8, 269);
				h30.className = "svelte-11bz4rc";
				add_location(h30, file$h, 18, 20, 436);
				div1.className = "box box1 svelte-11bz4rc";
				add_location(div1, file$h, 17, 16, 393);
				div2.className = "box box2 svelte-11bz4rc";
				add_location(div2, file$h, 20, 16, 501);
				h31.className = "svelte-11bz4rc";
				add_location(h31, file$h, 23, 38, 621);
				div3.className = "box box3 svelte-11bz4rc";
				add_location(div3, file$h, 23, 16, 599);
				h32.className = "svelte-11bz4rc";
				add_location(h32, file$h, 24, 38, 699);
				div4.className = "box box4 svelte-11bz4rc";
				add_location(div4, file$h, 24, 16, 677);
				h33.className = "svelte-11bz4rc";
				add_location(h33, file$h, 27, 20, 790);
				div5.className = "box box5 svelte-11bz4rc";
				add_location(div5, file$h, 25, 16, 746);
				h34.className = "svelte-11bz4rc";
				add_location(h34, file$h, 30, 20, 890);
				h40.className = "svelte-11bz4rc";
				add_location(h40, file$h, 31, 20, 928);
				add_location(br, file$h, 32, 20, 967);
				h41.className = "svelte-11bz4rc";
				add_location(h41, file$h, 33, 20, 993);
				h42.className = "svelte-11bz4rc";
				add_location(h42, file$h, 34, 20, 1042);
				div6.className = "box box6 svelte-11bz4rc";
				add_location(div6, file$h, 29, 16, 847);
				h35.className = "svelte-11bz4rc";
				add_location(h35, file$h, 37, 20, 1154);
				div7.className = "box box6 svelte-11bz4rc";
				add_location(div7, file$h, 36, 16, 1111);
				h36.className = "svelte-11bz4rc";
				add_location(h36, file$h, 40, 20, 1259);
				div8.className = "box box7 svelte-11bz4rc";
				add_location(div8, file$h, 39, 16, 1216);
				div9.className = "wrapper svelte-11bz4rc";
				add_location(div9, file$h, 16, 12, 355);
				div10.className = "svelte-11bz4rc";
				add_location(div10, file$h, 14, 8, 336);
			},

			m: function mount(target, anchor) {
				insert(target, div0, anchor);
				mount_component(titlearea, div0, null);
				insert(target, t0, anchor);
				insert(target, div10, anchor);
				append(div10, div9);
				append(div9, div1);
				append(div1, h30);
				append(div1, t2);
				append(div1, t3);
				append(div9, t4);
				append(div9, div2);
				mount_component(miniprofile, div2, null);
				append(div9, t5);
				append(div9, div3);
				append(div3, h31);
				append(div3, t7);
				append(div3, t8);
				append(div9, t9);
				append(div9, div4);
				append(div4, h32);
				append(div4, t11);
				append(div4, t12);
				append(div9, t13);
				append(div9, div5);
				append(div5, h33);
				append(div9, t15);
				append(div9, div6);
				append(div6, h34);
				append(div6, t17);
				append(div6, h40);
				append(h40, t18);
				append(h40, t19);
				append(div6, t20);
				append(div6, br);
				append(div6, t21);
				append(div6, h41);
				append(h41, t22);
				append(h41, t23);
				append(div6, t24);
				append(div6, h42);
				append(h42, t25);
				append(h42, t26);
				append(div9, t27);
				append(div9, div7);
				append(div7, h35);
				append(div7, t29);
				append(div7, t30);
				append(div9, t31);
				append(div9, div8);
				append(div8, h36);
				current = true;
			},

			p: function update(changed, ctx) {
				var titlearea_changes = {};
				if (changed.nome) titlearea_changes.title = ctx.nome;
				titlearea.$set(titlearea_changes);

				if (!current || changed.desc) {
					set_data(t3, ctx.desc);
				}

				if (!current || changed.comp) {
					set_data(t8, ctx.comp);
				}

				if (!current || changed.fav) {
					set_data(t12, ctx.fav);
				}

				if (!current || changed.id) {
					set_data(t19, ctx.id);
				}

				if (!current || changed.criado) {
					set_data(t23, ctx.criado);
				}

				if (!current || changed.att) {
					set_data(t26, ctx.att);
				}

				if (!current || changed.fonte) {
					set_data(t30, ctx.fonte);
				}
			},

			i: function intro(local) {
				if (current) return;
				titlearea.$$.fragment.i(local);

				miniprofile.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				titlearea.$$.fragment.o(local);
				miniprofile.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(div0);
				}

				titlearea.$destroy();

				if (detaching) {
					detach(t0);
					detach(div10);
				}

				miniprofile.$destroy();
			}
		};
	}

	function create_fragment$i(ctx) {
		var main, current;

		var rectangle = new Rectangle({
			props: {
			$$slots: { default: [create_default_slot$5] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		return {
			c: function create() {
				main = element("main");
				rectangle.$$.fragment.c();
				main.className = "svelte-11bz4rc";
				add_location(main, file$h, 9, 0, 238);
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
				if (changed.$$scope || changed.fonte || changed.att || changed.criado || changed.id || changed.fav || changed.comp || changed.desc || changed.nome) rectangle_changes.$$scope = { changed, ctx };
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

	function instance$b($$self, $$props, $$invalidate) {
		

	let { nome, desc, id, fav, comp, criado, att, fonte } = $$props;

		$$self.$set = $$props => {
			if ('nome' in $$props) $$invalidate('nome', nome = $$props.nome);
			if ('desc' in $$props) $$invalidate('desc', desc = $$props.desc);
			if ('id' in $$props) $$invalidate('id', id = $$props.id);
			if ('fav' in $$props) $$invalidate('fav', fav = $$props.fav);
			if ('comp' in $$props) $$invalidate('comp', comp = $$props.comp);
			if ('criado' in $$props) $$invalidate('criado', criado = $$props.criado);
			if ('att' in $$props) $$invalidate('att', att = $$props.att);
			if ('fonte' in $$props) $$invalidate('fonte', fonte = $$props.fonte);
		};

		return {
			nome,
			desc,
			id,
			fav,
			comp,
			criado,
			att,
			fonte
		};
	}

	class RoadmapCard extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$b, create_fragment$i, safe_not_equal, ["nome", "desc", "id", "fav", "comp", "criado", "att", "fonte"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.nome === undefined && !('nome' in props)) {
				console.warn("<RoadmapCard> was created without expected prop 'nome'");
			}
			if (ctx.desc === undefined && !('desc' in props)) {
				console.warn("<RoadmapCard> was created without expected prop 'desc'");
			}
			if (ctx.id === undefined && !('id' in props)) {
				console.warn("<RoadmapCard> was created without expected prop 'id'");
			}
			if (ctx.fav === undefined && !('fav' in props)) {
				console.warn("<RoadmapCard> was created without expected prop 'fav'");
			}
			if (ctx.comp === undefined && !('comp' in props)) {
				console.warn("<RoadmapCard> was created without expected prop 'comp'");
			}
			if (ctx.criado === undefined && !('criado' in props)) {
				console.warn("<RoadmapCard> was created without expected prop 'criado'");
			}
			if (ctx.att === undefined && !('att' in props)) {
				console.warn("<RoadmapCard> was created without expected prop 'att'");
			}
			if (ctx.fonte === undefined && !('fonte' in props)) {
				console.warn("<RoadmapCard> was created without expected prop 'fonte'");
			}
		}

		get nome() {
			throw new Error("<RoadmapCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set nome(value) {
			throw new Error("<RoadmapCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get desc() {
			throw new Error("<RoadmapCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set desc(value) {
			throw new Error("<RoadmapCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get id() {
			throw new Error("<RoadmapCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set id(value) {
			throw new Error("<RoadmapCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get fav() {
			throw new Error("<RoadmapCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set fav(value) {
			throw new Error("<RoadmapCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get comp() {
			throw new Error("<RoadmapCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set comp(value) {
			throw new Error("<RoadmapCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get criado() {
			throw new Error("<RoadmapCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set criado(value) {
			throw new Error("<RoadmapCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get att() {
			throw new Error("<RoadmapCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set att(value) {
			throw new Error("<RoadmapCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get fonte() {
			throw new Error("<RoadmapCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set fonte(value) {
			throw new Error("<RoadmapCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/app/lib/component/GetListRoadmaps.svelte generated by Svelte v3.1.0 */

	const file$i = "src/app/lib/component/GetListRoadmaps.svelte";

	function get_each_context$2(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.element = list[i];
		return child_ctx;
	}

	// (29:2) {:catch error}
	function create_catch_block$2(ctx) {
		var p, t_value = ctx.error.message, t;

		return {
			c: function create() {
				p = element("p");
				t = text(t_value);
				set_style(p, "color", "red");
				add_location(p, file$i, 29, 6, 781);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
				append(p, t);
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

	// (21:2) {:then response}
	function create_then_block$2(ctx) {
		var each_1_anchor, current;

		var each_value = ctx.response;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
		}

		function outro_block(i, detaching, local) {
			if (each_blocks[i]) {
				if (detaching) {
					on_outro(() => {
						each_blocks[i].d(detaching);
						each_blocks[i] = null;
					});
				}

				each_blocks[i].o(local);
			}
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
				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.promise) {
					each_value = ctx.response;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$2(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
							each_blocks[i].i(1);
						} else {
							each_blocks[i] = create_each_block$2(child_ctx);
							each_blocks[i].c();
							each_blocks[i].i(1);
							each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
						}
					}

					group_outros();
					for (; i < each_blocks.length; i += 1) outro_block(i, 1, 1);
					check_outros();
				}
			},

			i: function intro(local) {
				if (current) return;
				for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

				current = true;
			},

			o: function outro(local) {
				each_blocks = each_blocks.filter(Boolean);
				for (let i = 0; i < each_blocks.length; i += 1) outro_block(i, 0);

				current = false;
			},

			d: function destroy(detaching) {
				destroy_each(each_blocks, detaching);

				if (detaching) {
					detach(each_1_anchor);
				}
			}
		};
	}

	// (23:6) <RoadmapCard nome={element.nome} desc={element.descricao}         criado={element.criadoEm} id={element.id} fav={element.qtdFavoritos}         comp={element.qtdCompartilhamento} att={element.atualizadoEm} fonte={element.fonte} >
	function create_default_slot$6(ctx) {
		return {
			c: noop,
			m: noop,
			d: noop
		};
	}

	// (22:6) {#each response as element}
	function create_each_block$2(ctx) {
		var current;

		var roadmapcard = new RoadmapCard({
			props: {
			nome: ctx.element.nome,
			desc: ctx.element.descricao,
			criado: ctx.element.criadoEm,
			id: ctx.element.id,
			fav: ctx.element.qtdFavoritos,
			comp: ctx.element.qtdCompartilhamento,
			att: ctx.element.atualizadoEm,
			fonte: ctx.element.fonte,
			$$slots: { default: [create_default_slot$6] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		return {
			c: function create() {
				roadmapcard.$$.fragment.c();
			},

			m: function mount(target, anchor) {
				mount_component(roadmapcard, target, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				var roadmapcard_changes = {};
				if (changed.promise) roadmapcard_changes.nome = ctx.element.nome;
				if (changed.promise) roadmapcard_changes.desc = ctx.element.descricao;
				if (changed.promise) roadmapcard_changes.criado = ctx.element.criadoEm;
				if (changed.promise) roadmapcard_changes.id = ctx.element.id;
				if (changed.promise) roadmapcard_changes.fav = ctx.element.qtdFavoritos;
				if (changed.promise) roadmapcard_changes.comp = ctx.element.qtdCompartilhamento;
				if (changed.promise) roadmapcard_changes.att = ctx.element.atualizadoEm;
				if (changed.promise) roadmapcard_changes.fonte = ctx.element.fonte;
				if (changed.$$scope) roadmapcard_changes.$$scope = { changed, ctx };
				roadmapcard.$set(roadmapcard_changes);
			},

			i: function intro(local) {
				if (current) return;
				roadmapcard.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				roadmapcard.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				roadmapcard.$destroy(detaching);
			}
		};
	}

	// (19:18)        <p>...carregando</p>   {:then response}
	function create_pending_block$2(ctx) {
		var p;

		return {
			c: function create() {
				p = element("p");
				p.textContent = "...carregando";
				add_location(p, file$i, 19, 6, 405);
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

	function create_fragment$j(ctx) {
		var await_block_anchor, promise_1, current;

		let info = {
			ctx,
			current: null,
			pending: create_pending_block$2,
			then: create_then_block$2,
			catch: create_catch_block$2,
			value: 'response',
			error: 'error',
			blocks: Array(3)
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

				current = true;
			},

			p: function update(changed, new_ctx) {
				ctx = new_ctx;
				info.ctx = ctx;

				if (promise_1 !== (promise_1 = ctx.promise) && handle_promise(promise_1, info)) ; else {
					info.block.p(changed, assign(assign({}, ctx), info.resolved));
				}
			},

			i: function intro(local) {
				if (current) return;
				info.block.i();
				current = true;
			},

			o: function outro(local) {
				for (let i = 0; i < 3; i += 1) {
					const block = info.blocks[i];
					if (block) block.o();
				}

				current = false;
			},

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

	function instance$c($$self) {
		let promise = GetListRoadmaps();

		return { promise };
	}

	class GetListRoadmaps_1 extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$c, create_fragment$j, safe_not_equal, []);
		}
	}

	/* src/app/pages/ListaRoadmaps.svelte generated by Svelte v3.1.0 */

	const file$j = "src/app/pages/ListaRoadmaps.svelte";

	function create_fragment$k(ctx) {
		var h1, t1, t2, current;

		var trends = new Trends({ $$inline: true });

		var getlistroadmaps = new GetListRoadmaps_1({ $$inline: true });

		return {
			c: function create() {
				h1 = element("h1");
				h1.textContent = "Todos os Roadmaps";
				t1 = space();
				trends.$$.fragment.c();
				t2 = space();
				getlistroadmaps.$$.fragment.c();
				add_location(h1, file$j, 5, 0, 158);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, h1, anchor);
				insert(target, t1, anchor);
				mount_component(trends, target, anchor);
				insert(target, t2, anchor);
				mount_component(getlistroadmaps, target, anchor);
				current = true;
			},

			p: noop,

			i: function intro(local) {
				if (current) return;
				trends.$$.fragment.i(local);

				getlistroadmaps.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				trends.$$.fragment.o(local);
				getlistroadmaps.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(h1);
					detach(t1);
				}

				trends.$destroy(detaching);

				if (detaching) {
					detach(t2);
				}

				getlistroadmaps.$destroy(detaching);
			}
		};
	}

	class ListaRoadmaps extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$k, safe_not_equal, []);
		}
	}

	/* src/app/pages/PerfilDeUsuario.svelte generated by Svelte v3.1.0 */

	const file$k = "src/app/pages/PerfilDeUsuario.svelte";

	function create_fragment$l(ctx) {
		var main, current;

		var perfil = new Perfil({
			props: { username: ctx.name },
			$$inline: true
		});

		return {
			c: function create() {
				main = element("main");
				perfil.$$.fragment.c();
				add_location(main, file$k, 6, 0, 99);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, main, anchor);
				mount_component(perfil, main, null);
				current = true;
			},

			p: function update(changed, ctx) {
				var perfil_changes = {};
				if (changed.name) perfil_changes.username = ctx.name;
				perfil.$set(perfil_changes);
			},

			i: function intro(local) {
				if (current) return;
				perfil.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				perfil.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(main);
				}

				perfil.$destroy();
			}
		};
	}

	function instance$d($$self, $$props, $$invalidate) {
		let { name } = $$props;

		$$self.$set = $$props => {
			if ('name' in $$props) $$invalidate('name', name = $$props.name);
		};

		return { name };
	}

	class PerfilDeUsuario extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$d, create_fragment$l, safe_not_equal, ["name"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.name === undefined && !('name' in props)) {
				console.warn("<PerfilDeUsuario> was created without expected prop 'name'");
			}
		}

		get name() {
			throw new Error("<PerfilDeUsuario>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set name(value) {
			throw new Error("<PerfilDeUsuario>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/app/pages/Signout.svelte generated by Svelte v3.1.0 */

	const file$l = "src/app/pages/Signout.svelte";

	function create_fragment$m(ctx) {
		var main;

		return {
			c: function create() {
				main = element("main");
				main.className = "svelte-x6a0o2";
				add_location(main, file$l, 4, 0, 21);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, main, anchor);
			},

			p: noop,
			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(main);
				}
			}
		};
	}

	class Signout extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$m, safe_not_equal, []);
		}
	}

	/* src/app/routing/Router.svelte generated by Svelte v3.1.0 */

	const file$m = "src/app/routing/Router.svelte";

	function create_fragment$n(ctx) {
		var main, div, current;

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
				div = element("div");
				if (switch_instance) switch_instance.$$.fragment.c();
				div.className = "content svelte-1yjcuke";
				add_location(div, file$m, 63, 2, 1517);
				main.className = "svelte-1yjcuke";
				add_location(main, file$m, 62, 0, 1508);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, main, anchor);
				append(main, div);

				if (switch_instance) {
					mount_component(switch_instance, div, null);
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
						mount_component(switch_instance, div, null);
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

	function instance$e($$self, $$props, $$invalidate) {
		

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
	      case 'signout':
	        $$invalidate('value', value = Signout);
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
			init(this, options, instance$e, create_fragment$n, safe_not_equal, []);
		}
	}

	/* src/app/lib/component/RouterLink.svelte generated by Svelte v3.1.0 */

	const file$n = "src/app/lib/component/RouterLink.svelte";

	function create_fragment$o(ctx) {
		var div, figure, img, t, a, a_href_value, current;

		const default_slot_1 = ctx.$$slots.default;
		const default_slot = create_slot(default_slot_1, ctx, null);

		return {
			c: function create() {
				div = element("div");
				figure = element("figure");
				img = element("img");
				t = space();
				a = element("a");

				if (default_slot) default_slot.c();
				img.src = ctx.src;
				img.alt = "[O]";
				img.className = "svelte-xoblos";
				add_location(img, file$n, 24, 4, 327);
				add_location(figure, file$n, 23, 2, 314);

				a.href = a_href_value = "#/" + ctx.url;
				a.className = "svelte-xoblos";
				add_location(a, file$n, 26, 2, 369);
				div.className = "flex svelte-xoblos";
				add_location(div, file$n, 22, 0, 293);
			},

			l: function claim(nodes) {
				if (default_slot) default_slot.l(a_nodes);
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, figure);
				append(figure, img);
				append(div, t);
				append(div, a);

				if (default_slot) {
					default_slot.m(a, null);
				}

				current = true;
			},

			p: function update(changed, ctx) {
				if (!current || changed.src) {
					img.src = ctx.src;
				}

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
					detach(div);
				}

				if (default_slot) default_slot.d(detaching);
			}
		};
	}

	function instance$f($$self, $$props, $$invalidate) {
		let { url, src } = $$props;

		let { $$slots = {}, $$scope } = $$props;

		$$self.$set = $$props => {
			if ('url' in $$props) $$invalidate('url', url = $$props.url);
			if ('src' in $$props) $$invalidate('src', src = $$props.src);
			if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
		};

		return { url, src, $$slots, $$scope };
	}

	class RouterLink extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$f, create_fragment$o, safe_not_equal, ["url", "src"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.url === undefined && !('url' in props)) {
				console.warn("<RouterLink> was created without expected prop 'url'");
			}
			if (ctx.src === undefined && !('src' in props)) {
				console.warn("<RouterLink> was created without expected prop 'src'");
			}
		}

		get url() {
			throw new Error("<RouterLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set url(value) {
			throw new Error("<RouterLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get src() {
			throw new Error("<RouterLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set src(value) {
			throw new Error("<RouterLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/app/lib/component/Sidenav.svelte generated by Svelte v3.1.0 */

	const file$o = "src/app/lib/component/Sidenav.svelte";

	// (28:18) <RouterLink url=''>
	function create_default_slot_6(ctx) {
		var t;

		return {
			c: function create() {
				t = text("Líbero");
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

	// (35:14) <RouterLink url='perfil' src={srcprofile}>
	function create_default_slot_5(ctx) {
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

	// (40:14) <RouterLink url='assuntos' src={srcmytopics}>
	function create_default_slot_4(ctx) {
		var t;

		return {
			c: function create() {
				t = text("Meus Assuntos");
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

	// (43:14) <RouterLink url='lista-assuntos' src={srctopics}>
	function create_default_slot_3(ctx) {
		var t;

		return {
			c: function create() {
				t = text("Todos os Assuntos");
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

	// (46:14) <RouterLink url='roadmaps' src={srcmyroadmaps}>
	function create_default_slot_2(ctx) {
		var t;

		return {
			c: function create() {
				t = text("Meus Roadmaps");
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

	// (49:14) <RouterLink url='lista-roadmaps' src={srcroadmaps}>
	function create_default_slot_1$1(ctx) {
		var t;

		return {
			c: function create() {
				t = text("Todos os Roadmaps");
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

	// (55:14) <RouterLink url='signout'src={srcpower} >
	function create_default_slot$7(ctx) {
		var t;

		return {
			c: function create() {
				t = text("Sair");
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

	function create_fragment$p(ctx) {
		var style, t1, main, nav, div2, div0, ul0, li0, h2, t2, div1, ul1, li1, t3, br0, t4, br1, t5, li2, t6, li3, t7, li4, t8, li5, t9, br2, t10, br3, t11, br4, t12, li6, current;

		var routerlink0 = new RouterLink({
			props: {
			url: "",
			$$slots: { default: [create_default_slot_6] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		var routerlink1 = new RouterLink({
			props: {
			url: "perfil",
			src: srcprofile,
			$$slots: { default: [create_default_slot_5] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		var routerlink2 = new RouterLink({
			props: {
			url: "assuntos",
			src: srcmytopics,
			$$slots: { default: [create_default_slot_4] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		var routerlink3 = new RouterLink({
			props: {
			url: "lista-assuntos",
			src: srctopics,
			$$slots: { default: [create_default_slot_3] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		var routerlink4 = new RouterLink({
			props: {
			url: "roadmaps",
			src: srcmyroadmaps,
			$$slots: { default: [create_default_slot_2] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		var routerlink5 = new RouterLink({
			props: {
			url: "lista-roadmaps",
			src: srcroadmaps,
			$$slots: { default: [create_default_slot_1$1] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		var routerlink6 = new RouterLink({
			props: {
			url: "signout",
			src: srcpower,
			$$slots: { default: [create_default_slot$7] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		return {
			c: function create() {
				style = element("style");
				style.textContent = "@import url('https://fonts.googleapis.com/css?family=Raleway&display=swap');\n        @import url('https://fonts.googleapis.com/css?family=Lato');\n        @import url('https://fonts.googleapis.com/css?family=Rubik');";
				t1 = space();
				main = element("main");
				nav = element("nav");
				div2 = element("div");
				div0 = element("div");
				ul0 = element("ul");
				li0 = element("li");
				h2 = element("h2");
				routerlink0.$$.fragment.c();
				t2 = space();
				div1 = element("div");
				ul1 = element("ul");
				li1 = element("li");
				routerlink1.$$.fragment.c();
				t3 = space();
				br0 = element("br");
				t4 = space();
				br1 = element("br");
				t5 = space();
				li2 = element("li");
				routerlink2.$$.fragment.c();
				t6 = space();
				li3 = element("li");
				routerlink3.$$.fragment.c();
				t7 = space();
				li4 = element("li");
				routerlink4.$$.fragment.c();
				t8 = space();
				li5 = element("li");
				routerlink5.$$.fragment.c();
				t9 = space();
				br2 = element("br");
				t10 = space();
				br3 = element("br");
				t11 = space();
				br4 = element("br");
				t12 = space();
				li6 = element("li");
				routerlink6.$$.fragment.c();
				add_location(style, file$o, 1, 4, 18);
				h2.className = "svelte-19610ze";
				add_location(h2, file$o, 27, 14, 678);
				li0.className = "svelte-19610ze";
				add_location(li0, file$o, 26, 12, 659);
				ul0.className = "svelte-19610ze";
				add_location(ul0, file$o, 25, 10, 642);
				div0.className = "content svelte-19610ze";
				add_location(div0, file$o, 24, 8, 610);
				li1.className = "svelte-19610ze";
				add_location(li1, file$o, 33, 12, 821);
				add_location(br0, file$o, 36, 12, 932);
				add_location(br1, file$o, 37, 12, 949);
				li2.className = "svelte-19610ze";
				add_location(li2, file$o, 38, 12, 966);
				li3.className = "svelte-19610ze";
				add_location(li3, file$o, 41, 12, 1087);
				li4.className = "svelte-19610ze";
				add_location(li4, file$o, 44, 12, 1216);
				li5.className = "svelte-19610ze";
				add_location(li5, file$o, 47, 12, 1339);
				add_location(br2, file$o, 50, 12, 1470);
				add_location(br3, file$o, 51, 12, 1487);
				add_location(br4, file$o, 52, 12, 1504);
				li6.className = "svelte-19610ze";
				add_location(li6, file$o, 53, 12, 1521);
				ul1.className = "svelte-19610ze";
				add_location(ul1, file$o, 32, 10, 804);
				add_location(div1, file$o, 31, 8, 788);
				div2.className = "wrapper";
				add_location(div2, file$o, 23, 6, 580);
				nav.className = "svelte-19610ze";
				add_location(nav, file$o, 22, 4, 568);
				main.className = "svelte-19610ze";
				add_location(main, file$o, 21, 0, 557);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				append(document.head, style);
				insert(target, t1, anchor);
				insert(target, main, anchor);
				append(main, nav);
				append(nav, div2);
				append(div2, div0);
				append(div0, ul0);
				append(ul0, li0);
				append(li0, h2);
				mount_component(routerlink0, h2, null);
				append(div2, t2);
				append(div2, div1);
				append(div1, ul1);
				append(ul1, li1);
				mount_component(routerlink1, li1, null);
				append(ul1, t3);
				append(ul1, br0);
				append(ul1, t4);
				append(ul1, br1);
				append(ul1, t5);
				append(ul1, li2);
				mount_component(routerlink2, li2, null);
				append(ul1, t6);
				append(ul1, li3);
				mount_component(routerlink3, li3, null);
				append(ul1, t7);
				append(ul1, li4);
				mount_component(routerlink4, li4, null);
				append(ul1, t8);
				append(ul1, li5);
				mount_component(routerlink5, li5, null);
				append(ul1, t9);
				append(ul1, br2);
				append(ul1, t10);
				append(ul1, br3);
				append(ul1, t11);
				append(ul1, br4);
				append(ul1, t12);
				append(ul1, li6);
				mount_component(routerlink6, li6, null);
				current = true;
			},

			p: function update(changed, ctx) {
				var routerlink0_changes = {};
				if (changed.$$scope) routerlink0_changes.$$scope = { changed, ctx };
				routerlink0.$set(routerlink0_changes);

				var routerlink1_changes = {};
				if (changed.srcprofile) routerlink1_changes.src = srcprofile;
				if (changed.$$scope) routerlink1_changes.$$scope = { changed, ctx };
				routerlink1.$set(routerlink1_changes);

				var routerlink2_changes = {};
				if (changed.srcmytopics) routerlink2_changes.src = srcmytopics;
				if (changed.$$scope) routerlink2_changes.$$scope = { changed, ctx };
				routerlink2.$set(routerlink2_changes);

				var routerlink3_changes = {};
				if (changed.srctopics) routerlink3_changes.src = srctopics;
				if (changed.$$scope) routerlink3_changes.$$scope = { changed, ctx };
				routerlink3.$set(routerlink3_changes);

				var routerlink4_changes = {};
				if (changed.srcmyroadmaps) routerlink4_changes.src = srcmyroadmaps;
				if (changed.$$scope) routerlink4_changes.$$scope = { changed, ctx };
				routerlink4.$set(routerlink4_changes);

				var routerlink5_changes = {};
				if (changed.srcroadmaps) routerlink5_changes.src = srcroadmaps;
				if (changed.$$scope) routerlink5_changes.$$scope = { changed, ctx };
				routerlink5.$set(routerlink5_changes);

				var routerlink6_changes = {};
				if (changed.srcpower) routerlink6_changes.src = srcpower;
				if (changed.$$scope) routerlink6_changes.$$scope = { changed, ctx };
				routerlink6.$set(routerlink6_changes);
			},

			i: function intro(local) {
				if (current) return;
				routerlink0.$$.fragment.i(local);

				routerlink1.$$.fragment.i(local);

				routerlink2.$$.fragment.i(local);

				routerlink3.$$.fragment.i(local);

				routerlink4.$$.fragment.i(local);

				routerlink5.$$.fragment.i(local);

				routerlink6.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				routerlink0.$$.fragment.o(local);
				routerlink1.$$.fragment.o(local);
				routerlink2.$$.fragment.o(local);
				routerlink3.$$.fragment.o(local);
				routerlink4.$$.fragment.o(local);
				routerlink5.$$.fragment.o(local);
				routerlink6.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				detach(style);

				if (detaching) {
					detach(t1);
					detach(main);
				}

				routerlink0.$destroy();

				routerlink1.$destroy();

				routerlink2.$destroy();

				routerlink3.$destroy();

				routerlink4.$destroy();

				routerlink5.$destroy();

				routerlink6.$destroy();
			}
		};
	}

	let srcprofile = '/gear.svg';

	let srctopics = '/collection.svg';

	let srcroadmaps = '/book-fill.svg';

	let srcmytopics = '/bezier.svg';

	let srcmyroadmaps = '/book.svg';

	let srcpower = '/power.svg';

	class Sidenav extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$p, safe_not_equal, []);
		}
	}

	/* src/App.svelte generated by Svelte v3.1.0 */

	const file$p = "src/App.svelte";

	function create_fragment$q(ctx) {
		var div, t, current;

		var sidenav = new Sidenav({
			props: { class: "sidenav", id: "sidenav" },
			$$inline: true
		});

		var router = new Router({ props: { id: "router" }, $$inline: true });

		return {
			c: function create() {
				div = element("div");
				sidenav.$$.fragment.c();
				t = space();
				router.$$.fragment.c();
				div.className = "app-shell svelte-nec9hd";
				add_location(div, file$p, 20, 0, 268);
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
			init(this, options, null, create_fragment$q, safe_not_equal, []);
		}
	}

	const app = new App({
		target: document.body.querySelector('#app')
	});

	return app;

}());
//# sourceMappingURL=bundle.js.map
