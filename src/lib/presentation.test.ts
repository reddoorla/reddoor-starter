import { describe, it, expect } from "vitest";
import {
  bandStyle,
  contentStyle,
  pagePresentation,
  roleClass,
} from "./presentation";

// The starter ships an empty blux-presentation.json — a fresh site has no
// converted export yet. These tests pin the graceful-default behaviour the
// generic slice components rely on: with no manifest, every slice renders on
// its component defaults (no role classes, no inline band/content styles).
// After `blux emit`, the site drops in its real manifest + theme.css and the
// same components pick up the roles and block styles automatically.

describe("pagePresentation (empty starter manifest)", () => {
  it("returns an empty map for any page until a real manifest is dropped in", () => {
    expect(pagePresentation("home").size).toBe(0);
    expect(pagePresentation("anything").size).toBe(0);
  });
});

describe("roleClass", () => {
  it("names the role utility class when a role is known", () => {
    expect(roleClass("text5")).toBe("txt-role-text5");
  });
  it("returns empty string with no role (element keeps its base default)", () => {
    expect(roleClass(undefined)).toBe("");
  });
});

describe("bandStyle", () => {
  it("is empty when the block carries no styling", () => {
    expect(bandStyle(undefined)).toBe("");
    expect(bandStyle({})).toBe("");
  });
  it("paints a full-bleed background band from background-color", () => {
    expect(bandStyle({ "background-color": "#ffffff" })).toBe(
      "background-color: #ffffff",
    );
  });
  it("turns a height into a min-height flex band aligned by vertical-align", () => {
    expect(bandStyle({ height: "100vh", "vertical-align": "middle" })).toBe(
      "min-height: 100vh; display: flex; flex-direction: column; justify-content: center",
    );
  });
  it("maps top/bottom vertical-align and honours a caller fallback height", () => {
    expect(bandStyle({ height: "80vh", "vertical-align": "top" })).toContain(
      "justify-content: flex-start",
    );
    expect(bandStyle({}, "45vh")).toBe(
      "min-height: 45vh; display: flex; flex-direction: column; justify-content: center",
    );
  });
});

describe("contentStyle", () => {
  it("is empty when the block constrains nothing", () => {
    expect(contentStyle(undefined)).toBe("");
    expect(contentStyle({})).toBe("");
  });
  it("narrows the content box and passes text alignment through", () => {
    expect(
      contentStyle({ "_max-content-width": "920px", "text-align": "left" }),
    ).toBe("max-width: 920px; text-align: left");
  });
});
