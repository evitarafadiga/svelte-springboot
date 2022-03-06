<script>
  import GetList from '../component/GetList.svelte'
  import Perfil from '../component/Perfil.svelte';
  import Box from '../component/Box.svelte';
</script>

<div>
  <Perfil>

  </Perfil>
  <div class="topics-div">
    <Box value="nome">Assuntos</Box>
    <Box>Roadmaps</Box>
    <Box>Tendências</Box>
  </div>
  <GetList />
</div>

<style>

  div {
    flex-direction: column;
  }
  .topics-div {
    flex-direction: row;
  }
</style>



