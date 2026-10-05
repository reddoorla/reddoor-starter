import { test, expect } from "@playwright/test";
import { HYDRATED, HYDRATION_TIMEOUT } from "./routes";

// `html[data-hydrated]` is the marker every smoke route waits on (routes.ts),
// so it has to mean what it says: only a mounted root layout writes it. These
// two tests are its positive and negative control. The no-JS one is the one
// that matters: a marker the server ships, or that app.html carries, would
// pass every smoke route with the bundle missing, which is exactly what the
// old `footer` marker did (reddoor-maintenance#947).
//
// /privacy expects 200 on the placeholder starter and on a wired fork alike.
const ROUTE = "/privacy";

test(
  "the hydration marker is set once script has mounted the root layout",
  { tag: "@smoke" },
  async ({ page }) => {
    await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
    await expect(page.locator(HYDRATED)).toBeVisible({ timeout: HYDRATION_TIMEOUT });
  },
);

test(
  "with scripting off, the hydration marker is absent",
  { tag: "@smoke" },
  async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      const response = await page.goto(ROUTE, { waitUntil: "load" });
      expect(response?.status(), `HTTP status for ${ROUTE}`).toBe(200);
      await expect(page.locator("footer").first(), "the page server-rendered").toBeVisible();
      await expect(page.locator("html")).not.toHaveAttribute("data-hydrated");
    } finally {
      await context.close();
    }
  },
);
