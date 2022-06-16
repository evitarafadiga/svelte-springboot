<script>
import Rectangle from "../objects/Rectangle.svelte";
export let username;

let src = '/profile-picture.png'

</script>
<main>
    <Rectangle>
        <div class="wrapper">
            <figure>
                <img src={src} alt="Profile default" /> 
            </figure>
            <div>
                Bem vindo(a), {username}.
            </div>
            <div class="carreiras">
                Carreiras
            </div>
        </div>
    </Rectangle>
</main>


<style>
    .wrapper {
        width: 540px;
        height: 250px;
    }

    figure, img {
        align-items: center;
        width: 78px;
        height: 78px;
        border-radius: 50%;
        border: 4px solid white;
    }
    
</style>