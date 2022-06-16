<script>
import GetListAssunto from '../lib/component/GetListAssunto.svelte';
import Rectangle from '../lib/objects/Rectangle.svelte';
</script>
  


<div class="container">
    <h1>Todos os assuntos criados</h1>
    <div class="wrapper">
        <GetListAssunto id="assunto"/>
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

  