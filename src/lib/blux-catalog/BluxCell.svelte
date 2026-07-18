<script lang="ts">
  import {
    PrismicImage,
    PrismicLink,
    PrismicRichText,
  } from "@prismicio/svelte";
  import { isFilled } from "@prismicio/client";
  import type { BluxCellData } from "$lib/blux-catalog/cell";
  import Self from "./BluxCell.svelte";

  let { cell }: { cell: BluxCellData } = $props();
  let sub = $derived(cell.subgrid ?? []);
</script>

<div class="blux-cell" data-kind={cell.kind}>
  {#if isFilled.image(cell.media)}
    <div class="blux-cell__media" data-ratio={cell.media_ratio}>
      <PrismicImage field={cell.media} />
    </div>
  {/if}
  {#if isFilled.richText(cell.title)}<PrismicRichText field={cell.title} />{/if}
  {#if isFilled.richText(cell.body)}<PrismicRichText field={cell.body} />{/if}
  {#if isFilled.keyText(cell.embed_html)}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted Blux migration HTML, sanitized at the Emit stage (spec §6) -->
    {@html cell.embed_html}
  {/if}
  {#if isFilled.link(cell.link)}<PrismicLink field={cell.link}
      >{cell.link_label || "Read more"}</PrismicLink
    >{/if}
  {#if sub.length}
    <div class="blux-subgrid" data-cells={sub.length}>
      {#each sub as s (s)}<Self cell={s} />{/each}
    </div>
  {/if}
</div>
