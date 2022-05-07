<script>
    let src = '/search.png'
</script>

<main>
    <div>
    <form>
        <textarea placeholder="Pesquisar..."></textarea>
    </form>
    <figure>
        <img src={src} alt="Search tool" />
    </figure>
    </div>
</main>

<style>
    main {
        min-width: 340px;
        height: 40px;
        background-color: #3E76BD;
        border-radius: 300px;
        justify-content: center;
        align-items: center;
        justify-items: center;
        
        box-sizing: border-box;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.12);
        display: flexbox;
        margin-bottom: 1rem;
    }

    h1 {
        vertical-align: middle;
    }   

    textarea {
        text-align: center;
        overflow: auto;
        min-width: 100%;
        height: 40px;
        border: 0 1 0;
        border-style: none; 
        border-color: Transparent;
        overflow: auto;
        resize: none;
    }

    figure, img {
        align-items: center;
        width: 50px;
        height: 50px;
    }
</style>