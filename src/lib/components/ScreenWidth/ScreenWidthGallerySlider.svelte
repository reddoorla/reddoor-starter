<script lang='ts'>
    import { onMount } from "svelte";
    import { swipe } from "svelte-gestures";
      import placeholder from "../../assets/images/background_placeholder.svg";
    import ContentWidth from "../ContentWidth/ContentWidth.svelte";
    import FourByThreeImage from "../FullWidth/FourByThreeImage.svelte";
    import Progressbar from 'flowbite-svelte'
      
      export let imageArray = [placeholder, placeholder, placeholder, placeholder];
      export let altText = "background image"
      export let twProps = "";
  
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
  
      const handleSwipe = (e:CustomEvent<{ direction: "left" | "top" | "right" | "bottom"; target: EventTarget; }>) => {
        if(e.detail.direction==="left") 
          slideLeft();
  
          if(e.detail.direction==="right") 
          slideRight();
      }
  
      onMount(()=>{
         sliderInterval = setInterval(()=>slideLeft(), SLIDER_INTERVAL_IN_MS);
      });
  
      const tripledImages = imageArray.concat(imageArray).concat(imageArray)
  </script>
      
  <section class="pb-32 {twProps}">
      <div use:swipe on:swipe={handleSwipe} class="h-[320px] py-2 relative" >
      <div  class="h-full flex flex-row flex-nowrap {isSlideAnimated ? 'transition-transform duration-[2000ms]': ''}"
      style= "width:{352*tripledImages.length}px; margin-left:calc(50vw - 176px); transform:translateX({-(sliderIndex+imageArray.length)*352}px); ">
          
          
          {#each tripledImages as image }
          <div class="w-[360px] h-full mx-4">
              <FourByThreeImage alt={altText} twProps="h-full object-cover -z-10"/>
          </div>
          {/each}
          
          
      </div>
      <div class="absolute flex justify-center w-full h-full top-0 left-0">
          <ContentWidth twProps="h-full relative w-full">
          <Progressbar progress={(sliderIndex%imageArray.length)/imageArray.length*100} />
      </ContentWidth>
          
      </div>
  </div>
  </section>