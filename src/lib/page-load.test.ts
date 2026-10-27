import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/svelte";
import { NotFoundError, RepositoryNotFoundError } from "@prismicio/client";

import CtaBanner from "$lib/slices/CtaBanner/index.svelte";

import { loadPage, type PageClient } from "./page-load";

const doc = {
  uid: "about",
  type: "page",
  data: { title: [{ type: "heading1", text: "About", spans: [] }], slices: [] },
} as never;

const clientThat = (behaviour: () => Promise<never> | Promise<typeof doc>) =>
  ({ getByUID: behaviour }) as unknown as PageClient;

describe("loadPage", () => {
  it("returns the document plus its head payload", async () => {
    const client = clientThat(async () => doc);
    await expect(loadPage(client, "about")).resolves.toMatchObject({
      page: doc,
      title: "About",
    });
  });

  it("turns a Prismic miss into a 404", async () => {
    const client = clientThat(async () => {
      throw new NotFoundError("No documents were returned", "https://x", undefined);
    });
    await expect(loadPage(client, "missing")).rejects.toMatchObject({
      status: 404,
    });
  });

  it("rethrows anything that is not a miss so outages stay loud", async () => {
    const boom = new Error("ECONNRESET");
    const client = clientThat(async () => {
      throw boom;
    });
    await expect(loadPage(client, "about")).rejects.toBe(boom);
  });

  it("rethrows a wrong repository name instead of calling it a 404", async () => {
    const wrongRepo = new RepositoryNotFoundError("Repository not found", "https://x", undefined);
    const client = clientThat(async () => {
      throw wrongRepo;
    });
    await expect(loadPage(client, "about")).rejects.toBe(wrongRepo);
  });
});

// The client is routes-free ($lib/prismicio), so the API sends a document link
// with no `url`, and `PrismicLink` — the slices' button, and the default for
// every rich-text hyperlink — reads `url` alone: an <a> with no href
// (roalson-interests#10).
describe("loadPage — document links reach the page with an href", () => {
  afterEach(() => cleanup());

  it("renders a CTA and a rich-text link to documents at their routes", async () => {
    const link = (uid: string) => ({
      link_type: "Document",
      id: uid,
      type: "page",
      uid,
      tags: [],
      lang: "en-us",
      isBroken: false,
    });
    const about = {
      uid: "about",
      type: "page",
      data: {
        title: [{ type: "heading1", text: "About", spans: [] }],
        slices: [
          {
            slice_type: "cta_banner",
            variation: "default",
            primary: {
              heading: [
                {
                  type: "heading2",
                  text: "Meet the team",
                  spans: [{ start: 9, end: 13, type: "hyperlink", data: link("our-team") }],
                },
              ],
              buttonLabel: "Get in touch",
              buttonLink: link("home"),
              background: "light",
            },
            items: [],
          },
        ],
      },
    } as never;
    const { page } = await loadPage(
      clientThat(async () => about),
      "about",
    );
    const { getByRole } = render(CtaBanner, {
      props: { slice: (page.data.slices as never[])[0] },
    });
    expect(getByRole("link", { name: "Get in touch" }).getAttribute("href")).toBe("/");
    expect(getByRole("link", { name: "team" }).getAttribute("href")).toBe("/our-team");
  });
});
