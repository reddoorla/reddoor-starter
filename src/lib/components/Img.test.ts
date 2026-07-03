import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/svelte";
import { tick } from "svelte";
import Img from "./Img.svelte";

afterEach(() => cleanup());

// Minimal shape of a vite-imagetools `?as=run` import — enough for SvelteImg
// to render its inner <img>.
const runImport = {
  img: { src: "data:image/gif;base64,R0lGODlhAQABAAAAACw=", w: 3, h: 2 },
  sources: {},
};

describe("Img", () => {
  it("renders blurred until the underlying image loads", async () => {
    const { container } = render(Img, { src: runImport, alt: "test" });
    const img = container.querySelector("img")!;
    expect(img.className).toContain("progressive-img");
    expect(img.className).not.toContain("progressive-img--loaded");

    img.dispatchEvent(new Event("load"));
    await tick();
    expect(img.className).toContain("progressive-img--loaded");
  });

  it("unblurs on error too, so a broken image never stays blurred", async () => {
    const { container } = render(Img, { src: runImport, alt: "test" });
    const img = container.querySelector("img")!;

    img.dispatchEvent(new Event("error"));
    await tick();
    expect(img.className).toContain("progressive-img--loaded");
  });

  it("marks an already-complete (cached) image loaded without a load event", async () => {
    // jsdom images are never complete; simulate a cache hit at mount time.
    const desc = {
      complete: Object.getOwnPropertyDescriptor(
        HTMLImageElement.prototype,
        "complete",
      ),
      naturalWidth: Object.getOwnPropertyDescriptor(
        HTMLImageElement.prototype,
        "naturalWidth",
      ),
    };
    Object.defineProperty(HTMLImageElement.prototype, "complete", {
      get: () => true,
      configurable: true,
    });
    Object.defineProperty(HTMLImageElement.prototype, "naturalWidth", {
      get: () => 3,
      configurable: true,
    });

    try {
      const { container } = render(Img, { src: runImport, alt: "test" });
      await tick();
      const img = container.querySelector("img")!;
      expect(img.className).toContain("progressive-img--loaded");
    } finally {
      Object.defineProperty(
        HTMLImageElement.prototype,
        "complete",
        desc.complete!,
      );
      Object.defineProperty(
        HTMLImageElement.prototype,
        "naturalWidth",
        desc.naturalWidth!,
      );
    }
  });

  it("appends the passed class after the progressive classes", () => {
    const { container } = render(Img, {
      src: runImport,
      alt: "test",
      class: "object-cover",
    });
    const img = container.querySelector("img")!;
    expect(img.className).toContain("progressive-img");
    expect(img.className).toContain("object-cover");
  });
});
