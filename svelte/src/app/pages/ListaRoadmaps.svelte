<script>
    import GetListRoadmaps from '../lib/component/GetListRoadmaps.svelte';
    import Trends from '../lib/component/Trends.svelte';
</script>
      


<div class="container">
    <h1>Todos os Roadmaps</h1>
    <div class="wrapper">
        <Trends />
		<GetListRoadmaps />
    </div>   
</div>



<style>
    .container {
        padding: 10px;
    }

    .wrapper {
        display: flex;
        flex-wrap: wrap;  
    }

</style>

  
      
      