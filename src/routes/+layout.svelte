<script lang='ts'>
	import { PrismicPreview } from '@prismicio/svelte/kit';
	import { page } from '$app/state';
	import { repositoryName } from '$lib/prismicio';
	import "../app.css";
	import LandscapeModal from '$lib/components/LandscapeModal.svelte';
	import TransitionOverlay from '$lib/components/TransitionOverlay.svelte';
	import Nav from '$lib/components/Nav.svelte'
	import Footer from '$lib/components/Footer.svelte'

	let { children } = $props();
</script>

<svelte:head>
	<title>{page.data.title ?? 'Reddoor'}</title>
	<link rel="canonical" href={page.url.href} />
	<meta property="og:url" content={page.url.href} />
	<meta property="og:type" content="website" />
	{#if page.data.meta_description}
		<meta name="description" content={page.data.meta_description} />
		<meta name="twitter:description" content={page.data.meta_description} />
	{/if}
	{#if page.data.meta_title}
		<meta property="og:title" content={page.data.meta_title} />
		<meta name="twitter:title" content={page.data.meta_title} />
	{/if}
	{#if page.data.meta_image}
		<meta property="og:image" content={page.data.meta_image} />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:image" content={page.data.meta_image} />
	{/if}
</svelte:head>
<main class="flex flex-col min-h-screen">
	<Nav />

	{@render children?.()}

	<Footer />
</main>
<TransitionOverlay />
<LandscapeModal />
<PrismicPreview {repositoryName} />
