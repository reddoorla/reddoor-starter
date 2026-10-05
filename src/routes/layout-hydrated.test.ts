import { describe, it, expect, afterEach, vi } from "vitest";

// The layout imports the whole chrome; its first transform is slow cold.
vi.setConfig({ testTimeout: 60_000 });
import { render, cleanup } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";

// The other half of tests/smoke/hydrated.spec.ts. The smoke proves the server
// never ships `html[data-hydrated]`; this proves the browser does not write it
// early either. Early is what matters to a probe that waits on the marker
// before touching the DOM (reddoor-maintenance#1148): a write at module
// evaluation, or during the layout's own init, lands before the tree has
// hydrated, and a probe that trusted it would mutate a tree Svelte is still
// claiming.

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
  it("is not written when the layout module is evaluated", async () => {
    await import("./+layout.svelte");
    expect(hydrated()).toBe(false);
  });

  it("is written once the layout has mounted", async () => {
    const { default: Layout } = await import("./+layout.svelte");
    render(Layout, { data: { isPreviewSession: false }, children: ok });
    expect(hydrated()).toBe(true);
  });

  it("is not written when the tree under the layout fails to mount", async () => {
    const { default: Layout } = await import("./+layout.svelte");
    expect(() => render(Layout, { data: { isPreviewSession: false }, children: throws })).toThrow();
    expect(hydrated()).toBe(false);
  });
});
