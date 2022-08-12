<script>
    import AssuntoCard from "./AssuntoCard.svelte";

    let promise = getListAssunto();
  
    async function getListAssunto() {
        const res = await fetch(`listaassuntos`);
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

