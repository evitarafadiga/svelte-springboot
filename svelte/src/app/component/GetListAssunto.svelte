<script>
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
        <div>
        <p>Assunto: {element.descricao} id:{element.id}-{element.idStr}</p>
        <p>criado em:{element.criadoEm} Fonte: {element.fonte}</p>
        </div>
      {/each}
  {:catch error}
      <p style="color: red">{error.message}</p>
  {/await}
  
  