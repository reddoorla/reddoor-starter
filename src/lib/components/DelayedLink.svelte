<!-- src/lib/components/DelayedLink.svelte -->
<script lang="ts">
import { goto } from '$app/navigation';
import type { Snippet } from 'svelte';
import type { HTMLAnchorAttributes, MouseEventHandler } from 'svelte/elements';

interface DelayedLinkProps extends Omit<HTMLAnchorAttributes, 'onclick'> {
    href: string;
    delay?: number;
    children: Snippet;
    beforeNavigate?: (event: MouseEvent) => void | Promise<void>;
    onclick?: MouseEventHandler<HTMLAnchorElement>;
}

let { 
    href, 
    delay = 400, 
    children, 
    beforeNavigate,
    onclick,
    ...props 
}: DelayedLinkProps = $props();

const handleClick: MouseEventHandler<HTMLAnchorElement> = async (event) => {

    if (onclick) {
        await onclick(event);

        if (event.defaultPrevented) {
            return;
        }
    }

    if (beforeNavigate) {
        await beforeNavigate(event);
    }

    event.preventDefault();
    
    setTimeout(() => {
        goto(href);
    }, delay);
};
</script>

<a {href} onclick={handleClick} {...props}>
    {@render children()}
</a>