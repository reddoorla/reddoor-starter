<script lang="ts">
  // Progressive-loading wrapper around @zerodevx/svelte-img: the image renders
  // blurred (`.progressive-img` in app.css) and sharpens once the underlying
  // <img> finishes — or fails — loading. `src` must be a vite-imagetools
  // `?as=run` import; SvelteImg renders nothing for plain string URLs.
  import SvelteImg from "@zerodevx/svelte-img";

  type Props = {
    src: unknown; // ?as=run import
    class?: string;
    [key: string]: unknown;
  };

  let { src, class: className = "", ...rest }: Props = $props();

  let imgEl: HTMLImageElement | undefined = $state();
  let loaded = $state(false);

  // A cached image can be `complete` before this effect attaches listeners —
  // its load event already fired, so waiting for one would leave the blur
  // stuck. `naturalWidth > 0` excludes the broken-image case, which still
  // fires `error` below.
  $effect(() => {
    const el = imgEl;
    if (!el) return;
    if (el.complete && el.naturalWidth > 0) {
      loaded = true;
      return;
    }
    const onDone = () => (loaded = true);
    el.addEventListener("load", onDone);
    el.addEventListener("error", onDone);
    return () => {
      el.removeEventListener("load", onDone);
      el.removeEventListener("error", onDone);
    };
  });
</script>

<SvelteImg
  {src}
  {...rest}
  bind:ref={imgEl}
  class={`progressive-img${loaded ? " progressive-img--loaded" : ""}${className ? " " + className : ""}`}
/>
