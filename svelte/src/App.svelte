<script>
	import Router from './app/routing/Router.svelte';
	import Sidenav from './app/lib/component/Sidenav.svelte';

</script>

<style>
  .app-shell {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 
    "sidenav" 
    "router";
    grid-gap: 0.2rem;
  }

  #sidenav {
    grid-area: sidenav;
  }

  #router {
    grid-area: router;
  }

  @media only screen and (max-width: 550px) {
    .app-shell {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      grid-template-areas: 
      "sidenav" 
      "router router router";
    }

    #sidenav {
      grid-area: sidenav;
    }
  }
</style>



<div class="app-shell">
  <Sidenav class="sidenav" id="sidenav" />
  <Router id="router"/>
</div>