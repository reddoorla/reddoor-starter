<script lang="ts">
  import { useSwipe, type SwipeCustomEvent } from "svelte-gestures";
  import { onMount, type Snippet } from "svelte";
  import { viewport } from "$stores/viewport.svelte";

  interface Props {
    itemCount: number;
    /** Accessible name for the carousel region — say what's inside
     *  ("Customer testimonials"), not "Slider". */
    label: string;
    children: Snippet<[{ index: number }]>;
    /** Slides visible at once from 768px up; mobile is always 1. */
    cardsPerView?: number;
    gap?: string;
    mobileGap?: string;
    /** "slide" translates a track; "fade" cross-dissolves in place
     *  (one slide at a time — cardsPerView is ignored). */
    mode?: "slide" | "fade";
    /** Wrap past the ends. When false, arrows disable at the bounds. */
    loop?: boolean;
    /** Auto-advance every N ms. Off by default. Pauses on hover, focus,
     *  and hidden tab; never runs under prefers-reduced-motion; renders
     *  a pause/play toggle so rotation is always user-stoppable. */
    autoplay?: number;
    showDots?: boolean;
    navigationClass?: string;
    class?: string;
  }

  let {
    itemCount,
    label,
    children,
    cardsPerView = 1,
    gap = "14px",
    mobileGap = "6px",
    mode = "slide",
    loop = true,
    autoplay = 0,
    showDots = true,
    navigationClass = "",
    class: passedClasses = "",
  }: Props = $props();

  let currentSlide = $state(0);
  let hovered = $state(false);
  let focusWithin = $state(false);
  let pageHidden = $state(false);
  let reducedMotion = $state(false);
  let userPaused = $state(false);
  let rootEl: HTMLElement | undefined = $state();

  onMount(() => viewport.subscribe());

  onMount(() => {
    if (typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion = mql.matches;
    const onChange = (e: MediaQueryListEvent) => (reducedMotion = e.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  });

  onMount(() => {
    pageHidden = document.visibilityState === "hidden";
    const onVisibility = () =>
      (pageHidden = document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  });

  const responsiveCardsPerView = $derived(
    mode === "fade" ? 1 : viewport.width >= 768 ? cardsPerView : 1,
  );

  const maxSlide = $derived(Math.max(0, itemCount - responsiveCardsPerView));
  const currentGap = $derived(viewport.width > 768 ? gap : mobileGap);

  const translateValue = $derived.by(() => {
    const baseShift = 100 / responsiveCardsPerView;
    return `translateX(calc(-${currentSlide * baseShift}% - ${currentSlide} * ${currentGap}))`;
  });

  // Clamp when a resize (or fade mode) shrinks the reachable range out from
  // under the current index — otherwise the track points at empty space.
  $effect(() => {
    if (currentSlide > maxSlide) currentSlide = maxSlide;
  });

  // Autoplay wants a pause/play control (WCAG 2.2.2) — but only when rotation
  // can actually happen. Under reduced motion it never starts, so the control
  // would be a dead button.
  const autoplayEligible = $derived(
    autoplay > 0 && maxSlide > 0 && !reducedMotion,
  );
  const autoRotating = $derived(
    autoplayEligible && !userPaused && !hovered && !focusWithin && !pageHidden,
  );

  // Re-key the interval on manual navigation so a click restarts the full
  // delay instead of racing the in-flight tick.
  let autoplayEpoch = $state(0);

  $effect(() => {
    if (!autoRotating) return;
    void autoplayEpoch;
    const id = setInterval(() => {
      currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
    }, autoplay);
    return () => clearInterval(id);
  });

  const nextSlide = () => {
    if (currentSlide < maxSlide) {
      currentSlide++;
    } else if (loop) {
      currentSlide = 0;
    }
    autoplayEpoch++;
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      currentSlide--;
    } else if (loop) {
      currentSlide = maxSlide;
    }
    autoplayEpoch++;
  };

  const goToSlide = (index: number) => {
    currentSlide = Math.min(index, maxSlide);
    autoplayEpoch++;
  };

  const handleSwipe = (e: SwipeCustomEvent) => {
    if (e.detail.direction === "left") nextSlide();
    if (e.detail.direction === "right") prevSlide();
  };

  // Arrow-key nav when one of the carousel's own controls has focus — avoids
  // needing a tabindex on a non-interactive wrapper.
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    }
  };

  const onFocusOut = (e: FocusEvent) => {
    focusWithin = !!rootEl?.contains(e.relatedTarget as Node | null);
  };

  const slideVisible = (i: number) =>
    i >= currentSlide && i < currentSlide + responsiveCardsPerView;
