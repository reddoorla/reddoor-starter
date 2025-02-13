<script lang="ts">
    let { href = "", onclick, class:passedClasses = '', children, ...others  } = $props();

    const baseClasses = "rounded border-2 border-solid border-dark px-10 pt-4 pb-3 h-fit";

</script>



{#if href}
    <a 
        {href} 
        {onclick} 
        class="{baseClasses} {passedClasses}">
        {@render children()}
    </a>
{:else}
    <button 
        {onclick}
        class="{baseClasses} {passedClasses}">
        {@render children()}
    </button>
{/if}