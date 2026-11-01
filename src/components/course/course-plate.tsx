import Image from "next/image";
import type { Course } from "@/data/types";
import { courseCity, courses } from "@/data/courses";
import type { PressureView } from "@/lib/art/pressure";
import { assetPath } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { PressureField } from "@/components/ui/pressure-field";

/** Which part of the foot each programme is about (presentation only). */
const views: Record<string, PressureView> = {
  "podologiya-bazovyy-kurs": "foot-h",
  "korrektsiya-vrosshego-nogtya": "toes-v",
  "apparatnaya-obrabotka-stopy": "foot-hl",
  "problemnye-nogti": "toes-v",
  "ortopedicheskie-stelki": "foot-h",
  "metodika-prepodavaniya": "foot-hl",
};
const fallbackViews: PressureView[] = ["foot-h", "foot-hl", "toes-v"];

export const courseView = (course: Course) => views[course.slug] ?? fallbackViews[course.order % fallbackViews.length];

/**
 * The course "sensor plate": a graphite baropodometry panel whose readouts
 * carry real course facts (index, category, format · duration · city).
 * Shared by the card and the course page so the view-transition morph
 * pairs two identical surfaces. A supplied photo replaces the pressure map.
 */
export function CoursePlate({
  course,
  size = "card",
  priority = false,
  className,
}: {
  course: Course;
  size?: "card" | "page";
  priority?: boolean;
  className?: string;
}) {
  const city = courseCity(course);
  const readout = [course.format, course.duration, city].filter(Boolean).join(" · ");
  const index = String(course.order).padStart(2, "0");
  const total = String(courses.length).padStart(2, "0");
  const page = size === "page";

  return (
    <div className={cn("course-plate relative isolate overflow-hidden bg-graphite text-white", className)}>
      {/* sensor grid + a single warm light */}
      <div aria-hidden className="pattern-dots-dark absolute inset-0 opacity-70" />
      <div aria-hidden className="course-plate__glow absolute inset-0" />

      {course.image ? (
        <Image
          src={assetPath(course.image.src)}
          alt={course.image.alt}
          fill
          priority={priority}
          sizes={page ? "(min-width: 1024px) 40vw, 100vw" : "(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"}
          className="object-cover"
        />
      ) : (
        <PressureField
          view={courseView(course)}
          tone="dark"
          eager={priority}
          className={cn("absolute", page ? "inset-x-8 bottom-14 top-16" : "inset-x-5 bottom-9 top-10")}
        />
      )}

      <div
        className={cn(
          "course-plate__readout absolute inset-x-0 top-0 flex items-center justify-between gap-3",
          page ? "px-6 pt-5" : "px-4 pt-3",
        )}
      >
        <span className="text-[0.6875rem] font-semibold tabular-nums tracking-[0.16em] text-white/55">
          <span className="text-white">{index}</span>
          <span aria-hidden> / </span>
          {total}
        </span>
        <span className="inline-flex h-7 items-center rounded-full bg-white/10 px-3 text-xs font-semibold text-white ring-1 ring-inset ring-white/15">
          {course.category}
        </span>
      </div>
      {readout && (
        <p
          className={cn(
            "course-plate__readout absolute inset-x-0 bottom-0 flex items-center gap-2 truncate text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/60",
            page ? "px-6 pb-5" : "px-4 pb-3",
          )}
        >
          <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent" />
          <span className="truncate">{readout}</span>
        </p>
      )}
    </div>
  );
}
