import type { RequestHandler } from "./$types";

export const prerender = true;

// Replaces static/robots.txt so the Sitemap line can carry an absolute URL —
// the robots spec requires one, and a static file can't know its own origin.
// During prerender, `url.origin` comes from kit.prerender.origin (set from
// Netlify's URL env in svelte.config.js); local builds fall back to
// SvelteKit's placeholder origin, which is fine — robots.txt only matters
// on the deployed site.
export const GET: RequestHandler = ({ url }) => {
  const body = `User-agent: *
Disallow:

Sitemap: ${url.origin}/sitemap.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
};
