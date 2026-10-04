import { describe, it, expect } from "vitest";
import { deriveBuildServices, maskComments, measurementIdIn, type SourceFile } from "./services";

const CSP_ALL = `
import adapter from "@sveltejs/adapter-netlify";
export default { kit: { adapter: adapter(), csp: { directives: {
  "script-src": ["self", "https://player.vimeo.com", "https://www.youtube.com", "https://challenges.cloudflare.com"],
  "style-src": ["self", "https://fonts.googleapis.com", "https://use.typekit.net"],
  "form-action": ["self", "https://example.us1.list-manage.com"],
} } } };
`;

const src = (path: string, text: string): SourceFile => ({ path, text });

const HOOK = src(
  "src/hooks.client.ts",
  `import { initAnalytics } from "@reddoorla/maintenance/client";
export const init = () => {
  initAnalytics({
    measurementId: "G-ABCDEFGHIJ",
    productionHost: "example.com",
  });
};`,
);

const CONTACT = src(
  "src/routes/contact/+page.server.ts",
  `import { createIngestAction } from "@reddoorla/maintenance/forms";
export const actions = { default: createIngestAction({ formType: "contact" }) };`,
);

describe("measurementIdIn", () => {
  it("reads the ID from an initAnalytics call", () => {
    expect(measurementIdIn(HOOK.text)).toBe("G-ABCDEFGHIJ");
  });

  it("reads the ID from a direct gtag loader", () => {
    expect(
      measurementIdIn(`<script src="https://www.googletagmanager.com/gtag/js?id=G-ZYXWVUTSRQ">`),
    ).toBe("G-ZYXWVUTSRQ");
  });

  it("ignores an ID that only appears in a comment", () => {
    expect(
      measurementIdIn(
        maskComments(`// initAnalytics({ measurementId: "G-ABCDEFGHIJ" })\nexport {};`),
      ),
    ).toBeNull();
  });

  it("ignores a malformed ID", () => {
    expect(measurementIdIn(`initAnalytics({ measurementId: "G-123" })`)).toBeNull();
  });
});

describe("maskComments", () => {
  it("keeps URLs inside strings while dropping line comments", () => {
    const out = maskComments(`const a = "https://player.vimeo.com"; // https://use.typekit.net`);
    expect(out).toContain("https://player.vimeo.com");
    expect(out).not.toContain("typekit");
  });

  it("drops block and HTML comments", () => {
    const out = maskComments(`/* fonts.googleapis.com */ <!-- list-manage.com --> <p></p>`);
    expect(out).not.toContain("googleapis");
    expect(out).not.toContain("list-manage");
    expect(out).toContain("<p></p>");
  });
});

describe("deriveBuildServices", () => {
  it("turns GA4 on only when the site's code carries a measurement ID", () => {
    expect(deriveBuildServices({ svelteConfig: CSP_ALL, sources: [HOOK] }).ga4).toBe(true);
    expect(deriveBuildServices({ svelteConfig: CSP_ALL, sources: [CONTACT] }).ga4).toBe(false);
  });

  it("does not take GA4 from a CSP that merely admits Google's hosts", () => {
    const csp = CSP_ALL.replace(`"self",`, `"self", "https://www.googletagmanager.com",`);
    const page = src("src/app.html", `<link href="https://www.googletagmanager.com">`);
    expect(deriveBuildServices({ svelteConfig: csp, sources: [page] }).ga4).toBe(false);
  });

  it("turns forms on only for a route that forwards to the central ingest", () => {
    expect(deriveBuildServices({ svelteConfig: CSP_ALL, sources: [CONTACT] }).forms).toBe(true);
    expect(deriveBuildServices({ svelteConfig: CSP_ALL, sources: [HOOK] }).forms).toBe(false);
  });

  it("needs both the site's source and its CSP to name a third-party host", () => {
    const vimeo = src(
      "src/lib/components/VimeoBanner.svelte",
      `"https://player.vimeo.com/video/1"`,
    );
    expect(deriveBuildServices({ svelteConfig: CSP_ALL, sources: [vimeo] }).vimeo).toBe(true);
    expect(
      deriveBuildServices({
        svelteConfig: CSP_ALL.replace(`"https://player.vimeo.com", `, ""),
        sources: [vimeo],
      }).vimeo,
    ).toBe(false);
    expect(deriveBuildServices({ svelteConfig: CSP_ALL, sources: [] }).vimeo).toBe(false);
  });

  it("falls back to the source alone when svelte.config.js sets no CSP", () => {
    const fonts = src(
      "src/app.html",
      `<link href="https://fonts.googleapis.com/css2?family=Inter">`,
    );
    const noCsp = `import adapter from "@sveltejs/adapter-netlify"; export default { kit: { adapter: adapter() } };`;
    expect(deriveBuildServices({ svelteConfig: noCsp, sources: [fonts] }).googleFonts).toBe(true);
  });

  it("ignores a host named only in a comment", () => {
    const commented = src("src/app.html", `<!-- https://use.typekit.net/abc.css -->`);
    expect(deriveBuildServices({ svelteConfig: CSP_ALL, sources: [commented] }).adobeFonts).toBe(
      false,
    );
    const config = CSP_ALL.replace(`"https://use.typekit.net"`, `/* "https://use.typekit.net" */`);
    const live = src("src/app.html", `<link href="https://use.typekit.net/abc.css">`);
    expect(deriveBuildServices({ svelteConfig: config, sources: [live] }).adobeFonts).toBe(false);
  });

  it("finds each embed and font host it knows", () => {
    const all = src(
      "src/app.html",
      [
        "https://www.youtube.com/embed/x",
        "https://fonts.googleapis.com/css2",
        "https://use.typekit.net/abc.css",
        "https://example.us1.list-manage.com/subscribe/post",
        "https://player.vimeo.com/video/1",
      ]
        .map((u) => `"${u}"`)
        .join("\n"),
    );
    expect(deriveBuildServices({ svelteConfig: CSP_ALL, sources: [all] })).toMatchObject({
      youtube: true,
      googleFonts: true,
      adobeFonts: true,
      mailchimp: true,
      vimeo: true,
    });
  });

  it("names Netlify from the adapter the site builds with", () => {
    expect(deriveBuildServices({ svelteConfig: CSP_ALL, sources: [] }).netlify).toBe(true);
    expect(
      deriveBuildServices({
        svelteConfig: CSP_ALL.replace("adapter-netlify", "adapter-node"),
        sources: [],
      }).netlify,
    ).toBe(false);
  });
});
