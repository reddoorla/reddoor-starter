import { error, redirect } from "@sveltejs/kit";

import {
  collectionTypesOf,
  loadCollections,
} from "$lib/blux-catalog/collections-load";
import {
  getAllPageDocs,
  getPageDoc,
  pageMeta,
  toPrerenderEntries,
} from "$lib/blux-catalog/page-doc";
import { createClient, isPlaceholderRepo } from "$lib/prismicio";

export async function load({ params, fetch, cookies }) {
  if (params.uid === "home") redirect(308, "/");

  const client = createClient({ fetch, cookies });

  try {
    // Native `page` or Blux-migrated `catalog_page` — a repo has only one.
    const page = await getPageDoc(client, params.uid);

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

export async function entries() {
  if (isPlaceholderRepo) return [];

  const client = createClient();

  // Both native `page` and Blux-migrated `catalog_page` docs, so a migrated
  // multi-page site prerenders every page at its real route.
  return toPrerenderEntries(await getAllPageDocs(client));
}
