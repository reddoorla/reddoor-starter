import { describe, it, expect, afterEach, vi } from "vitest";

// The layout imports the whole chrome; its first transform is slow cold.
vi.setConfig({ testTimeout: 60_000 });
import { render, cleanup } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";

// The other half of tests/smoke/hydrated.spec.ts. The smoke proves the server
// never ships `html[data-hydrated]`; this proves the browser does not write it
// early either: not during the layout's own init (and, in
// layout-hydrated-module.test.ts, not at module evaluation).
// Early is what matters to a probe that waits on the marker before touching
// the DOM (reddoor-maintenance#1148). The marker means "the root layout has
// mounted", not "the page hydrated cleanly": in the app, kit catches a page
// that throws and mounts +error.svelte inside the same layout, and Svelte
// recovers from a hydration mismatch by re-rendering, so the marker is set in
// both. The throwing child below pins only that the write waits for the
// layout's whole tree to mount (onMount), which a write during init would not.
// Console errors on a smoke route are what catch a broken page.

vi.mock("$app/navigation", () => ({ afterNavigate: vi.fn(), beforeNavigate: vi.fn() }));
vi.mock("$app/state", () => ({
  page: { data: {}, url: new URL("https://example.com/"), params: {}, status: 200 },
}));

const root = document.documentElement;
const hydrated = () => root.hasAttribute("data-hydrated");

afterEach(() => {
  cleanup();
  delete root.dataset.hydrated;
});

const ok = createRawSnippet(() => ({ render: () => "<p>page</p>" }));
const throws = createRawSnippet(() => ({
  render: () => {
    throw new Error("a page that fails to mount");
  },
}));

describe("the root layout's hydration marker", () => {
  it("is written once the layout has mounted", async () => {
    const { default: Layout } = await import("./+layout.svelte");
    render(Layout, { data: { isPreviewSession: false }, children: ok });
    expect(hydrated()).toBe(true);
  });

  it("is not written when the tree under the layout fails to mount", async () => {
    const { default: Layout } = await import("./+layout.svelte");
    expect(() => render(Layout, { data: { isPreviewSession: false }, children: throws })).toThrow(
      "a page that fails to mount",
    );
    expect(hydrated()).toBe(false);
  });
});
