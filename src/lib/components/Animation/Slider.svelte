<script lang="ts">
  import { useSwipe, type SwipeCustomEvent } from 'svelte-gestures';
  import type { Snippet } from 'svelte';

  interface Props {
    itemCount: number;
    cardsPerView?: number;
    gap?: string;
    mobileGap?: string;
    children: Snippet<[{ index: number }]>;
    navigationClass?: string;
  }

  let {
    itemCount,
    cardsPerView = 1,
    gap = '14px',
    mobileGap = '6px',
    children,
    navigationClass = ''
  }: Props = $props();

  let currentSlide = $state(0);
  let sliderContainer: HTMLDivElement | undefined = $state();
  let viewportWidth = $state(0);

  const responsiveCardsPerView = $derived(
    viewportWidth >= 768 ? cardsPerView : 1
  );

  const maxSlide = $derived(Math.max(0, itemCount - responsiveCardsPerView));
  const currentGap = $derived(viewportWidth > 768 ? gap : mobileGap);

  const translateValue = $derived.by(() => {
    const baseShift = 100 / responsiveCardsPerView;
    return `translateX(calc(-${currentSlide * baseShift}% - ${currentSlide} * ${currentGap}))`;
  });

  const nextSlide = () => {
    if (currentSlide < maxSlide) {
      currentSlide++;
    } else {
      currentSlide = 0;
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      currentSlide--;
    } else {
      currentSlide = maxSlide;
    }
  };

  const goToSlide = (index: number) => {
    currentSlide = Math.min(index, maxSlide);
  };

  const handleSwipe = (e: SwipeCustomEvent) => {
    if (e.detail.direction === 'left') nextSlide();
    if (e.detail.direction === 'right') prevSlide();
  };
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<div class="relative w-full">
  <div
    class="relative overflow-hidden w-full"
    bind:this={sliderContainer}
    {...useSwipe( handleSwipe, ()=>({ timeframe: 300, minSwipeDistance: 60, touchAction: 'pan-y' }))}
  >
    <div
      class="flex transition-transform duration-500 ease-in-out"
      style="transform: {translateValue}; gap: {currentGap};"
    >
      {#each Array(itemCount) as _, i}
        <div
          class="w-full shrink-0"
          style="{viewportWidth >= 768 ? `width: calc((100% - ${cardsPerView - 1} * ${gap}) / ${cardsPerView});` : ''}"
        >
          {@render children({ index: i })}
        </div>
      {/each}
    </div>
  </div>

  {#if maxSlide > 0}
  <div class="flex justify-center items-center gap-4 mt-8 {navigationClass}">
    {#if maxSlide > 1}
    <button
      onclick={prevSlide}
      class="w-8 h-8 rounded-full text-gray-700 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
      aria-label="Previous slide"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    {/if}

    <div class="flex gap-2">
      {#each Array(maxSlide + 1) as _, i}
        <button
          onclick={() => goToSlide(i)}
          class="h-3 rounded-full active:-translate-y-1 transition-all duration-200 {currentSlide === i
            ? 'bg-gray-800 cursor-default w-8'
            : 'w-3 bg-gray-300 hover:bg-gray-400 active:bg-gray-600'}"
          aria-label="Go to slide {i + 1}"
        ></button>
      {/each}
    </div>
{#if maxSlide > 1}
    <button
      onclick={nextSlide}
      class="w-8 h-8 rounded-full text-gray-700 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
      aria-label="Next slide"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
    {/if}
  </div>
  {/if}
</div>
