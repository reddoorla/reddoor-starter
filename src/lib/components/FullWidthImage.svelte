<script lang='ts'>
import placeholder from "../assets/images/placeholder.svg";

export let image = placeholder;
export let altText = "background image"
</script>

<section>
	<div  class="h-[125vw] sm:h-[70vw] lg:h-[55vw] relative w-full">
		<img src={image} alt={altText} class="absolute bottom-0 right-0 h-full w-full object-cover {image===placeholder ? "lg:w-1/2 md:h-auto" : ""} -z-10"/>
        <slot />
	</div>
</section>