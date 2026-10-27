import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { axe } from "./axe";

// axe's default preload fetches every cross-origin stylesheet, and
// `connect-src` has no fonts.googleapis.com, so on a site that loads Google
// Fonts each audit logged a CSP violation (roalson-interests#52). The bare
// starter ships system fonts, so this adds the sheet itself, answered locally
// so the run needs no network. The control runs the default builder on the
// same page, so a pass here is not a CSP that has simply stopped reporting.
//
//   pnpm exec playwright test tests/interaction/axe-preload.spec.ts
const FIXTURE = "/dev/a11y-fixtures";
const SHEET = "https://fonts.googleapis.com/css2?family=Inter";

test.skip(process.env.REDDOOR_GATE_SERVER === "preview", "/dev/* 404s on a production build");

async function connectSrcAfter(page: Page, run: () => Promise<unknown>) {
  const reports: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error" && m.text().includes("connect-src")) reports.push(m.text());
  });
  await page.route(SHEET, (route) =>
    route.fulfill({ contentType: "text/css", body: "body { margin: 0; }" }),
  );
  await page.goto(FIXTURE);
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "", { timeout: 20_000 });
  await page.addStyleTag({ url: SHEET });
  await run();
  return reports;
}

test("the default builder's preload is refused by connect-src (control)", async ({ page }) => {
  const reports = await connectSrcAfter(page, () =>
    new AxeBuilder({ page }).withTags(["wcag2a"]).analyze(),
  );
  expect(reports.join("\n")).toContain("fonts.googleapis.com");
});

test("the specs' axe does not preload, so the CSP stays quiet", async ({ page }) => {
  const reports = await connectSrcAfter(page, () => axe(page).withTags(["wcag2a"]).analyze());
  expect(reports).toEqual([]);
});
