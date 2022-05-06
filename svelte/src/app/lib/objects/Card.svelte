<script>
import TitleArea from "../component/TitleArea.svelte";
import Rectangle from "./Rectangle.svelte";

export let nome, desc, id, fav, comp, criado, att, fonte;

</script>

<main>
    <Rectangle>
    <TitleArea title={nome}/> 
    <h3>ID: {id}</h3>
    <div>
        <h2>{desc}</h2>
    </div>
    </Rectangle>
</main>

<style>
    main {
        padding: 1rem;
        align-items: center;
    }

    h2 {
        font-size: 18px;
        color: black;
    }
    h3 {
        font-size: 16px;
    }
</style>