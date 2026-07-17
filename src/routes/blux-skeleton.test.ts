import { render } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";
import { SliceZone } from "@prismicio/svelte";
import { components } from "$lib/slices";

const rt = (level: string, text: string) => [{ type: level, text, spans: [] }];

// A page body mixing a container, a leaf, and the fallback — the full skeleton.
const slices = [
  {
    slice_type: "blux_section",
    variation: "default",
    primary: {
      heading: rt("heading2", "Amenities"),
      cells: [{ kind: "text", title: rt("heading3", "Pool"), subgrid: [] }],
    },
  },
  { slice_type: "blux_text", variation: "default", primary: { title: rt("heading2", "Welcome"), buttons: [] } },
  {
    slice_type: "blux_block",
    variation: "default",
    primary: { payload: JSON.stringify({ tag: "div", children: [{ html: "<p>Fallback content</p>" }] }) },
  },
];

describe("Blux catalog walking skeleton", () => {
  it("renders container, leaf, and fallback slices through the shared SliceZone", () => {
    const { getByText } = render(SliceZone, { props: { slices: slices as never, components } });
    expect(getByText("Amenities")).not.toBeNull();
    expect(getByText("Pool")).not.toBeNull();
    expect(getByText("Welcome")).not.toBeNull();
    expect(getByText("Fallback content")).not.toBeNull();
  });
});
