<script lang='ts'>
    import ContentBox from "$lib/components/ContentBox.svelte"
    import TitleBox from "$lib/components/TitleBox.svelte";
    import Spacer from "$lib/components/Spacer.svelte";
    import ContentWidthImage from "$lib/components/ContentWidthImage.svelte";
    import playIcon from "$lib/assets/icons/play-button.svg"
    import placeholderImage from "$lib/assets/images/placeholder.svg"
    import chevronLeft from "$lib/assets/icons/chevron-left.svg"
    import chevronRight from "$lib/assets/icons/chevron-right.svg"
    import SliderOfContentBoxes from "$lib/components/SliderOfContentBoxes.svelte";

    
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

<div class="max-w-[1280px] flex flew-row flex-wrap mx-auto my-14">
    <div class="w-full md:w-1/2 relative overflow-hidden">
       <!-- <div class="w-[200%] flex flex-row justify-start flex-nowrap">
            <div class="w-1/2 h-full z-0">
                <ContentBox 
                    icon=""
                    float='left'
                    titleText="Generic Content"
                    paragraphText="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi."
                />
            </div>
            <div class="w-1/2 h-full z-0">
                <ContentBox 
                    icon=""
                    float='left'
                    titleText="Generic Content 2"
                    paragraphText="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi."
                />
            </div>
        </div>
        <div class="ml-8 h-6 w-16 flex justify-between z-10 absolute bottom-0 md:bottom-12 xl:bottom-48 left-0">
            <div class="h-6 w-6 rounded-full border-[#C2D1D9] border-2 p-1 flex align-middle justify-center cursor-pointer transition-all duration-500 hover:bg-[#424B5A] hover:border-[#424B5A]">
                <img alt='chevron-left' src={chevronLeft} class='-translate-x-[1px]' />
            </div>
            <div class="h-6 w-6 rounded-full border-[#C2D1D9] border-2 p-1 flex align-middle cursor-pointer transition-all duration-500 justify-center hover:bg-[#424B5A] hover:border-[#424B5A]">
                <img alt='chevron-right' src={chevronRight} class='translate-x-[1px]' />
            </div>
        </div>-->
        <SliderOfContentBoxes />
    </div> 
    <div class="w-full md:w-1/2 p-4">
            <img alt='placeholder' src={placeholderImage} class='aspect-[4/3] w-full'/>
    </div>
</div>

<Spacer color="#424B5A" />

<!-- content #2 -->

<div class='my-14'>
<ContentWidthImage
>

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

