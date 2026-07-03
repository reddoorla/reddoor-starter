import { describe, it, expect, beforeEach, vi } from "vitest";
import type { AfterNavigate } from "@sveltejs/kit";
import { scrollToTopOnNavigate } from "./scrollToTopOnNavigate";

function nav(
  fromPath: string | null,
  toPath: string | null,
  type: AfterNavigate["type"] = "link",
): AfterNavigate {
  return {
    type,
    from: fromPath ? { url: new URL(fromPath, "https://example.com") } : null,
    to: toPath ? { url: new URL(toPath, "https://example.com") } : null,
  } as AfterNavigate;
}

let scrollToMock: ReturnType<typeof vi.fn>;
let rafCallbacks: FrameRequestCallback[];

beforeEach(() => {
  scrollToMock = vi.fn();
  // jsdom's scrollTo is a "not implemented" stub; replace so calls are observable.
  window.scrollTo = scrollToMock as unknown as typeof window.scrollTo;
  rafCallbacks = [];
  window.requestAnimationFrame = (cb: FrameRequestCallback) => {
    rafCallbacks.push(cb);
    return rafCallbacks.length;
  };
  document.documentElement.style.scrollBehavior = "";
});

describe("scrollToTopOnNavigate", () => {
  it("scrolls to the top on a cross-page link navigation", () => {
    scrollToTopOnNavigate(nav("/", "/about"));
    expect(scrollToMock).toHaveBeenCalledWith(0, 0);
  });

  it("suspends smooth scroll-behavior for one frame around the jump", () => {
    scrollToTopOnNavigate(nav("/", "/about"));
    expect(document.documentElement.style.scrollBehavior).toBe("auto");

    for (const cb of rafCallbacks) cb(0);
    expect(document.documentElement.style.scrollBehavior).toBe("");
  });

  it("skips the initial enter navigation (hash deep links, reload restore)", () => {
    scrollToTopOnNavigate(nav(null, "/about#team", "enter"));
    expect(scrollToMock).not.toHaveBeenCalled();
  });

  it("skips popstate so back/forward keeps SvelteKit's scroll restoration", () => {
    scrollToTopOnNavigate(nav("/", "/about", "popstate"));
    expect(scrollToMock).not.toHaveBeenCalled();
  });

  it("skips same-pathname hash navigation", () => {
    scrollToTopOnNavigate(nav("/about", "/about#team"));
    expect(scrollToMock).not.toHaveBeenCalled();
  });

  it("skips same-pathname query-only navigation", () => {
    scrollToTopOnNavigate(nav("/products?page=1", "/products?page=2"));
    expect(scrollToMock).not.toHaveBeenCalled();
  });
});
