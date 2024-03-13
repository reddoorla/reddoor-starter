<script lang="ts">
    export let text = "BUTTON";
    export let click = ()=>{};
</script>

<button on:click={click} class="bg-dark text-center text-white mb-5 sm:mb-0 uppercase">{text}</button>