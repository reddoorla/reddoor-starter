<script lang="ts">
  import { animateIn as animateInAction } from "$lib/actions/animateIn";
  import { viewport } from "$stores/viewport.svelte";
  import { onMount } from "svelte";

  let {
    animateIn = false,
    class: passedClasses = "",
    style: passedStyle = "",
    children = undefined,
    edgeFadeColor = "",
  } = $props();

  onMount(() => viewport.subscribe());

  const baseClasses =
    "max-w-[1220px] xl:max-w-[1440px] xl:mx-auto mx-[4%] w-[92%]";
  const defaultLayouts = "flex flex-col items-center justify-center relative";

  const edgeWidthPx = $derived.by(() => {
    const w = viewport.width;
    if (w < 1060) return w * 0.04;
    if (w < 1340) return (w - 1220) / 2;
    if (w < 1500) return w * 0.04;
    return (w - 1440) / 2;
  });
</script>

{#snippet content()}
  {#if animateIn}
    <div
      use:animateInAction
      class="{baseClasses} {passedClasses || defaultLayouts}"
      style={passedStyle}
    >
      {@render children?.()}
    </div>
  {:else}
    <div
      class="{baseClasses} {passedClasses || defaultLayouts}"
      style={passedStyle}
    >
      {@render children?.()}
    </div>
  {/if}
{/snippet}

{#if edgeFadeColor}
  <div class="w-screen relative">
    <div
      class="absolute h-full top-0 right-0 z-20"
      style="background: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, {edgeFadeColor} 100%);width:{edgeWidthPx}px;"
    ></div>
    <div
      class="absolute h-full top-0 left-0 z-20"
      style="background: linear-gradient(270deg, rgba(0, 0, 0, 0) 0%, {edgeFadeColor} 100%);width:{edgeWidthPx}px;"
    ></div>
    <div class="w-screen relative">
      {@render content()}
    </div>
  </div>
{:else}
  {@render content()}
{/if}
