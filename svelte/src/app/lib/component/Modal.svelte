<script context="module" lang="ts">
	let onTop   //keeping track of which open modal is on top
	const modals={}  //all modals get registered here for easy future access
	
	// 	returns an object for the modal specified by `id`, which contains the API functions (`open` and `close` )
	export function getModal(id=''){
		return modals[id]
	}
</script>

<script lang="ts">
import {onDestroy} from 'svelte'
	
let topDiv
let visible=false
let prevOnTop
let closeCallback

export let id=''

function keyPress(ev){
	//only respond if the current modal is the top one
	if(ev.key=="Escape" && onTop==topDiv) close() //ESC
}

/**  API **/
function open(callback){
	closeCallback=callback
	if(visible) return
	prevOnTop=onTop
	onTop=topDiv
	window.addEventListener("keydown",keyPress)
	
	//this prevents scrolling of the main window on larger screens
	document.body.style.overflow="hidden" 

	visible=true
	//Move the modal in the DOM to be the last child of <BODY> so that it can be on top of everything
	document.body.appendChild(topDiv)
}
	
function close(retVal){
	if(!visible) return
	window.removeEventListener("keydown",keyPress)
	onTop=prevOnTop
	if(onTop==null) document.body.style.overflow=""
	visible=false
	if(closeCallback) closeCallback(retVal)
}
	
//expose the API
modals[id]={open,close}
	
onDestroy(()=>{
	delete modals[id]
	window.removeEventListener("keydown",keyPress)
})
	
</script>

<div id="topModal" class:visible bind:this={topDiv} on:click={()=>close()}>
	<div id='modal' on:click|stopPropagation={()=>{}}>
		<svg id="close" on:click={()=>close()} viewBox="0 0 12 12">
			<circle cx=6 cy=6 r=6 />
			<line x1=3 y1=3 x2=9 y2=9 />
			<line x1=9 y1=3 x2=3 y2=9 />
		</svg>
		<div id='modal-content'>
			<slot></slot>
		</div>
	</div>
</div>

<style>
  
  * {
    box-sizing: border-box;
  }

	#topModal {
		visibility: hidden;
		z-index: 9999;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #4448;
		display: flex;
		align-items: center;
		justify-content: center;
    
	}
	#modal {
		position: relative;
		background: white;
    	border: 1px solid #555;
		filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.589));
		padding: 1em;

		min-width: 24%;
    	max-width: 100%;
    	max-height: 100%;
    	margin: 2rem auto;
    	color: black;
    	border-radius: 15px;
    	background: white;
	}

	.visible {
		visibility: visible !important;
	}

	#close {
		position: absolute;
		top:20px;
		right:20px;
		width:32px;
		height:32px;
		cursor: pointer;
		fill:#F44;
		transition: transform 0.3s;
	}	

	#close:hover {
		transform: scale(1.3);
	}

	#close line {
		stroke:#FFF;
		stroke-width:2;
	}
	#modal-content {
		max-width: calc(100vw - 20px);
		max-height: calc(100vh - 20px);
		overflow: auto;
	}
</style>