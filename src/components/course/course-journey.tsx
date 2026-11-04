import { Plus } from "lucide-react";
import type { CourseModule } from "@/data/types";
import { plural } from "@/lib/utils";

/**
 * «Программа курса» as a learning journey — the course's own modules and
 * topics, nothing added. Native <details> sharing one `name` (an exclusive
 * accordion that works without JS); the rail through the markers fills up to
 * the open module via `:has()`, topics settle in when a module opens.
 */
export function CourseJourney({ id, modules }: { id: string; modules: CourseModule[] }) {
  return (
    <ol className="journey mt-8">
      {modules.map((m, i) => (
        <li key={m.title} className="journey__step">
          <details name={`journey-${id}`} open={i === 0} className="group">
            <summary className="journey__summary flex min-h-16 cursor-pointer items-center gap-4 py-4 pr-1">
              <span aria-hidden className="journey__marker tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[1.0625rem] font-semibold leading-snug">{m.title}</span>
                <span className="mt-0.5 block text-xs text-muted">
                  {m.topics.length} {plural(m.topics.length, ["тема", "темы", "тем"])}
                </span>
              </span>
              <span className="journey__toggle inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line">
                <Plus aria-hidden className="size-4" strokeWidth={1.75} />
              </span>
            </summary>
            <ul className="journey__topics space-y-2.5 pb-6">
              {m.topics.map((topic, t) => (
                <li key={topic} className="journey__topic" style={{ "--i": t } as React.CSSProperties}>
                  {topic}
                </li>
              ))}
            </ul>
          </details>
        </li>
      ))}
    </ol>
  );
}
