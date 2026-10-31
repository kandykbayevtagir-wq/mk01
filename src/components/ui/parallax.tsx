"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Subtle vertical parallax for large editorial imagery.
 * ~40 lines, no animation library: one passive scroll listener, work only
 * while the element is on screen, writes a single GPU-friendly transform.
 * Disabled with prefers-reduced-motion.
 */
export function Parallax({
  children,
  className,
  distance = 40,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = outer.current;
    const layer = inner.current;
    if (!el || !layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let onScreen = false;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the element enters from the bottom, 1 when it leaves at the top.
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      layer.style.transform = `translate3d(0, ${((progress - 0.5) * 2 * distance).toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (onScreen && !frame) frame = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) onScroll();
    });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [distance]);

  return (
    <div ref={outer} className={cn("relative overflow-hidden", className)}>
      <div ref={inner} className="absolute inset-x-0 will-change-transform" style={{ top: -distance, bottom: -distance }}>
        {children}
      </div>
    </div>
  );
}
