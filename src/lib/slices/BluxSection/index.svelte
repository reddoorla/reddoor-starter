<script lang="ts">
  import {
    PrismicImage,
    PrismicLink,
    PrismicRichText,
  } from "@prismicio/svelte";
  import { isFilled, type Content } from "@prismicio/client";

  let { slice }: { slice: Content.BluxSectionSlice } = $props();

  type Cell = Content.BluxSectionSliceDefaultPrimaryCellsItem;
  type LeafCell =
    | Content.BluxSectionSliceDefaultPrimaryCellsItem
    | Content.BluxSectionSliceDefaultPrimaryCellsSubgridItem;
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

{#snippet cellLeaf(cell: LeafCell)}
  {#if isFilled.image(cell.media)}
    <div class="blux-cell__media" data-ratio={cell.media_ratio}>
      <PrismicImage field={cell.media} />
    </div>
  {/if}
  {#if isFilled.richText(cell.title)}<PrismicRichText field={cell.title} />{/if}
  {#if isFilled.richText(cell.body)}<PrismicRichText field={cell.body} />{/if}
  {#if isFilled.keyText(cell.embed_html)}{@html cell.embed_html}{/if}
  {#if isFilled.link(cell.link)}<PrismicLink field={cell.link}
      >{cell.link_label ?? "Read more"}</PrismicLink
    >{/if}
{/snippet}

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
    {#each cells as cell}
      <div class="blux-cell" data-kind={cell.kind}>
        {@render cellLeaf(cell)}

        {#if (cell.subgrid ?? []).length}
          <div class="blux-subgrid" data-cells={cell.subgrid?.length}>
            {#each cell.subgrid ?? [] as sub}
              <div class="blux-cell" data-kind={sub.kind}>
                {@render cellLeaf(sub)}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>

  {#if isFilled.keyText(slice.primary.widget_html)}
    <div class="blux-widget" data-widget={slice.primary.widget_kind}>
      {@html slice.primary.widget_html}
    </div>
  {/if}
</section>
