<script lang="ts">
  import HeroBackgroundImage from "$lib/components/HeroBackgroundImage.svelte";
  import RichTextBody from "$lib/components/RichTextBody.svelte";
  import SectionBand from "$lib/components/SectionBand.svelte";
  import { PrismicLink, PrismicRichText } from "@prismicio/svelte";
  import type { Content } from "@prismicio/client";
  import { roleClass, type SliceContext } from "$lib/presentation";
  import { bandFor, type Presentation } from "$lib/blux/presentation";
  import BluxSectionBand from "$lib/blux/SectionBand.svelte";
  import BandContent from "$lib/blux/BandContent.svelte";
  import BandTitle from "$lib/blux/BandTitle.svelte";

  // The `band` variation is not in the generated prismic types yet
  // (regenerating them needs a wired Prismic repo), so widen the union locally.
  type HeroBandSlice = {
    slice_type: "hero";
    variation: "band";
    primary: {
      band?: number | null;
      heading?: string | null;
      subtitle?: string | null;
      body?: string | null;
    };
    items: unknown[];
  };

  let {
    slice,
    index,
    context,
  }: {
    slice: Content.HeroSlice | HeroBandSlice;
    index?: number;
    // Two manifest generations meet here: the legacy index-keyed styles map
    // (SliceContext) and the Blux band presentation. Each branch reads only
    // its own shape and tolerates the other.
    context?: SliceContext | { presentation?: Presentation };
  } = $props();

  let entry = $derived(
    index != null && context?.presentation instanceof Map
      ? context.presentation.get(index)
      : undefined,
  );
  let headingRole = $derived(entry?.presentation?.headingRole);
  let bodyRole = $derived(entry?.presentation?.bodyRole);
  let hasImage = $derived(
    slice.variation === "default" && !!slice.primary.background_image?.url,
  );

  const band = $derived(
    context && !(context.presentation instanceof Map)
      ? bandFor(
          context.presentation,
          (slice.primary as { band?: number | null }).band ?? null,
        )
      : null,
  );
</script>

{#if slice.variation === "band"}
  <!-- Blux band hero: background media + block style from the presentation
       manifest, overlay text from the page doc, roles from band.text. Above
       the fold — eagerBackground keeps the LCP image eager and skips the
       scroll reveal. -->
  <BluxSectionBand
    {band}
    eagerBackground
    sliceType={slice.slice_type}
    sliceVariation={slice.variation}
  >
    <BandContent {band} class="relative z-10">
      <BandTitle
        heading={slice.primary.heading}
        subtitle={slice.primary.subtitle}
        text={band?.text}
      />
      {#if slice.primary.body}<p class="txt-role-text1 mt-4">
          {slice.primary.body}
        </p>{/if}
    </BandContent>
  </BluxSectionBand>
{:else}
  <!-- Full-bleed image band. Height / vertical-align / text-align come from the
     export (SectionBand); when the block gives no height we still stand a
     background-image hero 45vh tall so the photo shows. Overlay copy uses
     whatever role the export assigns the hero title (text2 "Page Title" on
     thePointe), applied via .txt-role-*; white comes from the section class,
     which the role class doesn't touch. -->
  <SectionBand
    block={entry?.presentation?.block}
    sliceType={slice.slice_type}
    variation={slice.variation}
    fallbackHeight={hasImage ? "45vh" : undefined}
    sectionClass="hero-band relative isolate overflow-hidden bg-neutral-900 text-white"
    contentClass="relative z-10 max-w-4xl px-6 py-24 text-center"
  >
    {#snippet background()}
      {#if hasImage}
        <HeroBackgroundImage
          image={slice.primary.background_image}
          preload={false}
        />
      {/if}
    {/snippet}
    <div class={roleClass(headingRole)}>
      <PrismicRichText field={slice.primary.heading} />
    </div>
    <div class={roleClass(bodyRole)}>
      <RichTextBody field={slice.primary.body} />
    </div>
    {#if slice.primary.cta_label && slice.primary.cta_link}
      <PrismicLink
        field={slice.primary.cta_link}
        class="mt-6 inline-block bg-white px-6 py-3 font-medium text-black"
      >
        {slice.primary.cta_label}
      </PrismicLink>
    {/if}
  </SectionBand>
{/if}
