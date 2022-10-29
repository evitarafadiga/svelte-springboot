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
    <ul>
    {#each response as element}
    <li>
    <AssuntoCard title={element.descricao} id={element.id} descricao={element.fonte}> 
    </AssuntoCard>
    </li>
    {/each}
    </ul>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}

