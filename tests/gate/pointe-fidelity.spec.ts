import { test, expect, type Page, type ConsoleMessage } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

// Plan 4d fidelity gate. Drives the offline /dev/blux-pointe route (the real
// the-pointe catalog fixture rendered through the production SliceZone + chrome)
// under the same webServer the a11y/smoke suites use, asserts it renders and
// hydrates cleanly, and dumps the rendered HTML for the maintenance coverage
// gate (tests/blux/catalog/pointe-coverage.test.ts scores it vs the export).

// Console noise that isn't actionable for an OFFLINE render: the export's
// CloudFront images 404 (no live CDN in the gate) and the Google Maps script /
// Vimeo / Turnstile telemetry can surface — none of which are fidelity signals.
const ALLOWED_CONSOLE: RegExp[] = [
  /cloudfront/i,
  /maps\.googleapis|maps\.google/i,
  /vimeo/i,
  /turnstile|challenges\.cloudflare/i,
  /Failed to load resource/i,
];

function watchConsole(page: Page): string[] {
  const errors: string[] = [];
  const allowed = (s: string) =>
    !!s && ALLOWED_CONSOLE.some((re) => re.test(s));
  page.on("console", (m: ConsoleMessage) => {
    if (m.type() !== "error") return;
    const text = m.text();
    const url = m.location()?.url ?? "";
    if (allowed(text) || allowed(url)) return;
    errors.push(`[console.error] ${text}${url ? ` (${url})` : ""}`);
  });
  page.on("pageerror", (e) => {
    if (!allowed(e.message)) errors.push(`[pageerror] ${e.message}`);
  });
  return errors;
}

test("the-pointe catalog fixture renders faithfully; HTML dumped for coverage", async ({
  page,
}) => {
  const errors = watchConsole(page);
  await page.goto("/dev/blux-pointe");

  // Chrome renders once (from the app layout, fed by the fixture page data).
  await expect(page.locator("footer")).toBeVisible();
  await expect(page.getByText("Todd Doney")).toBeVisible();
  // The map widget's static markup is present (hydration is keyless in CI).
  await expect(page.locator(".blux-map")).toHaveCount(1);
  await expect(page.locator("#burbank_map")).toHaveCount(1);
  // Band content rendered through the SliceZone.
  await expect(page.getByText(/Burbank/i).first()).toBeVisible();

  // No unexpected console errors beyond the offline-render allowlist.
  expect(errors).toEqual([]);

  // Dump the rendered HTML so the maintenance coverage gate can score it
  // (POINTE_RENDERED_HTML → this path).
  const html = await page.content();
  mkdirSync("test-results/gate", { recursive: true });
  writeFileSync("test-results/gate/pointe-rendered.html", html);
});
