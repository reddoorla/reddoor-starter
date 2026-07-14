import { describe, expect, it, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import BandContent from "./BandContent.svelte";

afterEach(() => cleanup());
const children = () =>
  createRawSnippet(() => ({ render: () => "<p>copy</p>" }));

describe("BandContent", () => {
  it("applies Blux blockcontainer defaults when the band gives no hints", () => {
    const { container } = render(BandContent, {
      props: { band: null, children: children() },
    });
    const box = container.querySelector("div") as HTMLElement;
    expect(box.style.maxWidth).toBe("1280px");
    // jsdom normalizes the shorthand ("0 4%" → "0px 4%").
    expect(box.style.padding).toBe("0px 4%");
    expect(box.textContent).toContain("copy");
  });

  it("honors the band's captured content padding, max-width and text-align", () => {
    const { container } = render(BandContent, {
      props: {
        band: {
          style: {
            _contentPadding: "100px 4% 100px 4%",
            "_max-content-width": "960px",
            "text-align": "center",
          },
        },
        children: children(),
      },
    });
    const box = container.querySelector("div") as HTMLElement;
    expect(box.style.maxWidth).toBe("960px");
    // jsdom collapses the 4-value shorthand to its 2-value equivalent.
    expect(box.style.padding).toBe("100px 4%");
    expect(box.style.textAlign).toBe("center");
  });

  it("hugs a narrow column to the requested side", () => {
    const { container } = render(BandContent, {
      props: {
        band: {
          style: { "_column-width": "420px", "_column-side": "right" },
        },
        children: children(),
      },
    });
    const box = container.querySelector("div") as HTMLElement;
    const column = box.querySelector("div") as HTMLElement;
    expect(column.style.maxWidth).toBe("420px");
    expect(column.style.marginInlineStart).toBe("auto");
    expect(column.textContent).toContain("copy");
  });
});
