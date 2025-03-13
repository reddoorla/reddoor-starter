<!-- @migration-task Error while migrating Svelte code: $$props is used together with named props in a way that cannot be automatically migrated. -->
<script lang="ts">
    import placeholder from "$lib/assets/images/image_placeholder.svg";
    import Img from "@zerodevx/svelte-img"


    let { src = placeholder, alt = "placeholder", label = "", class:passedClasses='' } = $props();

    
    </script>
    
    <div class="w-full relative {passedClasses}">
      <div class="w-full aspect-[4/3] {src===placeholder ? "border-light border-2 bg-light bg-opacity-25":""} rounded-sm flex items-center justify-center relative">
        {#if typeof src === "object"}
          <Img 
            {src}
            {alt} 
            class="z-10 object-cover w-full h-full"
            loading="lazy"
            decoding="async"
          />

        {:else}
          <img 
            {src}
            {alt} 
            class="z-10 object-cover w-full h-full"
            loading="lazy"
            decoding="async"
          />
        {/if}
        <h6 class="absolute bottom-4 z-20">{label}</h6>
      </div>
    </div>
 