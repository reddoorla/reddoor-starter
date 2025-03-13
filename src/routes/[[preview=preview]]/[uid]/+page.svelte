<script lang='ts'>
	import { SliceZone } from '@prismicio/svelte';

	let { data } = $props();

	let content = data.page.data;
	$effect(()=> {data; content = data.page.data;})
</script>

<SliceZone slices={data.page.data.slices} />
