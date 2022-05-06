<script>
import Card from "../objects/Card.svelte";


    let promise = GetListRoadmaps();
  
    async function GetListRoadmaps() {
      const res = await fetch(`listaroadmaps`);
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
      <Card nome={element.nome} desc={element.descricao}
        criado={element.criadoEm} id={element.id} fav={element.qtdFavoritos}
        comp={element.qtdCompartilhamento} att={element.atualizadoEm} fonte={element.fonte} >
        <div>
            <p>Roadmap: {element.nome} id:{element.id} favoritos: {element.qtdFavoritos} compartilhamentos: {element.qtdCompartilhamento}</p>
            <p>criado em:{element.criadoEm} atualizado em:{element.atualizadoEm} Fonte: {element.fonte}</p>
            <p>descrição:{element.descricao}</p>
        </div>
      </Card>
        
      {/each}
  {:catch error}
      <p style="color: red">{error.message}</p>
  {/await}
  
  