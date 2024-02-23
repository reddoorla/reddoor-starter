<script lang='ts'>
import FullWidthImage from "$lib/components/FullWidthImage.svelte";
import FullWidthImageSlider from "$lib/components/FullWidthImageSlider.svelte"
import ContentBox from "$lib/components/ContentBox.svelte"
import Spacer from "$lib/components/Spacer.svelte";
import playIcon from "$lib/assets/icons/play-button.svg"
</script>
<!--Masthead #1-->
<FullWidthImage>
    <div class="w-80 md:w-[560px] mx-auto mt-20 md:mt-[125px]">
        <ContentBox 
            paragraphText=""
            buttonText=""
            linkText=""
        />
    </div>

    <img src={playIcon} alt="play" class="w-[52.5px] h-[52.5px] mt-0 md:mt-16 mx-auto" />
</FullWidthImage>

<Spacer color="#424B5A" />
<!--Masthead #2-->

<FullWidthImageSlider>
</FullWidthImageSlider>

<Spacer color="#424B5A" />