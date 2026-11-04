"use client";

import { useEffect } from "react";

const keyframes: Keyframe[] = [
  { transform: "translate(-50%, -50%) scale(0)", opacity: "var(--ripple-opacity, 0.18)" },
  { transform: "translate(-50%, -50%) scale(1)", opacity: 0 },
];

/** Controls that get an immediate pressed state. */
const PRESSABLE = "a[href], button, summary, [data-ripple], .press";

/**
 * Signature press, one passive delegated listener for the whole site:
 *
 * 1. `data-pressed` lands on the pressed control in the pointerdown frame.
 *    Touch `:active` waits for scroll detection (≈100–250 ms in horizontal
 *    scrollers), so CSS keys press visuals off `[data-pressed]` too.
 * 2. A pressure ring spreads from the touch point of any `[data-ripple]`
 *    control (pseudo-element, transform/opacity, finishes after a quick tap).
 *
 * Released on pointerup/cancel; a scroll gesture cancels the pointer, so a
 * swipe never leaves anything pressed. Reduced motion: state only, no ring.
 */
export function PressRipple() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pressed: HTMLElement | null = null;
    const release = () => {
      if (pressed && pressed.dataset.pressed !== "nav") delete pressed.dataset.pressed;
      pressed = null;
    };
    const onDown = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0) return;
      const target = event.target as Element | null;
      const control = target?.closest<HTMLElement>(PRESSABLE);
      if (!control || control.matches(":disabled")) return;
      const ripple = target?.closest<HTMLElement>("[data-ripple]");
      // read layout before writing, so the press costs a single style pass
      const box = ripple && !reduce.matches ? ripple.getBoundingClientRect() : null;
      release();
      pressed = control;
      control.dataset.pressed = "true";
      if (!ripple || !box) return;
      ripple.style.setProperty("--ripple-x", `${event.clientX - box.left}px`);
      ripple.style.setProperty("--ripple-y", `${event.clientY - box.top}px`);
      ripple.style.setProperty("--ripple-size", `${Math.ceil(Math.hypot(box.width, box.height) * 2)}px`);
      try {
        ripple.animate(keyframes, { duration: 620, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", pseudoElement: "::after" });
      } catch {
        /* pseudo-element animation unsupported: the press state alone is fine */
      }
    };
    const opts = { passive: true, capture: true } as const;
    document.addEventListener("pointerdown", onDown, opts);
    document.addEventListener("pointerup", release, opts);
    document.addEventListener("pointercancel", release, opts);
    window.addEventListener("blur", release);
    return () => {
      document.removeEventListener("pointerdown", onDown, opts);
      document.removeEventListener("pointerup", release, opts);
      document.removeEventListener("pointercancel", release, opts);
      window.removeEventListener("blur", release);
    };
  }, []);
  return null;
}