</script>

<div
  bind:this={rootEl}
  class="relative w-full {passedClasses}"
  role="region"
  aria-roledescription="carousel"
  aria-label={label}
  onpointerenter={() => (hovered = true)}
  onpointerleave={() => (hovered = false)}
  onfocusin={() => (focusWithin = true)}
  onfocusout={onFocusOut}
>
  <div
    class="relative overflow-hidden w-full"
    {...useSwipe(handleSwipe, () => ({
      timeframe: 300,
      minSwipeDistance: 60,
      touchAction: "pan-y",
    }))}
  >
    {#if mode === "slide"}
      <div
        class="flex transition-transform duration-500 ease-in-out"
        style="transform: {translateValue}; gap: {currentGap};"
      >
        {#each Array(itemCount) as _, i (i)}
          <div
            class="w-full shrink-0"
            role="group"
            aria-roledescription="slide"
            aria-label="{i + 1} of {itemCount}"
            aria-hidden={slideVisible(i) ? undefined : "true"}
            inert={!slideVisible(i)}
            style={viewport.width >= 768
              ? `width: calc((100% - ${cardsPerView - 1} * ${gap}) / ${cardsPerView});`
              : ""}
          >
            {@render children({ index: i })}
          </div>
        {/each}
      </div>
    {:else}
      <div class="grid">
        {#each Array(itemCount) as _, i (i)}
          <div
            class="col-start-1 row-start-1 transition-opacity duration-500 ease-in-out {currentSlide ===
            i
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'}"
            role="group"
            aria-roledescription="slide"
            aria-label="{i + 1} of {itemCount}"
            aria-hidden={currentSlide === i ? undefined : "true"}
            inert={currentSlide !== i}
          >
            {@render children({ index: i })}
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Announce position to screen readers only when the user is driving;
       a rotating carousel announcing every few seconds is noise (APG). -->
  <div class="sr-only" aria-live={autoRotating ? "off" : "polite"}>
    {#if responsiveCardsPerView > 1}
      Slides {currentSlide + 1} through {currentSlide + responsiveCardsPerView} of
      {itemCount}
    {:else}
      Slide {currentSlide + 1} of {itemCount}
    {/if}
  </div>

  {#if maxSlide > 0}
    <div class="flex justify-center items-center gap-4 mt-8 {navigationClass}">
      {#if maxSlide > 1}
        <button
          type="button"
          onclick={prevSlide}
          onkeydown={handleKeydown}
          disabled={!loop && currentSlide === 0}
          class="w-8 h-8 rounded-full text-gray-700 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center disabled:opacity-40 disabled:hover:bg-transparent"
          aria-label="Previous slide"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      {/if}

      {#if showDots}
        <div class="flex gap-2">
          {#each Array(maxSlide + 1) as _, i (i)}
            <button
              type="button"
              onclick={() => goToSlide(i)}
              onkeydown={handleKeydown}
              class="h-3 rounded-full active:-translate-y-1 transition-all duration-200 {currentSlide ===
              i
                ? 'bg-gray-800 cursor-default w-8'
                : 'w-3 bg-gray-300 hover:bg-gray-400 active:bg-gray-600'}"
              aria-label="Go to slide {i + 1}"
              aria-current={currentSlide === i ? "true" : undefined}
            ></button>
          {/each}
        </div>
      {/if}

      {#if maxSlide > 1}
        <button
          type="button"
          onclick={nextSlide}
          onkeydown={handleKeydown}
          disabled={!loop && currentSlide === maxSlide}
          class="w-8 h-8 rounded-full text-gray-700 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center disabled:opacity-40 disabled:hover:bg-transparent"
          aria-label="Next slide"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      {/if}

      {#if autoplayEligible}
        <button
          type="button"
          onclick={() => (userPaused = !userPaused)}
          class="w-8 h-8 rounded-full text-gray-700 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
          aria-label={userPaused ? "Play slides" : "Pause slides"}
        >
          {#if userPaused}
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          {:else}
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
            </svg>
          {/if}
        </button>
      {/if}
    </div>
  {/if}
</div>
