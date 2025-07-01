<script>
  import { SliceSimulator } from "@slicemachine/adapter-sveltekit/simulator";
  import { SliceZone } from "@prismicio/svelte";
</script>

<!-- Slot syntax is used for backward compatibility with Svelte <=4. -->
<SliceSimulator let:slices>
  <SliceZone {slices} />
</SliceSimulator>
