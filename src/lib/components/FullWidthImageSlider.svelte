<script lang='ts'>
    import placeholder from "../assets/images/placeholder.svg";
    
    export let imageArray = [placeholder, placeholder, placeholder, placeholder];
    export let altText = "background image"

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
		setTimeout(()=>isSlideAnimated=false, 500)
		setTimeout(()=> sliderIndex=sliderIndex%imageArray.length, 520)
		setTimeout(()=>isSlideAnimated=true, 600)
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

	const tripledImages = imageArray.concat(imageArray).concat(imageArray)
</script>
    
<section>
    <div class="h-[125vw] sm:h-[70vw] lg:h-[55vw] relative overflow-hidden" >
    <div  class="h-full flex flex-row flex-nowrap {isSlideAnimated ? 'transition-transform duration-500': ''}"
    style= "width:{100*tripledImages.length}vw; transform:translateX({-(sliderIndex+imageArray.length)*100}vw); ">
		
        
        {#each tripledImages as image }
        <div class="w-screen">
            <img src={image} alt={altText} class="w-full object-cover {image===placeholder ? "md:h-auto" : ""} -z-10"/>
        </div>
        {/each}
        
        
    </div>
    <div class="absolute flex justify-center w-full h-full top-0 left-0">
        <div class="max-w-[1280px] h-full relative w-full">
        <slot />
        <div class="absolute h-10 flex align-middle justify-start left-8 xl:left-0 bottom-10">
            {#each  imageArray as image, i}
                <div class="h-[10px] w-[10px] border-2 border-gray-400 rounded-full mr-4"></div>
            {/each}
        </div>
        </div>
        
    </div>
</div>
</section>