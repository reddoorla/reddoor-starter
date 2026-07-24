import { test, expect, type ConsoleMessage } from "@playwright/test";

// Frozen-render fidelity gate. Drives the offline /dev/blux-frozen route (the
// real the-pointe freeze artifacts rendered through the production <FrozenPage>)
// and asserts it reproduces the live layout (~15333px) with every media
// background present and no residual slot token. Fonts + Blux-CDN source images
// legitimately load from third-party hosts here (dev fixture); real errors still
// fail via `pageerror`.
const ALLOWED_CONSOLE: RegExp[] = [
  /cloudfront\.net/i,
  /fonts\.g(oogleapis|static)\.com/i,
  /maps\.google/i,
  /vimeo/i,
];
const allowed = (s: string) => ALLOWED_CONSOLE.some((re) => re.test(s));

test("frozen the-pointe renders faithfully: ~15333px, 56 media, no tokens", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (m: ConsoleMessage) => {
    if (
      m.type() === "error" &&
      !allowed(m.text()) &&
      !allowed(m.location()?.url ?? "")
    ) {
      errors.push(m.text());
    }
  });
  page.on("pageerror", (e) => {
    if (!allowed(e.message)) errors.push(e.message);
  });

  await page.goto("/dev/blux-frozen", { waitUntil: "load" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);

  // Layout height matches the live Blux site (fonts load via the CSP allowance).
  const height = await page.evaluate(() => document.body.scrollHeight);
  expect(height).toBeGreaterThan(15200);
  expect(height).toBeLessThan(15800);

  // All 56 data-* backgrounds are baked as inline declarations.
  const backgrounds = await page.evaluate(
    () =>
      [...document.querySelectorAll<HTMLElement>("*")].filter((e) =>
        /url\(/.test(e.style.backgroundImage),
      ).length,
  );
  expect(backgrounds).toBeGreaterThanOrEqual(56);

  // No residual slot token survived substitution.
  expect(await page.content()).not.toContain("⟦");
  expect(errors).toEqual([]);
});
