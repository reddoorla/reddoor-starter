// @vitest-environment node
//
// SvelteKit 3 moved its configuration out of svelte.config.js and into the
// `sveltekit(...)` Vite plugin (reddoor-maintenance P1-45). These tests hold
// the three places that move can go wrong without a build failing:
//   - the config object never reaching the plugin (the CSP would just vanish);
//   - a svelte.config.js coming back beside it (kit 3 refuses to start);
//   - an environment variable read in src/ but not declared in src/env.ts,
//     which kit 3 turns into `undefined` with only a build warning.
// Node, not jsdom, for the same reason as csp-policy.test.ts: the config pulls
// in the adapter.
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfigFromFile, type Plugin, type PluginOption } from "vite";
import { SVELTE_EVENT_REPLAY_HASH } from "@reddoorla/maintenance/configs/svelte";
import { variables } from "../src/env.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function flatten(option: PluginOption): Promise<Plugin[]> {
  const value = await option;
  if (!value) return [];
  if (Array.isArray(value)) return (await Promise.all(value.map(flatten))).flat();
  return [value as Plugin];
}

/** The options SvelteKit itself validated, read off its own plugin: what kit
 *  will actually use, not what a config file says. */
async function kitOptions(): Promise<Record<string, unknown>> {
  const loaded = await loadConfigFromFile(
    { command: "build", mode: "production" },
    join(repoRoot, "vite.config.ts"),
    repoRoot,
  );
  if (!loaded) throw new Error("vite.config.ts did not load");
  const plugins = await flatten(loaded.config.plugins ?? []);
  const setup = plugins.find((p) => p.name === "vite-plugin-sveltekit-setup");
  if (!setup) throw new Error("vite.config.ts does not register the sveltekit() plugin");
  return (setup.api as { options: Record<string, unknown> }).options;
}

describe("the SvelteKit config reaches the sveltekit() plugin", () => {
  it("has no svelte.config.js or svelte.config.ts, which kit 3 refuses to start beside", () => {
    expect(existsSync(join(repoRoot, "svelte.config.js"))).toBe(false);
    expect(existsSync(join(repoRoot, "svelte.config.ts"))).toBe(false);
  });

  it("hands kit the CSP baseline, with the event-replay allowance", async () => {
    const options = await kitOptions();
    const csp = options.csp as { mode: string; directives: Record<string, string[]> };
    expect(csp.mode).toBe("auto");
    expect(csp.directives["script-src"]).toContain(SVELTE_EVENT_REPLAY_HASH);
    expect(csp.directives["report-uri"]).toEqual(["/api/csp-report"]);
  });

  it("keeps `$lib` resolving: kit 3 no longer provides it", async () => {
    const options = await kitOptions();
    expect(options.alias).toMatchObject({ $lib: "src/lib", "$lib/*": "src/lib/*" });
  });

  it("hands kit the prerender policy (the placeholder-repo 404 rule)", async () => {
    const options = await kitOptions();
    const prerender = options.prerender as { handleHttpError: unknown; handleInvalidUrl: unknown };
    expect(typeof prerender.handleHttpError).toBe("function");
    expect(typeof prerender.handleInvalidUrl).toBe("function");
  });
});

/** Import sveltekit.config.js in a child Node under exactly these Netlify
 *  variables, so the parent's environment cannot leak into the control. */
function configUnder(env: Record<string, string>) {
  const child = { ...process.env };
  for (const name of ["URL", "DEPLOY_URL", "DEPLOY_PRIME_URL", "SITE_NAME", "CI", "NETLIFY"]) {
    delete child[name];
  }
  delete child.VITE_PRISMIC_ENVIRONMENT;
  const r = spawnSync(
    process.execPath,
    [
      "-e",
      `import("./sveltekit.config.js").then((m) => console.log(JSON.stringify({ paths: m.default.paths ?? null, csrf: m.default.csrf ?? null })))`,
    ],
    { cwd: repoRoot, env: { ...child, ...env }, encoding: "utf-8" },
  );
  if (r.status !== 0) throw new Error(r.stderr);
  return JSON.parse(r.stdout) as {
    paths: { origin?: string } | null;
    csrf: { trustedOrigins?: string[] } | null;
  };
}

