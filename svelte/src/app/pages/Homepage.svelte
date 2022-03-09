<script>
  import Perfil from '../component/Perfil.svelte';
  import Box from '../component/Box.svelte';
  import Trends from '../component/Trends.svelte';
</script>

<div class="container">
  <div class="wrapper">
    <div class="content">
      <Perfil />
      <Trends />
    </div>
    
    <div class="content">
    <Box />
    <Box />
    <Box />
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



