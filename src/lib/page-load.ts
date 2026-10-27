import { error } from "@sveltejs/kit";
import { NotFoundError, RepositoryNotFoundError } from "@prismicio/client";

import type { PageDocument } from "../../prismicio-types";
import { withDocumentLinks } from "$lib/cms-href";
import { pageMeta } from "$lib/page-meta";
import { linkResolver } from "$lib/prismicio";

/** The minimal client surface the loader needs — method syntax keeps the real
 *  `createClient()` return type assignable, and lets tests pass a stub. */
export type PageClient = {
  getByUID(type: "page", uid: string): Promise<PageDocument>;
};

/** Load one `page` document and the layout's head payload for it, with its
 *  document links resolved (see withDocumentLinks).
 *
 *  Only a genuine miss (Prismic's NotFoundError: no document with that uid)
 *  becomes a 404. Everything else — an outage, a bad access token, a wrong
 *  repository name, a malformed response — is rethrown so it surfaces as a
 *  5xx at runtime and fails a prerender loudly instead of baking a false
 *  "Page not found" into the build.
 *
 *  (The route loaders answer 404 themselves on the placeholder repo before
 *  calling this, so an unconfigured clone still builds.) */
export async function loadPage(client: PageClient, uid: string) {
  try {
    const page = withDocumentLinks(await client.getByUID("page", uid), linkResolver);
    return { page, ...pageMeta(page) };
  } catch (err) {
    // RepositoryNotFoundError extends NotFoundError but means "wrong repository
    // name", not "no such page" — that must stay loud.
    if (err instanceof NotFoundError && !(err instanceof RepositoryNotFoundError)) {
      error(404, "Page not found");
    }
    throw err;
  }
}
