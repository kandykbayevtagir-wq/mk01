"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight scroll reveal: IntersectionObserver + CSS transition
 * (see `[data-reveal]` in globals.css). Content is fully visible without JS
 * and with `prefers-reduced-motion`.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
  "data-tone": tone,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
  "data-tone"?: "dark" | "light";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    // Tell the inline fallback timer (layout.tsx) that reveals are live.
    (window as Window & { __revealReady?: boolean }).__revealReady = true;
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.dataset.visible = "true";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = "true";
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      data-reveal=""
      data-tone={tone}
      className={cn(className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
