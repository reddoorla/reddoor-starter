import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parse } from "svelte/compiler";
import { compile } from "tailwindcss";
import { animateIn } from "$lib/actions/animateIn";

// A class that names a theme key Tailwind v4 does not have compiles to NOTHING,
// silently. `ease-fast-slow` shipped that way in both Animation components:
// the token was `--transition-fast-slow`, a v3 name, and v4 builds `ease-*`
// only from `--ease-*` (roalson-interests#183; `--screen-*` was the same
// defect for breakpoints there, #171). So this compiles app.css with Tailwind itself and asks
// it about every class the markup spells.
//
// What it reads: the static text of `class=` / `*Class=` attribute values in
// src/**/*.svelte, the '…' and "…" literals inside their `{…}` expressions,
// and `class:` directives. It does not read class strings kept in script
// constants or prop defaults, or inside template literals, so a dead class
// there passes.
//
// Resolved from the project root: under jsdom `import.meta.url` is not a file:
// URL (see reduced-motion-reset.test.ts).
const ROOT = process.cwd();
const CSS = readFileSync(resolve(ROOT, "src/app.css"), "utf8");

/** Spelled like a utility and emitting nothing, on purpose. */
const HOOKS: Record<string, string> = {
  "mt-copy":
    "MediaText's copy-column hook, twin of `.mt-media`; `mt-` is the slice, not margin-top",
};

function* files(dir: string, re: RegExp): Generator<string> {
  for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) yield* files(rel, re);
    else if (re.test(entry.name)) yield rel;
  }
}

/** The attribute value that starts at `s[i]` — quoted or a bare `{…}`. */
function valueAt(s: string, i: number): string {
  const open = s[i];
  const close = open === "{" ? "}" : open;
  if (open !== '"' && open !== "'" && open !== "{") return "";
  let depth = open === "{" ? 1 : 0;
  for (let j = i + 1; j < s.length; j++) {
    if (s[j] === "{") depth++;
    else if (s[j] === "}" && open !== "{") depth--;
    else if (s[j] === "}" && --depth === 0) return `{${s.slice(i + 1, j)}}`;
    else if (s[j] === close && depth === 0) return s.slice(i + 1, j);
  }
  return "";
}

