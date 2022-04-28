<script>
  import Perfil from '../lib/component/Perfil.svelte';
  import Box from '../lib/objects/Box.svelte';
  import Rectangle from '../lib/objects/Rectangle.svelte';
  import Trends from '../lib/component/Trends.svelte';

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
    <div class="content">
      <Perfil />
      <Trends />
    </div>
    
    <div class="content">
      <Box topic={"Assuntos"} func={crudAssunto} />
      <Box topic={"Roadmaps"} func={crudRoadmap} />
      <Box topic={"Tendências"} func={viewTrends} />
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
    padding: 10px 250px;
  }
</style>



