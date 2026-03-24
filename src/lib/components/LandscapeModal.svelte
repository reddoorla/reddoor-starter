<script lang='ts'>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    let showLandscapeModal = $state(false);
    let isTouchDevice = $state(false);

    function checkOrientation() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const isSmallScreen = window.innerWidth < 1024;
        showLandscapeModal = isTouchDevice && isLandscape && isSmallScreen;
    }

    onMount(() => {
        isTouchDevice = navigator.maxTouchPoints > 0;
        if (isTouchDevice) {
            checkOrientation();
            window.addEventListener("resize", checkOrientation);
            return () => window.removeEventListener("resize", checkOrientation);
        }
    });
</script>

{#if showLandscapeModal}
    <div transition:fade role="dialog" aria-modal="true" aria-labelledby="landscape-heading" class="w-screen h-screen fixed bg-black flex justify-center items-center top-0 left-0 z-50">
        <h3 id="landscape-heading" class="text-white">
            Please Switch to Portrait Mode
        </h3>
    </div>
{/if}
