<script lang='ts'>

	let { data } = $props();

	let viewpoortWidth=$state(1024)

	const content = data.page.data;
</script>


<svelte:window bind:innerWidth={viewpoortWidth} />

{#if viewpoortWidth>768}

{:else}
{/if}