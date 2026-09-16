import { test, expect, devices, type Browser } from "@playwright/test";

// A phone held sideways must not be locked out of the site (WCAG 2.1 SC 1.3.4,
// Orientation). The template used to mount `LandscapeModal` from the root
// layout, which paints an opaque black `aria-modal="true"` overlay — no close
// button, no Escape, nothing reachable behind it — on ANY coarse-pointer device
// in landscape under 1024px. No gate viewport was landscape-shaped, so nothing
// ever exercised it (reddoor-starter#121, beachfront-dentistry e8b5fe6).
//
// Everything the overlay keys on is MEASURED here rather than assumed. The
// first cut of this spec asserted only the overlay count and passed green with
// the lockout still mounted — the count was taken before hydration had run, so
// it could never have failed. The three reported values are the instrument's
// own proof: `coarse` and `narrowLandscape` are the two media queries
// LandscapeModal's onMount reads, and `hydrated` is a JS-only state change on
// the page, so a zero overlay count can only mean the overlay is not there.
const FIXTURES = "/dev/a11y-fixtures";
const MODAL = '[role="dialog"][aria-modal="true"]';

async function measure(browser: Browser, device: (typeof devices)[string]) {
  const context = await browser.newContext({ ...device });
  try {
    const page = await context.newPage();
    await page.goto(FIXTURES, { waitUntil: "domcontentloaded" });

    // Hydration proof: the Accordion trigger is a Svelte-state button (no
    // <details> fallback), so aria-expanded only flips once the client bundle
    // is live — the same moment LandscapeModal's onMount would have fired.
    const trigger = page.getByRole("button", { name: "What is this page?" });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    const media = await page.evaluate(() => ({
      coarse: window.matchMedia("(pointer: coarse)").matches,
      narrowLandscape: window.matchMedia("(orientation: landscape) and (max-width: 1023px)")
        .matches,
    }));

    return { ...media, hydrated: true, overlays: await page.locator(MODAL).count() };
  } finally {
    await context.close();
  }
}

test("a phone in landscape is not locked out by a modal overlay", async ({ browser }) => {
  expect(await measure(browser, devices["iPhone 13 landscape"])).toEqual({
    coarse: true,
    narrowLandscape: true,
    hydrated: true,
    overlays: 0,
  });
});

// Control: the same page, the same assertion, on a device the lockout never
// targeted. It passes with the lockout still in place, which is what makes the
// landscape failure above evidence rather than an untested assertion.
test("a phone in portrait shows no modal overlay either (control)", async ({ browser }) => {
  expect(await measure(browser, devices["iPhone 13"])).toEqual({
    coarse: true,
    narrowLandscape: false,
    hydrated: true,
    overlays: 0,
  });
});
