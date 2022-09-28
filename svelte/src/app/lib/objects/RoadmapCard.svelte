<script>
import MiniProfile from "../component/MiniProfile.svelte";
import TitleArea from "../component/TitleArea.svelte";
import Rectangle from "./Rectangle.svelte";

export let nome, desc, id, fav, comp, criado, att, fonte, username;

</script>

<main>
    <Rectangle>
        <div>
            <TitleArea title={nome}/>
        </div>
        <div>

            <div class="wrapper">
                <div class="box box1">
                    <h3>Descrição</h3> {desc}
                </div>
                <div class="box box2">
                    <MiniProfile username={username} />
                </div>
                <div class="box box3">
                    <h3>Compartilhamentos</h3> {comp}
                </div>
                <div class="box box4">
                    <h3>Favoritos</h3> {fav}
                </div>
                <div class="box box5">

                </div>
                
                <div class="box box7">
                    <h3>Assuntos relacionados</h3>
                    <h3>Assuntos</h3>
                    <slot></slot>
                </div>
            </div>
        </div>



    </Rectangle>
</main>

<style>

    main {
        width: 460px;
    }

    div {
        padding: 0 0 5px 0;
    }

    h3 {
        margin: 0.5em;
        font-size: 11px;
        color: #535353;
    }

    .wrapper {
        margin: 10px;
        display: grid;
        grid-template-columns: auto auto;
        grid-auto-rows: auto auto;
    }

    .box {
        overflow: initial;
        padding: 5px;
    }
    .box1 {
        text-align: justify;
        grid-column-start: 1;
        grid-column-end: 3;
        grid-row-start: 1;
    }
    .box2 {
        grid-column-start: 3;
        grid-row-start: 1;
        grid-column-end: 6;
    }

    .box3 {
        grid-column-start: 1;
        grid-row-start: 2;
        grid-column-end: 2;
    }
    .box4 {
        grid-column-start: 2;
        grid-row-start: 2;
        grid-column-end: 3;
    }
    .box5 {
        grid-column-start: 3;
        grid-column-end: 6;
        grid-row-start: 2;
    }

    .box7 {
        grid-column-start: 1;
        grid-column-end: 6;
        grid-row-start: 6;
    }

</style>