<script>
    import Rectangle from "../objects/Rectangle.svelte";
    import Modal from "./Modal.svelte";

    export let title, id, descricao;
</script>

<main>
    <button>
        <p>{title}</p>{descricao}
        
    </button>  
</main>

<Modal>
	<h1>{title}</h1>
	
</Modal>

<style>
    
    main {
        font-family: 'Rubik';
        font-size: 10px;
    }

    button {
        min-width: 380px;
        height: 80px;
        background-color: #aadbee;
        border-radius: 5px;
        justify-content: center;
        text-align: center;
        vertical-align: middle;
    }

    p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 16px;
        vertical-align: middle;
        padding: 2px 7px 2px 7px;
    }   
</style>