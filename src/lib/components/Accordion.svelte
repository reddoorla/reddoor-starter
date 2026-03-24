<script lang='ts'>
    import { slide } from 'svelte/transition';
  
    const LOREM = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat m dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor inc."
  
  let { labels = ["Is this thing on?", "It could be why don't you check"], contents = [LOREM, LOREM] } = $props();

    // svelte-ignore state_referenced_locally
    let activeAccordions: boolean[] = $state(labels.map(() => false));
  </script>
  
  <div class="w-full flex flex-col border-light border-b-2 cursor-pointer">
    {#each labels as label, i}
      <button class="w-full border-t-2 border-light cursor-pointer" aria-expanded={activeAccordions[i]} onclick={() => activeAccordions[i] = !activeAccordions[i]}>
        <div class="h-20 p-8 w-full flex flex-row justify-between items-center">
          <p class="text-left">{label}</p>
          <i class="fa-solid fa-chevron-right transition-transform duration-300 ease-in-out text-sm opacity-80 hover:opacity-100 {activeAccordions[i] ? 'rotate-90' : ''}"></i>
        </div>
        {#if activeAccordions[i]}
          <div transition:slide="{{ duration: 500 }}">
            <p class="text-left p-8 pt-0">{contents[i]}</p>
          </div>
        {/if}
      </button>
    {/each}
  </div>