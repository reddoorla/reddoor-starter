<script lang="ts">

    
    let { socials = [{
        platform: "",
        href:""
                        }] } = $props();

    
</script>

        <div class="h-full flex flex-row items center justify-center transition-opacity">
            {#each socials as social }
               
                <a href={social.href} class="mx-6 w-6 h-6 hover:opacity-75 transition-all bump">
                    {#if social.platform==='facebook'}
                    <i class="fa-brands fa-facebook fa-2xl invert" ></i>
                {:else if social.platform=='twitter'}
                <i class="fa-brands fa-x-twitter fa-2xl invert" ></i>
                {:else if social.platform=='redit'}
                <i class="fa-brands fa-redit fa-2xl invert" ></i>
                {:else if social.platform=='instagram'}
                    <i class="fa-brands fa-instagram fa-2xl invert" ></i>
                {/if}

                </a>
               
            {/each}
        </div>

