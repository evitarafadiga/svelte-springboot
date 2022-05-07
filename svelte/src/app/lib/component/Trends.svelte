<script>
    import GetList from './GetList.svelte'
</script>

<div class="container">
    <div class="wrapper">
        <h2>Top assuntos</h2>
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
    max-width: 240px;
    border-left: 10px --second-color;
    }
    
</style>