<script>
  import Perfil from '../lib/component/Perfil.svelte';
  import Box from '../lib/objects/Box.svelte';
  import Rectangle from '../lib/objects/Rectangle.svelte';
  import Trends from '../lib/component/Trends.svelte';
  import Searchbox from '../lib/objects/Searchbox.svelte';
  import AssuntoDialog from '../lib/component/AssuntoDialog.svelte';

  import Modal,{getModal} from '../lib/component/Modal.svelte'
	let name = 'world';
	
	let selection
	
	// Callback function provided to the `open` function, it receives the value given to the `close` function call, or `undefined` if the Modal was closed with escape or clicking the X, etc.
	function setSelection(res){
		selection=res
	}

  function crudAssunto(event) {
    console.log("Chamado cadastro de assunto");
    getModal().open()
  }

  function crudRoadmap(event) {
    console.log("Chamado cadastro de roadmap");
  }

  function viewTrends(event) {
    console.log("Chamado pesquisa e tendências.");
    
  }

</script>

<div class="container">
  <div class="wrapper">
    <Searchbox />
    <div class="content">
      <Perfil username={"Fulano"}/>
      <Trends />
    </div>
    
    <div class="content">
      <Box topic={"+ Assunto"} func={crudAssunto} />
      <Box topic={"+ Roadmap"} func={crudRoadmap} />
      <Box topic={"Tendências"} func={viewTrends} />
    </div>
    
    <AssuntoDialog />

    
  </div>
</div>

<!-- the modal without an `id` -->
<Modal>
	<h1>Hello {name}!</h1>
	<!-- opening a model with an `id` and specifying a callback	 -->
	<button on:click={()=>getModal('second').open(setSelection)}>
		Open Nested Popup
	</button>
	{#if selection}
	<p>
		Your selection was: {selection}
	</p>
	{/if}
</Modal>

<style>
  .container {
    margin: 0 auto;
  }
  .wrapper {
    overflow: hidden;
    margin: 1rem;
  }
  .content {
    display: flex;
    justify-content: center;
    border-top: 10px --second-color;
    padding: 10px 50px;
  }
</style>



