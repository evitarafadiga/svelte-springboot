<script>
    import AssuntoCard from "./AssuntoCard.svelte";

    let promise = getListAssuntoDeUsuario();
  
    async function getListAssuntoDeUsuario() {
        const res = await fetch(`assuntos`);
        const text = await res.json();
  
        if (res.ok) {
            return text;
        } else {
            throw new Error(text);
        } 
    }
</script>
  
{#await promise}
    <p>...carregando</p>
{:then response}
    {#each response as element}
    <AssuntoCard title={element.descricao} id={element.id} descricao={element.fonte}> 
    </AssuntoCard>
    {/each}
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}

