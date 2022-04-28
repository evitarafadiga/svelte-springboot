<script>
    
</script>
    
<div class="container">
    <button class="wrapper">
        <div class="content">
            <slot></slot>
        </div>
    </button>
</div>
    
<style>
    .container {
        margin: 0 auto;
        padding: 1px;
    }
    .wrapper {
        overflow: visible;
        min-width: 250px;
        min-height: 250px;
        padding: 25px;
        border-radius: 3px;
        background: #FFFFFF;
        border: 1px solid #E7E7E7;
        box-sizing: border-box;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.12);
    }
</style>