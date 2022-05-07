<script>
	import Modal,{getModal} from './Modal.svelte'
	let name = 'world';
	
	let selection
	
	// Callback function provided to the `open` function, it receives the value given to the `close` function call, or `undefined` if the Modal was closed with escape or clicking the X, etc.
	function setSelection(res){
		selection=res
	}
	
</script>
<h2>Very Simple Modal Component</h2>
<ul>
	<li>Sinlge .svelte file, no dependencies</li>
	<li>Code is simple and commented, easy to modify to your needs</li>
	<li>It will always display on top, even if placed low in the stacking context</li>
	<li>Supports multiple, nested modal popups</li>
	<li>Supports returning a value when closing modal popup</li>
</ul>

<!-- Simplest use: modal without an `id` or callback function -->
<button on:click={()=>getModal().open()}>
	Open First Popup
</button>

<!-- the modal without an `id` -->
<Modal>
	<h1>Hello {name}!</h1>
	
</Modal>

<Modal id="second">
	Inner window
	<!-- Passing a value back to the callback function	 -->
	<button class="green" on:click={()=>getModal('second').close(1)}>
		Select 1
	</button>
	<button class="green" on:click={()=>getModal('second').close(2)}>
		Select 2
	</button>
	
</Modal>

<style>
	/* The content inside the modal can be styled as usual	 */
	.green {
		background: #0f0;
	}
</style>