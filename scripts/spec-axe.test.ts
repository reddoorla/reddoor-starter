// tests/interaction/axe.ts is the one place a spec builds axe
// (roalson-interests#52). Anywhere else, `new AxeBuilder` brings the default
// preload back, and a later `.options()` silently replaces `preload: false`
// along with everything else.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

import { axe } from "../tests/interaction/axe";

// Resolved from the project root: under jsdom `import.meta.url` is not a file:
// URL (see src/reduced-motion-reset.test.ts).
const ROOT = process.cwd();
const HELPER = "tests/interaction/axe.ts";
/** The control that proves the default builder still trips the CSP. */
const CONTROL = "tests/interaction/axe-preload.spec.ts";

function tsFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return tsFiles(path);
    return entry.name.endsWith(".ts") ? [path] : [];
  });
}

const code = (text: string) => text.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");

function offenders(pattern: RegExp, allowed: string[]) {
  return tsFiles(join(ROOT, "tests"))
    .map((file) => relative(ROOT, file))
    .filter((rel) => !allowed.includes(rel))
    .filter((rel) => pattern.test(code(readFileSync(join(ROOT, rel), "utf8"))));
}

describe("the specs build axe in one place", () => {
  it("finds the builder where it is", () => {
    expect(code(readFileSync(join(ROOT, HELPER), "utf8"))).toMatch(/new AxeBuilder\(/);
  });

  it("constructs AxeBuilder nowhere else", () => {
    expect(offenders(/new AxeBuilder\(/, [HELPER, CONTROL])).toEqual([]);
  });

  it("imports axe's package nowhere else, under any name", () => {
    // `import Axe from "@axe-core/playwright"` builds the default preload
    // under a name the check above does not know.
    expect(offenders(/["']@axe-core\/playwright["']/, [HELPER, CONTROL])).toEqual([]);
  });

  it("never re-sets axe's options after the helper", () => {
    expect(offenders(/\.options\(/, [HELPER])).toEqual([]);
  });

  it("hands the specs a builder that does not preload", () => {
    // The options axe will run with, read off the builder the helper returns:
    // the two checks above keep it the only builder, this keeps it quiet.
    const builder = axe({} as Parameters<typeof axe>[0]).withTags(["wcag2a"]);
    expect((builder as unknown as { option: { preload?: unknown } }).option.preload).toBe(false);
  });
});
