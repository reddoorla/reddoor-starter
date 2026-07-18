import { render, cleanup } from "@testing-library/svelte";
import { describe, it, expect, afterEach } from "vitest";
import type { Content } from "@prismicio/client";
import BluxGrid from "./index.svelte";

const rt = (level: string, text: string) => [{ type: level, text, spans: [] }];
afterEach(() => cleanup());

const slice = {
  slice_type: "blux_grid",
  variation: "default",
  primary: {
    heading: rt("heading2", "Amenities"),
    columns: 4,
    spacing: 16,
    cells: [
      { kind: "text", title: rt("heading3", "Pool"), subgrid: [] },
      { kind: "text", title: rt("heading3", "Gym"), subgrid: [] },
      { kind: "text", title: rt("heading3", "Roof"), subgrid: [] },
    ],
  },
} as unknown as Content.BluxGridSlice;

describe("BluxGrid slice", () => {
  it("renders one cell per entry and reflects the column count", () => {
    const { container, getAllByRole } = render(BluxGrid, { props: { slice } });
    expect(
      container.querySelector(".blux-grid__cells[data-columns='4']"),
    ).not.toBeNull();
    expect(
      container.querySelectorAll(".blux-grid__cells > .blux-cell"),
    ).toHaveLength(3);
    expect(getAllByRole("heading", { level: 3 })).toHaveLength(3);
  });
});
