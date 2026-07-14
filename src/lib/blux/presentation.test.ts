import { describe, expect, it } from "vitest";
import { bandFor, cellWidth, loadPresentation } from "./presentation";
import type { Presentation } from "./presentation";

describe("presentation", () => {
  it("loadPresentation returns the checked-in manifest (empty until `blux convert`)", () => {
    const p = loadPresentation();
    // The starter ships the empty stub; a converted site's emit output has one
    // entry per band, keyed by string index.
    expect(p.bands).toEqual({});
  });

  it("bandFor looks up by band index and returns null when absent", () => {
    const p: Presentation = {
      bands: { "3": { style: { "background-color": "#eef" } } },
    };
    expect(bandFor(p, 3)?.style?.["background-color"]).toBe("#eef");
    expect(bandFor(p, 4)).toBeNull();
    expect(bandFor(undefined, 3)).toBeNull();
  });

  it("bandFor tolerates a manifest missing the bands key", () => {
    expect(bandFor({} as Presentation, 1)).toBeNull();
  });

  it("bandFor stamps the band index onto the entry (section anchor id)", () => {
    const p: Presentation = { bands: { "5": { style: {} } } };
    expect(bandFor(p, 5)?.index).toBe(5);
  });

  it("cellWidth: ratio → %, spacing ignored, numeric cols → 100/cols, any → null", () => {
    expect(cellWidth({ cols: 2, ratio: 60 })).toBe("60%");
    // spacing is a gap, not a width: a 1-col grid stacks full-width.
    expect(cellWidth({ cols: 1, spacing: 40 })).toBe("100%");
    expect(cellWidth({ cols: 4 })).toBe("25%");
    expect(cellWidth({ cols: 3 })).toBe("33.3333%");
    expect(cellWidth({ cols: "any", spacing: 20 })).toBeNull();
  });

  it("cellWidth guards non-positive cols instead of yielding Infinity%", () => {
    expect(cellWidth({ cols: 0 })).toBeNull();
  });

  it("carries the map payload on a band (render contract)", () => {
    const p: Presentation = {
      bands: {
        "14": {
          map: {
            mid: "M",
            layers: [
              {
                name: "A",
                lid: "L",
                initiallyVisible: true,
                preserveViewport: false,
              },
            ],
            toggles: [{ label: "All", layers: ["A"] }],
            styles: [],
          },
        },
      },
    };
    expect(bandFor(p, 14)?.map?.mid).toBe("M");
  });

  it("carries text-role metadata on a band (Hero/TitleBand contract)", () => {
    const p: Presentation = {
      bands: {
        "2": {
          text: {
            headingRole: "text5",
            headingLevel: 2,
            subtitleRole: "text12",
          },
        },
      },
    };
    expect(bandFor(p, 2)?.text?.subtitleRole).toBe("text12");
  });
});
