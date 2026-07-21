import { render, cleanup } from "@testing-library/svelte";
import { describe, it, expect, afterEach } from "vitest";
import Footer from "./Footer.svelte";

afterEach(() => cleanup());

describe("Footer", () => {
  it("default: renders the hardcoded copyright (fleet behavior unchanged)", () => {
    const { container } = render(Footer);
    expect(container.querySelector("footer")).not.toBeNull();
    expect(container.querySelector("footer")?.textContent).toContain(
      "Company Name",
    );
  });

  it("columns prop renders text items with tel/mailto links", () => {
    const { container, getByText } = render(Footer, {
      props: {
        columns: [
          {
            items: [
              { text: "Todd Doney" },
              { text: "213.613.3330", href: "tel:213.593.1360" },
              {
                text: "Todd.Doney@cbre.com",
                href: "mailto:Todd.Doney@cbre.com",
              },
            ],
          },
        ],
      },
    });
    // A no-href text item is a plain <p>, never an anchor.
    const plain = getByText("Todd Doney");
    expect(plain.tagName).toBe("P");
    expect(plain.closest("a")).toBeNull();

    const tel = container.querySelector("a[href='tel:213.593.1360']");
    expect(tel?.textContent).toContain("213.613.3330");
    // tel:/mailto: stay same-tab — no target/rel.
    expect(tel?.getAttribute("target")).toBeNull();
    expect(tel?.getAttribute("rel")).toBeNull();
    expect(container.querySelector("footer")).not.toBeNull();
  });

  it("columns prop renders image items, linked when href present", () => {
    const { container } = render(Footer, {
      props: {
        columns: [
          {
            items: [
              {
                image: {
                  url: "https://cdn/logo.png",
                  maxWidth: "300px",
                  alt: "Burbank Portfolio",
                },
                href: "https://www.theburbankportfolio.com/",
              },
              { image: { url: "https://cdn/plain.png" } },
            ],
          },
        ],
      },
    });
    const linked = container.querySelector(
      "a[href='https://www.theburbankportfolio.com/'] img",
    );
    expect(linked?.getAttribute("src")).toBe("https://cdn/logo.png");
    expect((linked as HTMLElement)?.style.maxWidth).toBe("300px");
    expect(linked?.getAttribute("alt")).toBe("Burbank Portfolio");

    // http(s) logo link opens in a new tab with the safe rel.
    const anchor = container.querySelector(
      "a[href='https://www.theburbankportfolio.com/']",
    );
    expect(anchor?.getAttribute("target")).toBe("_blank");
    expect(anchor?.getAttribute("rel")).toBe("noopener noreferrer");

    // Two images total; only the href'd one is wrapped in an anchor.
    const imgs = container.querySelectorAll("img");
    expect(imgs.length).toBe(2);
    expect(container.querySelectorAll("a > img").length).toBe(1);
  });

  it("linked logo exposes its alt as the link's accessible name (a11y)", () => {
    const { getByRole } = render(Footer, {
      props: {
        columns: [
          {
            items: [
              {
                image: {
                  url: "https://cdn/logo.png",
                  alt: "Burbank Portfolio",
                },
                href: "https://www.theburbankportfolio.com/",
              },
            ],
          },
        ],
      },
    });
    // The anchor wrapping only an <img> derives its name from the img alt.
    expect(getByRole("link", { name: "Burbank Portfolio" })).not.toBeNull();
  });

  it("default branch when columns is empty/undefined (fleet default preserved)", () => {
    const { container } = render(Footer, { props: { columns: [] } });
    expect(container.querySelector("footer")?.textContent).toContain(
      "Company Name",
    );
  });
});
