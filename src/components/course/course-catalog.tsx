"use client";

import { useMemo, useState } from "react";
import { flushSync } from "react-dom";
import type { AudienceId, Course } from "@/data/types";
import { audiences } from "@/data/courses";
import { cn, plural } from "@/lib/utils";
import { CourseCard } from "./course-card";

type Filter = AudienceId | "all";

/**
 * Filterable course grid.
 *
 * Re-flow animation uses the native View Transitions API: every card and
 * the active filter pill carry a `view-transition-name`, so the browser
 * morphs them between states (see `::view-transition-*` in globals.css).
 * Zero JS animation library; browsers without support (or users with
 * reduced motion) simply get an instant update.
 */
export function CourseCatalog({
  courses,
  limit,
  mobileLimit,
  headingLevel = "h3",
}: {
  courses: Course[];
  limit?: number;
  /** Show fewer cards below md (CSS only, no layout shift). */
  mobileLimit?: number;
  headingLevel?: "h2" | "h3";
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: courses.length };
    for (const a of audiences) c[a.id] = courses.filter((x) => x.audiences.includes(a.id)).length;
    return c;
  }, [courses]);

  const visible = useMemo(() => {
    const list = filter === "all" ? courses : courses.filter((c) => c.audiences.includes(filter));
    return limit ? list.slice(0, limit) : list;
  }, [courses, filter, limit]);

  const options = [
    { id: "all" as Filter, label: "Все программы" },
    ...audiences.map((a) => ({ id: a.id as Filter, label: a.label, short: a.short })),
  ] as { id: Filter; label: string; short?: string }[];

  function select(next: Filter, button: HTMLButtonElement) {
    // Keep the chosen chip fully visible in the horizontal scroller (mobile).
    button.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
    if (next === filter) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof document.startViewTransition !== "function") {
      setFilter(next);
      return;
    }
    const root = document.documentElement;
    root.setAttribute("data-vt", "filter");
    const transition = document.startViewTransition(() => {
      flushSync(() => setFilter(next));
    });
    transition.finished.finally(() => {
      if (root.getAttribute("data-vt") === "filter") root.removeAttribute("data-vt");
    });
  }

  return (
    <div>
      <div
        role="group"
        aria-label="Фильтр по аудитории"
        className={cn(
          "-mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // fade the trailing edge to signal more chips; off once they wrap
          "[mask-image:linear-gradient(to_right,black_85%,transparent)] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:[mask-image:none]",
        )}
      >
        {options.map((o) => {
          const active = filter === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={(e) => select(o.id, e.currentTarget)}
              data-ripple=""
              aria-pressed={active}
              className={cn(
                "press relative isolate inline-flex h-11 shrink-0 snap-start items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-[var(--dur-press)]",
                active ? "border-accent text-white" : "border-line bg-card text-ink hover:border-ink/30 active:bg-mist",
              )}
            >
              {active && (
                <span
                  aria-hidden
                  className="vt-filter-item absolute inset-[-1px] -z-10 rounded-full bg-accent"
                  style={{ "--vt-name": "course-filter-pill" } as React.CSSProperties}
                />
              )}
              {o.short ? (
                <>
                  <span className="sm:hidden">{o.short}</span>
                  <span className="max-sm:hidden">{o.label}</span>
                </>
              ) : (
                <span>{o.label}</span>
              )}
              <span className={cn("text-xs tabular-nums", active ? "text-white/75" : "text-muted")}>
                {counts[o.id]}
              </span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {`Показано ${visible.length} ${plural(visible.length, ["программа", "программы", "программ"])}`}
      </p>

      {visible.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {visible.map((course, i) => (
            <li
              key={course.slug}
              style={{ "--vt-name": `course-${course.slug}` } as React.CSSProperties}
              className={cn("vt-filter-item", mobileLimit !== undefined && i >= mobileLimit && "max-md:hidden")}
            >
              <CourseCard course={course} headingLevel={headingLevel} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-card border border-dashed border-line p-10 text-center text-muted">
          Программы для этой аудитории появятся в ближайшее время.
        </div>
      )}
    </div>
  );
}
