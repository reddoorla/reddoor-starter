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
  Object.defineProperty(window, "innerWidth", { value: 1024, configurable: true });
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

  it("sets transition-delay based on horizontal position", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    // Element 25% across a 1000px viewport, delayMax 400 → 100ms delay.
    Object.defineProperty(window, "innerWidth", { value: 1000, configurable: true });
    el.getBoundingClientRect = () =>
      ({ left: 250, top: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;

    animateIn(el);

    expect(el.style.transitionDelay).toBe("100ms");
  });

  it("honors a custom delayMax", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    Object.defineProperty(window, "innerWidth", { value: 1000, configurable: true });
    el.getBoundingClientRect = () =>
      ({ left: 500, top: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;

    animateIn(el, { delayMax: 800 });

    expect(el.style.transitionDelay).toBe("400ms");
  });
});

describe("animateIn — triggered mode", () => {
  it("mounts hidden when trigger is false (boolean shorthand)", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    animateIn(el, false);

    expect(el.style.opacity).toBe("0");
    expect(el.style.transform).toBe("translateY(50%)");
    expect(FakeIntersectionObserver.instances.length).toBe(0);
  });

  it("mounts visible when trigger is true (boolean shorthand)", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    animateIn(el, true);

    expect(el.style.opacity).toBe("1");
    expect(el.style.transform).toBe("translateY(0)");
    expect(FakeIntersectionObserver.instances.length).toBe(0);
  });

  it("mounts visible when options have trigger: true", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    animateIn(el, { trigger: true });

    expect(el.style.opacity).toBe("1");
    expect(FakeIntersectionObserver.instances.length).toBe(0);
  });

  it("does not set transition-delay in triggered mode", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    animateIn(el, false);

    expect(el.style.transitionDelay).toBe("");
  });
});
