<script>
  import Perfil from '../lib/component/Perfil.svelte';
  import Box from '../lib/objects/Box.svelte';
  import Rectangle from '../lib/objects/Rectangle.svelte';
  import Trends from '../lib/component/Trends.svelte';
  import Searchbox from '../lib/objects/Searchbox.svelte';

  function crudAssunto(event) {
    console.log("Assunto.");
  }

  function crudRoadmap(event) {
    console.log("Roadmaps.");
  }

  function viewTrends(event) {
    console.log("Tendências.");
    
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
      <Box topic={"Pesquisa"} func={viewTrends} />
    </div>
  </div>
</div>

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
    border-top: 10px rgb(0, 0, 0);
    padding: 10px 50px;
  }
</style>



