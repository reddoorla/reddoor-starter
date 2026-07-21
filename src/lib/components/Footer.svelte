<script lang="ts">
  type FooterText = { text: string; href?: string };
  type FooterImage = {
    image: { url: string; maxWidth?: string };
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
</script>

<footer class="w-full px-8 py-12 mt-auto">
  {#if columns?.length}
    <div class="flex flex-col sm:flex-row justify-between gap-8">
      {#each columns as col, colIndex (colIndex)}
        <div class="flex flex-col gap-2">
          {#each col.items as item, itemIndex (itemIndex)}
            {#if isImage(item)}
              {#if item.href}
                <a href={item.href}>
                  <img
                    src={item.image.url}
                    alt=""
                    style={item.image.maxWidth
                      ? `max-width:${item.image.maxWidth}`
                      : undefined}
                  />
                </a>
              {:else}
                <img
                  src={item.image.url}
                  alt=""
                  style={item.image.maxWidth
                    ? `max-width:${item.image.maxWidth}`
                    : undefined}
                />
              {/if}
            {:else if item.href}
              <a href={item.href}>{item.text}</a>
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
