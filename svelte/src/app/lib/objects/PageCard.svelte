<script>
    import Rectangle from "./Rectangle.svelte";
    export let name;

</script>

<Rectangle>
    {#if name === 'new'}
    <div>
        Adicionar novo Asssunto

        +
    </div>
    {/if}
    {#if name === ''} 
    <div>
        Assunto 1
    </div>
    {/if}
</Rectangle>


<style>

</style>