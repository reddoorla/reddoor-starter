<script lang="ts">
    import type { Snippet } from 'svelte';

    interface ButtonProps {
        href?: string;
        onclick?: (event: MouseEvent) => void;
        class?: string;
        children?: Snippet;
    }

    let { href = "", onclick = () => {}, class: passedClasses = '', children = undefined }: ButtonProps = $props();

    const baseClasses = "bump rounded border-2 border-solid border-dark px-10 pt-4 pb-3 h-fit hover:bg-dark hover:text-white transition"

</script>

{#if href}
    <a
        {href}
        {onclick}
        class="{baseClasses} {passedClasses}">
            {@render children?.()}
    </a>
{:else}
<button {onclick}
        class="{baseClasses} {passedClasses}">
        {@render children?.()}
</button>
{/if}