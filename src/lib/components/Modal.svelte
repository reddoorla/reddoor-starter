<script lang='ts'>
    import { fade, fly } from "svelte/transition";
    import type { Snippet } from "svelte";

    interface ModalProps {
        open: boolean;
        onclose?: () => void;
        class?: string;
        children?: Snippet;
    }

    let { open = $bindable(false), onclose, class: passedClasses = '', children }: ModalProps = $props();

    function close() {
        open = false;
        onclose?.();
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") close();
    }

    function handleBackdropClick(e: MouseEvent) {
        if (e.target === e.currentTarget) close();
    }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
    <div
        role="button"
        tabindex="-1"
        transition:fade={{ duration: 200 }}
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 cursor-default"
        onclick={handleBackdropClick}
        onkeydown={handleKeydown}
    >
        <div
            transition:fly={{ y: 20, duration: 300 }}
            role="dialog"
            aria-modal="true"
            class="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto {passedClasses}"
        >
            <button
                onclick={close}
                class="absolute top-4 right-4 text-dark/60 hover:text-dark transition cursor-pointer"
                aria-label="Close"
            >
                <i class="fa-solid fa-xmark text-xl"></i>
            </button>
            <div class="p-8">
                {@render children?.()}
            </div>
        </div>
    </div>
{/if}
