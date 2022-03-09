<script>
  import RouterLink from './RouterLink.svelte'
</script>

<nav>
  <div class="wrapper">
    <div class="content">
      <h1>Líbero</h1>
      <RouterLink url=''>Home</RouterLink>
      <RouterLink url='asas'>Erro</RouterLink>
      <RouterLink url='listaassuntos'>Lista de Assuntos</RouterLink>
    </div>
  </div> 
</nav>

<style>
  nav {
    flex-basis: 10rem;
    background-color: var(--primary-color);
    color: var(--second-color-4);
    padding: 1rem; 
  }

  nav ul {
    list-style: none;
  }

  nav ul li {
    padding: .5rem 0;
  }

  .wrapper {
    max-height: 32px;
  }
  .content {
    display: flex;
    justify-content: space-between;
    vertical-align: middle;
    border-top: 10px rgb(204, 204, 204);
    padding: 1px 170px;
  }
</style>

