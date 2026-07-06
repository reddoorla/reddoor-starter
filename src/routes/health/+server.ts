import { json } from "@sveltejs/kit";
import { env as privateEnv } from "$env/dynamic/private";
import { env as publicEnv } from "$env/dynamic/public";
import { createClient, isPlaceholderRepo } from "$lib/prismicio";
import type { RequestHandler } from "./$types";

// Deploys as a Netlify function under adapter-netlify v6 — a live probe, so it
// must never be prerendered.
export const prerender = false;

type PrismicHealth = "ok" | "error" | "skipped";

// Server-side Prismic reachability probe. Hits the PUBLIC repository-metadata
// endpoint (getRepository — no token), time-boxed, and returns ONLY a status
// string. The repository body is never included: /health is public and
// unauthenticated, so it exposes booleans and status strings, nothing more.
async function probePrismic(fetch: typeof globalThis.fetch): Promise<PrismicHealth> {
  if (isPlaceholderRepo) return "skipped";
  const client = createClient({ fetch });
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("prismic health probe timed out")), 5000);
    });
    await Promise.race([client.getRepository(), timeout]);
    return "ok";
  } catch {
    return "error";
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export const GET: RequestHandler = async ({ fetch }) => {
  const prismic = await probePrismic(fetch);
  const forms = {
    ingestUrl: !!privateEnv.FORMS_INGEST_URL,
    ingestToken: !!privateEnv.FORMS_INGEST_TOKEN,
    turnstile: !!publicEnv.PUBLIC_TURNSTILE_SITE_KEY,
  };
  // We are inside the handler, so the function ran. The downstream function-health
  // audit treats an unreachable endpoint as "not present"; ok is false only when
  // the Prismic probe actively errored.
  const functionRan = true;
  const ok = functionRan && prismic !== "error";
  return json({ ok, prismic, forms });
};