describe("the origin a Netlify build bakes in", () => {
  it("sets none locally (the control): kit keeps its prerender placeholder", () => {
    expect(configUnder({})).toEqual({ paths: null, csrf: null });
  });

  it("takes the production URL as paths.origin, which kit 2 called prerender.origin", () => {
    expect(configUnder({ URL: "https://www.example.com" }).paths).toEqual({
      origin: "https://www.example.com",
    });
  });

  // Kit 3's CSRF check compares a form POST's Origin with paths.origin once it
  // is set. One build is served at all of these, and kit 2 accepted the
  // contact form on every one, because it compared with the request's host.
  it("trusts the mirror, deploy and preview origins for form posts, and not the production one twice", () => {
    const { csrf } = configUnder({
      URL: "https://www.example.com",
      DEPLOY_URL: "https://6123abc--example-site.netlify.app",
      DEPLOY_PRIME_URL: "https://deploy-preview-4--example-site.netlify.app",
      SITE_NAME: "example-site",
    });
    expect(csrf?.trustedOrigins).toEqual([
      "https://deploy-preview-4--example-site.netlify.app",
      "https://6123abc--example-site.netlify.app",
      "https://example-site.netlify.app",
    ]);
  });

  it("ignores a variable that is not an http(s) origin rather than failing the build", () => {
    const { csrf } = configUnder({ URL: "https://www.example.com", DEPLOY_URL: "not a url" });
    expect(csrf?.trustedOrigins).toEqual([]);
  });
});

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(svelte|ts|js)$/.test(entry) && !/\.(test|spec)\.ts$/.test(entry)) out.push(full);
  }
  return out;
}

// What a source file reads through `import * as <name> from "$app/env/<type>"`.
function envReads(source: string): { type: "public" | "private"; name: string }[] {
  const reads: { type: "public" | "private"; name: string }[] = [];
  const imports = source.matchAll(
    /import\s+\*\s+as\s+(\w+)\s+from\s+["']\$app\/env\/(public|private)["']/g,
  );
  for (const [, binding, type] of imports) {
    for (const [, name] of source.matchAll(new RegExp(`\\b${binding}\\.([A-Z][A-Z0-9_]*)`, "g"))) {
      reads.push({ type: type as "public" | "private", name });
    }
  }
  return reads;
}

describe("environment variables (kit 3 exposes only what src/env.ts declares)", () => {
  const files = walk(join(repoRoot, "src"));

  it("finds the reads it is meant to check (the instrument's control)", () => {
    const names = files.flatMap((f) => envReads(readFileSync(f, "utf8")).map((r) => r.name));
    expect(names).toContain("FORMS_INGEST_URL");
    expect(names).toContain("PUBLIC_TURNSTILE_SITE_KEY");
  });

  it("declares every variable src/ reads, as public exactly when it is read from $app/env/public", () => {
    const declared = variables as Record<string, { public?: boolean }>;
    const missing = files.flatMap((file) =>
      envReads(readFileSync(file, "utf8"))
        .filter(
          ({ type, name }) =>
            !(name in declared) || !!declared[name].public !== (type === "public"),
        )
        .map(({ type, name }) => `${relative(repoRoot, file)}: ${name} from $app/env/${type}`),
    );
    expect(missing).toEqual([]);
  });

  it("reads none through $env/*, whose `env` object is now only a view of the declared list", () => {
    const legacy = files.filter((file) => /from\s+["']\$env\//.test(readFileSync(file, "utf8")));
    expect(legacy.map((f) => relative(repoRoot, f))).toEqual([]);
  });
});
