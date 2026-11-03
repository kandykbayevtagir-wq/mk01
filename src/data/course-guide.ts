import type { AudienceId, Course } from "./types";
import { audienceById, courses as allCourses } from "./courses";
import { plural } from "@/lib/utils";

/**
 * «Подбор программы» on /courses — two questions, answered from the catalogue
 * itself. A goal never describes a course in its own words: it points at a
 * module, topic or outcome that already exists in `courses.ts`, and the card
 * quotes that text. A reference that does not resolve throws at build time,
 * so renaming a module can never leave a recommendation claiming it.
 */

/** Question 1 reuses the catalogue's audiences, phrased as answers. */
export const experienceOptions: { id: AudienceId; label: string }[] = [
  { id: "beginners", label: "Без опыта" },
  { id: "pedicure", label: "Мастер педикюра" },
  { id: "practicing", label: "Подолог" },
  { id: "educators", label: "Преподаю" },
];

type Ref =
  | { slug: string; module: string; topic?: string; strength: Strength }
  | { slug: string; outcome: string; strength: Strength };

/** core — the course is built around the topic; related — the topic is part of it. */
export type Strength = "core" | "related";

export type GoalId = "base" | "ingrown" | "hardware" | "nails" | "feet" | "teaching";

export const goals: { id: GoalId; label: string; refs: Ref[] }[] = [
  {
    id: "base",
    label: "Основа профессии",
    refs: [
      { slug: "podologiya-bazovyy-kurs", module: "Основы подологии", strength: "core" },
      { slug: "podologiya-bazovyy-kurs", module: "Безопасность и организация кабинета", strength: "core" },
    ],
  },
  {
    id: "ingrown",
    label: "Вросший ноготь",
    refs: [
      { slug: "korrektsiya-vrosshego-nogtya", module: "Корректирующие системы", strength: "core" },
      { slug: "korrektsiya-vrosshego-nogtya", outcome: "Оценивать степень врастания и выбирать тактику", strength: "core" },
    ],
  },
  {
    id: "hardware",
    label: "Аппаратная техника",
    refs: [
      { slug: "apparatnaya-obrabotka-stopy", module: "Оборудование", strength: "core" },
      { slug: "apparatnaya-obrabotka-stopy", module: "Техника", strength: "core" },
    ],
  },
  {
    id: "nails",
    label: "Сложные ногти",
    refs: [
      { slug: "problemnye-nogti", module: "Работа с ногтем", strength: "core" },
      { slug: "problemnye-nogti", outcome: "Различать виды изменений ногтевых пластин", strength: "core" },
      { slug: "apparatnaya-obrabotka-stopy", outcome: "Безопасно работать с утолщениями и гиперкератозом", strength: "related" },
    ],
  },
  {
    id: "feet",
    label: "Стопа и стельки",
    refs: [
      { slug: "ortopedicheskie-stelki", module: "Биомеханика", strength: "core" },
      { slug: "ortopedicheskie-stelki", module: "Стельки и ортезы", strength: "core" },
      { slug: "podologiya-bazovyy-kurs", module: "Основы подологии", topic: "Анатомия и биомеханика стопы", strength: "related" },
    ],
  },
  {
    id: "teaching",
    label: "Преподавание",
    refs: [
      { slug: "metodika-prepodavaniya", module: "Проектирование курса", strength: "core" },
      { slug: "metodika-prepodavaniya", module: "Проведение занятий", strength: "core" },
    ],
  },
];

/** A line quoted from the course data: `title` is the module/topic/outcome, `detail` its context. */
export type Evidence = { kind: "module" | "topic" | "outcome"; title: string; detail?: string };

function resolve(ref: Ref, course: Course): Evidence {
  if ("outcome" in ref) {
    if (!course.outcomes.includes(ref.outcome)) throw new Error(`course-guide: outcome «${ref.outcome}» not in ${course.slug}`);
    return { kind: "outcome", title: ref.outcome };
  }
  const m = course.curriculum.find((x) => x.title === ref.module);
  if (!m) throw new Error(`course-guide: module «${ref.module}» not in ${course.slug}`);
  if (ref.topic) {
    if (!m.topics.includes(ref.topic)) throw new Error(`course-guide: topic «${ref.topic}» not in ${course.slug} / ${ref.module}`);
    return { kind: "topic", title: ref.topic, detail: `модуль «${m.title}»` };
  }
  return { kind: "module", title: m.title, detail: m.topics.join(" · ") };
}

