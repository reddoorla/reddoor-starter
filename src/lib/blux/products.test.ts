import { describe, it, expect } from "vitest";
import { allProducts, getProduct, productSlugs } from "./products";
import { categorySlug } from "./product-types";

describe("products loader", () => {
  it("ships an empty catalog on the unconverted starter", () => {
    // The stub is []; a fresh site has no product routes until `blux convert`.
    expect(allProducts()).toEqual([]);
    expect(productSlugs()).toEqual([]);
    expect(getProduct("anything")).toBeUndefined();
  });
});

describe("categorySlug", () => {
  it("slugifies a category to its listing path segment", () => {
    expect(categorySlug("Upholstered")).toBe("upholstered");
    expect(categorySlug("Ottomans & Benches")).toBe("ottomans-benches");
    expect(categorySlug("  Case  ")).toBe("case");
  });
});
