<script>
    import GetList from './GetList.svelte'
</script>

<div class="container">
    <div class="wrapper">
        <h1>Tendências</h1>
        <GetList />
    </div>
</div>


<style>
    .container {
    margin: 0 auto;
    }
    .wrapper {
    overflow: hidden;
    margin: 1rem;
    max-width: 240px;
    border-left: 10px black;
    }
    
</style>