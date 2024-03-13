<script lang='ts'>
import placeholder from "../../assets/images/background_placeholder.svg";
import ContentWidth from "../ContentWidth/ContentWidth.svelte";

export let image = placeholder;
export let altText = "background image"
export let placeholderSide = "right"
</script>

<section>
	<div class="right-0 left-0"></div>
	<div  class="h-[160vw] sm:h-[90vw] xl:h-[60vw] md:max-h-screen relative w-full">
		<img src={image} alt={altText} class="absolute bottom-0 {placeholderSide}-0 h-full w-full object-cover {image===placeholder ? "lg:w-[45%] md:h-auto" : ""} -z-10"/>
        <ContentWidth twProps='w-full h-full'>
			<slot />
		</ContentWidth>
	</div>
</section>