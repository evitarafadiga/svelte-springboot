<script>
import RoadmapCard from "../objects/RoadmapCard.svelte";


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
      <RoadmapCard nome={element.nome} desc={element.descricao}
        criado={element.criadoEm} id={element.id} fav={element.qtdFavoritos}
        comp={element.qtdCompartilhamento} att={element.atualizadoEm} fonte={element.fonte} >
      </RoadmapCard>
        
      {/each}
  {:catch error}
      <p style="color: red">{error.message}</p>
  {/await}
  
  