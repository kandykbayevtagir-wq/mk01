"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Cinematic reveal for photographs marked `data-media-reveal` (see Visual's
 * `reveal` prop and motion.css): a rounded mask opens into the panel's own
 * shape while the photo settles from a slight zoom — once.
 *
 * Course plates get one sensor sweep the same way (`data-sweep`).
 *
 * A photo that is already on screen when the page appears is shown at once
 * (no LCP delay). Without JS, with reduced motion or if this never runs, the
 * CSS never clips anything (the mask needs `.js` + motion allowed).
 */
export function MediaReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const vh = window.innerHeight;
    const onScreen = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.top < vh && r.bottom > 0;
    };
    const items = [...document.querySelectorAll<HTMLElement>("[data-media-reveal]:not([data-revealed])")];
    // course plates: one sensor sweep the first time each scrolls in (time-based,
    // so it never parks half-way when scrolling stops)
    const plates = [...document.querySelectorAll<HTMLElement>(".course-plate:not([data-sweep])")];
    if (items.length + plates.length === 0) return;
    if (!("IntersectionObserver" in window)) {
      for (const el of items) el.dataset.revealed = "instant";
      return;
    }
    for (const el of items) if (onScreen(el)) el.dataset.revealed = "instant";
    for (const el of plates) if (onScreen(el)) el.dataset.sweep = "done";
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          if (el.matches("[data-media-reveal]")) el.dataset.revealed = "true";
          else el.dataset.sweep = "run";
          io.unobserve(el);
        }
      },
      // well inside the screen, so the whole unveil is seen
      { rootMargin: "0px 0px -20% 0px", threshold: 0.35 },
    );
    for (const el of items) if (!el.dataset.revealed) io.observe(el);
    for (const el of plates) if (!el.dataset.sweep) io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
