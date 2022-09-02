<script>
    import GetListAssuntoDeUsuario from '../lib/component/GetListAssuntoDeUsuario.svelte';
    import Rectangle from '../lib/objects/Rectangle.svelte';
</script>
      
<div class="container">
    <h1>Meus Assuntos</h1>
    <div class="wrapper">
        <GetListAssuntoDeUsuario id="assunto"/>
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

  