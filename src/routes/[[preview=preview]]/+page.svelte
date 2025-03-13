<script lang='ts'>

	let { data } = $props();

	let viewpoortWidth=$state(1024)

	let content = data.page.data;

	$effect(()=> {data; content = data.page.data;})
</script>


<svelte:window bind:innerWidth={viewpoortWidth} />

