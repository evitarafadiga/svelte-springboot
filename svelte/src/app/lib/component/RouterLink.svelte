<script>
  export let url;
  export let src;
</script>

<style>
  a {
    margin: 1em;
    display: inline-block;
    color: var(--second-color-4);
    vertical-align: middle;
    text-align: center;
  }
  img {
  vertical-align: middle;
  }

  .flex {
    display: inline-flex;
  }
</style>

<div class="flex">
  <figure>
    <img src={src} alt="[O]" />
  </figure>
  <a href="#/{url}">
    <slot></slot>
  </a>
</div>

 
