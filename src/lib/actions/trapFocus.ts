// Focus management for modal overlays (WCAG 2.4.3 focus order + 2.1.2 no keyboard
// trap). Apply with `use:trapFocus` to an overlay element that is gated by an
// `{#if}` block, so the action's mount/destroy lifecycle matches open/close.
//
// On open it moves focus into the overlay; while open it cycles Tab/Shift+Tab
// within the overlay (so focus can't reach the now-inert page behind it); on
// close it restores focus to whatever was focused before — usually the control
// that opened the overlay.
//
// Degenerate case: an overlay with no focusable children (e.g. an informational
// "rotate your device" modal) gets focus moved to the container but NO Tab trap,
// because trapping with no focusable target and no Escape would itself be a
// keyboard trap (2.1.2). Pass `onEscape` for overlays that should close on Escape;
// omit it where the host component already handles Escape. Not for `<dialog>`
// opened via `showModal()` — the browser already provides all of this natively.

export type TrapFocusOptions = {
  /** Called when Escape is pressed inside the overlay. Omit if the host handles it. */
  onEscape?: () => void;
  /** When false the action is inert. Default true. */
  enabled?: boolean;
  /**
   * Where to send focus on close, evaluated one frame after destroy. Needed when
   * the opening control itself unmounts while the overlay is open (e.g. a menu
   * button inside `{#if !open}`): the element captured at open is detached by
   * close time, so return the re-mounted trigger here instead.
   */
  restoreFocus?: () => HTMLElement | null | undefined;
};

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/** Visible, focusable descendants. `getClientRects()` is empty for display:none
 *  (and correctly non-empty inside a position:fixed container, where offsetParent
 *  would be null). */
function focusable(node: HTMLElement): HTMLElement[] {
  return Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.getClientRects().length > 0,
  );
}

export function trapFocus(node: HTMLElement, options: TrapFocusOptions = {}) {
  let opts = options;
  let active = false;
  // What had focus before the overlay opened, so we can restore it on close.
  let previouslyFocused: HTMLElement | null = null;

  const moveFocusIn = () => {
    const preferred = node.querySelector<HTMLElement>("[data-autofocus]");
    const target = preferred ?? focusable(node)[0];
    if (target) {
      target.focus();
    } else {
      // No focusable children: focus the container so AT announces the dialog
      // and focus leaves the inert background. No Tab trap (see file header).
      if (!node.hasAttribute("tabindex")) node.setAttribute("tabindex", "-1");
      node.focus();
    }
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && opts.onEscape) {
      e.preventDefault();
      opts.onEscape();
      return;
    }
    if (e.key !== "Tab") return;

    const items = focusable(node);
    if (items.length === 0) return; // nothing to cycle — no trap

    const first = items[0];
    const last = items[items.length - 1];
    const activeEl = document.activeElement;

    if (e.shiftKey) {
      if (activeEl === first || !node.contains(activeEl)) {
        e.preventDefault();
        last.focus();
      }
    } else if (activeEl === last || !node.contains(activeEl)) {
      e.preventDefault();
      first.focus();
    }
  };

  const activate = () => {
    if (active) return;
    active = true;
    previouslyFocused = document.activeElement as HTMLElement | null;
    // Defer past the open transition so the element is laid out before focusing.
    requestAnimationFrame(() => {
      if (active) moveFocusIn();
    });
    node.addEventListener("keydown", onKeydown);
  };

  const deactivate = () => {
    if (!active) return;
    active = false;
    node.removeEventListener("keydown", onKeydown);
    // Defer a frame so a trigger that re-mounts on close exists before we focus
    // it. Queued before any successor trap's own rAF, so a newly opened overlay
    // still wins the focus race.
    const captured = previouslyFocused;
    requestAnimationFrame(() => {
      const target = opts.restoreFocus?.() ?? captured;
      if (target?.isConnected && typeof target.focus === "function") {
        target.focus();
      }
    });
  };

  if (opts.enabled !== false) activate();

  return {
    update(next: TrapFocusOptions = {}) {
      const wasEnabled = opts.enabled !== false;
      opts = next;
      const isEnabled = opts.enabled !== false;
      if (isEnabled && !wasEnabled) activate();
      else if (!isEnabled && wasEnabled) deactivate();
    },
    destroy() {
      deactivate();
    },
  };
}
