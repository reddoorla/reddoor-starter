import adapter from "@sveltejs/adapter-netlify";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    warningFilter: (warning) =>
      warning.code !== "element_invalid_self_closing_tag",
  },
  kit: {
    adapter: adapter(),
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
    // Baseline CSP for Prismic + Vimeo. Extend per project — any new CDN or
    // analytics host must be added to the relevant directive. SvelteKit
    // automatically adds nonces/hashes for inline scripts and styles it emits.
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
        ],
        "style-src": ["self", "unsafe-inline"],
        "img-src": [
          "self",
          "data:",
          "https://images.prismic.io",
          "https://*.prismic.io",
        ],
        "media-src": ["self", "https://*.vimeocdn.com"],
        "frame-src": ["self", "https://player.vimeo.com"],
        "connect-src": [
          "self",
          "https://*.prismic.io",
          "https://static.cdn.prismic.io",
        ],
        "font-src": ["self", "data:"],
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
