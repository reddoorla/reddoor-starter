import { expect, test } from "@playwright/test";

// VimeoBanner and ScreenWidthMedia are `w-screen`: full-bleed wherever they
// sit, so inside a column they reach past the viewport and the page scrolls
// sideways (roalson-interests#87). The fixture page draws both inside its
// max-w-3xl column; it must not scroll.
//
// Asked with scrollTo, not a wheel: body's `overflow-x: clip` computes to
// hidden beside `overflow-y: auto`, which stops a wheel and not a script, a
// focus move, or find-in-page.
test.skip(process.env.REDDOOR_GATE_SERVER === "preview", "/dev/* 404s on a production build");

for (const width of [1440, 390]) {
  test(`the fixture page does not scroll sideways at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/dev/a11y-fixtures");
    await expect(page.locator("html")).toHaveAttribute("data-hydrated", "", { timeout: 20_000 });
    // The instrument can see a scroll: a 200px-too-wide element moves it.
    const control = await page.evaluate(() => {
      const probe = document.createElement("div");
      probe.style.cssText = "width: calc(100vw + 200px); height: 1px";
      document.body.append(probe);
      window.scrollTo(10_000, 0);
      const x = window.scrollX;
      probe.remove();
      window.scrollTo(0, 0);
      return x;
    });
    expect(control).toBeGreaterThan(0);
    const scrolled = await page.evaluate(() => {
      window.scrollTo(10_000, 0);
      return window.scrollX;
    });
    expect(scrolled).toBe(0);
  });
}
