<script lang="ts">
  import RichTextBody from "$lib/components/RichTextBody.svelte";
  import SectionBand from "$lib/components/SectionBand.svelte";
  import type { Content } from "@prismicio/client";
  import { roleClass, type SliceContext } from "$lib/presentation";
  import { bandFor, type Presentation } from "$lib/blux/presentation";
  import BluxSectionBand from "$lib/blux/SectionBand.svelte";

  // `band` is a new optional Number field not in the generated prismic types
  // yet (regenerating them needs a wired Prismic repo), so intersect it in.
  let {
    slice,
    index,
    context,
  }: {
    slice: Content.RichTextSlice & { primary: { band?: number | null } };
    index?: number;
    // Two manifest generations meet here: the legacy index-keyed styles map
    // (SliceContext) and the Blux band presentation. Each branch reads only
    // its own shape and tolerates the other.
    context?: SliceContext | { presentation?: Presentation };
  } = $props();

  // The role this block uses (text5 eyebrow, text11/text0 serif display, text14
  // serif body) comes straight from the manifest — no word-count guessing.
  let entry = $derived(
    index != null && context?.presentation instanceof Map
      ? context.presentation.get(index)
      : undefined,
  );
  let role = $derived(
    entry?.presentation?.headingRole ?? entry?.presentation?.bodyRole,
  );

  const band = $derived(
    context && !(context.presentation instanceof Map)
      ? bandFor(context.presentation, slice.primary.band ?? null)
      : null,
  );
</script>

<!-- Standalone copy blocks are the original's centered section openers and
     interstitial blurbs — centered, on a comfortable measure. The band's
     background/height and the box's max-width/text-align come from the export
     (SectionBand); the text role (via .txt-role-*) decides eyebrow vs serif
     display vs serif body. -->
{#snippet content()}
  <SectionBand
    block={entry?.presentation?.block}
    sliceType={slice.slice_type}
    variation={slice.variation}
    contentClass="richtext-block max-w-3xl px-6 py-10 text-center {roleClass(
      role,
    )}"
  >
    <RichTextBody field={slice.primary.content} />
  </SectionBand>
{/snippet}

{#if band}
  <!-- A Blux band index wraps today's output in the band's <section> (block
       style + background from the manifest); without one the slice renders
       exactly as before. -->
  <BluxSectionBand {band}>
    {@render content()}
  </BluxSectionBand>
{:else}
  {@render content()}
{/if}
