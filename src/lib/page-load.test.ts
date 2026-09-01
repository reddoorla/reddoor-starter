import { describe, expect, it } from "vitest";
import { NotFoundError } from "@prismicio/client";

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
      throw new NotFoundError(
        "No documents were returned",
        "https://x",
        undefined,
      );
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
});
