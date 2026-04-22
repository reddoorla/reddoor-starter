<script lang="ts">
  import { PrismicRichText } from "@prismicio/svelte";
  import type { Content } from "@prismicio/client";

  interface Props {
    slice: Content.RichTextSlice;
  }

  let { slice }: Props = $props();
</script>

<section
  data-slice-type={slice.slice_type}
  data-slice-variation={slice.variation}
  class="prose mx-auto px-6 py-12"
>
  <PrismicRichText field={slice.primary.content} />
</section>
