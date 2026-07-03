import type { AfterNavigate } from "@sveltejs/kit";

/**
 * `afterNavigate` handler that forces an instant scroll-to-top on route
 * change. app.css sets `html { scroll-behavior: smooth }`, which would turn
 * the reset into a visible glide across the page — so scroll-behavior is
 * flipped to `auto` for one frame around the jump.
 *
 * Deliberately skipped:
 * - `enter` (initial load) — the browser owns hash-anchor jumps and reload
 *   scroll restoration on first render.
 * - `popstate` (back/forward) — SvelteKit restores the previous scroll
 *   position itself; jumping to the top would break it.
 * - same-pathname navigations (hash links, query-only changes) — scrolling
 *   to the top would fight the anchor the user just clicked.
 */
export function scrollToTopOnNavigate({ from, to, type }: AfterNavigate): void {
  if (type === "enter" || type === "popstate") return;
  if (from?.url.pathname === to?.url.pathname) return;

  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    document.documentElement.style.scrollBehavior = "";
  });
}
