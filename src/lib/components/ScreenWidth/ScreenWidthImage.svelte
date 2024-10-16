<script lang='ts'>
	import placeholder from "../../assets/images/background_placeholder.svg";
	import ContentWidth from "../ContentWidth/ContentWidth.svelte";
	
	export let src = placeholder;
	export let altText = "background image"
	export let placeholderSide = "right"
	export let vimeoId = ""
	export let darken = false;
	
	let viewportHeight:number;
	let viewportWidth:number;
	
	</script>
	
	<svelte:window bind:innerHeight={viewportHeight} bind:innerWidth={viewportWidth} />
	
	<section>
		<div class="right-0 left-0 overflow-hidden max-h-screen aspect-video relative {viewportHeight * 16 > viewportWidth * 9 ? 'h-screen min-w-full' : 'w-screen min-h-full'}">
			
				<img src={src} alt={altText} class="absolute bottom-0 {placeholderSide}-0 h-full w-full object-cover {src===placeholder ? "lg:w-[45%] md:h-auto" : ""} -z-10"/>
			
			{#if vimeoId}
				
					<iframe 
					title="background video" 
					src={`https://player.vimeo.com/video/${vimeoId}?background=1`}
					class="aspect-video absolute {viewportHeight * 16 > viewportWidth * 9 ? 'h-screen min-w-full' : 'w-screen min-h-full'} contrast-[1.15] -z-10"
					frameborder="0"
					allowfullscreen
					
				  ></iframe>
			{/if}
			
			{#if darken}
			<div class="bg-black opacity-20 pointer-events-none absolute w-full h-full top-0 left-0 -z-10" />
			{/if}
			<div class="w-screen h-full">
			<ContentWidth class='{$$props.class || 'flex items-center justify-center'} h-full'>
				<slot />
			</ContentWidth>
			</div>
		</div>
	</section>