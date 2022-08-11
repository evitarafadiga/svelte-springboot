<script>
    import Rectangle from "../objects/Rectangle.svelte";
    import Modal from "./Modal.svelte";

    export let title, id, descricao
</script>

<main>
    <Rectangle>
        <p>{title}</p>
        {descricao}
    </Rectangle>  
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
        max-width: 700px;
        height: 60px;
        background-color: #BD6248;
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