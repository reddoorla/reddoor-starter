// Document links as the hrefs the routes-free client cannot fill.
//
// Every client is routes-free ($lib/prismicio), so the API sends a document
// link with no `url`. `PrismicLink` and `PrismicRichText` read `url` alone and
// take no resolver, so a CMS link to a page rendered an `<a>` with no href
// (roalson-interests#10). The loaders run every fetched document through
// `withDocumentLinks` before a slice sees it.
import { asLink, type LinkField, type LinkResolverFunction } from "@prismicio/client";

/** A fetched document with `url` filled on every document link inside it —
 *  fields, groups, slices, rich-text spans — through `linkResolver`, as
 *  Prismic's routes resolver would if the client had one. A broken link (its
 *  target unpublished or deleted) is left without one: that page would 404.
 *  So is a link the resolver has no route for. The input is not mutated. */
export function withDocumentLinks<T>(value: T, linkResolver: LinkResolverFunction): T {
  if (Array.isArray(value)) return value.map((v) => withDocumentLinks(v, linkResolver)) as T;
  if (!value || typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) out[k] = withDocumentLinks(v, linkResolver);
  if (out.link_type === "Document" && !out.isBroken && !out.url) {
    const href = asLink(out as unknown as LinkField, { linkResolver });
    if (typeof href === "string" && href.trim() !== "") out.url = href;
  }
  return out as T;
}
