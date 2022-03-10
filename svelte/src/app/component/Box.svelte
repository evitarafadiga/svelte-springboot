<script>
    import RouterLink from './RouterLink.svelte'
    export let url
    export let topic
</script>

<div class="container">
    <div class="wrapper">
        <div class="content">
            <h1>
                <RouterLink url={url}>{topic}</RouterLink>
            </h1>
        </div>
    </div>
</div>

<style>
    .container {
        margin: 0 auto;
    }
    .wrapper {
        overflow: hidden;
        width: 250px;
        height: 250px;
        background-color: orange;
        border-radius: 15px;
    }
    .content {
        padding-top: 5rem;
        padding-left: 3rem;
        padding-right: 5rem;
        padding-bottom: 5rem;
        
    }
    .content h1 {
        font-size: 32px;
        color: white;
    }
</style>