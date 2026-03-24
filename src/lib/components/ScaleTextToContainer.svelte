<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
	}

	let { children, class: passedClasses = '' }: Props = $props();

	let parent: HTMLElement | undefined = $state();
	let originalFontSizes: Map<HTMLElement, number> = new Map();
	let mounted = $state(false);
	let windowWidth = $state(0);

	function getFontSizeInPixels(element: Element): number {
		const computedStyle = window.getComputedStyle(element);
		const fontSize = computedStyle.fontSize;
		const fontSizeValue = parseFloat(fontSize);
		const fontSizeUnit = fontSize.slice(fontSizeValue.toString().length);

		if (fontSizeUnit === 'px') {
			return fontSizeValue;
		} else if (fontSizeUnit === 'em' || fontSizeUnit === 'rem') {
			const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
			return fontSizeValue * rootFontSize;
		} else if (fontSizeUnit === '%') {
			const parentFontSize = parseFloat(
				getComputedStyle(element.parentElement as Element).fontSize
			);
			return (fontSizeValue / 100) * parentFontSize;
		} else {
			return 16;
		}
	}

	onMount(() => {
		mounted = true;
		windowWidth = window.innerWidth;

		// Capture original font sizes once
		if (parent) {
			const nodes = [...parent.children] as HTMLElement[];
			nodes.forEach((node) => {
				originalFontSizes.set(node, getFontSizeInPixels(node));
			});
		}

		let timer: ReturnType<typeof setTimeout>;
		const handleResize = () => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				windowWidth = window.innerWidth;
			}, 100);
		};

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	$effect(() => {
		windowWidth;
		if (mounted && parent) {
			const nodes = [...parent.children] as HTMLElement[];
			const parentWidth = parent.offsetWidth;

			// Reset font sizes to originals before measuring
			nodes.forEach((node) => {
				const original = originalFontSizes.get(node);
				if (original) {
					node.style.fontSize = original + 'px';
				}
			});

			let largestChildWidth = 1;
			nodes.forEach((node) => {
				if (node.offsetWidth > largestChildWidth) largestChildWidth = node.offsetWidth;
			});

			const scale = parentWidth / largestChildWidth;
			if (scale < 1) {
				nodes.forEach((node) => {
					const original = originalFontSizes.get(node);
					if (original) {
						node.style.fontSize = original * scale + 'px';
					}
				});
			}
		}
	});
</script>

<div bind:this={parent} class="w-full transition-all {passedClasses}">
	{@render children?.()}
</div>
