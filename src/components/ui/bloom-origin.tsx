"use client";

import { useLayoutEffect, useRef } from "react";

type Bloom = { x: number; y: number; oy: number; t: number };

/**
 * Pressure-bloom navigation: the incoming page opens as a circle from the
 * point that was tapped, like the plate's pressure ripple (motion.css,
 * `html[data-bloom]`).
 *
 * PressRipple records the pointerdown point on internal links. This runs in
 * the new page's layout phase — after React commits, before the browser
 * captures the new view-transition snapshot — and converts that point into
 * the coordinates of this page's own box (the outgoing page's box is known
 * from the tap: same x, y offset by its scroll). Keyboard, Back/Forward and
 * reduced-motion navigations have no fresh point and keep the default arrival.
 */
export function BloomOrigin() {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const w = window as Window & { __bloom?: Bloom };
    const p = w.__bloom;
    w.__bloom = undefined;
    const page = ref.current?.parentElement;
    if (!p || !page || performance.now() - p.t > 2000) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = page.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // far enough to cover the whole screen from the tap point
    const reach = Math.ceil(Math.hypot(Math.max(p.x, vw - p.x), Math.max(p.y, vh - p.y))) + 24;
    root.style.setProperty("--bloom-x", `${Math.round(p.x - r.left)}px`);
    root.style.setProperty("--bloom-y", `${Math.round(p.y - r.top)}px`);
    root.style.setProperty("--bloom-r", `${reach}px`);
    root.style.setProperty("--bloom-oy", `${Math.round(p.oy)}px`);
    root.dataset.bloom = "";
    const done = window.setTimeout(() => delete root.dataset.bloom, 1200);
    return () => window.clearTimeout(done);
  }, []);

  return <span ref={ref} hidden />;
}
