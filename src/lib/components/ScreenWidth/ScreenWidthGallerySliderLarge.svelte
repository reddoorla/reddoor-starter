<script lang='ts'>
    import { onMount } from "svelte";
    import { swipe } from "svelte-gestures";
    import placeholder from "../../assets/images/background_placeholder.svg";
    import ContentWidth from "../ContentWidth/ContentWidth.svelte";
    import FourByThreeImage from "../FullWidth/FourByThreeImage.svelte";
    import chevronLeft from "$lib/assets/icons/chevron-left.svg"
    import chevronRight from "$lib/assets/icons/chevron-right.svg"

      
      export let imageArray = [placeholder, placeholder, placeholder, placeholder];
      export let labelArray = ["client 1", "client 2","client 3", "client 4"]
      export let altText = "background image"
      export let twProps = "";
      
  
      const SLIDER_TRANSITION_FUNCTION="cubic-bezier(.5,0,0,1)";
      const SLIDER_TRANSITION_LENGTH_IN_MS=2000;
      const SLIDER_INTERVAL_IN_MS = 5000;
      
  
      let sliderIndex = 0;
      let innerWidth:number;
      let imageWidth = 720;
      let isSlideAnimated = true;

      $: {
        if(innerWidth>1040){
            imageWidth = 720;
        } else if(innerWidth>768){
            imageWidth = 480;
        }else{
            imageWidth = 320;
        }
      }

      const resetSliderToStart = () => {
          setTimeout(()=>isSlideAnimated=false, SLIDER_TRANSITION_LENGTH_IN_MS)
          setTimeout(()=> sliderIndex=0, SLIDER_TRANSITION_LENGTH_IN_MS+20)
          setTimeout(()=>isSlideAnimated=true,SLIDER_TRANSITION_LENGTH_IN_MS+40)
      }

      const resetSliderToEnd = () => {
          setTimeout(()=>isSlideAnimated=false, SLIDER_TRANSITION_LENGTH_IN_MS)
          setTimeout(()=> sliderIndex=imageArray.length-1, SLIDER_TRANSITION_LENGTH_IN_MS+20)
          setTimeout(()=>isSlideAnimated=true,SLIDER_TRANSITION_LENGTH_IN_MS+40)
      }
  
      const slideRight = () => {
          sliderIndex++;
          clearInterval(sliderInterval);
	        sliderInterval = setInterval(()=>slideRight(), SLIDER_INTERVAL_IN_MS);
          if(sliderIndex==imageArray.length)
              resetSliderToStart();
          
          console.log(sliderIndex)
      }
      const slideLeft = () => {
          sliderIndex--;
          clearInterval(sliderInterval);
	    sliderInterval = setInterval(()=>slideLeft(), SLIDER_INTERVAL_IN_MS);
          if(sliderIndex<0)
              resetSliderToEnd();
      }
  
      const setSliderIndex = (index:number) => {
          sliderIndex=index;
          clearInterval(sliderInterval);
          sliderInterval = setInterval(()=>slideRight(), SLIDER_INTERVAL_IN_MS);
      }
  
      let sliderInterval:NodeJS.Timeout;
  
      const handleSwipe = (e:CustomEvent<{ direction: "left" | "top" | "right" | "bottom"; target: EventTarget; }>) => {
        if(e.detail.direction==="left") 
          slideRight();
  
          if(e.detail.direction==="right") 
          slideLeft();
      }

      let progressPosistion = 0;
      let progressWrapForwardPosition = -100;
      let progressWrapBackwardPosition = imageArray.length*100

      $: {
        progressPosistion= (sliderIndex)*100;
        if(sliderIndex==imageArray.length)
            progressWrapForwardPosition=0;
        else
        progressWrapForwardPosition = 100;
        
        if(sliderIndex==-1)
            progressWrapBackwardPosition=imageArray.length*100-100;
        else
            progressWrapBackwardPosition = imageArray.length*100;

            console.log(sliderIndex)
      }
  
      onMount(()=>{
         sliderInterval = setInterval(()=>slideRight(), SLIDER_INTERVAL_IN_MS);
      });
  
      const tripledImages = imageArray.concat(imageArray).concat(imageArray)
  </script>
  <svelte:head><title>Portfolios | Reddoor Wireframer</title></svelte:head>
  <svelte:window bind:innerWidth />
      
  <section class="pb-32 {twProps}">
      <div use:swipe on:swipe={handleSwipe} class="h-py-2 relative" style="height:{imageWidth*0.95}px;">
      <div  class="h-full flex flex-row flex-nowrap {isSlideAnimated ? 'transition-transform duration-[2000ms]': ''}"
      style= "width:{(imageWidth-8)*tripledImages.length}px; margin-left:calc(50vw - {(imageWidth-8)/2}px); transform:translateX({-(sliderIndex+imageArray.length)*(imageWidth-8)}px); ">   
          {#each tripledImages as image, i }
          <div class="h-full mx-4" style="width:{imageWidth}px">
              <FourByThreeImage label={labelArray[i%imageArray.length]||""} alt={altText} twProps="h-full object-cover -z-10"/>
          </div>
          {/each}
          
          
      </div>
      <div class="absolute flex justify-center w-full bottom-0 left-0">
        <ContentWidth twProps="h-full relative w-full">
            <div class="h-10 flex align-middle justify-center translate-x-[2px] bottom-10">
                {#each  imageArray as image, i}
                    <button class="h-[10px] w-[10px] border-2  rounded-full transition-colors duration-1000 cursor-pointer active:-translate-y-[0.5px] hover:opacity-60 mr-4 
                                    {(sliderIndex%imageArray.length>=0&&sliderIndex%imageArray.length===i)|| (sliderIndex%imageArray.length<=0&&imageArray.length+sliderIndex%imageArray.length===i) ? "bg-dark border-dark" : "border-light"}"
                        on:click={()=>setSliderIndex(i)}
                        aria-label="image {i} of {imageArray.length}"
                        aria-hidden
                    ></button>
                {/each}
            </div>
        </ContentWidth>
          
      </div>
  </div>
  </section>