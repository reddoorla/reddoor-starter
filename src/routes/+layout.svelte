<script lang="ts">
  import { PrismicPreview } from "@prismicio/svelte/kit";
  import { page } from "$app/state";
  import { afterNavigate } from "$app/navigation";
  import { repositoryName } from "$lib/prismicio";
  import "../app.css";
  import LandscapeModal from "$lib/components/LandscapeModal.svelte";
  import TransitionOverlay from "$lib/components/TransitionOverlay.svelte";
  import Nav from "$lib/components/Nav.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { scrollToTopOnNavigate } from "$lib/utils/scrollToTopOnNavigate";

  let { data, children } = $props();

  // Instant scroll-to-top on route change; skips popstate (back/forward keeps
  // SvelteKit's restored position) and hash/query-only navs. See the util for details.
  afterNavigate(scrollToTopOnNavigate);
</script>

<svelte:head>
  <title>{page.data.title ?? "Reddoor"}</title>
  <link rel="canonical" href={page.url.href} />
  <meta property="og:url" content={page.url.href} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Reddoor" />
  <meta property="og:locale" content="en_US" />
  <meta name="twitter:card" content="summary_large_image" />
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
    <meta property="og:image:alt" content={page.data.meta_title ?? "Reddoor"} />
    <meta name="twitter:image" content={page.data.meta_image} />
  {/if}
</svelte:head>
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:bg-white focus:text-primary focus:px-4 focus:py-2 focus:rounded focus:shadow"
>
  Skip to main content
</a>
<div class="flex flex-col min-h-screen">
  <Nav />

  <main id="main-content" tabindex="-1" class="flex-1">
    {@render children?.()}
  </main>

  <Footer />
</div>
<TransitionOverlay />
<LandscapeModal />
{#if data.isPreviewSession}
  <PrismicPreview {repositoryName} />
{/if}
