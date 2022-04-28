<script>
    export let topic;
    export let func;

</script>

<div class="container">
    <button class="wrapper" on:click={func}>
        <div class="content">
            <h1>{topic}</h1>
        </div>
    </button>
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
        box-sizing: 10px;
        
    }
    h1 {
        font-size: 32px;
        color: white;
    }
</style>