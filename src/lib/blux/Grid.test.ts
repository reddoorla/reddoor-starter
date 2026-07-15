import { describe, expect, it, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/svelte";
import Grid from "./Grid.svelte";
import type { RenderNode } from "./presentation";

afterEach(() => cleanup());

const tree: RenderNode = {
  kind: "stack",
  children: [
    { kind: "heading", level: 2, html: "The <em>Space</em>", role: "text2" },
    {
      kind: "row",
      cells: [
        {
          token: { cols: 2, ratio: 60 },
          node: { kind: "body", html: "<p>Left copy</p>", role: "text4" },
        },
        {
          token: { cols: 2, ratio: 40 },
          node: {
            kind: "media",
            media: { kind: "image", url: "https://cdn/a.jpg" },
          },
        },
      ],
    },
  ],
};

describe("Grid (recursive fallback)", () => {
  it("renders nested rows/cells with token widths and role classes", () => {
    const { container } = render(Grid, { props: { node: tree } });
    const h2 = container.querySelector("h2");
    expect(h2?.innerHTML).toContain("The <em>Space</em>");
    expect(h2?.className).toContain("txt-role-text2");
    const cells = container.querySelectorAll("[data-grid-cell]");
    expect(cells).toHaveLength(2);
    expect(
      (cells[0] as HTMLElement).style.getPropertyValue("--cell-basis"),
    ).toBe("60%");
    expect(
      (cells[1] as HTMLElement).style.getPropertyValue("--cell-basis"),
    ).toBe("40%");
    // Cells stack full-width on mobile; the token basis applies from md: up.
    expect((cells[0] as HTMLElement).className).toContain("basis-full");
    expect((cells[0] as HTMLElement).className).toContain(
      "md:basis-(--cell-basis)",
    );
    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      "https://cdn/a.jpg",
    );
    expect(container.textContent).toContain("Left copy");
  });

  it("renders raw html verbatim and a placeholder for widgets", () => {
    const { container } = render(Grid, {
      props: {
        node: {
          kind: "stack",
          children: [
            { kind: "raw", html: "<div class='legacy'>kept</div>" },
            { kind: "widget", widget: { type: "map" } },
          ],
        },
      },
    });
    expect(container.querySelector(".legacy")?.textContent).toBe("kept");
    expect(container.querySelector("[data-widget='map']")).not.toBeNull();
  });

  it("mounts LocationMap for a widget:map when a map config is provided", () => {
    const { container } = render(Grid, {
      props: {
        node: {
          kind: "stack",
          children: [{ kind: "widget", widget: { type: "map" } }],
        },
        map: { mid: "M", layers: [], toggles: [], styles: [] },
      },
    });
    expect(container.querySelector("[data-map-placeholder]")).not.toBeNull();
    expect(container.querySelector("[data-widget='map']")).toBeNull();
  });

  it("clamps heading levels to the h1–h6 range", () => {
    const { container } = render(Grid, {
      props: {
        node: { kind: "heading", level: 9, html: "Deep" },
      },
    });
    expect(container.querySelector("h6")).not.toBeNull();
    expect(container.querySelector("h9")).toBeNull();
  });

  it("wraps media in a full-width block with an inline-block image, never mx-auto", () => {
    const { container } = render(Grid, {
      props: {
        node: {
          kind: "media",
          media: { kind: "image", url: "https://cdn/rule.png" },
        },
      },
    });
    const img = container.querySelector("img") as HTMLElement;
    // Image is inline-block so it follows the ancestor's text-align, not forced
    // center: no `mx-auto`, no `block`.
    expect(img.className).toContain("inline-block");
    expect(img.className).not.toContain("mx-auto");
    // It sits inside a full-width wrapper div.
    const wrapper = img.parentElement as HTMLElement;
    expect(wrapper.tagName).toBe("DIV");
    expect(wrapper.className).toContain("w-full");
  });

  it("applies a text node's export style: inline color/padding, margin-right as a md-scoped var", () => {
    const { container } = render(Grid, {
      props: {
        node: {
          kind: "subtitle",
          text: "aside",
          role: "text5",
          style: {
            color: "rgb(255, 255, 255)",
            padding: "8px",
            "margin-right": "20%",
          },
        },
      },
    });
    const p = container.querySelector("p") as HTMLElement;
    // Role class is preserved alongside the md-scoped margin utility.
    expect(p.className).toContain("txt-role-text5");
    // color + padding apply inline at every width.
    expect(p.style.color).toBe("rgb(255, 255, 255)");
    expect(p.style.padding).toBe("8px");
    // margin-right is desktop-only: it rides a custom property + md: class, and
    // must NOT be an unconditional inline margin-right that leaks onto mobile.
    expect(p.style.marginRight).toBe("");
    expect(p.style.getPropertyValue("--node-mr")).toBe("20%");
    expect(p.className).toContain("md:mr-(--node-mr)");
  });

  it("applies inline color to a styled heading", () => {
    const { container } = render(Grid, {
      props: {
        node: {
          kind: "heading",
          level: 2,
          html: "Bright",
          role: "text11",
          style: { color: "rgb(255, 255, 255)" },
        },
      },
    });
    const h2 = container.querySelector("h2") as HTMLElement;
    expect(h2.className).toContain("txt-role-text11");
    expect(h2.style.color).toBe("rgb(255, 255, 255)");
    // No margin var when the export carries no margin-right.
    expect(h2.className).not.toContain("md:mr-(--node-mr)");
  });

  it("a text node with no style carries only its role class and no inline style", () => {
    const { container } = render(Grid, {
      props: {
        node: { kind: "subtitle", text: "plain", role: "text5" },
      },
    });
    const p = container.querySelector("p") as HTMLElement;
    expect(p.className).toBe("txt-role-text5");
    expect(p.getAttribute("style")).toBeNull();
  });

  it("a cell with cols 'any' falls back to an auto basis from md: up", () => {
    const { container } = render(Grid, {
      props: {
        node: {
          kind: "row",
          cells: [
            { token: { cols: "any" }, node: { kind: "subtitle", text: "s" } },
          ],
        },
      },
    });
    const cell = container.querySelector("[data-grid-cell]") as HTMLElement;
    expect(cell.style.getPropertyValue("--cell-basis")).toBe("auto");
    expect(cell.className).toContain("basis-full");
    expect(cell.className).toContain("md:basis-(--cell-basis)");
  });
});
