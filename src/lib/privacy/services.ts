export type SourceFile = { path: string; text: string };

export type HostedService = "vimeo" | "youtube" | "googleFonts" | "adobeFonts" | "mailchimp";

export type BuildServices = Record<HostedService, boolean> & {
  forms: boolean;
  ga4: boolean;
  netlify: boolean;
};

export type PrivacyServices = BuildServices & { turnstile: boolean };

export const SERVICE_HOSTS: Record<HostedService, string[]> = {
  vimeo: ["player.vimeo.com"],
  youtube: ["youtube.com", "youtube-nocookie.com"],
  googleFonts: ["fonts.googleapis.com", "fonts.gstatic.com"],
  adobeFonts: ["use.typekit.net"],
  mailchimp: ["list-manage.com"],
};

const MEASUREMENT_ID_PATTERNS = [
  /initAnalytics\s*\(\s*\{[^}]*?\bmeasurementId\s*:\s*["'`](G-[A-Z0-9]{10})["'`]/,
  /googletagmanager\.com\/gtag\/js\?id=(G-[A-Z0-9]{10})\b/,
];

export function maskComments(source: string): string {
  let out = "";
  let i = 0;
  let quote: string | null = null;
  while (i < source.length) {
    const c = source[i];
    if (quote) {
      out += c;
      if (c === "\\" && i + 1 < source.length) {
        out += source[i + 1];
        i += 2;
        continue;
      }
      if (c === quote || (c === "\n" && quote !== "`")) quote = null;
      i++;
      continue;
    }
    if (source.startsWith("<!--", i)) {
      const end = source.indexOf("-->", i + 4);
      i = end === -1 ? source.length : end + 3;
      continue;
    }
    if (source.startsWith("/*", i)) {
      const end = source.indexOf("*/", i + 2);
      i = end === -1 ? source.length : end + 2;
      continue;
    }
    if (source.startsWith("//", i) && source[i - 1] !== ":") {
      const end = source.indexOf("\n", i);
      i = end === -1 ? source.length : end;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") quote = c;
    out += c;
    i++;
  }
  return out;
}

export function measurementIdIn(code: string): string | null {
  for (const pattern of MEASUREMENT_ID_PATTERNS) {
    const match = pattern.exec(code);
    if (match) return match[1];
  }
  return null;
}

const mentions = (code: string, hosts: string[]) => hosts.some((h) => code.includes(h));

export function deriveBuildServices(input: {
  svelteConfig: string;
  sources: SourceFile[];
}): BuildServices {
  const config = maskComments(input.svelteConfig);
  const code = input.sources.map((s) => maskComments(s.text));
  const hasCsp = /\bcsp\s*:/.test(config) && /\bdirectives\s*:/.test(config);
  const hosted = (service: HostedService) =>
    code.some((c) => mentions(c, SERVICE_HOSTS[service])) &&
    (!hasCsp || mentions(config, SERVICE_HOSTS[service]));

  return {
    forms: code.some((c) => /\bcreateIngestAction\s*\(/.test(c)),
    ga4: code.some((c) => measurementIdIn(c) !== null),
    netlify: config.includes("@sveltejs/adapter-netlify"),
    vimeo: hosted("vimeo"),
    youtube: hosted("youtube"),
    googleFonts: hosted("googleFonts"),
    adobeFonts: hosted("adobeFonts"),
    mailchimp: hosted("mailchimp"),
  };
}

export function withRuntime(
  build: BuildServices,
  runtime: { turnstileSiteKey?: string },
): PrivacyServices {
  return { ...build, turnstile: build.forms && !!runtime.turnstileSiteKey?.trim() };
}
