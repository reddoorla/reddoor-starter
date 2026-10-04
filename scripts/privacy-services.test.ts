import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { collectBuildServices } from "./privacy-services.ts";

let root: string;
const put = (rel: string, text: string) => {
  mkdirSync(dirname(join(root, rel)), { recursive: true });
  writeFileSync(join(root, rel), text);
};

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "privacy-"));
  put(
    "svelte.config.js",
    `import adapter from "@sveltejs/adapter-netlify";
export default { kit: { adapter: adapter(), csp: { directives: { "script-src": ["self", "https://player.vimeo.com"] } } } };`,
  );
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("collectBuildServices", () => {
  it("reads the client hook for GA4", () => {
    put(
      "src/hooks.client.ts",
      `initAnalytics({ measurementId: "G-ABCDEFGHIJ", productionHost: "x.com" });`,
    );
    expect(collectBuildServices(root).ga4).toBe(true);
  });

  it("does not count tests, type declarations, dev fixtures or the privacy page itself", () => {
    const hook = `initAnalytics({ measurementId: "G-ABCDEFGHIJ" }); "https://player.vimeo.com"; createIngestAction(`;
    put("src/hooks.client.test.ts", hook);
    put("src/lib/a.spec.ts", hook);
    put("src/global.d.ts", hook);
    put("src/routes/dev/x/+page.svelte", hook);
    put("src/routes/privacy/+page.svelte", hook);
    put("src/lib/privacy/services.ts", hook);
    expect(collectBuildServices(root)).toMatchObject({ ga4: false, vimeo: false, forms: false });
  });

  it("finds a form route and an embed in nested source", () => {
    put("src/routes/contact/+page.server.ts", `createIngestAction({ formType: "contact" })`);
    put("src/lib/components/VimeoBanner.svelte", `const src = "https://player.vimeo.com/video/1";`);
    expect(collectBuildServices(root)).toMatchObject({ forms: true, vimeo: true, netlify: true });
  });
});

describe("the starter itself", () => {
  it("collects forms and Netlify, and no GA4 until a measurement ID is installed", () => {
    const starter = join(dirname(fileURLToPath(import.meta.url)), "..");
    expect(collectBuildServices(starter)).toMatchObject({
      forms: true,
      netlify: true,
      ga4: false,
      googleFonts: false,
    });
  });
});
