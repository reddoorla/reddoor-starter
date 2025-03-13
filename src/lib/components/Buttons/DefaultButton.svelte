<script lang="ts">
    import type { MouseEventHandler } from "svelte/elements";
    interface ButtonProps {
   href?: string;
   onclick?: (event: MouseEvent ) => any;
   class?: string;
   children: any;
   [key: string]: any;
 }
    let { href = "", onclick = () => {}, class:passedClasses = '', children, ...others  } : ButtonProps = $props();

    const baseClasses = "rounded border-2 border-solid border-dark px-10 pt-4 pb-3 h-fit hover:bg-dark hover:text-white transition"

</script>

<style>
    a, button{
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: 1px;
    text-transform: uppercase;
}
</style>


<div class="bump">
    {#if href}
        <a 
            {href} 
            {onclick} 
            class="{baseClasses} {passedClasses}">
                {@render children()}
        </a>
    {:else}
    <button {onclick}
            class="{baseClasses} {passedClasses}">
            {@render children()}
    </button>
    {/if}
</div>