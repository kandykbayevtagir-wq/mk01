"use client";

import { useEffect, useRef } from "react";

/**
 * Thin red reading line under the header for a course page. Progress runs
 * over the educational content only (`#course-content`, from its top under
 * the header to its end) — not the form, related courses or footer.
 * Native scroll-driven animation where supported (see motion.css); a passive,
 * rAF-throttled scroll fallback elsewhere. Decorative: the page itself is
 * the accessible structure.
 */
export function ReadingProgress({ target }: { target: string }) {
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (CSS.supports("animation-timeline: view()")) return;
    const el = document.getElementById(target);
    const line = bar.current;
    if (!el || !line) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 60;
      const r = el.getBoundingClientRect();
      const total = r.height - (window.innerHeight - header);
      const p = total > 0 ? Math.min(1, Math.max(0, (header - r.top) / total)) : r.top < header ? 1 : 0;
      line.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [target]);

  return (
    <div aria-hidden className="reading-progress">
      <span ref={bar} />
    </div>
  );
}
