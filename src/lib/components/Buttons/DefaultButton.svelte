<script lang="ts">
    export let text = "BUTTON";
    export let click = ()=>{};
    export let twProps = ""
    export let filled = true;
</script>


<button on:click={click} 
        class="{filled ?
         "bg-dark bg-opacity-80 hover:bg-opacity-100 active:bg-black  text-white" 
         : 
         "hover:bg-dark text-dark hover:text-white active:bg-black " 
         } border-2 border-dark text-center mb-5 sm:mb-0 uppercase cursor-pointer {twProps}">
        {text}
</button>