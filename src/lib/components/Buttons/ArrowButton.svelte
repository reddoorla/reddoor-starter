<script>
    import linkArrow from "$lib/assets/icons/wireframe-link-arrow-right.svg"
    export let text = "";
    export let href ="#"

    let isLinkArrowActive=false;

</script>

<a 
on:mouseenter={()=>isLinkArrowActive=true} 
on:mouseleave={()=>isLinkArrowActive=false} 
class="flex flex-row align-middle no-underline justify-center" 
{href}>
    <span class="h-5 uppercase no-underline">{text}</span>
    <img src={linkArrow} alt="link arrow" class="h-5 w-5 -mt-[5px] ml-[10px] transition-transform duration-300 {isLinkArrowActive ? "translate-x-2":""}">
</a>