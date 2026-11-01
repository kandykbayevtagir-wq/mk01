import { ViewTransition } from "react";
import { PressLink } from "@/components/ui/press-link";
import { ArrowUpRight, Clock3, MapPin, MonitorSmartphone } from "lucide-react";
import type { Course } from "@/data/types";
import { audienceById, courseCity, nextSession } from "@/data/courses";
import { cn, formatDateRange, formatKzt } from "@/lib/utils";
import { MotionRegion } from "@/components/ui/motion-region";
import { CardSheen, LightTrail } from "@/components/ui/liquid-light";
import { Visual } from "@/components/ui/visual";

/**
 * Course card — the primary commercial unit.
 *
 * Scan order: category → audience → title → summary → format/duration/city
 * → price + next date → explicit action. Everything is visible without
 * hover or JS. Hover (pointer devices), keyboard focus and touch press add
 * a layered image shift and a one-pass border sheen; the meta rows settle
 * in on a CSS view timeline. Only the featured card owns an IntersectionObserver
 * (MotionRegion) because it is the only one with a looping layer.
 */
export function CourseCard({
  course,
  headingLevel = "h3",
  featuredMotion = false,
}: {
  course: Course;
  headingLevel?: "h2" | "h3";
  featuredMotion?: boolean;
}) {
  const H = headingLevel;
  const session = nextSession(course);
  const city = courseCity(course);
  const meta = [
    course.format && { icon: MonitorSmartphone, label: course.format },
    course.duration && { icon: Clock3, label: course.duration },
    city && { icon: MapPin, label: city },
  ].filter(Boolean) as { icon: typeof Clock3; label: string }[];

  const cardClassName = cn(
    "course-card group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-card",
    "transition-[transform,box-shadow,border-color] duration-[var(--dur-card)] ease-out-soft",
    "hover:-translate-y-1 hover:border-ink/10 hover:shadow-lift",
    "active:scale-[0.99] active:duration-[var(--dur-press)]",
    "focus-within:border-ink/20 focus-within:shadow-lift",
    featuredMotion && "course-card--featured",
  );
  const body = (
    <>
      {featuredMotion && <LightTrail />}
      <CardSheen />
      <ViewTransition name={`course-visual-${course.slug}`} default="none" share="course-morph">
        <Visual
          image={course.image}
          seed={course.order + 3}
          className="course-card__visual aspect-[16/10] sm:aspect-[16/11]"
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          marker={false}
        >
          <span className="course-card__chip absolute left-3 top-3 inline-flex h-7 items-center rounded-full bg-card px-3 text-xs font-semibold text-ink shadow-card sm:left-4 sm:top-4 sm:h-8">
            {course.category}
          </span>
        </Visual>
      </ViewTransition>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[0.8125rem] font-medium text-muted">
          {course.audiences.map((a) => audienceById[a].short).join(" · ")}
        </p>
        <H className="mt-1.5 text-h3 font-semibold">
          <PressLink
            href={`/courses/${course.slug}`}
            className="outline-none after:absolute after:inset-0 after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
          >
            {course.title}
          </PressLink>
        </H>
        <p className="mt-2.5 line-clamp-2 text-[0.9375rem] leading-relaxed text-muted sm:line-clamp-3">{course.summary}</p>

        {meta.length > 0 && (
          <ul className="card-settle mt-4 flex flex-wrap gap-1.5">
            {meta.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex h-7 items-center gap-1.5 rounded-full bg-mist px-2.5 text-xs font-medium text-ink/80">
                <Icon aria-hidden className="size-3.5 text-muted" strokeWidth={1.75} />
                {label}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-5">
          <dl className="grid grid-cols-2 gap-3 border-t border-line pt-4">
            <div className="card-settle">
              <dt className="text-xs text-muted">Стоимость</dt>
              <dd className={cn("mt-1 font-semibold", course.price ? "text-[1.0625rem]" : "text-[0.9375rem]")}>
                {course.price ? formatKzt(course.price) : "Уточняется"}
              </dd>
            </div>
            <div className="card-settle [--settle-shift:18px]">
              <dt className="text-xs text-muted">Ближайший поток</dt>
              <dd className="mt-1 flex items-center gap-1.5 text-[0.9375rem] font-medium">
                <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", session ? "bg-accent" : "bg-line")} />
                {session ? formatDateRange(session.start, session.end) : "По запросу"}
              </dd>
            </div>
          </dl>
          <div aria-hidden className="card-settle mt-4 flex items-center justify-between rounded-2xl bg-mist py-2 pl-4 pr-2 transition-colors duration-[var(--dur-card)] group-hover:bg-ink group-hover:text-white">
            <span className="text-sm font-semibold">Подробнее о курсе</span>
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-card text-ink">
              <ArrowUpRight
                className="size-[18px] transition-transform duration-[var(--dur-card)] ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.75}
              />
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return featuredMotion ? (
    <MotionRegion as="article" className={cardClassName}>
      {body}
    </MotionRegion>
  ) : (
    <article className={cardClassName}>{body}</article>
  );
}
