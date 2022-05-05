<script>
  import { hash } from '../services/route.serv'
  import Homepage from '../pages/Homepage.svelte';
  import Notfound from '../pages/Notfound.svelte';
  import ListaAssuntos from '../pages/ListaAssuntos.svelte';
  import Assuntos from '../pages/Assuntos.svelte';
  import Roadmaps from '../pages/Roadmaps.svelte';
  import Tendencias from '../pages/Tendencias.svelte';
  import ListaRoadmaps from '../pages/ListaRoadmaps.svelte';
  import PerfilDeUsuario from '../pages/PerfilDeUsuario.svelte';

  let value = Notfound;

  hash.subscribe( valu => {
    switch(valu) {
      case '':
        value = Homepage;
        break;
      case 'lista-assuntos':
        value = ListaAssuntos;
        break;
      case 'lista-roadmaps':
        value = ListaRoadmaps;
        break;
      case 'assuntos':
        value = Assuntos;
        break;
      case 'roadmaps':
        value = Roadmaps;
        break;
      case 'perfil':
        value = PerfilDeUsuario;
        break;
      case 'tendencias':
        value = Tendencias;
        break;
      default:
        value = Notfound;
    }
  });
</script>

<style>
  main {
    margin: 0 auto;
    display: flex;
    background-color: var(--primary-color-2);
    color: var(--second-color);
    padding: 1rem;
  }

  .content {
    justify-content: center;
    border-top: 10px rgb(0, 0, 0);
    padding: 17px 17px 50px 250px;
  }
</style>

<main>
  <div class="content">
    <svelte:component this={value}/>
  </div>
</main>
