<script lang="ts">
    import { afterNavigate, beforeNavigate, onNavigate } from "$app/navigation";
    import { fade } from "svelte/transition";
    let isTransitioning = $state(false);

    beforeNavigate(()=>{
        isTransitioning = true;

    })

    afterNavigate(()=>{
        setTimeout(()=>{
            isTransitioning=false
        }, 1050)
    })

</script>
{#if isTransitioning}
    <div class="h-screen w-screen fixed z-50 bg-black top-0 left-0" out:fade={{duration:700}}></div>
{/if}
