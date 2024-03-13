<script lang='ts'>
    import Spacer from "$lib/components/Spacer.svelte";
    import placeholder from "$lib/assets/images/image_placeholder.svg"
    import ArrowButton from "$lib/components/Buttons/ArrowButton.svelte";
    import nextArrow from "$lib/assets/icons/wireframe-link-arrow-right.svg"
</script>
<style>
    .plan-arrow{
        filter: invert(1);
        filter: invert(88%) sepia(19%) saturate(154%) hue-rotate(156deg) brightness(96%) contrast(82%);
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
<Spacer color="#424B5A" />

<!-- plan #3 -->
<Spacer color="#424B5A" />

<!-- plan #4 -->
<Spacer color="#424B5A" />