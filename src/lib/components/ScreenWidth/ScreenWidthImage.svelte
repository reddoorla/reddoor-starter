<script lang='ts'>
import placeholder from "../../assets/images/placeholder.svg";

export let image = placeholder;
export let altText = "background image"
export let placeholderSide = "right"
</script>

<section>
	<div class="right-0 left-0"></div>
	<div  class="h-[160vw] sm:h-[90vw] xl:h-[60vw] md:max-h-screen relative w-full">
		<img src={image} alt={altText} class="absolute bottom-0 {placeholderSide}-0 h-full w-full object-cover {image===placeholder ? "lg:w-[45%] md:h-auto" : ""} -z-10"/>
        <div class='w-full h-full max-w-screen-xl mx-auto p-[4%] xl:p-0'>
			<slot />
		</div>
	</div>
</section>