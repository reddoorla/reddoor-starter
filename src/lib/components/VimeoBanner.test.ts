import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/svelte";
import { tick } from "svelte";
import VimeoBanner from "./VimeoBanner.svelte";

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  callback: IntersectionObserverCallback;
  observed: Element[] = [];
  disconnected = false;
  constructor(cb: IntersectionObserverCallback) {
    this.callback = cb;
    FakeIntersectionObserver.instances.push(this);
  }
  observe(el: Element) {
    this.observed.push(el);
  }
  disconnect() {
    this.disconnected = true;
  }
  unobserve() {}
  takeRecords() {
    return [];
  }
  trigger(isIntersecting: boolean) {
    this.callback(
      [
        {
          isIntersecting,
          target: this.observed[0],
        } as IntersectionObserverEntry,
      ],
      this as unknown as IntersectionObserver,
    );
  }
}

function mockMatchMedia(reducedMotion: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches:
      query === "(prefers-reduced-motion: reduce)" ? reducedMotion : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  }));
}

const props = {
  vimeoId: "76979871",
  poster: {
    img: { src: "data:image/gif;base64,R0lGODlhAQABAAAAACw=", w: 3, h: 2 },
    sources: {},
  },
  alt: "Background reel",
};

beforeEach(() => {
  FakeIntersectionObserver.instances = [];
  // @ts-expect-error — replacing global for test
  window.IntersectionObserver = FakeIntersectionObserver;
  mockMatchMedia(false);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

/** Engage (first input) + scroll near viewport — the two mount conditions. */
async function engageAndIntersect() {
  FakeIntersectionObserver.instances[0].trigger(true);
  window.dispatchEvent(new Event("pointermove"));
  await tick();
}

function vimeoMessage(event: string, origin = "https://player.vimeo.com") {
  return new MessageEvent("message", {
    origin,
    data: JSON.stringify({ event }),
  });
}

describe("VimeoBanner", () => {
  it("renders the poster with no iframe until the visitor engages AND the banner is near the viewport", async () => {
    const { container } = render(VimeoBanner, props);
    expect(container.querySelector("img")).toBeTruthy();
    expect(container.querySelector("iframe")).toBeNull();

    // Intersection alone is not enough (a Lighthouse audit scrolls but never inputs).
    FakeIntersectionObserver.instances[0].trigger(true);
    await tick();
    expect(container.querySelector("iframe")).toBeNull();

    window.dispatchEvent(new Event("pointermove"));
    await tick();
    const iframe = container.querySelector("iframe")!;
    expect(iframe).toBeTruthy();
    expect(iframe.getAttribute("src")).toContain(
      "player.vimeo.com/video/76979871",
    );
    expect(iframe.getAttribute("tabindex")).toBe("-1");
  });

  it("never creates the iframe under prefers-reduced-motion", async () => {
    mockMatchMedia(true);
    const { container } = render(VimeoBanner, props);
    // No observer is even created — the effect bails before IO setup.
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
    window.dispatchEvent(new Event("pointermove"));
    await tick();
    expect(container.querySelector("iframe")).toBeNull();
    expect(container.querySelector("img")).toBeTruthy();
  });

  it("keeps the iframe hidden until a heartbeat arrives from player.vimeo.com", async () => {
    const { container } = render(VimeoBanner, props);
    await engageAndIntersect();
    const wrapper = container.querySelector("iframe")!.parentElement!;
    expect(wrapper.className).toContain("opacity-0");

    window.dispatchEvent(vimeoMessage("playProgress"));
    await tick();
    expect(wrapper.className).toContain("opacity-100");
  });

  it("ignores heartbeat messages from other origins", async () => {
    const { container } = render(VimeoBanner, props);
    await engageAndIntersect();
    const wrapper = container.querySelector("iframe")!.parentElement!;

    window.dispatchEvent(
      vimeoMessage("playProgress", "https://evil.example.com"),
    );
    // Lookalike suffix host — must not pass a strict-equality check.
    window.dispatchEvent(
      vimeoMessage("playProgress", "https://notplayer.vimeo.com"),
    );
    await tick();
    expect(wrapper.className).toContain("opacity-0");
  });

  it("survives opaque origins and junk payloads without throwing", async () => {
    const { container } = render(VimeoBanner, props);
    await engageAndIntersect();
    const wrapper = container.querySelector("iframe")!.parentElement!;

    // `new URL("null")` throws — a sandboxed-iframe message must not crash the handler.
    window.dispatchEvent(
      new MessageEvent("message", { origin: "null", data: "{}" }),
    );
    window.dispatchEvent(
      new MessageEvent("message", {
        origin: "https://player.vimeo.com",
        data: "not json",
      }),
    );
    window.dispatchEvent(
      new MessageEvent("message", {
        origin: "https://player.vimeo.com",
        data: "null", // parses to null — must not TypeError on .event
      }),
    );
    await tick();
    expect(wrapper.className).toContain("opacity-0");
  });

  it("falls back to the poster when heartbeats stop (iOS autoplay suspension)", async () => {
    vi.useFakeTimers({
      toFake: [
        "setTimeout",
        "clearTimeout",
        "setInterval",
        "clearInterval",
        "performance",
      ],
    });
    const { container } = render(VimeoBanner, props);
    await engageAndIntersect();
    const wrapper = container.querySelector("iframe")!.parentElement!;

    window.dispatchEvent(vimeoMessage("playProgress"));
    await tick();
    expect(wrapper.className).toContain("opacity-100");

    // Watchdog polls each second; >2.5s without a beat hides the video.
    vi.advanceTimersByTime(4000);
    await tick();
    expect(wrapper.className).toContain("opacity-0");
  });
});
