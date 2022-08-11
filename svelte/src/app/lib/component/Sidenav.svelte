<svelte:head>
    <style>
        @import url('https://fonts.googleapis.com/css?family=Raleway&display=swap');
        @import url('https://fonts.googleapis.com/css?family=Lato');
        @import url('https://fonts.googleapis.com/css?family=Rubik');
    </style>
</svelte:head>


<script>
  import RouterLink from './RouterLink.svelte'

  let srcprofile = '/gear.svg';
  let srctopics = '/collection.svg';
  let srcroadmaps = '/book-fill.svg';
  let srcmytopics = '/bezier.svg';
  let srcmyroadmaps = '/book.svg';
  let srcpower = '/power.svg';

</script>

<main>
    <nav>
      <div class="wrapper">
        <div class="content">
          <ul>
            <li>
              <h2><RouterLink url=''>Líbero</RouterLink></h2>
            </li>
          </ul>     
        </div>
        <div>
          <ul>
            <li>
              <RouterLink url='perfil' src={srcprofile}>Perfil</RouterLink>
            </li>
            <br>
            <br>
            <li>
              <RouterLink url='assuntos' src={srcmytopics}>Meus Assuntos</RouterLink>
            </li>
            <li>
              <RouterLink url='lista-assuntos' src={srctopics}>Todos os Assuntos</RouterLink>
            </li>
            <li>
              <RouterLink url='roadmaps' src={srcmyroadmaps}>Meus Roadmaps</RouterLink>
            </li>
            <li>
              <RouterLink url='lista-roadmaps' src={srcroadmaps}>Todos os Roadmaps</RouterLink>
            </li>
            <br>
            <br>
            <br>
            <li>
              <RouterLink url='signout'src={srcpower} >Sair</RouterLink>
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
    width: 321px;
    background-color: var(--primary-color);
    color: var(--second-color-4);
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  }
  
  nav {
    flex-basis: 10rem;
  }

  nav ul {
    list-style: none;
  }

  nav ul li {
    padding: .5rem 0;
  }

  h2 {
    font-family: 'Raleway';
    font-weight: bolder;
  }
  .content {
    border-top: 10px --second-color-1;
    border: 10px;
  }
  
</style>


