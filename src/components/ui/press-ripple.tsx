"use client";

import { useEffect } from "react";

const keyframes: Keyframe[] = [
  { transform: "translate(-50%, -50%) scale(0)", opacity: "var(--ripple-opacity, 0.18)" },
  { transform: "translate(-50%, -50%) scale(1)", opacity: 0 },
];

/**
 * Signature press: a single pressure ring spreads from the touch point of
 * any `[data-ripple]` control. One passive, delegated listener for the whole
 * site; the ring is a pseudo-element animated with transform/opacity, so it
 * finishes even on a quick tap. Skipped with reduced motion and where WAAPI
 * cannot target pseudo-elements; the control's own press state remains.
 */
export function PressRipple() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onDown = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0 || reduce.matches) return;
      const el = (event.target as Element | null)?.closest<HTMLElement>("[data-ripple]");
      if (!el || el.matches(":disabled")) return;
      const box = el.getBoundingClientRect();
      el.style.setProperty("--ripple-x", `${event.clientX - box.left}px`);
      el.style.setProperty("--ripple-y", `${event.clientY - box.top}px`);
      el.style.setProperty("--ripple-size", `${Math.ceil(Math.hypot(box.width, box.height) * 2)}px`);
      try {
        el.animate(keyframes, { duration: 620, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", pseudoElement: "::after" });
      } catch {
        /* pseudo-element animation unsupported: press state alone is fine */
      }
    };
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);
  return null;
}
