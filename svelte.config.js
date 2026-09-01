import { readFileSync } from "node:fs";
import adapter from "@sveltejs/adapter-netlify";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const slicemachine = JSON.parse(
  readFileSync(new URL("./slicemachine.config.json", import.meta.url), "utf-8"),
);
const isPlaceholderRepo =
  (process.env.VITE_PRISMIC_ENVIRONMENT || slicemachine.repositoryName) ===
  "your-prismic-repo-name";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    warningFilter: (warning) =>
      warning.code !== "element_invalid_self_closing_tag",
  },
  kit: {
    adapter: adapter(),
    // Until a clone is wired to a real Prismic repo, every Prismic-backed
    // route returns 404 during prerender. Tolerate that on the placeholder
    // so `pnpm build` (and Netlify CI) succeed; real sites still fail loudly
    // because `repositoryName` no longer matches the sentinel.
    prerender: {
      // Prerendered endpoints (robots.txt, sitemap.xml) bake `url.origin` into
      // their output at build time; without this it would be SvelteKit's
      // "http://sveltekit-prerender" placeholder. Netlify sets URL to the
      // site's production origin during builds. Local builds keep the
      // placeholder, which only shows up in build/ output, never in dev.
      ...(process.env.URL ? { origin: process.env.URL } : {}),
      handleHttpError: ({ path, status, message, referrer }) => {
        if (isPlaceholderRepo && status === 404) {
          return;
        }
        throw new Error(
          `${status} ${path}${referrer ? ` (linked from ${referrer})` : ""}: ${message}`,
        );
      },
      // `/dev/*` tooling routes may carry in-page anchors that target ids on
      // fixture content, not on this site's pages. Those routes are
      // robots-excluded, so a missing id is tolerated only when every referrer
      // is a dev route — content routes keep failing loudly on a genuine
      // broken anchor.
      handleMissingId: ({ referrers, message }) => {
        if (referrers.every((r) => r.startsWith("/dev/"))) return;
        throw new Error(message);
      },
      // A malformed URL in CMS-pasted rich text (e.g. a school name typed into a
      // hyperlink) is unparseable — it can never be a real route to crawl, and
      // one editor's typo must not fail the whole build. Warn (so it surfaces
      // for cleanup) and keep prerendering. Unlike handleHttpError's fail-loud
      // 404 policy, an invalid URL has no valid interpretation to preserve.
      handleInvalidUrl: ({ href, referrer, message }) => {
        console.warn(
          `[prerender] skipped invalid URL ${JSON.stringify(href)}` +
            `${referrer ? ` (linked from ${referrer})` : ""} — fix the CMS link` +
            `${message ? ` [${message}]` : ""}`,
        );
      },
    },
    alias: {
      $components: "src/lib/components",
      "$components/*": "src/lib/components/*",
      $utils: "src/lib/utils",
      "$utils/*": "src/lib/utils/*",
      $stores: "src/lib/stores",
      "$stores/*": "src/lib/stores/*",
      $assets: "src/lib/assets",
      "$assets/*": "src/lib/assets/*",
    },
    // Baseline CSP for Prismic + Vimeo + Turnstile. EXTEND PER PROJECT — every
    // new host (web fonts, YouTube, a donation platform, analytics, Maps) must
    // be added to the relevant directive or the browser blocks it silently.
    // SvelteKit adds nonces/hashes for the inline scripts and styles it emits.
    csp: {
      mode: "auto",
      // Violations POST to /api/csp-report. To stage a stricter policy without
      // blocking, copy `directives` below into a sibling `reportOnly: { ... }`
      // block — SvelteKit will then emit a Content-Security-Policy-Report-Only
      // header alongside the enforced one.
      directives: {
        "default-src": ["self"],
        "script-src": [
          "self",
          "https://static.cdn.prismic.io",
          "https://player.vimeo.com",
          // Cloudflare Turnstile contact-form widget (enable via PUBLIC_TURNSTILE_SITE_KEY).
          "https://challenges.cloudflare.com",
        ],
        // Google Fonts stylesheet host (paired with fonts.gstatic.com under
        // font-src). Self-hosted fonts need nothing extra.
        "style-src": ["self", "unsafe-inline", "https://fonts.googleapis.com"],
        "img-src": [
          "self",
          "data:",
          "https://images.prismic.io",
          "https://*.prismic.io",
        ],
        // Prismic hosts non-image media (e.g. .mp4 assets) on
        // <repo>.cdn.prismic.io — first-party content, same origin family as
        // images.prismic.io already allowed under img-src.
        "media-src": ["self", "https://*.vimeocdn.com", "https://*.prismic.io"],
        "frame-src": [
          "self",
          "https://player.vimeo.com",
          // Cloudflare Turnstile renders its challenge in an iframe from this host.
          "https://challenges.cloudflare.com",
        ],
        "connect-src": [
          "self",
          "https://*.prismic.io",
          "https://static.cdn.prismic.io",
        ],
        "font-src": ["self", "data:", "https://fonts.gstatic.com"],
        "base-uri": ["self"],
        "form-action": ["self"],
        "frame-ancestors": ["self"],
        "report-uri": ["/api/csp-report"],
      },
    },
  },
  preprocess: vitePreprocess(),
};

export default config;
