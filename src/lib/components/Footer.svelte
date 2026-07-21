<script lang="ts">
  type FooterText = { text: string; href?: string };
  type FooterImage = {
    image: { url: string; maxWidth?: string; alt?: string };
    href?: string;
  };
  type FooterItem = FooterText | FooterImage;

  interface Props {
    columns?: { items: FooterItem[] }[];
  }

  // Placeholder styling — restyle per project. Pass `columns` (the shape the
  // Blux catalog pipeline emits in site-config.json) to render leasing-contact
  // columns; omit it for the hardcoded fleet default.
  let { columns }: Props = $props();

  const isImage = (i: FooterItem): i is FooterImage => "image" in i;

  // Only http(s) links open in a new tab; tel:/mailto: stay same-tab (repo
  // idiom, ProductDetail.svelte). Consistent shape — Svelte drops undefined
  // attributes — so target/rel can't drift between the text- and image-link
  // branches.
  const isExternal = (href: string) => /^https?:\/\//i.test(href);
  const linkAttrs = (href: string) => ({
    href,
    target: isExternal(href) ? "_blank" : undefined,
    rel: isExternal(href) ? "noopener noreferrer" : undefined,
  });
</script>

{#snippet logo(img: FooterImage["image"])}
  <img
    src={img.url}
    alt={img.alt ?? ""}
    style={img.maxWidth ? `max-width:${img.maxWidth}` : undefined}
  />
{/snippet}

<footer class="w-full px-8 py-12 mt-auto">
  {#if columns?.length}
    <div class="flex flex-col sm:flex-row justify-between gap-8">
      {#each columns as col, colIndex (colIndex)}
        <div class="flex flex-col gap-2">
          {#each col.items as item, itemIndex (itemIndex)}
            {#if isImage(item)}
              {#if item.href}
                <a {...linkAttrs(item.href)}>{@render logo(item.image)}</a>
              {:else}
                {@render logo(item.image)}
              {/if}
            {:else if item.href}
              <a {...linkAttrs(item.href)}>{item.text}</a>
            {:else}
              <p>{item.text}</p>
            {/if}
          {/each}
        </div>
      {/each}
    </div>
  {:else}
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm opacity-60">
        &copy; {new Date().getFullYear()} Company Name
      </p>
    </div>
  {/if}
</footer>
