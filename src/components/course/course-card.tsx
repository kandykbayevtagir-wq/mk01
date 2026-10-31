import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3, MapPin, MonitorSmartphone } from "lucide-react";
import type { Course } from "@/data/types";
import { audienceById, courseCity, nextSession } from "@/data/courses";
import { cn, formatDateRange, formatKzt } from "@/lib/utils";
import { Visual } from "@/components/ui/visual";

export function CourseCard({
  course,
  headingLevel = "h3",
}: {
  course: Course;
  headingLevel?: "h2" | "h3";
}) {
  const H = headingLevel;
  const session = nextSession(course);
  const city = courseCity(course);
  const meta = [
    course.format && { icon: MonitorSmartphone, label: course.format },
    course.duration && { icon: Clock3, label: course.duration },
    city && { icon: MapPin, label: city },
  ].filter(Boolean) as { icon: typeof Clock3; label: string }[];

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-paper",
        "transition-[transform,box-shadow,border-color] duration-500 ease-out-soft",
        "hover:-translate-y-1 hover:border-transparent hover:shadow-lift",
        "focus-within:border-transparent focus-within:shadow-lift",
      )}
    >
      <Visual
        image={course.image}
        seed={course.order + 3}
        className="aspect-[4/3] sm:aspect-[16/11]"
        imgClassName="transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
        sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
        marker={false}
      >
        <span className="absolute left-4 top-4 inline-flex h-8 items-center rounded-full bg-paper/90 px-3 text-xs font-semibold text-ink backdrop-blur">
          {course.category}
        </span>
        <span
          aria-hidden
          className="absolute bottom-4 right-4 inline-flex size-11 items-center justify-center rounded-full bg-paper text-ink shadow-card transition-[background-color,color,transform] duration-300 ease-out-soft group-hover:bg-accent group-hover:text-white"
        >
          <ArrowUpRight className="size-5 transition-transform duration-300 ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.75} />
        </span>
      </Visual>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[0.8125rem] font-medium text-muted">
          {course.audiences.map((a) => audienceById[a].short).join(" · ")}
        </p>
        <H className="mt-2 text-h3 font-semibold">
          <Link
            href={`/courses/${course.slug}`}
            className="outline-none after:absolute after:inset-0 after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
          >
            {course.title}
          </Link>
        </H>
        <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-relaxed text-muted">{course.summary}</p>

        {meta.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[0.8125rem] text-ink/80">
            {meta.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-1.5">
                <Icon aria-hidden className="size-4 text-muted" strokeWidth={1.5} />
                {label}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-6">
          <div className="flex items-end justify-between gap-4 border-t border-line pt-5">
            <div>
              <p className="text-xs text-muted">Стоимость</p>
              <p className={cn("mt-1 font-semibold", course.price ? "text-lg" : "text-[0.9375rem]")}>
                {course.price ? formatKzt(course.price) : "Уточняется"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">Ближайший поток</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium">
                <CalendarDays aria-hidden className="size-4 text-accent" strokeWidth={1.75} />
                {session ? formatDateRange(session.start, session.end) : "По запросу"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
