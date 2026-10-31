"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

/**
 * Compact sticky registration CTA for small screens. Appears after the
 * hero has scrolled away and hides again while the enrolment form itself
 * is on screen, so it never covers form fields.
 */
export function MobileEnrollBar({
  priceLabel,
  dateLabel,
  targetId,
  heroId,
}: {
  priceLabel: string;
  dateLabel: string;
  targetId: string;
  heroId: string;
}) {
  const [pastHero, setPastHero] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    const target = document.getElementById(targetId);
    if (!hero || !target || !("IntersectionObserver" in window)) return;
    const heroIo = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), { threshold: 0 });
    const formIo = new IntersectionObserver(([e]) => setFormVisible(e.isIntersecting), { threshold: 0 });
    heroIo.observe(hero);
    formIo.observe(target);
    return () => {
      heroIo.disconnect();
      formIo.disconnect();
    };
  }, [heroId, targetId]);

  const show = pastHero && !formVisible;

  return (
    <div
      aria-hidden={!show}
      inert={!show}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden",
        "transition-[transform,opacity] duration-300 ease-out-soft",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
    >
      <div className="flex items-center justify-between gap-3 rounded-[22px] border border-line bg-paper/95 p-2 pl-4 shadow-float backdrop-blur-xl">
        <div className="min-w-0">
          <p className="truncate text-[0.9375rem] font-semibold">{priceLabel}</p>
          <p className="truncate text-xs text-muted">{dateLabel}</p>
        </div>
        <ButtonLink href={`#${targetId}`} variant="accent" size="md" className="shrink-0">
          Записаться
        </ButtonLink>
      </div>
    </div>
  );
}
