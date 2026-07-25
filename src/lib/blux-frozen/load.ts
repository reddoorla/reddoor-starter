import { frozenSlotsFromDoc, type FrozenRenderSlot } from "./from-doc";
import { getFrozenPageDoc, type FrozenPageDoc } from "./frozen-page-doc";
import { frozenArtifacts, type FrozenArtifact } from "./artifacts";

// Production frozen-page resolution for the shared `[[preview]]` routes. A repo is
// a frozen Blux site iff it has BOTH a committed per-uid template artifact AND a
// published `frozen_page` doc. The committed artifact is checked FIRST (a cheap,
// build-time gate), so a non-frozen repo pays no extra Prismic query and falls
// straight through to the normal `getPageDoc` → `SliceZone` path.

export interface FrozenPageData {
  frozen: true;
  template: string;
  styleCss: string;
  fontLinks: string[];
  slots: FrozenRenderSlot[];
  title: string;
  metaTitle?: string | undefined;
  metaDescription?: string | undefined;
  metaImageUrl?: string | undefined;
}

/** Compose a committed artifact + a Prismic `frozen_page` doc into the render
 * shape `<FrozenPage>` wants. Slots are decoded via the shared mapper; SEO meta
 * comes from the doc; fontLinks come from the artifact. */
export function buildFrozenData(
  art: FrozenArtifact,
  doc: FrozenPageDoc,
): FrozenPageData {
  return {
    frozen: true,
    template: art.template,
    styleCss: art.styleCss,
    fontLinks: art.fontLinks,
    slots: frozenSlotsFromDoc(doc.data.slots),
    title: doc.data.title ?? "",
    metaTitle: doc.data.meta_title || undefined,
    metaDescription: doc.data.meta_description || undefined,
    metaImageUrl: doc.data.meta_image?.url || undefined,
  };
}

type FrozenReadClient = Parameters<typeof getFrozenPageDoc>[0];

/**
 * Frozen render data for `uid`, or `null` to fall through to the normal path.
 * `artifacts` is injectable for testing; it defaults to the glob-built map.
 */
export async function resolveFrozen(
  client: FrozenReadClient,
  uid: string,
  artifacts: Record<string, FrozenArtifact> = frozenArtifacts,
): Promise<FrozenPageData | null> {
  const art = artifacts[uid];
  if (!art) return null; // not a frozen site (no committed artifact) → fall through
  const doc = await getFrozenPageDoc(client, uid);
  return doc ? buildFrozenData(art, doc) : null;
}

/** Uids with a committed frozen artifact — the prerender entry list. */
export function frozenUids(
  artifacts: Record<string, FrozenArtifact> = frozenArtifacts,
): string[] {
  return Object.keys(artifacts);
}
