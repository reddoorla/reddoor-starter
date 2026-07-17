<script lang="ts">
  import type { BluxNode } from "$lib/blux-catalog/node";
  import { styleString } from "$lib/blux-catalog/node";
  import Self from "./BluxNode.svelte";

  let { node }: { node: BluxNode } = $props();
</script>

<svelte:element this={node.tag ?? "div"} class={node.className} style={styleString(node.style)}>
  {#if node.image}
    <img src={node.image.url} alt={node.image.alt ?? ""} width={node.image.width} height={node.image.height} />
  {/if}
  {#if node.html}{@html node.html}{/if}
  {#each node.children ?? [] as child}
    <Self node={child} />
  {/each}
</svelte:element>
