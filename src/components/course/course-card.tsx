import { ViewTransition } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Course } from "@/data/types";
import { audienceById, nextSession } from "@/data/courses";
import { cn, formatDateRange, formatKzt } from "@/lib/utils";
import { PressLink } from "@/components/ui/press-link";
import { CardSheen } from "@/components/ui/liquid-light";
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
}: {
  course: Course;
  headingLevel?: "h2" | "h3";
  /** First card above the fold: load its map eagerly (it is the LCP element). */
  priority?: boolean;
}) {
  const H = headingLevel;
  const session = nextSession(course);

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
        <H className="mt-1.5 text-[1.3125rem] font-semibold leading-[1.18] tracking-[-0.02em] sm:text-h3">
          <PressLink
            href={`/courses/${course.slug}`}
            className="outline-none after:absolute after:inset-0 after:z-[3] after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
          >
            {course.title}
          </PressLink>
        </H>
        <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-snug text-muted">{course.summary}</p>

        <div className="card-settle mt-auto pt-4">
          <dl className="grid grid-cols-2 gap-3 border-t border-dashed border-ink/15 pt-3">
            <div>
              <dt className="text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-muted">Стоимость</dt>
              <dd className="mt-0.5 text-[1rem] font-semibold tracking-tight">
                {course.price ? formatKzt(course.price) : "Уточняется"}
              </dd>
            </div>
            <div>
              <dt className="text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-muted">Ближайший поток</dt>
              <dd className="mt-0.5 flex items-center gap-1.5 text-[1rem] font-semibold tracking-tight">
                <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", session ? "bg-accent" : "bg-ink/25")} />
                {session ? formatDateRange(session.start, session.end) : "По запросу"}
              </dd>
            </div>
          </dl>
          <div
            aria-hidden
            className="course-cta mt-3.5 flex h-12 items-center justify-between rounded-full pl-5 pr-1.5 text-white"
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
