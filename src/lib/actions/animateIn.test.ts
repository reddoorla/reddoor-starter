import { describe, it, expect, beforeEach, vi } from "vitest";
import { animateIn } from "./animateIn";

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
  // Test helper — trigger an intersection event.
  trigger(isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting, target: this.observed[0] } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

function mockMatchMedia(reducedMotion: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)" ? reducedMotion : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  }));
}

beforeEach(() => {
  FakeIntersectionObserver.instances = [];
  // @ts-expect-error — replacing global for test
  window.IntersectionObserver = FakeIntersectionObserver;
  mockMatchMedia(false);
});

describe("animateIn — viewport mode", () => {
  it("applies initial hidden styles on mount", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    animateIn(el);

    expect(el.style.opacity).toBe("0");
    expect(el.style.transform).toBe("translateY(50%)");
    expect(el.style.transition).toContain("opacity 2400ms var(--transition-fast-slow)");
    expect(el.style.transition).toContain("transform 2400ms var(--transition-fast-slow)");
  });

  it("reveals on intersection and disconnects the observer", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    animateIn(el);
    const observer = FakeIntersectionObserver.instances[0];
    expect(observer).toBeDefined();
    expect(observer.observed[0]).toBe(el);

    observer.trigger(true);

    expect(el.style.opacity).toBe("1");
    expect(el.style.transform).toBe("translateY(0)");
    expect(observer.disconnected).toBe(true);
  });

  it("does not reveal when not intersecting", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    animateIn(el);
    FakeIntersectionObserver.instances[0].trigger(false);

    expect(el.style.opacity).toBe("0");
    expect(FakeIntersectionObserver.instances[0].disconnected).toBe(false);
  });

  it("disconnects the observer on destroy", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    const ret = animateIn(el);
    const observer = FakeIntersectionObserver.instances[0];
    ret.destroy();

    expect(observer.disconnected).toBe(true);
  });
});
