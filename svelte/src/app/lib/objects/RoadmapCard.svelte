<script>
import MiniProfile from "../component/MiniProfile.svelte";
import TitleArea from "../component/TitleArea.svelte";
import Rectangle from "./Rectangle.svelte";

export let nome, desc, id, fav, comp, criado, att, fonte;

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
                    <MiniProfile />
                </div>
                <div class="box box3"><h3>Compartilhamentos</h3> {comp}</div>
                <div class="box box4"><h3>Favoritos</h3> {fav}</div>
                <div class="box box5">
<<<<<<< HEAD
                    <h3>Assuntos</h3>
                </div>
                <div class="box box6">
                    <h3>Assuntos</h3>
=======
                    <h4>ID: {id} </h4>
                    <br> 
                    <h4>Criado em: {criado}</h4>
                    <h4>Atualizado em: {att}</h4>
                </div>
                <div class="box box6">
                    <h3>Fonte</h3> {fonte}
                </div>
                <div class="box box7">
                    <h3>Assuntos relacionados</h3>
>>>>>>> 4b4efd8 (Mudanças significativas no layout e dados.)
                </div>
            </div>
        </div>



    </Rectangle>
</main>

<style>

    main {
        width: 670px;
    }

    div {
        padding: 0 0 7px 0;
    }

    h4 {
        margin: 1em;
        font-size: 12px;
        color: #535353;
    }
    h3 {
        margin: 1em;
        font-size: 16px;
        color: #535353;
    }

    .wrapper {
        display: grid;
        grid-template-columns: auto auto;
        grid-auto-rows: auto auto;
    }

    .box {
        overflow: initial;
        padding: 25px;
    }
    .box1 {
        text-align: justify;
        grid-column-start: 1;
        grid-column-end: 4;
        grid-row-start: 1;
    }
    .box2 {
        grid-column-start: 4;
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
        grid-row-end: 4;
    }

    .box6 {
        grid-column-start: 1;
        grid-column-end: 3;
        grid-row-start: 3;
    }

    .box7 {
        grid-column-start: 1;
        grid-column-end: 6;
        grid-row-start: 6;
    }

</style>