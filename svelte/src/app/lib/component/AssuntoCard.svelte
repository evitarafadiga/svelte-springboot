<script>

    export let title
    export let id
</script>

<main>
    <button>
        <h2>{title}</h2>
    </button>
</main>

<style>
    
    main {
        font-family: 'Rubik';
    }

    button {
        max-width: 200px;
        height: 60px;
        background-color: #BD6248;
        border-radius: 5px;
        justify-content: center;
        text-align: center;
        vertical-align: middle;
    }

    h2 {
        color: white;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }   
</style>