import { describe, it, expect } from "vitest";
import { GET } from "./+server";

function get(origin: string) {
  return GET({
    url: new URL(`${origin}/robots.txt`),
  } as Parameters<typeof GET>[0]);
}

describe("GET /robots.txt", () => {
  it("allows all agents", async () => {
    const body = await (await get("https://example.com")).text();
    expect(body).toContain("User-agent: *");
    expect(body).toContain("Disallow:\n");
    // "Disallow:" with no path = allow everything; make sure no path snuck in.
    expect(body).not.toMatch(/Disallow: \S/);
  });

  it("points at the sitemap with an absolute URL on the request origin", async () => {
    const body = await (await get("https://example.com")).text();
    expect(body).toContain("Sitemap: https://example.com/sitemap.xml");
  });

  it("serves text/plain", async () => {
    const response = await get("https://example.com");
    expect(response.headers.get("Content-Type")).toBe("text/plain");
  });
});
