<script>
  
  /**
   * @typedef {Object} Props
   * @property {import("@prismicio/client").Content.ContentWidthMediaSlice} slice
   */

  /** @type {Props} */
  let { slice } = $props();
</script>

<section
  data-slice-type={slice.slice_type}
  data-slice-variation={slice.variation}
>
  Placeholder component for {slice.slice_type} (variation: {slice.variation})
  Slices
</section>
