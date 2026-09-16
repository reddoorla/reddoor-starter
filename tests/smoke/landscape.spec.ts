import { test, expect, devices, type Browser } from "@playwright/test";

// A phone held sideways must not be locked out of the site (WCAG 2.1 SC 1.3.4,
// Orientation). The template used to mount `LandscapeModal` from the root
// layout, which paints an opaque black `aria-modal="true"` overlay — no close
// button, no Escape, nothing reachable behind it — on ANY coarse-pointer device
// in landscape under 1024px. No gate viewport was landscape-shaped, so nothing
// ever exercised it (reddoor-starter#121, beachfront-dentistry e8b5fe6).
//
// Both orientations are asserted on purpose. The portrait case is the control:
// it passes with the lockout still mounted, so a green landscape assertion
// cannot be the locator silently matching nothing.
const FIXTURES = "/dev/a11y-fixtures";
const MODAL = '[role="dialog"][aria-modal="true"]';

async function modalCountOn(browser: Browser, device: (typeof devices)[string]) {
  const context = await browser.newContext({ ...device });
  try {
    const page = await context.newPage();
    await page.goto(FIXTURES, { waitUntil: "domcontentloaded" });
    // The overlay mounts in onMount, so wait for hydration to have had its say
    // before counting — otherwise a 0 could just mean "not mounted yet".
    await expect(page.locator("footer")).toBeVisible();
    return await page.locator(MODAL).count();
  } finally {
    await context.close();
  }
}

test("a phone in landscape is not locked out by a modal overlay", async ({ browser }) => {
  expect(await modalCountOn(browser, devices["iPhone 13 landscape"])).toBe(0);
});

test("a phone in portrait shows no modal overlay either (control)", async ({ browser }) => {
  expect(await modalCountOn(browser, devices["iPhone 13"])).toBe(0);
});
