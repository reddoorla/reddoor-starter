<script lang="ts">
  import { type Content } from "@prismicio/client";
  import { parseBluxPayload } from "$lib/blux-catalog/node";
  import BluxNode from "./BluxNode.svelte";

  let { slice }: { slice: Content.BluxBlockSlice } = $props();
  let root = $derived(parseBluxPayload(slice.primary.payload));
</script>

{#if root}
  <div class="blux-block">
    <BluxNode node={root} />
  </div>
{/if}
