import { error } from "@sveltejs/kit";

import {
  collectionTypesOf,
  loadCollections,
} from "$lib/blux-catalog/collections-load";
import { getPageDoc, pageMeta } from "$lib/blux-catalog/page-doc";
import { createClient, isPlaceholderRepo } from "$lib/prismicio";

export async function load({ fetch, cookies }) {
  const client = createClient({ fetch, cookies });

  try {
    // Native `page` or Blux-migrated `catalog_page` — both pin home to "home".
    const page = await getPageDoc(client, "home");

    // Entity documents for any blux_collection slices on this page — slices
    // never fetch; SliceZone hands these down as context.collections.
    const collections = await loadCollections(
      client,
      collectionTypesOf(page.data.slices as never),
    );

    return { page, collections, ...pageMeta(page) };
  } catch {
    error(404, { message: "Page not found" });
  }
}

// On an unconfigured starter, skip prerendering "/" — the load above would
// 404 on the placeholder repo and fail the build. Real sites still prerender
// the home route normally.
export function entries() {
  return isPlaceholderRepo ? [] : [{}];
}
