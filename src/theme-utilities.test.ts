import { describe, it, expect, beforeAll } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
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
// What it reads, from the Svelte AST: the text of `class=` / `*Class=`
// attributes, the string literals in class position inside their `{…}` (both
// branches of a ternary, the right of `&&`, array items, object keys, call
// arguments; never a comparison operand), and `class:` directives. It does not
// read class strings kept in script constants or prop defaults, template
// literals, or `+` concatenations, so a dead class there passes.
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

type Node = { type?: string; [key: string]: unknown };

const parsedCache = new Map<string, ReturnType<typeof parse>>();
/** One file's Svelte AST, parsed once; a parse error names the file. */
const parsed = (rel: string) => {
  if (!parsedCache.has(rel)) {
    try {
      parsedCache.set(
        rel,
        parse(readFileSync(join(ROOT, rel), "utf8"), { modern: true, filename: rel }),
      );
    } catch (err) {
      throw new Error(`${rel} does not parse: ${(err as Error).message}`, { cause: err });
    }
  }
  return parsedCache.get(rel)!;
};

/** The class strings an expression can put in a class attribute. */
function classLiterals(e: Node | null | undefined): string[] {
  if (!e) return [];
  switch (e.type) {
    case "Literal":
      return typeof e.value === "string" ? [e.value] : [];
    case "ConditionalExpression":
      return [...classLiterals(e.consequent as Node), ...classLiterals(e.alternate as Node)];
    case "LogicalExpression":
      return e.operator === "&&"
        ? classLiterals(e.right as Node)
        : [...classLiterals(e.left as Node), ...classLiterals(e.right as Node)];
    case "ArrayExpression":
      return (e.elements as Node[]).flatMap(classLiterals);
    case "ObjectExpression":
      return (e.properties as Node[]).flatMap((p) => {
        const key = p.key as Node | undefined;
        if (p.type !== "Property" || p.computed || !key) return [];
        return key.type === "Identifier" ? [key.name as string] : classLiterals(key);
      });
    case "CallExpression":
      return (e.arguments as Node[]).flatMap(classLiterals);
    default:
      return [];
  }
}

/** Every class the markup spells, and the files that spell it. */
function spelledClasses(): Map<string, string[]> {
  const found = new Map<string, string[]>();
  for (const rel of files("src", /\.svelte$/)) {
    const add = (text: string) => {
      for (const t of text.split(/\s+/).filter(Boolean)) {
        const at = found.get(t) ?? [];
        if (!at.includes(rel)) at.push(rel);
        found.set(t, at);
      }
    };
    const walk = (n: unknown): void => {
      if (Array.isArray(n)) return n.forEach(walk);
      if (!n || typeof n !== "object") return;
      const node = n as Node;
      if (node.type === "ClassDirective") add(node.name as string);
      if (
        node.type === "Attribute" &&
        /^(?:class|[a-z][A-Za-z]*Class)$/.test(node.name as string)
      ) {
        const value = node.value;
        for (const part of (Array.isArray(value) ? value : [value]) as Node[]) {
          if (part?.type === "Text") add(part.data as string);
          if (part?.type === "ExpressionTag") classLiterals(part.expression as Node).forEach(add);
        }
      }
      for (const [k, v] of Object.entries(node)) if (k !== "parent" && k !== "metadata") walk(v);
    };
    walk(parsed(rel).fragment);
  }
  return found;
}

type CssNode = { type?: string; name?: string; args?: unknown; [key: string]: unknown };

/** The classes a component's own <style> defines, from the AST Svelte parses —
 *  so a comment, a string, or a <style> inside a script or an HTML comment
 *  defines nothing. A scoped rule defines the class for its own file only.
 *  For every file: `:global(.x)`, everything after a bare `:global` in a
 *  selector (`div :global .x`), and every rule inside a block whose selector
 *  ends in a bare `:global` (`:global { … }`, `.card :global { … }`). A
 *  `:global(…)` nested in `:is()`, `:where()`, `:not()` or `:has()` still
 *  applies only inside its file, so it stays scoped. */
function componentClasses(rel: string): { own: Set<string>; global: Set<string> } {
  const own = new Set<string>();
  const global = new Set<string>();
  const css = parsed(rel).css as CssNode | null;
  const bareGlobal = (n: CssNode) =>
    n.type === "PseudoClassSelector" && n.name === "global" && !n.args;
  /** Whether a complex selector's last simple selector is a bare :global. */
  const endsBare = (c: CssNode) => {
    const rels = c.children as CssNode[];
    const last = (rels.at(-1)?.selectors as CssNode[] | undefined)?.at(-1);
    return !!last && bareGlobal(last);
  };
  const walk = (n: unknown, inGlobal: boolean, nested: boolean): void => {
    if (Array.isArray(n)) return n.forEach((c) => walk(c, inGlobal, nested));
    if (!n || typeof n !== "object") return;
    const node = n as CssNode;
    switch (node.type) {
      case "ClassSelector":
        (inGlobal ? global : own).add(node.name!);
        return;
      case "ComplexSelector": {
        let after = inGlobal;
        for (const r of node.children as CssNode[]) {
          for (const sel of r.selectors as CssNode[]) {
            if (bareGlobal(sel) && !nested) after = true;
            else walk(sel, after, nested);
          }
        }
        return;
      }
      case "PseudoClassSelector":
        if (node.name === "global") walk(node.args, inGlobal || !nested, nested);
        else
          walk(node.args, inGlobal, nested || ["is", "where", "not", "has"].includes(node.name!));
        return;
      case "Rule": {
        const list = (node.prelude as CssNode).children as CssNode[];
        walk(node.prelude, inGlobal, nested);
        walk(node.block, inGlobal || list.some(endsBare), nested);
        return;
      }
    }
    for (const [k, v] of Object.entries(node)) if (k !== "parent") walk(v, inGlobal, nested);
  };
  if (css) walk(css.children, false, false);
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
    // `@plugin "…"`, loaded as the bundler would: a relative path against
    // src, with Tailwind's extensions (`.ts` too); a package through import(),
    // so an ESM-only `exports` resolves.
    loadModule: async (id, base) => {
      const relative = id.startsWith(".") || id.startsWith("/");
      const candidates = relative
        ? ["", ".js", ".mjs", ".cjs", ".ts", ".mts", ".cts", "/index.js", "/index.ts"]
            .map((ext) => resolve(base, id + ext))
            .filter((path) => existsSync(path) && statSync(path).isFile())
        : [id];
      for (const path of candidates) {
        try {
          const mod = (await import(relative ? pathToFileURL(path).href : path)) as {
            default?: unknown;
          };
          return {
            path,
            base: relative ? dirname(path) : base,
            module: (mod.default ?? mod) as never,
          };
        } catch {
          // fall through to the refusal below
        }
      }
      throw new Error(`app.css loads the plugin ${id}, which does not resolve; teach this test`);
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
      const defined = componentClasses(rel);
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
