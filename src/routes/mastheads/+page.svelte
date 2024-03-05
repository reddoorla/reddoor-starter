<script lang='ts'>
import FullWidthImage from "$lib/components/FullWidthImage.svelte";
import FullWidthImageSlider from "$lib/components/FullWidthImageSlider.svelte"
import ContentBox from "$lib/components/ContentBox.svelte"
import Spacer from "$lib/components/Spacer.svelte";
import playIcon from "$lib/assets/icons/play-button.svg"
</script>

<svelte:head>
    <title>Mastheads | Reddoor Wireframer</title>
</svelte:head>

<!--Masthead #1-->
<FullWidthImage>
    <div class="w-full max-w-80 sm:w-[620px] sm:max-w-full mx-auto mt-20 sm:mt-[125px]">
        <ContentBox 
            labelText="Designing Tomorrow's Success Today"
            titleText="Craft Seamless Experiences with Wireframes"
        />
    </div>

    <img src={playIcon} alt="play" class="w-[52.5px] h-[52.5px] mt-0 md:mt-16 mx-auto" />
</FullWidthImage>

<Spacer color="#424B5A" />
<!--Masthead #4-->

<FullWidthImageSlider>
    <div class="w-full max-w-screen-xl h-full flex flex-col justify-end">
        <div class="w-80 sm:w-[620px] h-fit mx-auto sm:ml-0  mb-28">
            <ContentBox
                labelText="Designing Tomorrow's Success Today"
                titleText="Craft Seamless Experiences with Wireframes"
                buttonText = "BUTTON"
                linkText = "LEARN MORE"
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
    <div class="w-full max-w-screen-xl h-full flex flex-col justify-center">
        <div class="w-80 sm:w-[620px] mx-auto md:ml-0 h-fit">
            <ContentBox 
             icon=""
             labelText="Designing Tomorrow's Success Today"
             titleText="Craft Seamless Experiences with Wireframes"
             paragraphText="Unleash the power of intuitive design with our comprehensive wireframing solutions. Elevate your projects through meticulous planning and user-centric layouts. Join us on a journey of innovation and precision in every pixel. Transform your ideas into extraordinary digital experiences."
             buttonText="BUTTON"
             linkText="LEARN MORE"
             float="left"
            />
        </div>
    </div>

</FullWidthImage>

<Spacer color="#424B5A" />

<!--Masthead #3-->

<FullWidthImage placeholderSide="left">
    <div class="w-full max-w-screen-xl h-full flex flex-col justify-center">
        <div class="w-80 sm:w-[620px] mx-auto md:ml-0 lg:mr-0 lg:ml-auto h-fit">
            <ContentBox 
             icon=""
             labelText="Designing Tomorrow's Success Today"
             titleText="Craft Seamless Experiences with Wireframes"
             paragraphText="Unleash the power of intuitive design with our comprehensive wireframing solutions. Elevate your projects through meticulous planning and user-centric layouts. Join us on a journey of innovation and precision in every pixel. Transform your ideas into extraordinary digital experiences."
             buttonText="BUTTON"
             linkText="LEARN MORE"
             float="left"
            />
        </div>
    </div>

</FullWidthImage>