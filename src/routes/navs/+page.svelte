<script lang='ts'>
    import ContentWidth from "$lib/components/ContentWidth/ContentWidth.svelte";
    import Spacer from "$lib/components/Spacer.svelte";
    import DefaultButton from "$lib/components/Buttons/DefaultButton.svelte";
    import logoIcon from "$lib/assets/icons/logos/logo.svg"
    import logoFull from "$lib/assets/icons/logos/logoFull.svg"

    import { fly, crossfade, fade } from "svelte/transition"

    const NAV_LINKS=[
        {
            label:"ABOUT",
            href:"/"
        },
        {
            label:"PORTFOLIO",
            href:"/"
        },
        {
            label:"RESOURCES",
            href:"/"
        },
        {
            label:"BLOG",
            href:"/"
        },
        {
            label:"CONTACT",
            href:"/"
        },

    ];

    const [send, receive] = crossfade({
    duration: 200
  });

    let isOverlayVisible = $state(false);

    const toggleOverlayOn = () => isOverlayVisible = true;
    const toggleOverlayOff = () => isOverlayVisible = false;
</script>

<svelte:head>
    <title>Headers | Reddoor Wireframer</title>
</svelte:head>

<!--overlay-->
{#if isOverlayVisible}
<div class="w-screen h-screen fixed bg-dark flex flex-col items-center justify-center gap-12 z-30" transition:fly={{y:"-100%"}}>
    {#each NAV_LINKS as item}
        <a onclick={()=>isOverlayVisible=false} href={item.href} class="text-white text-2xl">{item.label}</a>
    {/each}

    <button class="absolute top-5 right-5 opacity-60 hover:opacity-100 transition-all z-40" aria-label="close" onclick={toggleOverlayOff}>
        <div in:fade={{delay: 600}} out:fade class="text-white">
            <i class="fa-solid fa-close fa-3x"></i>
        </div>
      
    </button>
</div>
{/if}
<!-- nav #1 -->

<div class="h-16 w-screen">
    <ContentWidth class="flex flex-row justify-between items-center h-full">
        <a href="/" class="hover:opacity-80 transition-all duration-500 bump">
            <img src={logoFull} alt="logo"/>
        </a>
        <div class="hidden lg:flex flex-row justify-between items-center gap-10">
            {#each NAV_LINKS as item}
                <a href={item.href}>{item.label}</a>
            {/each}
        </div>
        
        <div class="flex flex-row">
        <div class="hidden md:flex">   
            <DefaultButton text="BUTTON" click={toggleOverlayOn} />
        </div> 
        <button class="lg:hidden ml-6 opacity-60 hover:opacity-100 transition-all " aria-label="open menu" onclick={toggleOverlayOn}>
           
            <i class="fa-regular fa-solid fa-bars fa-2xl"></i>
        
        </button>
        </div>

    </ContentWidth>
</div>

<Spacer color="#424B5A" />
<!-- nav #2 -->

<div class="h-16 w-screen">
    <ContentWidth class="flex flex-row justify-between items-center h-full">
        <a href="/" class="hover:opacity-80 transition-all duration-500 bump">
            <img src={logoFull} alt="logo"/>
        </a>
        
        
        <div class="flex flex-row">
            <div class="hidden lg:flex flex-row justify-between items-center gap-10">
                {#each NAV_LINKS as item}
                    <a href={item.href}>{item.label}</a>
                {/each}
            </div>
       
        <button class="lg:hidden ml-6 opacity-60 hover:opacity-100 transition-all" onclick={toggleOverlayOn}>
           {#if !isOverlayVisible}
           <i class="fa-regular fa-solid fa-bars fa-2xl"></i>
            {/if}
        
        </button>
        </div>

    </ContentWidth>
</div>
<Spacer color="#424B5A" />

<!-- nav #3 -->
<div class="h-16 w-screen">
    <ContentWidth class="flex flex-row justify-between items-center h-full">

        <button class="opacity-60 hover:opacity-100 transition-all" onclick={toggleOverlayOn}>
           {#if !isOverlayVisible}
           <i class="fa-regular fa-solid fa-bars fa-2xl"></i>
            {/if}
        
        </button>

        <a href="/" class="hover:opacity-80 transition-all duration-500 bump">
            <img src={logoFull} alt="logo"/>
        </a>

        <button class="ml-6 opacity-60 hover:opacity-100 transition-all" onclick={toggleOverlayOn}>
            {#if !isOverlayVisible}
            <i class="fa-regular fa-solid fa-search fa-xl"></i>
             {/if}
         
         </button>
        

    </ContentWidth>
</div>

<Spacer color="#424B5A" />

<!-- nav #4 -->

<div class="h-16 w-screen">
    <ContentWidth class="flex flex-row justify-between items-center h-full">
        <a href="/" class="hover:opacity-80 transition-all duration-500 bump">
            <img src={logoFull} alt="logo"/>
        </a>
        <button class="opacity-60 hover:opacity-100 transition-all" onclick={toggleOverlayOn}>
            {#if !isOverlayVisible}
            <i class="fa-regular fa-solid fa-bars fa-2xl"></i>
             {/if}
         
         </button>
    </ContentWidth>
</div>
<Spacer color="#424B5A" />

<!-- nav #5 -->
<div class="h-16 w-screen">
    <ContentWidth class="flex flex-row justify-between items-center h-full">
       
        
        <div class="flex flex-row">
            <div class="hidden lg:flex flex-row justify-between items-center gap-10">
                {#each NAV_LINKS as item}
                    <a href={item.href}>{item.label}</a>
                {/each}
            </div>
       
        <button class="lg:hidden ml-6 opacity-60 hover:opacity-100 transition-all" onclick={toggleOverlayOn}>
           {#if !isOverlayVisible}
           <i class="fa-regular fa-solid fa-bars fa-2xl"></i>
            {/if}
        
        </button>
        </div>

        <a href="/" class="hover:opacity-80 transition-all duration-500 bump">
            <img src={logoIcon} alt="logo" class="h-8"/>
        </a>
        <div class="hidden md:flex">   
            <DefaultButton text="BUTTON" click={toggleOverlayOn} />
        </div> 
    </ContentWidth>
</div>
<Spacer color="#424B5A" />

<!-- nav #6 -->
<div class="h-16 w-screen">
    <ContentWidth class="flex flex-row justify-between items-center h-full">

        
        <a href="/" class="hover:opacity-80 transition-all duration-500 bump">
            <img src={logoFull} alt="logo"/>
        </a>
        <div class="flex flex-row">
            <div class="hidden lg:flex flex-row justify-between items-center gap-10">
                {#each NAV_LINKS as item}
                    <a href={item.href}>{item.label}</a>
                {/each}
            </div>
       
        <button class="lg:hidden ml-6 opacity-60 hover:opacity-100 transition-all" onclick={toggleOverlayOn}>
           {#if !isOverlayVisible}
           <i class="fa-regular fa-solid fa-bars fa-2xl"></i>
            {/if}
        
        </button>
        <button class="ml-6 opacity-60 hover:opacity-100 transition-all" onclick={toggleOverlayOn}>
            
            {#if !isOverlayVisible}
            <i class="fa-regular fa-solid fa-search fa-2xl"></i>
             {/if}
         
         </button>
         </div>
        

    </ContentWidth>
</div>
<Spacer color="#424B5A" />