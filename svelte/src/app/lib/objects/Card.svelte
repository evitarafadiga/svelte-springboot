<script>
import TitleArea from "../component/TitleArea.svelte";
import Rectangle from "./Rectangle.svelte";

export let desc
</script>

<main>
    <Rectangle>
    <TitleArea /> 
    <h3>{desc}</h3>
    </Rectangle>
</main>

<style>
    main {
        align-items: center;
    }

    h2 {
        color: black;
    }
</style>