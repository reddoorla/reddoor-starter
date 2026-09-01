import { error, redirect } from "@sveltejs/kit";

import { pageMeta } from "$lib/page-meta";
import { createClient, isPlaceholderRepo } from "$lib/prismicio";

export async function load({ params, fetch, cookies }) {
  if (params.uid === "home") redirect(308, "/");

  const client = createClient({ fetch, cookies });

  try {
    const page = await client.getByUID("page", params.uid);
    return { page, ...pageMeta(page) };
  } catch {
    error(404, { message: "Page not found" });
  }
}

// Prerender every page document at its real route. "home" renders at "/" via
// the root route, so it is excluded here. Empty on an unconfigured starter so
// `pnpm build` succeeds before the Prismic repo is wired.
export async function entries() {
  if (isPlaceholderRepo) return [];

  const pages = await createClient().getAllByType("page");
  return pages
    .filter((page) => page.uid !== "home")
    .map((page) => ({ uid: page.uid }));
}
