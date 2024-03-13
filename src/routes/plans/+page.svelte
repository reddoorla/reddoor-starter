<script lang='ts'>
    import Spacer from "$lib/components/Spacer.svelte";
    import placeholder from "$lib/assets/images/image_placeholder.svg"
    import ArrowButton from "$lib/components/Buttons/ArrowButton.svelte";
    import nextArrow from "$lib/assets/icons/wireframe-link-arrow-right.svg"
    import ContentBox from "$lib/components/FullWidth/ContentBox.svelte";
    import HalfWidthImage from "$lib/components/HalfWidth/HalfWidthImage.svelte";

    const placeholderParagraph = `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.

    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.`;
</script>
<style>
    .plan-arrow{
        filter: invert(1);
        filter: invert(88%) sepia(19%) saturate(154%) hue-rotate(156deg) brightness(96%) contrast(82%);
    }
    .plan-line{
        height: 1px;
        width: calc(100% - 100px);
        background-color: #C2D1D9;
    }
</style>
<svelte:head>
    <title>Plan | Reddoor Wireframer</title>
</svelte:head>

<!-- plan #1 -->

<div class="max-w-screen-xl xl:mx-auto flex flex-col justify-center items-center my-32 mx-[4%]">
    <h2 class="mb-20">The Plan</h2>
    <div class="flex w-full justify-between items-center flex-col lg:flex-row mb-20">
        <div class="w-full sm:w-96 lg:w-1/3 flex flex-col justify-center items-center py-5 px-4 mx-auto relative mb-10">
            <div class="w-9 h-9 bg-black rounded-full text-white flex justify-center items-center mb-5"><p class="translate-y-[1px]">1</p></div>
            <img src={placeholder} alt="placeholder" class="w-32 mb-5" />
            <h6 class="mb-6">Blueprint Your Vision</h6>
            <p class="text-center">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.</p>
            <img  src={nextArrow} alt="next arrow" class="w-6 absolute -translate-2 rotate-90 lg:rotate-0 top-[100%] lg:top-[50%] right-[50%] lg:right-0 translate-x-3 plan-arrow"/>
        </div>
        <div class="w-full sm:w-96 lg:w-1/3 flex flex-col justify-center items-center py-5 px-4 mx-auto relative mb-10">
            <div class="w-9 h-9 bg-black rounded-full text-white flex justify-center items-center mb-5"><p class="translate-y-[1px]">2</p></div>
            <img src={placeholder} alt="placeholder" class="w-32 mb-5" />
            <h6 class="mb-6">Refine with Precision</h6>
            <p class="text-center">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.</p>
            <img  src={nextArrow} alt="next arrow" class="w-6 absolute -translate-2 rotate-90 lg:rotate-0 top-[100%] lg:top-[50%] right-[50%] lg:right-0 translate-x-3 plan-arrow"/>
        </div>
        <div class="w-full sm:w-96 lg:w-1/3 flex flex-col justify-center items-center py-5 px-4 mx-auto relative mb-10">
            <div class="w-9 h-9 bg-black rounded-full text-white flex justify-center items-center mb-5"><p class="translate-y-[1px]">3</p></div>
            <img src={placeholder} alt="placeholder" class="w-32 mb-5" />
            <h6 class="mb-6">Test and Iterate</h6>
            <p class="text-center">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.</p>
            <img  src={nextArrow} alt="next arrow" class="w-6 absolute -translate-2 rotate-90 lg:rotate-0 top-[100%] lg:top-[50%] right-[50%] lg:right-0 translate-x-3 plan-arrow hidden"/>
        </div>
    </div>
    <ArrowButton text="Learn More" />
</div>

<Spacer color="#424B5A" />

<!-- plan #2 -->

<div class="max-w-screen-xl xl:mx-auto flex flex-col justify-center items-center my-32 mx-[4%]">
    <h2 class="mb-20">The Plan</h2>
    <div class="w-11/12 h-24 relative flex flex-row justify-between">
        <div class="plan-line absolute top-6 translate-y-[1.5px] left-[50px] -z-10"></div>
        <div class="flex flex-col justify-center items-center">
            <div class="w-12 h-12 bg-black rounded-full text-white flex justify-center items-center mb-5"><p class="translate-y-[1px]">1</p></div>
            <h6>Sign Up</h6>
        </div>
        <div class="flex flex-col justify-center items-center">
            <div class="w-12 h-12 bg-black rounded-full text-white flex justify-center items-center mb-5"><p class="translate-y-[1px]">2</p></div>
            <h6>Set Up</h6>
        </div> 
        <div class="flex flex-col justify-center items-center">
            <div class="w-12 h-12 bg-black rounded-full text-white flex justify-center items-center mb-5"><p class="translate-y-[1px]">3</p></div>
            <h6>Share</h6>
        </div>  
    </div>
    <div class="w-full flex flex-col lg:flex-row justify-center items-top mt-16">
        <div class="w-full lg:w-1/2 pr-6">
            <ContentBox 
                titleTag="h3"
                titleText="BLUEPRINT YOUR VISION"
                paragraphText={placeholderParagraph}
                buttonText="BUTTON"
                linkText="Learn More"
                float="left"
                icon=""
                twProps=""
            />
        </div>
       <HalfWidthImage />
    </div>
</div>
<Spacer color="#424B5A" />

<!-- plan #3 -->
<Spacer color="#424B5A" />

<!-- plan #4 -->
<Spacer color="#424B5A" />