import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import type { Plugin } from "vite";
import {
  deriveBuildServices,
  type BuildServices,
  type SourceFile,
} from "../src/lib/privacy/services.ts";

export const VIRTUAL_ID = "virtual:privacy-services";
const RESOLVED_ID = "\0" + VIRTUAL_ID;

const CODE_FILE = /\.(svelte|ts|js|mjs|css|html)$/;
const SKIPPED_FILE = /\.(test|spec)\.[jt]s$|\.d\.ts$/;
const SKIPPED_DIRS = ["src/lib/privacy", "src/routes/privacy", "src/routes/dev"];

function walk(root: string, dir: string, out: SourceFile[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    const rel = relative(root, full).split(sep).join("/");
    if (entry.isDirectory()) {
      if (!SKIPPED_DIRS.includes(rel)) walk(root, full, out);
    } else if (CODE_FILE.test(entry.name) && !SKIPPED_FILE.test(entry.name)) {
      out.push({ path: rel, text: readFileSync(full, "utf8") });
    }
  }
}

export function collectBuildServices(root: string): BuildServices {
  const configPath = join(root, "svelte.config.js");
  const sources: SourceFile[] = [];
  if (existsSync(join(root, "src"))) walk(root, join(root, "src"), sources);
  return deriveBuildServices({
    svelteConfig: existsSync(configPath) ? readFileSync(configPath, "utf8") : "",
    sources,
  });
}

export function privacyServices(): Plugin {
  let root = process.cwd();
  return {
    name: "reddoor:privacy-services",
    configResolved(config) {
      root = config.root;
    },
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined;
    },
    load(id) {
      if (id !== RESOLVED_ID) return undefined;
      return `export default ${JSON.stringify(collectBuildServices(root))};`;
    },
  };
}
