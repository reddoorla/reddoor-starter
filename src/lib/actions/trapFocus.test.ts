import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { trapFocus } from "./trapFocus";

// jsdom performs no layout, so getClientRects() is always empty and the
// action's visibility filter would reject everything. Treat connected
// elements as visible.
beforeEach(() => {
  vi.spyOn(Element.prototype, "getClientRects").mockImplementation(function (
    this: Element,
  ) {
    return (this.isConnected ? [{}] : []) as unknown as DOMRectList;
  });
  // Run rAF callbacks synchronously so mount-focus and restore-focus are
  // observable without frame plumbing.
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

function overlayWithButtons(labels: string[]) {
  const overlay = document.createElement("div");
  const buttons = labels.map((label) => {
    const b = document.createElement("button");
    b.textContent = label;
    overlay.appendChild(b);
    return b;
  });
  document.body.appendChild(overlay);
  return { overlay, buttons };
}

function pressTab(target: Element, shiftKey = false) {
  const e = new KeyboardEvent("keydown", {
    key: "Tab",
    shiftKey,
    bubbles: true,
    cancelable: true,
  });
  target.dispatchEvent(e);
  return e;
}

describe("trapFocus — initial focus", () => {
  it("focuses the first focusable child on mount", () => {
    const { buttons } = overlayWithButtons(["first", "second"]);
    trapFocus(buttons[0].parentElement as HTMLElement);
    expect(document.activeElement).toBe(buttons[0]);
  });

  it("prefers a [data-autofocus] element over the first focusable", () => {
    const { overlay, buttons } = overlayWithButtons(["first", "second"]);
    buttons[1].setAttribute("data-autofocus", "");
    trapFocus(overlay);
    expect(document.activeElement).toBe(buttons[1]);
  });

  it("focuses the container itself when there are no focusable children", () => {
    const overlay = document.createElement("div");
    overlay.textContent = "Please rotate your device";
    document.body.appendChild(overlay);
    trapFocus(overlay);
    expect(overlay.getAttribute("tabindex")).toBe("-1");
    expect(document.activeElement).toBe(overlay);
  });

  it("skips children hidden from layout (empty client rects)", () => {
    const { overlay, buttons } = overlayWithButtons(["hidden", "visible"]);
    const hidden = buttons[0];
    vi.spyOn(Element.prototype, "getClientRects").mockImplementation(function (
      this: Element,
    ) {
      return (this === hidden ? [] : [{}]) as unknown as DOMRectList;
    });
    trapFocus(overlay);
    expect(document.activeElement).toBe(buttons[1]);
  });
});

describe("trapFocus — Tab cycling", () => {
  it("wraps Tab on the last item back to the first", () => {
    const { overlay, buttons } = overlayWithButtons(["a", "b", "c"]);
    trapFocus(overlay);

    buttons[2].focus();
    const e = pressTab(buttons[2]);

    expect(e.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(buttons[0]);
  });

  it("wraps Shift+Tab on the first item to the last", () => {
    const { overlay, buttons } = overlayWithButtons(["a", "b", "c"]);
    trapFocus(overlay);

    const e = pressTab(buttons[0], true);

    expect(e.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(buttons[2]);
  });

  it("lets Tab proceed natively between interior items", () => {
    const { overlay, buttons } = overlayWithButtons(["a", "b", "c"]);
    trapFocus(overlay);

    buttons[1].focus();
    const e = pressTab(buttons[1]);

    // Not wrapped — the browser's normal tab order takes over.
    expect(e.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(buttons[1]);
  });

  it("pulls focus back in when it has escaped the overlay", () => {
    const { overlay, buttons } = overlayWithButtons(["a", "b"]);
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    trapFocus(overlay);

    outside.focus();
    const e = pressTab(overlay);

    expect(e.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(buttons[0]);
  });

  it("does not trap Tab when there are no focusable children", () => {
    const overlay = document.createElement("div");
    document.body.appendChild(overlay);
    trapFocus(overlay);

    const e = pressTab(overlay);
    expect(e.defaultPrevented).toBe(false);
  });
});

describe("trapFocus — Escape", () => {
  it("calls onEscape and swallows the event", () => {
    const onEscape = vi.fn();
    const { overlay, buttons } = overlayWithButtons(["a"]);
    trapFocus(overlay, { onEscape });

    const e = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });
    buttons[0].dispatchEvent(e);

    expect(onEscape).toHaveBeenCalledOnce();
    expect(e.defaultPrevented).toBe(true);
  });

  it("ignores Escape when no onEscape is provided", () => {
    const { overlay, buttons } = overlayWithButtons(["a"]);
    trapFocus(overlay);

    const e = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });
    buttons[0].dispatchEvent(e);
    expect(e.defaultPrevented).toBe(false);
  });
});

describe("trapFocus — restore on destroy", () => {
  it("restores focus to the previously focused element", () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();

    const { overlay, buttons } = overlayWithButtons(["a"]);
    const action = trapFocus(overlay);
    expect(document.activeElement).toBe(buttons[0]);

    action.destroy();
    expect(document.activeElement).toBe(trigger);
  });

  it("uses restoreFocus when the original trigger unmounted while open", () => {
    // Model a menu button inside {#if !open}: the element focused at open time
    // is detached by close time, and a fresh instance has re-mounted.
    const oldTrigger = document.createElement("button");
    document.body.appendChild(oldTrigger);
    oldTrigger.focus();

    const { overlay } = overlayWithButtons(["a"]);
    const newTrigger = document.createElement("button");
    const action = trapFocus(overlay, { restoreFocus: () => newTrigger });

    oldTrigger.remove();
    document.body.appendChild(newTrigger);
    action.destroy();

    expect(document.activeElement).toBe(newTrigger);
  });

  it("does not restore to a detached element", () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();

    const { overlay, buttons } = overlayWithButtons(["a"]);
    const action = trapFocus(overlay);

    trigger.remove();
    action.destroy();

    // Nothing valid to restore to — focus stays where it was.
    expect(document.activeElement).toBe(buttons[0]);
  });
});

describe("trapFocus — enabled option", () => {
  it("is a complete no-op when mounted with enabled: false", () => {
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    outside.focus();

    const { overlay, buttons } = overlayWithButtons(["a", "b"]);
    const action = trapFocus(overlay, { enabled: false });

    // No focus stolen on mount.
    expect(document.activeElement).toBe(outside);

    // No Tab trap.
    buttons[1].focus();
    const e = pressTab(buttons[1]);
    expect(e.defaultPrevented).toBe(false);

    // No focus restore on destroy.
    buttons[0].focus();
    action.destroy();
    expect(document.activeElement).toBe(buttons[0]);
  });

  it("activates when update flips enabled to true", () => {
    const { overlay, buttons } = overlayWithButtons(["a", "b"]);
    const action = trapFocus(overlay, { enabled: false });

    action.update({ enabled: true });
    expect(document.activeElement).toBe(buttons[0]);

    buttons[1].focus();
    const e = pressTab(buttons[1]);
    expect(e.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(buttons[0]);
  });

  it("releases the trap and restores focus when update flips enabled to false", () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();

    const { overlay, buttons } = overlayWithButtons(["a"]);
    const action = trapFocus(overlay);
    expect(document.activeElement).toBe(buttons[0]);

    action.update({ enabled: false });
    expect(document.activeElement).toBe(trigger);

    const e = pressTab(buttons[0], true);
    expect(e.defaultPrevented).toBe(false);
  });
});
