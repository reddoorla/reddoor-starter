import type * as prismic from "@prismicio/client";

/** The structural cell shape shared by every catalog container slice's
 * generated cell-item type (BluxSection/Grid/Gallery/... CellsItem, and their
 * SubgridItem). BluxCell.svelte renders any of them; a container casts its
 * generated `cells` items to this at the render boundary. `subgrid` is the one
 * nested level (leaf cells only); it is absent on subgrid items themselves. */
export type BluxCellData = {
  kind: prismic.SelectField<string> | null;
  title: prismic.RichTextField;
  body: prismic.RichTextField;
  media: prismic.ImageField;
  media_ratio: prismic.KeyTextField;
  embed_html: prismic.KeyTextField;
  link: prismic.LinkField;
  link_label: prismic.KeyTextField;
  subgrid?: BluxCellData[];
};
