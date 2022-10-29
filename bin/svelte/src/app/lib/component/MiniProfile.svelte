<script>
    import Rectangle from "../objects/Rectangle.svelte";
    export let username;
    
    let src = '/profile-picture.png'
    
    </script>
    <main>
        <div class="wrapper">
            <figure>
                <img src={src} alt="Profile default" /> 
            </figure>
            <div>
                <h4>Criador: {username}</h4>
            </div>
        </div>
    </main>
    
    
    <style>
        .wrapper {
            width: 120px;
            height: 54px;
        }
    
        figure {
            align-items: center;
        }
        img {
            border-radius: 50%;
            border: 4px solid rgb(192, 192, 192);
            width: 60px;
            height: 60px;
        }

        h4 {
            margin: 1em;
            font-size: 12px;
            color: #535353;
            text-align: center;
        }
        
    </style>