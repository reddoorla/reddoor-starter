import { error } from "@sveltejs/kit";

import { pageMeta } from "$lib/page-meta";
import { createClient, isPlaceholderRepo } from "$lib/prismicio";

export async function load({ fetch, cookies }) {
  const client = createClient({ fetch, cookies });

  try {
    // The homepage is the `page` document with uid "home".
    const page = await client.getByUID("page", "home");
    return { page, ...pageMeta(page) };
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
