<script>
import GetListAssunto from '../lib/component/GetListAssunto.svelte';
import Rectangle from '../lib/objects/Rectangle.svelte';
</script>
  


<div class="container">
    <h1>Todos os Assuntos</h1>
    <Rectangle>
        <div class="wrapper">
            <GetListAssunto id="assunto"/>
        </div>
    </Rectangle>    
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

  