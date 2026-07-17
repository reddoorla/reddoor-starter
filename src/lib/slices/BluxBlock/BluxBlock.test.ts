import { render, cleanup } from "@testing-library/svelte";
import { describe, it, expect, afterEach } from "vitest";
import type { Content } from "@prismicio/client";
import BluxBlock from "./index.svelte";

afterEach(() => cleanup());

const tree = {
  tag: "section",
  className: "band",
  children: [
    { tag: "div", className: "row", children: [
      { html: "<h3>Stacking Plan</h3>" },
      { image: { url: "https://cdn.example/plan.png", alt: "plan" } },
      { tag: "div", children: [{ html: "<p>Level 4</p>" }] },
    ] },
  ],
};

const slice = {
  slice_type: "blux_block",
  variation: "default",
  primary: { payload: JSON.stringify(tree) },
} as unknown as Content.BluxBlockSlice;

describe("BluxBlock fallback slice", () => {
  it("recursively renders the serialized tree at any depth", () => {
    const { getByText, container } = render(BluxBlock, { props: { slice } });
    expect(getByText("Stacking Plan")).not.toBeNull();
    expect(getByText("Level 4")).not.toBeNull();
    expect(container.querySelector("img[alt='plan']")?.getAttribute("src")).toBe("https://cdn.example/plan.png");
    expect(container.querySelector("section.band .row")).not.toBeNull();
  });

  it("renders nothing for an unparseable payload", () => {
    const bad = { ...slice, primary: { payload: "not json" } } as unknown as Content.BluxBlockSlice;
    const { container } = render(BluxBlock, { props: { slice: bad } });
    expect(container.querySelector(".blux-block")).toBeNull();
  });
});
