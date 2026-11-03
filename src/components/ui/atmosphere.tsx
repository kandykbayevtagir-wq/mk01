"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide atmosphere: a fixed layer *behind* all content (so photographs,
 * the logo and dark panels keep their own surfaces) made of
 *
 *  - four light states (hero · courses · learn · deep) that cross-fade with
 *    opacity only, chosen by whichever `[data-atmo]` section crosses the
 *    middle of the viewport — one attribute write per section change, no
 *    React state while scrolling;
 *  - a scroll-linked drift of the light (compositor-only `transform` on a
 *    scroll timeline): the light moves while you scroll, costs nothing at rest;
 *  - a static film-grain tile that never moves, so it cannot flicker.
 *
 * It fades in once the page is interactive (kept out of the first paint, so it
 * never delays LCP). Without JS the page is simply white — still finished.
 * Reduced motion / .motion-lite: no drift (see motion.css).
 */
export function Atmosphere() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const sections = [...document.querySelectorAll<HTMLElement>("body [data-atmo]")];
    if (sections.length === 0 || !("IntersectionObserver" in window)) {
      root.dataset.atmo = "hero";
      return;
    }
    const crossing = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) crossing.set(e.target, e.isIntersecting);
        let state: string | undefined;
        for (const el of sections) if (crossing.get(el)) state = el.dataset.atmo;
        if (state && root.dataset.atmo !== state) root.dataset.atmo = state;
      },
      // a thin band around the middle of the viewport
      { rootMargin: "-46% 0px -53% 0px" },
    );
    for (const el of sections) io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  return (
    <div aria-hidden className="atmo">
      <div className="atmo__lights">
        <div className="atmo__light atmo__light--hero" />
        <div className="atmo__light atmo__light--courses" />
        <div className="atmo__light atmo__light--learn" />
        <div className="atmo__light atmo__light--deep" />
      </div>
      <div className="atmo__grain" />
    </div>
  );
}
