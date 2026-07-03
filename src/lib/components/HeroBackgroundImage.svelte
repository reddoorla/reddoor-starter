<script lang="ts">
  // LCP-optimized hero image. Two constraints drive the markup: the browser
  // must discover the image before hydration (hence the <link rel="preload">
  // in <svelte:head> — fixes Lighthouse "LCP request discovery"), and it must
  // never download the full-resolution master (hence the imgix srcset ladder).
  import type { ImageField } from "@prismicio/client";
  import { imgix, srcset } from "$lib/utils/image";

  interface Props {
    image: ImageField;
    /** Used when the Prismic image has no alt text (satisfies image-alt for a11y + SEO). */
    altFallback?: string;
    class?: string;
  }

  let {
    image,
    altFallback = "",
    class: className = "absolute bottom-0 left-0 h-full w-full object-cover",
  }: Props = $props();

  const src = $derived(imgix(image?.url, { w: 1920 }));
  const candidates = $derived(srcset(image?.url));
  const alt = $derived(image?.alt || altFallback);
</script>

<svelte:head>
  {#if image?.url}
    <link
      rel="preload"
      as="image"
      href={src}
      imagesrcset={candidates}
      imagesizes="100vw"
      fetchpriority="high"
    />
  {/if}
</svelte:head>

{#if image?.url}
  <img
    {src}
    srcset={candidates}
    sizes="100vw"
    width={image.dimensions?.width}
    height={image.dimensions?.height}
    {alt}
    fetchpriority="high"
    decoding="async"
    class={className}
  />
{/if}
