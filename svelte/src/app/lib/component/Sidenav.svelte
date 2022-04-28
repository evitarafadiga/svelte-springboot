<script>
  import RouterLink from './RouterLink.svelte'
</script>

<nav>
  <div class="wrapper">
    <div class="content">
      <ul>
        <li>
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

<style>
  nav {
    height: 56px;
    flex-basis: 1rem;
    background-color: var(--primary-color);
    color: var(--second-color-4);
  }

  nav ul {
    list-style: none;
  }

  nav ul li {
    display: inline;
    padding: .5rem 54px;
  }

  nav h1 {
    display: inline;
  }

  .wrapper {
    padding-left: 216px;
  }
  .content {
    border-top: 10px rgb(204, 204, 204);
    border: 10px;
  }
</style>

