<script lang='ts'>
    import placeholderIcon from "../assets/icons/logo.svg"
    import linkArrow from "../assets/icons/wireframe-link-arrow-right.svg"


export let icon = placeholderIcon;
export let iconAltText = "logo"
export let labelText = ""
export let titleText = ""
export let titleTag = "h3"
export let subtitleText = ""
export let paragraphText = ""
export let buttonText = ""
export let linkText=""

export let backgroundColor="transparent"
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

let isLinkArrowActive=false;
</script>

<div class="w-full flex flex-col p-8 justify-{justify} text-{float}"
     style="background-color: {backgroundColor}"
>
    {#if icon}
        <img src={icon} alt={iconAltText} class="w-[70px] h-[70px] mb-7 {horizontalFloatMargin}"/>
    {/if}
    {#if labelText}
        <h6 class="mb-7">{labelText}</h6>
    {/if}
    {#if titleText}
        {#if titleTag==="h1"}
            <h1 class="mb-7">{titleText}</h1>
        {/if}
        {#if titleTag==="h2"}
            <h2 class="mb-7">{titleText}</h2>
        {/if}
        {#if titleTag==="h3"}
            <h3 class="mb-7">{titleText}</h3>
        {/if}
        {#if titleTag==="h4"}
            <h4 class="mb-7">{titleText}</h4>
        {/if}
        {#if titleTag==="h5"}
            <h5 class="mb-7">{titleText}</h5>
        {/if}
        
    {/if}
    {#if subtitleText}
        <h6 class="mb-7">{subtitleText}</h6>
    {/if}
    {#if paragraphText}
        <p class="mb-7 max-w-full">{paragraphText}</p>
    {/if}
    <div class="w-full flex flex-nowrap text-nowrap flex-col sm:flex-row align-middle justify-center sm:justify-{justify}">
        {#if buttonText}
            <button class="bg-dark text-center text-white mb-5 sm:mb-0 uppercase">{buttonText}</button>
        {/if}
        {#if linkText}
                <a 
                    on:mouseenter={()=>isLinkArrowActive=true} 
                    on:mouseleave={()=>isLinkArrowActive=false} 
                    class="flex flex-row align-middle no-underline justify-center sm:justify-{justify}" 
                    href="#">
                        <span class="h-5 uppercase no-underline">{linkText}</span>
                        <img src={linkArrow} alt="link arrow" class="h-5 w-5 -mt-[5px] ml-[10px] transition-transform duration-300 {isLinkArrowActive ? "translate-x-2":""}">
                </a>

        {/if}
    </div>


</div>