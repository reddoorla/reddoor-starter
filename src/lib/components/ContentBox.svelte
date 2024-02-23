<script lang='ts'>
    import placeholderIcon from "../assets/icons/logo.svg"


export let icon = placeholderIcon;
export let iconAltText = "logo"
export let labelText = "Designing Tomorrow's Success Today"
export let titleText = "Craft Seamless Experiences with Wireframes"
export let paragraphText = "Unleash the power of intuitive design with our comprehensive wireframing solutions. Elevate your projects through meticulous planning and user-centric layouts. Join us on a journey of innovation and precision in every pixel. Transform your ideas into extraordinary digital experiences."
export let buttonText = "BUTTON"
export let linkText="Learn More"

export let float = "center"
let justify=float;
if(float==="left")
    justify="start";
if(float==="right")
    justify="end"

let horizontalFloatMargin = "mx-auto"
if(float==="left")
    horizontalFloatMargin="ml-0 mr-auto";
if(float==="right")
    horizontalFloatMargin="ml-auto mr-0"
</script>
<!--TODO: force tailwind to load justify classes in configs-->
<div class="justify-center justify-start justify-end"></div>

<div class="w-full flex flex-col justify-{justify} text-{float}">
    {#if icon}
        <img src={icon} alt={iconAltText} class="w-[70px] h-[70px] mb-7 {horizontalFloatMargin}"/>
    {/if}
    {#if labelText}
        <h6 class="mb-7">{labelText}</h6>
    {/if}
    {#if titleText}
        <h1 class="mb-7">{titleText}</h1>
    {/if}
    {#if paragraphText}
        <p class="mb-7">{paragraphText}</p>
    {/if}
    <div class="w-full flex flex-row align-middle justify-{justify}">
        {#if buttonText}
            <button class="bg-dark text-center text-white">{buttonText}</button>
        {/if}
        {#if linkText}
            <a class="text-center" href="#">{linkText}</a>
        {/if}
    </div>


</div>