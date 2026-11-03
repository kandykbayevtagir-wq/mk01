import { ViewTransition } from "react";
import { ArrowUpRight, Check, CircleDashed } from "lucide-react";
import type { Course } from "@/data/types";
import type { Evidence, Match } from "@/data/course-guide";
import { audienceById, nextSession } from "@/data/courses";
import { cn, formatDateRange, formatKzt } from "@/lib/utils";
import { PressLink } from "@/components/ui/press-link";
import { CardSheen } from "@/components/ui/card-sheen";
import { CoursePlate } from "./course-plate";

/**
 * Course card — the primary commercial unit, built for 360–430 px phones.
 *
 * Scan order: sensor plate (index, category, format/duration/city) →
 * audience → title → two-line summary → price | next intake → explicit CTA.
 * Everything is readable without JS or motion. On a phone the card answers
 * a press immediately (compression, ink → red CTA, one edge sheen, a
 * pressure ripple from the finger on the plate) and settles back softly;
 * the whole card is one link (stretched) that morphs into the course page.
 */
export function CourseCard({
  course,
  headingLevel = "h3",
  priority = false,
  match,
}: {
  course: Course;
  headingLevel?: "h2" | "h3";
  /** First card above the fold: load its map eagerly (it is the LCP element). */
  priority?: boolean;
  /** Course guide result: shows why this course was recommended (quoted from the course data). */
  match?: Match;
}) {
  const H = headingLevel;
  const session = nextSession(course);
  // Only verified values are shown: an unknown price or intake is simply absent.
  const facts = [
    course.price && { label: "Стоимость", value: formatKzt(course.price), dot: false },
    session && { label: "Ближайший поток", value: formatDateRange(session.start, session.end), dot: true },
  ].filter(Boolean) as { label: string; value: string; dot: boolean }[];

  return (
    <article
      data-pressure-host=""
      className={cn(
        "course-card group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-card",
        "transition-[transform,box-shadow,border-color] duration-[var(--dur-card)] ease-out-soft",
        "hover:-translate-y-1 hover:border-ink/10 hover:shadow-lift",
        "focus-within:border-ink/20 focus-within:shadow-lift",
      )}
    >
      <CardSheen />
      <ViewTransition name={`course-visual-${course.slug}`} default="none" share="course-morph">
        <CoursePlate course={course} priority={priority} className="m-1.5 mb-0 aspect-[2/1] rounded-[22px] sm:aspect-[16/9]" />
      </ViewTransition>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted">
          {course.audiences.map((a) => audienceById[a].short).join(" · ")}
        </p>
        <ViewTransition name={`course-title-${course.slug}`} default="none" share="course-morph course-title">
          <H className="mt-1.5 text-[1.3125rem] font-semibold leading-[1.18] tracking-[-0.02em] sm:text-h3">
            <PressLink
              href={`/courses/${course.slug}`}
              className="outline-none after:absolute after:inset-0 after:z-[3] after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
            >
              {course.title}
            </PressLink>
          </H>
        </ViewTransition>
        <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-snug text-muted">{course.summary}</p>
        {match?.strength && <WhyPanel match={match} />}

        <div className="card-settle mt-auto pt-4">
          {facts.length > 0 && (
            <dl className={cn("grid gap-3 border-t border-dashed border-ink/15 pt-3", facts.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-muted">{f.label}</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5 text-[1rem] font-semibold tracking-tight">
                    {f.dot && <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent" />}
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          <div
            aria-hidden
            className={cn("course-cta flex h-12 items-center justify-between rounded-full pl-5 pr-1.5 text-white", facts.length > 0 && "mt-3.5")}
          >
            <span className="text-[0.9375rem] font-semibold">Подробнее о курсе</span>
            <span className="course-cta__arrow inline-flex size-9 items-center justify-center rounded-full bg-white text-ink">
              <ArrowUpRight className="size-[18px]" strokeWidth={1.75} />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

const evidenceLabel = (e: Evidence) =>
  e.kind === "module" ? `Модуль «${e.title}»` : e.kind === "topic" ? `Тема «${e.title}»` : e.title;

/** «Почему подходит»: only lines that exist in the course data, plus one line on experience fit. */
function WhyPanel({ match }: { match: Match }) {
  return (
    <div className="guide-why mt-3.5 rounded-2xl bg-mist px-3.5 pb-3 pt-2.5">
      <p className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-accent">
        <span aria-hidden className="size-1.5 rounded-full bg-accent" />
        {match.strength === "core" ? "Основная программа по теме" : "Тема входит в программу"}
      </p>
      <ul className="mt-2 space-y-1.5 text-[0.875rem] leading-snug">
        {match.evidence.map((e) => (
          <li key={e.title} className="flex gap-2">
            <Check aria-hidden className="mt-[3px] size-3.5 shrink-0 text-accent" strokeWidth={2.25} />
            <span className="min-w-0">
              {e.kind === "outcome" && <span className="text-muted">Результат: </span>}
              <span className="font-medium text-ink">{evidenceLabel(e)}</span>
              {e.detail && <span className="line-clamp-2 text-[0.8125rem] text-muted">{e.detail}</span>}
            </span>
          </li>
        ))}
        {match.fits === true && (
          <li className="flex gap-2">
            <Check aria-hidden className="mt-[3px] size-3.5 shrink-0 text-accent" strokeWidth={2.25} />
            <span className="font-medium text-ink">Подходит вашему опыту</span>
          </li>
        )}
        {match.fits === false && (
          <li className="flex gap-2 text-muted">
            <CircleDashed aria-hidden className="mt-[3px] size-3.5 shrink-0" strokeWidth={2} />
            <span>Рассчитан на специалистов с другим опытом</span>
          </li>
        )}
      </ul>
    </div>
  );
}
