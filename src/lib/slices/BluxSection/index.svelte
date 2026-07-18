<script lang="ts">
  import { PrismicImage, PrismicRichText } from "@prismicio/svelte";
  import { isFilled, type Content } from "@prismicio/client";
  import BluxCell from "$lib/blux-catalog/BluxCell.svelte";
  import type { BluxCellData } from "$lib/blux-catalog/cell";

  let { slice }: { slice: Content.BluxSectionSlice } = $props();

  type Cell = Content.BluxSectionSliceDefaultPrimaryCellsItem;
  let cells = $derived((slice.primary.cells ?? []) as Cell[]);

  let bandStyle = $derived(
    [
      isFilled.keyText(slice.primary.background_color)
        ? `background-color:${slice.primary.background_color}`
        : "",
      isFilled.keyText(slice.primary.min_height)
        ? `min-height:${slice.primary.min_height}`
        : "",
    ]
      .filter(Boolean)
      .join(";"),
  );
</script>

<section
  class="blux-section"
  data-cells={cells.length}
  data-overlay={slice.primary.overlay}
  style={bandStyle}
>
  {#if isFilled.image(slice.primary.background_image)}
    <PrismicImage
      field={slice.primary.background_image}
      class="blux-section__bg"
    />
  {/if}

  {#if isFilled.richText(slice.primary.heading)}
    <PrismicRichText field={slice.primary.heading} />
  {/if}

  <div
    class="blux-section__cells"
    data-align={slice.primary.vertical_align}
    data-max-width={slice.primary.max_content_width}
  >
    {#each cells as cell (cell)}
      <BluxCell cell={cell as unknown as BluxCellData} />
    {/each}
  </div>

  {#if isFilled.keyText(slice.primary.widget_html)}
    <div class="blux-widget" data-widget={slice.primary.widget_kind}>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted Blux migration HTML (widget/embed), sanitized at the Emit stage (spec §6) -->
      {@html slice.primary.widget_html}
    </div>
  {/if}
</section>
