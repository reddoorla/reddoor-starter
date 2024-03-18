<script lang='ts'>
  import ContentWidth from "$lib/components/ContentWidth/ContentWidth.svelte";
  import ContentBox from "$lib/components/FullWidth/ContentBox.svelte";
  import ScreenWidthGallerySliderLarge from "$lib/components/ScreenWidth/ScreenWidthGallerySliderLarge.svelte";
    import Spacer from "$lib/components/Spacer.svelte";
</script>

<!-- portfolio #1 -->
<ContentWidth twProps="-mb-12 mt-12">
    <div class="max-w-[564px] mx-auto">
        <ContentBox 
        icon=""
        titleTag="h2"
        titleText="Our Portfolio"
        paragraphText="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi."
        float="center"
        />
    </div>
   
</ContentWidth>
<ScreenWidthGallerySliderLarge />


<Spacer color="#424B5A" />

<!-- portfolio #2 -->
<Spacer color="#424B5A" />

<!-- portfolio #3 -->
<Spacer color="#424B5A" />

<!-- portfolio #4 -->
<Spacer color="#424B5A" />

<!-- portfolio #5 -->
<Spacer color="#424B5A" />