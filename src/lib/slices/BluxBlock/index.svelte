<script lang="ts">
  import { isFilled, type Content } from "@prismicio/client";
  import { parseBluxPayload } from "$lib/blux-catalog/node";
  import BluxNode from "./BluxNode.svelte";

  let { slice }: { slice: Content.BluxBlockSlice } = $props();
  let root = $derived(parseBluxPayload(slice.primary.payload));
</script>

{#if root || isFilled.keyText(slice.primary.widget_html)}
  <div class="blux-block">
    {#if root}
      <BluxNode node={root} />
    {/if}
    {#if isFilled.keyText(slice.primary.widget_html)}
      <div class="blux-widget" data-widget={slice.primary.widget_kind}>
        <!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted Blux migration HTML, sanitized at the Emit stage (spec §6) -->
        {@html slice.primary.widget_html}
      </div>
    {/if}
  </div>
{/if}
