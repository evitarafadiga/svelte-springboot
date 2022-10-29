<script>
  import GetListAssunto from "../lib/component/GetListAssunto.svelte";
import RoadmapCard from "../lib/objects/RoadmapCard.svelte";


</script>

<h1>Meus Roadmaps</h1>

<div>
    <RoadmapCard 
    nome="Estrutura de Dados Feliz"
    desc="Roadmap para aprender estruturas de dados"
    fav="299"
    comp="57"
    criado="17/05/2022"
    fonte="Líbero"
    username="Joãozinho Silva">
        <GetListAssunto></GetListAssunto>
    </RoadmapCard>
</div>
<style>
    
</style>
