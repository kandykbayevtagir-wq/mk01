"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Cinematic reveal for photographs marked `data-media-reveal` (see Visual's
 * `reveal` prop and motion.css): a rounded mask opens into the panel's own
 * shape while the photo settles from a slight zoom — once.
 *
 * A photo that is already on screen when the page appears is shown at once
 * (no LCP delay). Without JS, with reduced motion or if this never runs, the
 * CSS never clips anything (the mask needs `.js` + motion allowed).
 */
export function MediaReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const items = [...document.querySelectorAll<HTMLElement>("[data-media-reveal]:not([data-revealed])")];
    if (items.length === 0) return;
    if (!("IntersectionObserver" in window)) {
      for (const el of items) el.dataset.revealed = "instant";
      return;
    }
    const vh = window.innerHeight;
    for (const el of items) {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.dataset.revealed = "instant";
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.revealed = "true";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.2 },
    );
    for (const el of items) if (!el.dataset.revealed) io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
