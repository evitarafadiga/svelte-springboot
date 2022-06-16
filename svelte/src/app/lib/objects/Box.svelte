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
    h1 {
        font-family: 'Rubik';
        font-weight: bolder;
        font-stretch: expanded;
    }
    .container {
        margin: 0 auto;
    }
    .wrapper {
        overflow: hidden;
        width: 244px;
        height: 64px;
        background: rgb(255,237,30);
        background: linear-gradient(165deg, rgba(255,237,30,1) 0%, rgba(255,165,0,1) 100%);  
        border-radius: 15px;
    }
    .content {
        box-sizing: 10px;
        
    }
    h1 {
        font-size: 18px;
        color: white;
    }
</style>