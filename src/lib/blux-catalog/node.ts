/** The fallback tree a BluxBlock slice carries as stringified JSON in its
 * `payload` field. Renders any depth via BluxNode.svelte. Structure/media are
 * preserved; assets are Prismic asset URLs rewritten by Emit (see spec §6). */
export type BluxNode = {
  tag?: string; // container element tag, default "div"
  className?: string;
  style?: Record<string, string>;
  html?: string; // leaf raw HTML (rich text / embed), rendered with {@html}
  image?: { url: string; alt?: string; width?: number; height?: number };
  children?: BluxNode[];
};

export function parseBluxPayload(payload: string | null | undefined): BluxNode | null {
  if (!payload) return null;
  try {
    const node = JSON.parse(payload) as BluxNode;
    return node && typeof node === "object" ? node : null;
  } catch {
    return null;
  }
}

export function styleString(style: Record<string, string> | undefined): string {
  if (!style) return "";
  return Object.entries(style)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
}
