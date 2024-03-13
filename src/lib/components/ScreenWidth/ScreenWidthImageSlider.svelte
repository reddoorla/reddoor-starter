<script lang='ts'>
  import { onMount } from "svelte";
    import placeholder from "../../assets/images/background_placeholder.svg";
  import ContentWidth from "../ContentWidth/ContentWidth.svelte";
    
    export let imageArray = [placeholder, placeholder, placeholder, placeholder];
    export let altText = "background image"

	const SLIDER_TRANSITION_FUNCTION="cubic-bezier(.5,0,0,1)";
	const SLIDER_TRANSITION_LENGTH_IN_MS=2000;
	const SLIDER_INTERVAL_IN_MS = 5000;

    let sliderIndex = 0;
	
	let isSlideAnimated = true;
	let nextSlideIndex = 1;
	let previousSlideIndex = imageArray.length-1;

	let getNextSlideIndex = () =>{
		if(sliderIndex==imageArray.length-1){
			nextSlideIndex = 0;
			return;
		}
		if(sliderIndex==imageArray.length){
			nextSlideIndex = 1;
			return;
		}
		if(sliderIndex<-1){
			nextSlideIndex = imageArray.length+(sliderIndex + 1);
			return;
		}
			nextSlideIndex = sliderIndex + 1;
	}

	let getPreviousSlideIndex = () => {
		if(sliderIndex<1&&sliderIndex>0-imageArray.length){
			previousSlideIndex = imageArray.length+(sliderIndex-1);
			return;
		}
		if(sliderIndex==0-imageArray.length){
			previousSlideIndex = imageArray.length-1;
			return;
		}
		
		previousSlideIndex = sliderIndex - 1;
	}

	const resetSlider = () => {
		setTimeout(()=>isSlideAnimated=false, SLIDER_TRANSITION_LENGTH_IN_MS)
		setTimeout(()=> sliderIndex=sliderIndex%imageArray.length, SLIDER_TRANSITION_LENGTH_IN_MS+20)
		setTimeout(()=>isSlideAnimated=true,SLIDER_TRANSITION_LENGTH_IN_MS+40)
	}

	const slideLeft = () => {
		sliderIndex++;
		getNextSlideIndex();
		getPreviousSlideIndex();
		if(sliderIndex%imageArray.length==0&&sliderIndex!==0)
			resetSlider();
		
		console.log(sliderIndex)
	}
	const slideRight = () => {
		sliderIndex--;
		getNextSlideIndex();
		getPreviousSlideIndex();
		if(sliderIndex%imageArray.length==0&&sliderIndex!==0)
			resetSlider();
		

		console.log(sliderIndex)
	}

    const setSliderIndex = (index:number) => {
        sliderIndex=index;
		clearInterval(sliderInterval);
		sliderInterval = setInterval(()=>slideLeft(), SLIDER_INTERVAL_IN_MS);
    }

	let sliderInterval:NodeJS.Timeout;

    onMount(()=>{
       sliderInterval = setInterval(()=>slideLeft(), SLIDER_INTERVAL_IN_MS);
    });

	const tripledImages = imageArray.concat(imageArray).concat(imageArray)
</script>
    
<section>
    <div class="h-[160vw] sm:h-[90vw] xl:h-[60vw] lg:max-h-screen relative overflow-hidden" >
    <div  class="h-full flex flex-row flex-nowrap {isSlideAnimated ? 'transition-transform duration-[2000ms] ease=[cubic-bezier(.5,0,0,1)]': ''}"
    style= "width:{100*tripledImages.length}vw; transform:translateX({-(sliderIndex+imageArray.length)*100}vw); ">
		
        
        {#each tripledImages as image }
        <div class="w-screen">
            <img src={image} alt={altText} class=" h-full w-full object-cover -z-10"/>
        </div>
        {/each}
        
        
    </div>
    <div class="absolute flex justify-center w-full h-full top-0 left-0">
        <ContentWidth twProps="h-full relative w-full">
        <slot />
        <div class="absolute h-10 flex align-middle justify-start left-[4%] xl:left-8 translate-x-[2px] bottom-10">
            {#each  imageArray as image, i}
                <div class="h-[10px] w-[10px] border-2 border-gray-400 rounded-full transition-all duration-1000 cursor-pointer hover:opacity-60 mr-4 {sliderIndex%imageArray.length===i ? "bg-dark border-dark" : ""}"
                    on:click={()=>setSliderIndex(i)}
                    aria-label="image {i} of {imageArray.length}"
                    aria-hidden
                ></div>
            {/each}
        </div>
	</ContentWidth>
        
    </div>
</div>
</section>