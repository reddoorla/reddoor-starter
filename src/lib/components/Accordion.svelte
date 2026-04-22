<script lang="ts">
  import { slide } from "svelte/transition";
  import { ChevronRight } from "@lucide/svelte";
  import { SvelteSet } from "svelte/reactivity";

  interface AccordionItem {
    label: string;
    content: string;
  }

  interface Props {
    items?: AccordionItem[];
    allowMultiple?: boolean;
    class?: string;
  }

  let {
    items = [],
    allowMultiple = true,
    class: passedClasses = "",
  }: Props = $props();

  const openIndexes = new SvelteSet<number>();

  function toggle(i: number) {
    if (openIndexes.has(i)) {
      openIndexes.delete(i);
    } else {
      if (!allowMultiple) openIndexes.clear();
      openIndexes.add(i);
    }
  }
</script>

<div class="w-full flex flex-col border-light border-b-2 {passedClasses}">
  {#each items as item, i (i)}
    {@const isOpen = openIndexes.has(i)}
    <button
      type="button"
      class="w-full border-t-2 border-light cursor-pointer text-left"
      aria-expanded={isOpen}
      onclick={() => toggle(i)}
    >
      <div class="h-20 p-8 w-full flex flex-row justify-between items-center">
        <p>{item.label}</p>
        <ChevronRight
          class="transition-transform duration-300 ease-in-out opacity-80 {isOpen
            ? 'rotate-90'
            : ''}"
          size={16}
        />
      </div>
      {#if isOpen}
        <div transition:slide={{ duration: 500 }}>
          <p class="p-8 pt-0">{item.content}</p>
        </div>
      {/if}
    </button>
  {/each}
</div>
