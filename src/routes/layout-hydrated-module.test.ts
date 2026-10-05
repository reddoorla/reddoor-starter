import { it, expect, vi } from "vitest";

// Its own file so the import below is the first evaluation of the layout
// module in this worker: vitest isolates each test file, and a second import
// in a shared file would hit the module cache and prove nothing. See
// layout-hydrated.test.ts for the rest of the marker's contract.
vi.setConfig({ testTimeout: 60_000 });

vi.mock("$app/navigation", () => ({ afterNavigate: vi.fn(), beforeNavigate: vi.fn() }));
vi.mock("$app/state", () => ({
  page: { data: {}, url: new URL("https://example.com/"), params: {}, status: 200 },
}));

it("evaluating the root layout module does not write the hydration marker", async () => {
  expect(document.documentElement.hasAttribute("data-hydrated")).toBe(false);
  await import("./+layout.svelte");
  expect(document.documentElement.hasAttribute("data-hydrated")).toBe(false);
});
