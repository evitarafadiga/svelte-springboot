<script>
import Rectangle from "../objects/Rectangle.svelte";
export let username;

let src = '../src/app/public/profile-picture.png'

</script>

<Rectangle>
    <div class="wrapper">
        <figure>
            <img src={src} alt="Profile default" /> 
        </figure>
        <div>
            {username}
            <div class="carreiras">
            Carreiras
            </div>
        </div>
    </div>
</Rectangle>

<style>
    .wrapper {
        width: 540px;
    }

    figure, img {
        align-items: center;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        border: 4px solid white;
    }
    
</style>