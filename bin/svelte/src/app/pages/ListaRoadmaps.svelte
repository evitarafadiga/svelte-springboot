<script>
    import GetListRoadmaps from '../lib/component/GetListRoadmaps.svelte';
    import Trends from '../lib/component/Trends.svelte';
</script>
      


<div class="container">
    <h1>Todos os Roadmaps</h1>
    <div class="wrapper">
        <Trends />
    </div>
    <GetListRoadmaps />
</div>



<style>
    .container {
        padding: 10px;
    }

    .wrapper {
        flex-wrap: wrap;  
    }

</style>

  
      
      