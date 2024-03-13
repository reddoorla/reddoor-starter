<script lang='ts'>
    import ContentBox from "$lib/components/FullWidth/ContentBox.svelte"
    import TitleBox from "$lib/components/FullWidth/TitleBox.svelte";
    import Spacer from "$lib/components/Spacer.svelte";
    import ContentWidthImage from "$lib/components/ContentWidth/ContentWidthImage.svelte";
    import playIcon from "$lib/assets/icons/play-button.svg"
    import placeholderImage from "$lib/assets/images/image_placeholder.svg"
    import chevronLeft from "$lib/assets/icons/chevron-left.svg"
    import chevronRight from "$lib/assets/icons/chevron-right.svg"
    import SliderOfContentBoxes from "$lib/components/FullWidth/SliderOfContentBoxes.svelte";
  import ContentWidth from "$lib/components/ContentWidth/ContentWidth.svelte";

    
</script>
<svelte:head>
    <title>Content Blocks | Reddoor Wireframer</title>
</svelte:head>

<!--content #1-->
<div class="max-w-80 sm:w-[560px] sm:max-w-full mx-auto mt-20 sm:mt-[125px] my-14">
    <TitleBox 
        titleText="Generic Content"
        paragraphText="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi."
    />
</div>

<Spacer color="#424B5A" />

<!--content #7-->

<ContentWidth twProps="flex flew-row flex-wrap my-14">
    <div class="w-full md:w-1/2 relative overflow-hidden">
        <SliderOfContentBoxes />
    </div> 
    <div class="w-full md:w-1/2 p-4">
            <img alt='placeholder' src={placeholderImage} class='aspect-[4/3] w-full'/>
    </div>
</ContentWidth>

<Spacer color="#424B5A" />

<!-- content #2 -->

<div class='my-14'>
<ContentWidthImage>

<div class="w-full lg:w-[400px] absolute bottom-0 lg:right-8 xl:right-0">
    <ContentBox
        titleText="Generic Text"
        titleTag="h3"
        subtitleText="subtitle here"
        buttonText="BUTTON"
        linkText="LEARN MORE"
        icon=""
        backgroundColor="white"
    />
</div>
    
</ContentWidthImage>
</div>

<!-- content #3 -->
<Spacer color="#424B5A" />
<!-- content #4 -->
<Spacer color="#424B5A" />
<!-- content #5 -->
<Spacer color="#424B5A" />
<!-- content #6 -->

