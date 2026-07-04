// Site-wide SEO configuration + helpers. `/new-site` should update SITE_NAME
// (sites with a social presence also fill in organizationJsonLd in the layout).

import { imgix, isPrismicImageUrl } from "$lib/utils/image";

export const SITE_NAME = "Reddoor";
export const SITE_LOCALE = "en_US";

/** Fallback meta description when a page has none. Empty = omit the tag —
 *  an absent description beats a generic one repeated on every result, since
 *  search engines then synthesize a snippet from the page copy instead. */
export const DEFAULT_DESCRIPTION = "";

/** Social-card canvas. Prismic og images are cropped to this exact box so a
 *  card never ships a multi-MB original, and width/height can be advertised. */
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/**
 * Serialize structured data for a JSON-LD script tag rendered with {@html}.
 * `<` is escaped to the < JSON escape so CMS-authored strings can never
 * close the script tag and inject markup (the `</script><script>` break-out).
 */
export function jsonLdScript(data: unknown): string {
  const json = JSON.stringify(data).replaceAll("<", "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

/**
 * Canonical URL for a page: the production origin + path with the optional
 * `/preview` route segment removed and the query string / hash dropped (so
 * `?utm_*`-tagged and previewed URLs both canonicalize to the real page).
 * The origin is whatever `page.url` carries — prerender-safe because the
 * starter sets `kit.prerender.origin` from Netlify's `URL` at build time.
 */
export function canonicalUrl(url: URL | string): string {
  const u = typeof url === "string" ? new URL(url) : url;
  let path = u.pathname;
  if (path === "/preview" || path === "/preview/") {
    path = "/";
  } else if (path.startsWith("/preview/")) {
    path = path.slice("/preview".length);
  }
  return `${u.origin}${path}`;
}

export interface ResolvedOgImage {
  url: string;
  width?: number;
  height?: number;
}

/**
 * Resolve an og:image to an absolute URL. Prismic assets are imgix-cropped to
 * the card canvas (so width/height are known and advertised); other absolute
 * URLs pass through; root-relative static assets are made absolute against the
 * page origin. Returns undefined when there is no image.
 */
export function resolveOgImage(
  image: string | null | undefined,
  origin: string,
): ResolvedOgImage | undefined {
  if (!image) return undefined;
  // Alias the string before the type-guard call: `isPrismicImageUrl`'s
  // `url is string` predicate would otherwise narrow `image` to `never` in
  // the fallback branch (it's already string). `src` is not narrowed.
  const src = image;
  if (isPrismicImageUrl(image)) {
    return {
      url: imgix(image, {
        w: OG_IMAGE_WIDTH,
        h: OG_IMAGE_HEIGHT,
        fit: "crop",
      }),
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
    };
  }
  try {
    // Already absolute (http/https or any parseable URL).
    return { url: new URL(src).toString() };
  } catch {
    // Root-relative static asset, e.g. /og-default.png.
    return { url: `${origin}${src.startsWith("/") ? "" : "/"}${src}` };
  }
}

export interface OrganizationInput {
  name: string;
  url: string;
  /** e.g. "LocalBusiness", "MedicalBusiness", "HomeAndConstructionBusiness".
   *  Pick the most specific type that fits: https://schema.org/Organization */
  type?: string;
  logo?: string;
  telephone?: string;
  /** Social/profile URLs (Instagram, LinkedIn, ...) for the sameAs field. */
  sameAs?: string[];
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry?: string;
  };
}

/** Minimal Organization structured data. Only provided fields are emitted. */
export function organizationJsonLd(input: OrganizationInput): object {
  const { type, address, sameAs, ...rest } = input;
  return {
    "@context": "https://schema.org",
    "@type": type ?? "Organization",
    ...Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v != null && v !== ""),
    ),
    ...(sameAs && sameAs.length > 0 ? { sameAs } : {}),
    ...(address
      ? {
          address: {
            "@type": "PostalAddress",
            addressCountry: "US",
            ...address,
          },
        }
      : {}),
  };
}
