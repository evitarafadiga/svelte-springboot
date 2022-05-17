<script>
import Modal from "./Modal.svelte";



    export let title, id
</script>

<main>
    <button>
        <h2>{title}</h2>
    </button>
</main>

<Modal>
	<h1>{title}</h1>
	
	
</Modal>

<style>
    
    main {
        font-family: 'Rubik';
    }

    button {
        max-width: 700px;
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