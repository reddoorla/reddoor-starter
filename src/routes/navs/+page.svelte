<script lang='ts'>
    import ContentWidth from "$lib/components/ContentWidth/ContentWidth.svelte";
    import Spacer from "$lib/components/Spacer.svelte";
    import DefaultButton from "$lib/components/Buttons/DefaultButton.svelte";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
    import logoIcon from "$lib/assets/icons/logos/logo.svg"
    import logoFull from "$lib/assets/icons/logos/logoFull.svg"

    import { fly, crossfade, fade } from "svelte/transition"

    const NAV_LINKS=[
        {
            label:"ABOUT",
            href:"/about"
        },
        {
            label:"PORTFOLIO",
            href:"/portfolio"
        },
        {
            label:"RESOURCES",
            href:"/resources"
        },
        {
            label:"BLOG",
            href:"/blog"
        },
        {
            label:"CONTACT",
            href:"/contact"
        },

    ];

    const [send, receive] = crossfade({
    duration: 200
  });

    let isOverlayVisible = false;

    const toggleOverlayOn = () => isOverlayVisible = true;
    const toggleOverlayOff = () => isOverlayVisible = false;
</script>

<svelte:head>
    <title>Headers | Reddoor Wireframer</title>
</svelte:head>

<!--overlay-->
{#if isOverlayVisible}
<div class="w-screen h-screen bg-dark flex flex-col items-center justify-center gap-12 z-30" transition:fly>
    {#each NAV_LINKS as item}
        <a href={item.href} class="text-white text-2xl">{item.label}</a>
    {/each}

    <button class="absolute top-5 right-5 opacity-60 hover:opacity-100 transition-all z-40" on:click={toggleOverlayOff}>
        <div transition:fade class="text-white">
        <FontAwesomeIcon icon={faX} size="2x" />
        </div>
      
    </button>
</div>
{/if}
<!-- nav #1 -->

<div class="h-16 w-screen">
    <ContentWidth twProps="flex flex-row justify-between items-center h-full">
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
        <button class="lg:hidden ml-6 opacity-60 hover:opacity-100 transition-all z-40" on:click={toggleOverlayOn}>
           
            <FontAwesomeIcon icon={faBars} size="2x"/>
        
        </button>
        </div>

    </ContentWidth>
</div>

<Spacer color="#424B5A" />
<!-- nav #2 -->

<div class="h-16 w-screen">
    <ContentWidth twProps="flex flex-row justify-between items-center h-full">
        <a href="/" class="hover:opacity-80 transition-all duration-500 bump">
            <img src={logoFull} alt="logo"/>
        </a>
        
        
        <div class="flex flex-row">
            <div class="hidden lg:flex flex-row justify-between items-center gap-10">
                {#each NAV_LINKS as item}
                    <a href={item.href}>{item.label}</a>
                {/each}
            </div>
       
        <button class="lg:hidden ml-6 opacity-60 hover:opacity-100 transition-all z-40" on:click={toggleOverlayOn}>
           
            <FontAwesomeIcon icon={faBars} size="2x"/>
        
        </button>
        </div>

    </ContentWidth>
</div>
<Spacer color="#424B5A" />

<!-- nav #3 -->
<Spacer color="#424B5A" />

<!-- nav #4 -->
<Spacer color="#424B5A" />

<!-- nav #5 -->
<Spacer color="#424B5A" />

<!-- nav #6 -->
<Spacer color="#424B5A" />