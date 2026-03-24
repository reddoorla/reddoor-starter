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

const isInternalLink = (url: string): boolean => {

	if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
		return true;
	}
	

	if (url.startsWith('#')) {
		return true;
	}

	try {
		const linkUrl = new URL(url, window.location.origin);
		return linkUrl.origin === window.location.origin;
	} catch {
		return true;
	}
};

const handleClick: MouseEventHandler<HTMLAnchorElement> = async (event) => {
	// Only apply delayed navigation to internal links (excluding PDFs)
	if (isInternalLink(href) && !href.includes('.pdf')) {
		event.preventDefault();

		if (onclick) {
			await onclick(event);
		}

		if (beforeNavigate) {
			await beforeNavigate(event);
		}

		setTimeout(() => {
			goto(href);
		}, delay);
	} else {

		if (onclick) {
			await onclick(event);
		}
	}
};
</script>

<a {href} onclick={handleClick} {...props}>
	{@render children()}
</a>