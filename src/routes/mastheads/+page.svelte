<script lang='ts'>
import FullWidthImage from "$lib/components/FullWidthImage.svelte";
import FullWidthImageSlider from "$lib/components/FullWidthImageSlider.svelte"
import ContentBox from "$lib/components/ContentBox.svelte"
import Spacer from "$lib/components/Spacer.svelte";
import playIcon from "$lib/assets/icons/play-button.svg"
</script>
<!--Masthead #1-->
<FullWidthImage>
    <div class="w-full max-w-80 sm:w-[560px] sm:max-w-full mx-auto mt-20 sm:mt-[125px]">
        <ContentBox 
            paragraphText=""
            buttonText=""
            linkText=""
        />
    </div>

    <img src={playIcon} alt="play" class="w-[52.5px] h-[52.5px] mt-0 md:mt-16 mx-auto" />
</FullWidthImage>

<Spacer color="#424B5A" />
<!--Masthead #4-->

<FullWidthImageSlider>
    <div class="w-full max-w-[1280px] h-full flex flex-col justify-end">
        <div class="w-80 sm:w-[560px] h-fit mx-auto sm:ml-0  mb-28">
            <ContentBox
                paragraphText=""
                icon=""
                float="left"
            />
        </div>
    </div>
</FullWidthImageSlider>

<Spacer color="#424B5A" />

<!--TODO: center content box on small even if content is left aligned-->
<!--Masthead #2-->
<FullWidthImage>
    <div class="w-full max-w-[1280px] h-full flex flex-col justify-center">
        <div class="w-80 sm:w-[560px] mx-auto md:ml-0 h-fit">
            <ContentBox 
             icon=""
             float="left"
            />
        </div>
    </div>

</FullWidthImage>

<Spacer color="#424B5A" />

<FullWidthImage placeholderSide="left">
    <div class="w-full max-w-[1280px] h-full flex flex-col justify-center">
        <div class="w-80 sm:w-[560px] mx-auto md:ml-0 lg:mr-0 lg:ml-auto h-fit">
            <ContentBox 
             icon=""
             float="left"
            />
        </div>
    </div>

</FullWidthImage>