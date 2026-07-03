import { describe, it, expect } from "vitest";
import {
  isPrismicImageUrl,
  imgix,
  srcset,
  DEFAULT_IMAGE_WIDTHS,
} from "./image";

const PRISMIC_URL =
  "https://images.prismic.io/repo/abc123_hero.jpg?auto=compress";

describe("isPrismicImageUrl", () => {
  it("accepts a Prismic imgix URL", () => {
    expect(isPrismicImageUrl(PRISMIC_URL)).toBe(true);
  });

  it("rejects other hosts", () => {
    expect(isPrismicImageUrl("https://example.com/hero.jpg")).toBe(false);
  });

  it("rejects URLs that only mention the host in their path", () => {
    expect(
      isPrismicImageUrl("https://evil.example/images.prismic.io/hero.jpg"),
    ).toBe(false);
  });

  it("rejects null, undefined, empty, and malformed input", () => {
    expect(isPrismicImageUrl(null)).toBe(false);
    expect(isPrismicImageUrl(undefined)).toBe(false);
    expect(isPrismicImageUrl("")).toBe(false);
    expect(isPrismicImageUrl("not a url")).toBe(false);
  });
});

describe("imgix", () => {
  it("returns empty string for missing URLs", () => {
    expect(imgix(null)).toBe("");
    expect(imgix(undefined)).toBe("");
    expect(imgix("")).toBe("");
  });

  it("returns non-Prismic URLs unchanged", () => {
    expect(imgix("https://example.com/hero.jpg", { w: 100 })).toBe(
      "https://example.com/hero.jpg",
    );
    expect(imgix("not a url")).toBe("not a url");
  });

  it("always sets auto=format,compress", () => {
    const url = new URL(imgix(PRISMIC_URL));
    expect(url.searchParams.get("auto")).toBe("format,compress");
  });

  it("applies params and overrides existing query values", () => {
    const url = new URL(imgix(`${PRISMIC_URL}&w=4000`, { w: 800, q: 60 }));
    expect(url.searchParams.get("w")).toBe("800");
    expect(url.searchParams.get("q")).toBe("60");
  });

  it("preserves unrelated existing query params", () => {
    const url = new URL(imgix(`${PRISMIC_URL}&rect=0,0,100,100`, { w: 800 }));
    expect(url.searchParams.get("rect")).toBe("0,0,100,100");
  });
});

describe("srcset", () => {
  it("returns undefined for non-Prismic URLs so the attribute can be omitted", () => {
    expect(srcset("https://example.com/hero.jpg")).toBeUndefined();
    expect(srcset(null)).toBeUndefined();
    expect(srcset(undefined)).toBeUndefined();
  });

  it("builds one candidate per default width", () => {
    const candidates = srcset(PRISMIC_URL)!.split(", ");
    expect(candidates).toHaveLength(DEFAULT_IMAGE_WIDTHS.length);
    for (const [i, width] of DEFAULT_IMAGE_WIDTHS.entries()) {
      expect(candidates[i]).toContain(`w=${width}`);
      expect(candidates[i].endsWith(` ${width}w`)).toBe(true);
    }
  });

  it("accepts a custom width ladder", () => {
    const candidates = srcset(PRISMIC_URL, [320, 640])!.split(", ");
    expect(candidates).toHaveLength(2);
    expect(candidates[0]).toContain("w=320");
    expect(candidates[1]).toContain("w=640");
  });
});