const bySlug = new Map(allCourses.map((c) => [c.slug, c]));
// Fail the build on any reference that does not resolve.
for (const g of goals)
  for (const r of g.refs) {
    const c = bySlug.get(r.slug);
    if (!c) throw new Error(`course-guide: unknown course ${r.slug} in goal ${g.id}`);
    resolve(r, c);
  }

export type Match = {
  course: Course;
  /** null when no goal is chosen */
  strength: Strength | null;
  /** null when no experience is chosen */
  fits: boolean | null;
  evidence: Evidence[];
};

export const goalById = Object.fromEntries(goals.map((g) => [g.id, g])) as Record<GoalId, (typeof goals)[number]>;
export const isAudience = (v: string | null): v is AudienceId => !!v && v in audienceById;
export const isGoal = (v: string | null): v is GoalId => !!v && v in goalById;

function goalMatch(course: Course, goal: GoalId) {
  const refs = goalById[goal].refs.filter((r) => r.slug === course.slug);
  if (refs.length === 0) return null;
  return {
    strength: refs.some((r) => r.strength === "core") ? ("core" as const) : ("related" as const),
    evidence: refs.slice(0, 2).map((r) => resolve(r, course)),
  };
}

/**
 * Experience only → the catalogue's audience filter, unchanged.
 * Goal (± experience) → courses that cover the goal. Fit with the chosen
 * experience outranks topic strength (a beginner is better served by a
 * beginner course that covers the topic than by an advanced one built
 * around it); courses for other levels stay visible with an honest note.
 */
export function recommend(courses: Course[], audience: AudienceId | null, goal: GoalId | null): Match[] {
  const fits = (c: Course) => (audience ? c.audiences.includes(audience) : null);
  if (!goal) {
    return courses
      .filter((c) => !audience || c.audiences.includes(audience))
      .map((course) => ({ course, strength: null, fits: fits(course), evidence: [] }));
  }
  const rank = (m: Match) => (m.strength === "core" ? 0 : 2) + (m.fits === false ? 3 : 0);
  return courses
    .flatMap((course) => {
      const g = goalMatch(course, goal);
      return g ? [{ course, strength: g.strength, fits: fits(course), evidence: g.evidence }] : [];
    })
    .sort((a, b) => rank(a) - rank(b) || a.course.order - b.course.order);
}

/** Chip counts: how many courses each answer would show, given the other answer. */
export function counts(courses: Course[], audience: AudienceId | null, goal: GoalId | null) {
  const exp: Record<string, number> = {};
  for (const o of [null, ...experienceOptions.map((o) => o.id)])
    exp[o ?? "all"] = goal
      ? recommend(courses, o, goal).filter((m) => m.fits !== false).length
      : recommend(courses, o, null).length;
  const gl: Record<string, number> = {};
  for (const g of goals) gl[g.id] = recommend(courses, audience, g.id).filter((m) => m.fits !== false).length;
  return { exp, goal: gl };
}

const programs = (n: number) => `${n} ${plural(n, ["программа", "программы", "программ"])}`;
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** One plain sentence that explains the result. Empty when nothing is chosen. */
export function summary(matches: Match[], audience: AudienceId | null, goal: GoalId | null) {
  const forAudience = audience ? lowerFirst(audienceById[audience].label) : "";
  if (!goal) return audience ? `${programs(matches.length)} ${forAudience}` : "";
  const topic = `По теме «${goalById[goal].label}»`;
  if (!audience) return `${topic}: ${programs(matches.length)}`;
  const fit = matches.filter((m) => m.fits).length;
  if (fit === 0) return `${topic} программ ${forAudience} нет — ниже ${matches.length > 1 ? "ближайшие" : "ближайшая"} по теме`;
  if (fit === matches.length) return `${topic}: ${programs(fit)} ${forAudience}`;
  return `${topic}: ${programs(matches.length)}, ${fit} из них — ${forAudience}`;
}
