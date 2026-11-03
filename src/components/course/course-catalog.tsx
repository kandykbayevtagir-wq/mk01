"use client";

import { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { RotateCcw } from "lucide-react";
import type { AudienceId, Course } from "@/data/types";
import {
  counts as countsFor,
  experienceOptions,
  goals,
  isAudience,
  isGoal,
  recommend,
  summary,
  type GoalId,
} from "@/data/course-guide";
import { cn } from "@/lib/utils";
import { CourseCard } from "./course-card";

type Answers = { audience: AudienceId | null; goal: GoalId | null };
const none: Answers = { audience: null, goal: null };

/**
 * Course catalogue with the two-question guide («Ваш опыт», «Что хотите развить»).
 *
 * Experience alone is the catalogue's audience filter. A goal re-ranks the
 * catalogue around it and each card explains itself with lines quoted from
 * the course data (see data/course-guide.ts). No form, no backend.
 *
 * Every change runs one native View Transition: the active pill glides, the
 * result sentence cross-fades, cards morph to their new places and newly
 * shown cards arrive in a short stagger. Reduced motion / no support → an
 * instant update. Answers live in the URL (?for=&goal=) so Back and shared
 * links keep them.
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
  const [answers, setAnswers] = useState<Answers>(none);

  // Restore answers from the URL after hydration (static pages render the default).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const audience = q.get("for");
    const goal = q.get("goal");
    if (!isAudience(audience) && !isGoal(goal)) return;
    const restored = { audience: isAudience(audience) ? audience : null, goal: isGoal(goal) ? goal : null };
    queueMicrotask(() => setAnswers(restored));
  }, []);

  const matches = useMemo(() => recommend(courses, answers.audience, answers.goal), [courses, answers]);
  const visible = limit ? matches.slice(0, limit) : matches;
  const count = useMemo(() => countsFor(courses, answers.audience, answers.goal), [courses, answers]);
  const result = summary(matches, answers.audience, answers.goal);
  const chosen = answers.audience !== null || answers.goal !== null;

  function commit(next: Answers, from?: HTMLElement) {
    // Keep the chosen chip fully visible in its horizontal scroller (mobile).
    from?.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
    if (next.audience === answers.audience && next.goal === answers.goal) return;

    const url = new URL(window.location.href);
    for (const [key, value] of [["for", next.audience], ["goal", next.goal]] as const) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(null, "", url);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // A short confirmation tick where supported (Android); silent elsewhere.
    if (!reduce && "vibrate" in navigator) navigator.vibrate(8);
    if (reduce || typeof document.startViewTransition !== "function") {
      setAnswers(next);
      return;
    }

    // Stagger only the cards that newly appear; the rest glide to their new place.
    const shown = new Set(visible.map((m) => m.course.slug));
    const entering = recommend(courses, next.audience, next.goal)
      .slice(0, limit)
      .filter((m) => !shown.has(m.course.slug));
    const stagger = document.createElement("style");
    stagger.textContent = entering
      .map((m, i) => `::view-transition-new(course-${m.course.slug}):only-child{animation-delay:${70 + i * 55}ms}`)
      .join("");
    document.head.append(stagger);

    const root = document.documentElement;
    root.setAttribute("data-vt", "filter");
    const transition = document.startViewTransition(() => {
      flushSync(() => setAnswers(next));
    });
    transition.finished.finally(() => {
      stagger.remove();
      if (root.getAttribute("data-vt") === "filter") root.removeAttribute("data-vt");
    });
  }

  return (
    <div>
      <Question id="guide-experience" label="Ваш опыт">
        {[{ id: null, label: "Любой" }, ...experienceOptions].map((o) => (
          <Chip
            key={o.id ?? "all"}
            active={answers.audience === o.id}
            pill="course-filter-pill"
            count={count.exp[o.id ?? "all"]}
            onClick={(e) => commit({ ...answers, audience: o.id }, e.currentTarget)}
          >
            {o.label}
          </Chip>
        ))}
      </Question>

      <Question id="guide-goal" label="Что хотите развить" className="mt-4">
        {goals.map((g) => (
          <Chip
            key={g.id}
            active={answers.goal === g.id}
            pill="course-goal-pill"
            count={count.goal[g.id]}
            // Tap the chosen topic again to clear it.
            onClick={(e) => commit({ ...answers, goal: answers.goal === g.id ? null : g.id }, e.currentTarget)}
          >
            {g.label}
          </Chip>
        ))}
      </Question>

      <div className="mt-5 flex min-h-9 items-center justify-between gap-3 border-t border-line pt-4">
        <p
          aria-live="polite"
          className={cn("vt-filter-item text-[0.9375rem] leading-snug", chosen ? "font-medium text-ink" : "text-muted")}
          style={{ "--vt-name": "course-guide-summary" } as React.CSSProperties}
        >
          {result || "Выберите опыт и тему — подберём программы и объясним выбор."}
        </p>
        {chosen && (
          <button
            type="button"
            onClick={() => commit(none)}
            className="press inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-sm font-medium text-muted transition-colors hover:text-ink active:bg-mist"
          >
            <RotateCcw aria-hidden className="size-3.5" strokeWidth={2} />
            Сбросить
          </button>
        )}
      </div>

      {visible.length > 0 ? (
        <ul className="course-stack mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {visible.map((m, i) => (
            <li
              key={m.course.slug}
              style={{ "--vt-name": `course-${m.course.slug}`, "--stack-i": i } as React.CSSProperties}
              className={cn("vt-filter-item", mobileLimit !== undefined && i >= mobileLimit && "max-md:hidden")}
            >
              <CourseCard
                course={m.course}
                headingLevel={headingLevel}
                priority={i === 0}
                match={answers.goal ? m : undefined}
              />
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

function Question({ id, label, className, children }: { id: string; label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <p id={id} className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
      <div
        role="group"
        aria-labelledby={id}
        data-guide={id}
        className={cn(
          "-mx-4 mt-2.5 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // fade the trailing edge to signal more chips; off once they wrap
          "[mask-image:linear-gradient(to_right,black_85%,transparent)] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:[mask-image:none]",
        )}
      >
        {children}
      </div>
    </div>
  );
}

function Chip({
  active,
  pill,
  count,
  onClick,
  children,
}: {
  active: boolean;
  /** view-transition name of the active background, so it glides between chips */
  pill: string;
  count: number;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ripple=""
      aria-pressed={active}
      className={cn(
        "guide-chip press relative isolate inline-flex h-11 shrink-0 snap-start items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-[var(--dur-press)]",
        active ? "border-accent text-white" : "border-line bg-card text-ink hover:border-ink/30 active:bg-mist",
      )}
    >
      {active && (
        <span
          aria-hidden
          className="vt-filter-item absolute inset-[-1px] -z-10 rounded-full bg-accent"
          style={{ "--vt-name": pill } as React.CSSProperties}
        />
      )}
      <span>{children}</span>
      <span className={cn("text-xs tabular-nums", active ? "text-white/75" : count === 0 ? "text-muted/60" : "text-muted")}>{count}</span>
    </button>
  );
}