/** Static text outside braces, plus '…' and "…" literals inside them. */
function classTokens(value: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let text = "";
  for (let i = 0; i < value.length; i++) {
    const ch = value[i]!;
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    else if (depth === 0) text += ch;
    else if (ch === "'" || ch === '"' || ch === "`") {
      const end = value.indexOf(ch, i + 1);
      if (end === -1) break;
      if (ch !== "`") parts.push(value.slice(i + 1, end));
      i = end;
    }
    if (ch === "{" || ch === "}") text += " ";
  }
  parts.push(text);
  return parts
    .join(" ")
    .split(/\s+/)
    .filter((t) => t && !/[`${}]/.test(t));
}

/** Every class the markup spells, and the files that spell it. */
function spelledClasses(): Map<string, string[]> {
  const found = new Map<string, string[]>();
  const add = (t: string, rel: string) => {
    const at = found.get(t) ?? [];
    if (!at.includes(rel)) at.push(rel);
    found.set(t, at);
  };
  for (const rel of files("src", /\.svelte$/)) {
    const src = readFileSync(join(ROOT, rel), "utf8");
    for (const m of src.matchAll(/\s(?:class|[a-z][A-Za-z]*Class)=/g)) {
      for (const t of classTokens(valueAt(src, m.index + m[0].length))) add(t, rel);
    }
    for (const m of src.matchAll(/\sclass:([^\s=>]+)/g)) add(m[1]!, rel);
  }
  return found;
}

type CssNode = { type?: string; name?: string; args?: unknown; [key: string]: unknown };

/** The classes a component's own <style> defines, as Svelte parses it — so a
 *  comment, a string, or a <style> inside a script or an HTML comment defines
 *  nothing. A scoped rule defines the class for its own file only; a
 *  `:global(.x)`, a `:global .x` or a `:global { … }` block, for every file. */
function componentClasses(src: string): { own: Set<string>; global: Set<string> } {
  const own = new Set<string>();
  const global = new Set<string>();
  const css = parse(src, { modern: true }).css as CssNode | null;
  const bareGlobal = (n: CssNode) =>
    n.type === "PseudoClassSelector" && n.name === "global" && !n.args;
  const walk = (n: unknown, inGlobal: boolean): void => {
    if (Array.isArray(n)) return n.forEach((c) => walk(c, inGlobal));
    if (!n || typeof n !== "object") return;
    const node = n as CssNode;
    if (node.type === "ClassSelector") {
      (inGlobal ? global : own).add(node.name!);
      return;
    }
    if (node.type === "ComplexSelector") {
      // `:global .x`: every selector after a bare :global is global.
      let after = inGlobal;
      for (const rel of node.children as CssNode[]) {
        for (const sel of rel.selectors as CssNode[]) {
          if (bareGlobal(sel)) after = true;
          else walk(sel, after);
        }
      }
      return;
    }
    if (node.type === "PseudoClassSelector" && node.name === "global") {
      walk(node.args, true); // `:global(.x)`
      return;
    }
    if (node.type === "Rule") {
      // `:global { … }`: a rule whose whole prelude is a bare :global.
      const prelude = JSON.stringify(node.prelude);
      const blockGlobal = !prelude.includes('"ClassSelector"') && prelude.includes('"global"');
      walk(node.prelude, inGlobal);
      walk(node.block, inGlobal || blockGlobal);
      return;
    }
    for (const [k, v] of Object.entries(node)) if (k !== "parent") walk(v, inGlobal);
  };
  if (css) walk(css.children, false);
  return { own, global };
}

/** A selector for `cls` as Tailwind escapes it: a leading digit (`2xl:`)
 *  becomes a code point, `\32 xl`, as CSS.escape writes it. */
const selector = (cls: string) =>
  `.${cls.replace(/[^\w-]/g, (ch) => `\\${ch}`).replace(/^\d/, (d) => `\\3${d} `)}`;
const literally = (s: string) =>
  new RegExp(`${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`);

let tailwind: Awaited<ReturnType<typeof compile>>;
beforeAll(async () => {
  const index = resolve(ROOT, "node_modules/tailwindcss/index.css");
  tailwind = await compile(CSS, {
    base: resolve(ROOT, "src"),
    // `@plugin "…"`: resolved from where app.css would resolve it.
    loadModule: async (id, base) => {
      let path: string;
      try {
        path = createRequire(join(base, "app.css")).resolve(id);
      } catch {
        throw new Error(`app.css loads the plugin ${id}, which does not resolve; teach this test`);
      }
      const module = ((await import(pathToFileURL(path).href)) as { default: unknown }).default;
      return { path, base: dirname(path), module: module as never };
    },
    loadStylesheet: async (id) => {
      if (id !== "tailwindcss")
        throw new Error(`app.css imports ${id}; teach this test to load it`);
      return { path: index, base: dirname(index), content: readFileSync(index, "utf8") };
    },
  });
});

describe("classes the markup spells", () => {
  it("reads markup, and Tailwind answers for it — the instrument is not blind", () => {
    const spelled = [...spelledClasses().keys()];
    const css = tailwind.build(spelled);
    expect(
      spelled.filter((cls) => literally(selector(cls)).test(css)).length,
      "no class the markup spells compiles",
    ).toBeGreaterThan(0);
    expect(tailwind.build(["ease-out"])).toContain("transition-timing-function: var(--ease-out)");
    // A class that opens with a digit is escaped to a code point; it compiles.
    expect(tailwind.build(["2xl:text-lg"])).toMatch(literally(selector("2xl:text-lg")));
    // Its answer for a key the theme lacks is nothing, which is the whole test.
    expect(tailwind.build(["ease-not-a-token"])).not.toContain(selector("ease-not-a-token"));
  });

  it("never names a theme key Tailwind does not have", () => {
    const spelled = spelledClasses();
    const css = tailwind.build([...spelled.keys()]);
    // A class may also be defined by a real stylesheet. A .css file defines
    // it everywhere (comments stripped). A component's <style>, as Svelte
    // parses it, defines it in that component, or everywhere under :global.
    const sheets = [...files("src", /\.css$/)]
      .map((rel) => readFileSync(join(ROOT, rel), "utf8").replace(/\/\*[\s\S]*?\*\//g, ""))
      .join("\n");
    const own = new Map<string, Set<string>>();
    const global = new Set<string>();
    for (const rel of files("src", /\.svelte$/)) {
      const defined = componentClasses(readFileSync(join(ROOT, rel), "utf8"));
      own.set(rel, defined.own);
      for (const cls of defined.global) global.add(cls);
    }
    /** Whether Tailwind has a utility by this root: `root-(--x)` compiles. */
    const knownRoot = (cls: string) => {
      const utility = cls.slice(cls.lastIndexOf(":") + 1).replace(/^!?-?/, "");
      const roots = utility.split("-").map((_, i, a) => a.slice(0, i + 1).join("-"));
      return roots
        .slice(0, -1)
        .some((r) => tailwind.build([`${r}-(--x)`]).includes(selector(`${r}-(--x)`)));
    };
    const dead = [...spelled]
      .filter(([cls]) => !literally(selector(cls)).test(css))
      .filter(([cls]) => !literally(selector(cls)).test(sheets) && !global.has(cls))
      .filter(([cls]) => !(cls in HOOKS) && knownRoot(cls))
      .flatMap(([cls, rels]) =>
        rels.filter((rel) => !own.get(rel)?.has(cls)).map((rel) => `${cls} (${rel})`),
      );
    expect(dead).toEqual([]);
  });
});

describe("the easing animateIn writes", () => {
  it("is a token app.css's @theme declares", () => {
    const node = document.createElement("div");
    const { destroy } = animateIn(node);
    const transition = node.style.transition;
    destroy();
    expect(transition, "animateIn wrote no transition to read").not.toBe("");
    // The token each property's easing names first; a fallback inside it is
    // for sites, not for this repo, and is not held to app.css.
    const reads = [
      ...new Set([...transition.matchAll(/ms var\((--[\w-]+)[,)]/g)].map((m) => m[1]!)),
    ];
    expect(reads, "animateIn's transition reads no token").not.toEqual([]);
    const theme = CSS.slice(CSS.indexOf("@theme {"), CSS.indexOf("\n}\n", CSS.indexOf("@theme {")));
    for (const name of reads) expect(theme).toMatch(new RegExp(`^\\s*${name}:`, "m"));
  });
});
