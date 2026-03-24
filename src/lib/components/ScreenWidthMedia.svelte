<script lang="ts">
  import { PrismicImage } from "@prismicio/svelte";
  import Img from "@zerodevx/svelte-img";
  import { onMount } from 'svelte';

  let {
    src = '',
    field = undefined,
    altText = "background image",
    vimeoId = "",
    darken = false,
    backdrop = false,
    percentHeight = 80,
    class: passedClasses = '',
    children = undefined
  } = $props();

  let viewportHeight: number = $state(1024);
  let viewportWidth: number = $state(768);
  let videoError: boolean = $state(false);
  let iframeElement: HTMLIFrameElement | undefined = $state();
  const coverStyle = $derived(
    viewportHeight * percentHeight / 100 * 16 > viewportWidth * 9
      ? `height: ${percentHeight}lvh; min-width: 100%`
      : `width: 100vw; min-height: ${percentHeight}lvh`
  );

  onMount(() => {
    if (vimeoId && iframeElement) {
      const initPlayer = () => {
        if (!window.Vimeo?.Player || !iframeElement) return;
        const player = new window.Vimeo.Player(iframeElement);

        player.on('error', () => {
          videoError = true;
        });

        player.ready().catch(() => {
          videoError = true;
        });
      };

      if (window.Vimeo?.Player) {
        initPlayer();
      } else {
        const existing = document.querySelector('script[src="https://player.vimeo.com/api/player.js"]');
        if (existing) {
          existing.addEventListener('load', initPlayer);
        } else {
          const script = document.createElement('script');
          script.src = 'https://player.vimeo.com/api/player.js';
          script.onload = initPlayer;
          document.head.appendChild(script);
        }
      }
    }
  });
</script>

<svelte:window
  bind:innerHeight={viewportHeight}
  bind:innerWidth={viewportWidth}
/>

<section
  class="w-screen overflow-clip {backdrop ? 'fixed -z-10 top-0 left-0' : 'relative'}"
  style="height: {percentHeight}lvh"
>
  <div
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-video"
    style={coverStyle}
  >
    {#if !field && typeof src === 'string' && src}
      <img
        {src}
        alt={altText}
        class="absolute bottom-0 left-0 h-full w-full object-cover {passedClasses} -z-10"
      />
    {:else if src}
      <Img
        {src}
        alt={altText}
        class="absolute bottom-0 left-0 h-full w-full object-cover {passedClasses} -z-10"
      />
    {:else if field}
      <PrismicImage
        {field}
        class="absolute h-full w-full object-cover -z-10 {passedClasses}"
      />
    {/if}

    {#if vimeoId && !videoError}
      <iframe
        bind:this={iframeElement}
        title="background video"
        src="https://player.vimeo.com/video/{vimeoId}?background=1&muted=1&loop=1&autoplay=1"
        class="aspect-video absolute contrast-[1.15] -z-10 border-0"
        style={coverStyle}
        allow="autoplay; fullscreen"
      ></iframe>
    {/if}

    {#if darken}
      <div
        class="bg-darken-gradient pointer-events-none absolute w-full h-full top-0 left-0 -z-10"
      ></div>
    {/if}
  </div>
  {@render children?.()}
</section>

<style>
  .bg-darken-gradient {
    background: linear-gradient(0deg, rgba(0, 38, 62, 0.50) 0%, rgba(0, 38, 62, 0.50) 100%), linear-gradient(180deg, rgba(0, 38, 62, 0.75) -3.96%, rgba(0, 38, 62, 0.00) 49.92%);
  }
</style>
