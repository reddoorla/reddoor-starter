<script lang="ts">
  import { SliceZone } from "@prismicio/svelte";
  import { components } from "$lib/slices";
  import { pagePresentation } from "$lib/presentation";

  let { data } = $props();

  // Per-slice presentation (type roles + block styles) from the Blux styles
  // manifest, keyed by slice index. Empty until the site is converted with
  // `blux emit`; SliceZone hands it to every slice as `context`.
  let presentation = $derived(pagePresentation(data.page.uid));
</script>

<SliceZone
  slices={data.page.data.slices}
  {components}
  context={{ presentation }}
/>
