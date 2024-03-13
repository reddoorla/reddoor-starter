<script lang="ts">
    export let text = "BUTTON";
    export let click = ()=>{};
    export let twProps = "";
</script>

<button on:click={click} class="hover:bg-dark text-dark hover:text-white active:bg-black border-2 border-dark text-center mb-5 sm:mb-0 uppercase {twProps}">{text}</button>