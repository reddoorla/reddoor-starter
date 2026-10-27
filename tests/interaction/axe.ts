import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

/** Every spec's axe. `preload: false` because axe's preload fetches every
 *  cross-origin stylesheet, and `connect-src` refuses a Google Fonts sheet, so
 *  each audit posts a CSP report once a site loads one (roalson-interests#52).
 *  The two rules that read the preloaded sheets cannot fail under the tags
 *  these specs use. `options()` replaces the whole options object, so nothing
 *  may call it again after this. */
export const axe = (page: Page) => new AxeBuilder({ page }).options({ preload: false });
