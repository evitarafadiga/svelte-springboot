<script>
	import Perfil from "./Perfil.svelte";

	let id = 1;
	let promise = getUsuario(id);
	
	async function getUsuario(id) {
		const res = await fetch(`perfil`);
		const text = await res.json();
		
		if (res.ok) {
		
			return text;
		} else {
			throw new Error(text);
		}
	}

</script>

{#await promise}
    <p>...carregando usuário</p>
{:then response}
    {#each response as element}
    <Perfil nome={element.nome} criadoem={element.criadoem} id={element.id} descricao={element.descricao}> 
	</Perfil>
     {element.nome}
    {/each}
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}