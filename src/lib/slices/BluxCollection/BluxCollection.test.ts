import { render, cleanup } from "@testing-library/svelte";
import { describe, it, expect, afterEach } from "vitest";
import type { Content } from "@prismicio/client";
import BluxCollection from "./index.svelte";

const rt = (level: string, text: string) => [{ type: level, text, spans: [] }];
afterEach(() => cleanup());

type EntityDoc = {
  uid: string;
  data: Record<string, unknown>;
};

const img = {
  url: "https://images.example/steel-chair.jpg",
  alt: "Steel chair",
  dimensions: { width: 800, height: 600 },
};

const docs: EntityDoc[] = [
  {
    uid: "steel-chair",
    data: {
      title: rt("heading1", "Steel Chair"),
      media: img,
      tags: "metal, seating",
    },
  },
  {
    uid: "oak-table",
    data: {
      title: rt("heading1", "Oak Table"),
      media: img,
      tags: "wood",
    },
  },
  {
    uid: "iron-lamp",
    data: {
      title: rt("heading1", "Iron Lamp"),
      tags: "metal",
      link: { link_type: "Web", url: "https://vendor.example/iron-lamp" },
    },
  },
];

const slice = (primary: Record<string, unknown>) =>
  ({
    slice_type: "blux_collection",
    variation: "default",
    primary,
  }) as unknown as Content.BluxCollectionSlice;

describe("BluxCollection slice", () => {
  it("filters by filter_tag, applies limit, renders img+title cards", () => {
    const { container, getByText, queryByText } = render(BluxCollection, {
      props: {
        slice: slice({
          heading: rt("heading2", "Products"),
          collection_type: "product",
          filter_tag: "metal",
          limit: 5,
          layout: "grid",
        }),
        context: { collections: { product: docs } },
      },
    });
    // Both metal-tagged docs survive; the wood one is filtered out.
    expect(container.querySelectorAll(".blux-collection__card")).toHaveLength(
      2,
    );
    expect(getByText("Steel Chair")).not.toBeNull();
    expect(getByText("Iron Lamp")).not.toBeNull();
    expect(queryByText("Oak Table")).toBeNull();
    // The card with media renders an img.
    expect(
      container.querySelector(".blux-collection__card img"),
    ).not.toBeNull();
  });

  it("limit truncates the filtered list", () => {
    const { container } = render(BluxCollection, {
      props: {
        slice: slice({
          collection_type: "product",
          filter_tag: "metal",
          limit: 1,
          layout: "grid",
        }),
        context: { collections: { product: docs } },
      },
    });
    expect(container.querySelectorAll(".blux-collection__card")).toHaveLength(
      1,
    );
  });

  it("card-link contract: only the external Web link gets an <a>, others none", () => {
    const { container } = render(BluxCollection, {
      props: {
        slice: slice({ collection_type: "product", layout: "grid" }),
        context: { collections: { product: docs } },
      },
    });
    const anchors = container.querySelectorAll("a");
    expect(anchors).toHaveLength(1);
    expect(anchors[0].getAttribute("href")).toBe(
      "https://vendor.example/iron-lamp",
    );
    // The linked card is the external-link one.
    expect(anchors[0].textContent).toContain("Iron Lamp");
    // All three cards render (no filter, no limit).
    expect(container.querySelectorAll(".blux-collection__card")).toHaveLength(
      3,
    );
  });

  it("no context: renders the empty container without crashing", () => {
    const { container } = render(BluxCollection, {
      props: {
        slice: slice({ collection_type: "product", layout: "grid" }),
      },
    });
    expect(container.querySelector("section.blux-collection")).not.toBeNull();
    expect(container.querySelectorAll(".blux-collection__card")).toHaveLength(
      0,
    );
  });
});
