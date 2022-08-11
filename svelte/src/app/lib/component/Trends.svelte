<script>
    import GetList from './GetList.svelte'
</script>

<div class="container">
    <div class="wrapper">
        <h2>Mais estudados</h2>
        <GetList />
    </div>
</div>


<style>
    h2 {
        font-family: 'Lato';
        font-weight: normal;
    }
    .container {
    margin: 0 auto;
    }
    .wrapper {
    overflow: hidden;
    margin: 1rem;
    max-width: 600px;
    border-left: 10px --second-color;
    }
    
</style>