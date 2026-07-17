import { render, cleanup } from "@testing-library/svelte";
import { describe, it, expect, afterEach } from "vitest";
import type { Content } from "@prismicio/client";
import BluxSection from "./index.svelte";

afterEach(() => cleanup());

const rt = (level: string, text: string) => [{ type: level, text, spans: [] }];

const slice = {
  slice_type: "blux_section",
  variation: "default",
  primary: {
    heading: rt("heading2", "Amenities"),
    background_image: {
      url: "https://cdn.example/bg.jpg",
      alt: "bg",
      dimensions: { width: 1200, height: 800 },
      edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
    },
    background_color: "#111111",
    min_height: "80vh",
    vertical_align: "middle",
    widget_kind: "Two White Lines",
    widget_html: "<hr class='divider' />",
    cells: [
      { kind: "text", title: rt("heading3", "Pool"), body: rt("paragraph", "Heated."), subgrid: [] },
      {
        kind: "subgrid",
        title: rt("heading3", "Floors"),
        subgrid: [
          { kind: "text", title: rt("heading4", "Level 2"), body: rt("paragraph", "Studios") },
          { kind: "text", title: rt("heading4", "Level 3"), body: rt("paragraph", "One-beds") },
        ],
      },
    ],
  },
} as unknown as Content.BluxSectionSlice;

describe("BluxSection slice", () => {
  it("renders the band heading and one node per cell", () => {
    const { getByRole, container } = render(BluxSection, { props: { slice } });
    expect(getByRole("heading", { level: 2 }).textContent).toContain("Amenities");
    expect(container.querySelectorAll(".blux-section__cells > .blux-cell")).toHaveLength(2);
  });

  it("renders nested subgrid cells", () => {
    const { getAllByRole } = render(BluxSection, { props: { slice } });
    expect(getAllByRole("heading", { level: 4 })).toHaveLength(2);
  });

  it("renders the inline widget html and background color", () => {
    const { container } = render(BluxSection, { props: { slice } });
    expect(container.querySelector(".blux-widget[data-widget='Two White Lines'] hr.divider")).not.toBeNull();
    // jsdom's CSSOM normalizes hex colors when the style attribute is parsed,
    // so the serialized attribute reads back as rgb(), same as the
    // established convention in GridBand.test.ts (.style.backgroundColor).
    expect(container.querySelector(".blux-section")?.getAttribute("style")).toContain(
      "background-color: rgb(17, 17, 17)",
    );
    expect(container.querySelector(".blux-section__bg")).not.toBeNull();
  });

  it("renders a cell's embed html and link", () => {
    const embedSlice = {
      slice_type: "blux_section",
      variation: "default",
      primary: {
        cells: [
          {
            kind: "embed",
            embed_html: "<span class='promo'>Book now</span>",
            link: { link_type: "Web", url: "https://ex.com" },
            link_label: "Details",
            subgrid: [],
          },
        ],
      },
    } as unknown as Content.BluxSectionSlice;

    const { container, getByText } = render(BluxSection, { props: { slice: embedSlice } });
    expect(container.querySelector(".promo")?.textContent).toContain("Book now");
    const link = getByText("Details");
    expect(link.closest("a")?.getAttribute("href")).toBe("https://ex.com");
  });
});
