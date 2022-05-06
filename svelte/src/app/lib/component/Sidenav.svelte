<script>
  import RouterLink from './RouterLink.svelte'
</script>

<main>
    <nav>
      <div class="wrapper">
        <div class="content">
          <ul>
            <li class="title">
              <RouterLink url=''><h1>Líbero</h1></RouterLink>
            </li>
            <li>
              <RouterLink url='perfil'>Perfil</RouterLink>
            </li>
            <li>
              <RouterLink url='lista-roadmaps'>Lista de Roadmaps</RouterLink>
            </li>
            <li>
              <RouterLink url='lista-assuntos'>Lista de Assuntos</RouterLink>
            </li>
          </ul>     
        </div>
      </div> 
    </nav>
</main>


<style>
  main {
    position: fixed;
    display: block;
    height: 2508px;
    width: 23%;
    background-color: var(--primary-color);
    color: var(--second-color-4);
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  }
  nav {
    
    flex-basis: 10rem;
    padding: 1rem; 
  }

  nav ul {
    list-style: none;
  }

  nav ul li {
    padding: .5rem 0;
  }

  .title {
    padding-bottom: 5rem;
  }
  .wrapper {
    padding-right: 100px;
  }
  .content {
    border-top: 10px rgb(204, 204, 204);
    border: 10px;
  }
</style>

