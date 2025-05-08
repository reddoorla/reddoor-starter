<script lang="ts">
	import { swipe, type SwipeCustomEvent } from 'svelte-gestures';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
    import profilePlaceholder from '$lib/assets/images/profile_placeholder.png'
    import featuredPlaceholder from '$lib/assets/images/background_placeholder.svg'
  import ContentWidth from './ContentWidth.svelte';
  
	let viewportWidth = $state(1024);

    type Testimonial = {
        title: string;
        quote: string;
        featuredImage: string;
        profileImage: string; 
        attribution: string;
        attributionSubtitle: string;
};

	let testimonialArray: Testimonial[] = [
        {
            title:'testimonial',
            quote: '“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittis eros. Quisque quis euismod lorem.”',
            featuredImage: featuredPlaceholder,
            profileImage: profilePlaceholder,
            attribution: 'Author Name',
            attributionSubtitle: 'CITY, ST'
        },
        {
            title:'testimonial',
            quote: '“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittis eros. Quisque quis euismod lorem.”',
            featuredImage: featuredPlaceholder,
            profileImage: profilePlaceholder,
            attribution: 'Author Name',
            attributionSubtitle: 'CITY, ST'
        },
        {
            title:'testimonial',
            quote: '“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sagittis eros. Quisque quis euismod lorem.”',
            featuredImage: featuredPlaceholder,
            profileImage: profilePlaceholder,
            attribution: 'Author Name',
            attributionSubtitle: 'CITY, ST'
        },
    ];
	let tripledTestimonials: Testimonial[] = $state([]);
  

	let sliderIndex = $state(0);
	let isSlideAnimated = $state(true);
	const SLIDER_TRANSITION_LENGTH_IN_MS = 2000;
  
	const resetSliderToStart = () => {
	  setTimeout(() => (isSlideAnimated = false), SLIDER_TRANSITION_LENGTH_IN_MS);
	  setTimeout(() => (sliderIndex = 0), SLIDER_TRANSITION_LENGTH_IN_MS + 20);
	  setTimeout(() => (isSlideAnimated = true), SLIDER_TRANSITION_LENGTH_IN_MS + 40);
	};
  
	const resetSliderToEnd = () => {
	  setTimeout(() => (isSlideAnimated = false), SLIDER_TRANSITION_LENGTH_IN_MS);
	  setTimeout(() => (sliderIndex = testimonialArray.length - 1), SLIDER_TRANSITION_LENGTH_IN_MS + 20);
	  setTimeout(() => (isSlideAnimated = true), SLIDER_TRANSITION_LENGTH_IN_MS + 40);
	};
  
	const slideRight = () => {
	  sliderIndex--;
	  if (sliderIndex < 0) resetSliderToEnd();
	  console.log('Current slide index:', sliderIndex);
	};
  
	const slideLeft = () => {
	  sliderIndex++;
	  if (sliderIndex >= testimonialArray.length) resetSliderToStart();
	  console.log('Current slide index:', sliderIndex);
	};
  
	const handleSwipe = (
	  e: SwipeCustomEvent
	) => {
	  if (e.detail.direction === 'left') slideLeft();
	  if (e.detail.direction === 'right') slideRight();
	};
  
    let { testimonials = [] } = $props();

    onMount(()=>{
        if(testimonials.length>0)
            testimonialArray = testimonials;

        tripledTestimonials = [...testimonialArray, ...testimonialArray, ...testimonialArray];
    })

  </script>
  
  <ContentWidth class=" lg:h-[560px] relative">
  <div
	class="w-full h-full overflow-hidden relative"
	use:swipe={()=>({ timeframe: 300, minSwipeDistance: 60 })}
	onswipe={handleSwipe}
  >
	{#if tripledTestimonials.length > 0}
	  <div
		style="width: {tripledTestimonials.length * 100}%; transform:translateX({((-sliderIndex / tripledTestimonials.length) - (1/3)) * 100}%);"
		class="flex flex-row justify-between flex-nowrap h-full w-full overflow-hidden
		{isSlideAnimated ? 'transition-transform duration-[2000ms]' : ''}"
	  >
		{#each tripledTestimonials as testimonial, i}
		  <div
			style="width: {100 / tripledTestimonials.length}%;"
			class="h-full relative overflow-hidden bg-dark flex flex-col-reverse gap-12 lg:flex-row p-4 lg:p-0"
		  >
          <div class='w-full lg:h-full flex flex-col justify-center gap-6 lg:gap-12 lg:p-12'>
            <h3 class='text-light uppercase'>{testimonial.title}</h3>
            <p class='text-white'>{testimonial.quote}</p>
            <div class='flex gap-9 items-center'>
                <img src={testimonial.profileImage} alt={testimonial.profileImage} class='h-16 w-16 rounded-full bg-light' />
                <div class='flex flex-col'>
                    <h4 class='text-light'>{testimonial.attribution}</h4>
                    <div class='label text-light'>{testimonial.attributionSubtitle}</div>
                </div>
            </div>
          </div>
        
                <img
                src={testimonial.featuredImage}
                class="lg:h-[560px] w-full lg:w-[560px]"
                alt='slideshow item'
                />
            
		  </div>
		{/each}
	  </div>
	  
	 
	{:else}
	  <div class="w-full h-full flex items-center justify-center">
		<p>No testimonials available</p>
	  </div>
	{/if}
  </div>

  <button class="hidden lg:block absolute top-1/2 -translate-y-1/2 -left-6 -translate-x-full" onclick={slideRight} aria-label='slide right'>
    <i class="bump fa-sharp fa-regular fa-arrow-left text-dark fa-2xl shadow-sm" ></i>
  </button>
  <button class="hidden lg:block absolute top-1/2 -translate-y-1/2 -right-6 translate-x-full" onclick={slideLeft} aria-label='slide left'>
    <i class="bump fa-sharp fa-regular fa-arrow-right text-dark fa-2xl shadow-sm" ></i>
  </button>

  <div
  class="lg:hidden flex flex-row justify-between items-center absolute -bottom-8 left-6 gap-12"
>
  <button class="bump" onclick={slideRight} aria-label='slide right'>
    <i class="fa-sharp fa-regular fa-arrow-left text-dark fa-2xl shadow-sm" ></i>
  </button>
  <button class="bump" onclick={slideLeft} aria-label='slide left'>
    <i class="fa-sharp fa-regular fa-arrow-right text-dark fa-2xl shadow-sm" ></i>
  </button>
</div>

  </ContentWidth>