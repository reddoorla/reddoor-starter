import { describe, expect, it } from "vitest";

import { withDocumentLinks } from "./cms-href";
import { linkResolver } from "./prismicio";

describe("withDocumentLinks — a fetched document's links given the url the client cannot fill", () => {
  const toTeam = { link_type: "Document", id: "t", type: "page", uid: "our-team" };
  const toHome = { link_type: "Document", id: "h", type: "page", uid: "home" };

  it("fills every document link, at every depth: field, group row, slice, rich-text span", () => {
    const doc = {
      id: "about",
      type: "page",
      url: null,
      data: {
        cta: toTeam,
        slices: [
          {
            slice_type: "cta_banner",
            primary: {
              buttonLink: toHome,
              heading: [
                {
                  type: "paragraph",
                  text: "Meet the team",
                  spans: [{ start: 9, end: 13, type: "hyperlink", data: toTeam }],
                },
              ],
              rows: [{ link: toTeam }],
            },
          },
        ],
      },
    };
    const out = withDocumentLinks(doc, linkResolver);
    const primary = out.data.slices[0]!.primary;
    expect(out.data.cta).toMatchObject({ url: "/our-team" });
    expect(primary.buttonLink).toMatchObject({ url: "/" });
    expect(primary.heading[0]!.spans[0]!.data).toMatchObject({ url: "/our-team" });
    expect(primary.rows[0]!.link).toMatchObject({ url: "/our-team" });
    // The document itself is not a link, and the input is not mutated.
    expect(out.url).toBeNull();
    expect(doc.data.cta).not.toHaveProperty("url");
  });

  it("leaves a broken link, a web link and a type with no route as they were", () => {
    const broken = { ...toTeam, isBroken: true };
    const webLink = { link_type: "Web", url: "https://example.com" };
    const unrouted = { link_type: "Document", id: "s", type: "settings", uid: "x" };
    expect(withDocumentLinks({ broken, webLink, unrouted }, linkResolver)).toEqual({
      broken,
      webLink,
      unrouted,
    });
  });
});
