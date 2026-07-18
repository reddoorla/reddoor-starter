<script lang="ts">
  import {
    PrismicImage,
    PrismicLink,
    PrismicRichText,
  } from "@prismicio/svelte";
  import { isFilled, type Content } from "@prismicio/client";

  let { slice }: { slice: Content.BluxMediaSlice } = $props();
</script>

<figure
  class="blux-media"
  data-ratio={slice.primary.ratio}
  data-crop={slice.primary.crop}
>
  {#if isFilled.image(slice.primary.media)}
    <PrismicImage field={slice.primary.media} />
  {:else if isFilled.keyText(slice.primary.video_embed)}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted Blux migration HTML, sanitized at the Emit stage (spec §6) -->
    {@html slice.primary.video_embed}
  {/if}
  {#if isFilled.richText(slice.primary.caption)}
    <figcaption><PrismicRichText field={slice.primary.caption} /></figcaption>
  {/if}
  {#if isFilled.link(slice.primary.link)}
    <PrismicLink field={slice.primary.link}
      >{slice.primary.link_label || "View"}</PrismicLink
    >
  {/if}
</figure>
