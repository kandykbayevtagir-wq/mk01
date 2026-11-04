import { ViewTransition } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarDays, Check } from "lucide-react";
import {
  audienceById,
  courseCity,
  getCourse,
  getCourses,
  nextSession,
  relatedCourses,
  upcomingSessions,
} from "@/data/courses";
import { founder, founderDisplayName } from "@/data/founder";
import { site } from "@/data/site";
import type { Course } from "@/data/types";
import { t } from "@/i18n";
import { absoluteUrl, jsonLd, pageMetadata } from "@/lib/seo";
import { formatDateRange } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { Visual } from "@/components/ui/visual";
import { SectionDecor } from "@/components/ui/section-decor";
import { Breadcrumbs } from "@/components/sections/page-hero";
import { Faq } from "@/components/sections/faq";
import { WhatsAppAlt } from "@/components/sections/form-section";
import { CourseCard } from "@/components/course/course-card";
import { CoursePlate } from "@/components/course/course-plate";
import { CourseJourney } from "@/components/course/course-journey";
import { ReadingProgress } from "@/components/course/reading-progress";
import { LeadForm } from "@/components/forms/lead-form";
import { courseEnrollFields } from "@/components/forms/presets";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCourses().map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  return pageMetadata({
    title: course.title,
    description: course.summary,
    path: `/courses/${course.slug}`,
    image: course.image?.src,
  });
}

function courseLd(course: Course) {
  const sessions = upcomingSessions(course);
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.summary,
    url: absoluteUrl(`/courses/${course.slug}`),
    inLanguage: "ru",
    provider: { "@type": "EducationalOrganization", name: site.name, url: site.url },
    ...(course.image ? { image: absoluteUrl(course.image.src) } : {}),
    ...(course.price
      ? { offers: { "@type": "Offer", price: course.price, priceCurrency: "KZT", category: "Paid" } }
      : {}),
    ...(sessions.length
      ? {
          hasCourseInstance: sessions.map((s) => ({
            "@type": "CourseInstance",
            courseMode: "Onsite",
            startDate: s.start,
            ...(s.end ? { endDate: s.end } : {}),
            location: { "@type": "Place", name: s.city, address: { "@type": "PostalAddress", addressLocality: s.city, addressCountry: "KZ" } },
          })),
        }
      : {}),
  };
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-h3 font-semibold lg:text-[1.875rem]">
      {children}
    </h2>
  );
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const sessions = upcomingSessions(course);
  const session = nextSession(course);
  const city = courseCity(course);
  const faq = course.faq; // course-specific questions only; process answers live on /courses
  const related = relatedCourses(course, 2);

  // Verified facts only: an unknown value is not shown (and not repeated as «уточняется»).
  const facts = [
    { label: "Формат", value: course.format },
    { label: "Длительность", value: course.duration },
    { label: "Город", value: city },
    { label: "Ближайший поток", value: session ? formatDateRange(session.start, session.end) : null },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(courseLd(course))} />

      {/* Hero */}
      <section id="course-hero" data-atmo="hero" className="relative overflow-hidden bg-veil">
        <SectionDecor variant={["dots-corner", "arches-left"]} />
        <Container className="relative pb-12 pt-6 sm:pt-8 lg:pb-20 lg:pt-10">
          <Breadcrumbs
            className="enter"
            items={[
              { href: "/courses", label: "Курсы" },
              { href: `/courses/${course.slug}`, label: course.title },
            ]}
          />
          <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
              <div className="enter flex flex-wrap items-center gap-2" style={{ "--enter-delay": "40ms" } as React.CSSProperties}>
                <span className="inline-flex h-8 items-center rounded-full bg-ink px-3 text-xs font-semibold text-white">
                  {course.category}
                </span>
                {course.audiences.map((a) => (
                  <span key={a} className="inline-flex h-8 items-center rounded-full border border-line px-3 text-xs font-medium text-muted">
                    {audienceById[a].label}
                  </span>
                ))}
              </div>
              <ViewTransition name={`course-title-${course.slug}`} default="none" share="course-morph course-title">
                <h1 className="enter-rise mt-6 text-h1 font-semibold" style={{ "--enter-delay": "90ms" } as React.CSSProperties}>
                  {course.title}
                </h1>
              </ViewTransition>
              <p className="enter mt-6 max-w-2xl text-lead text-muted" style={{ "--enter-delay": "150ms" } as React.CSSProperties}>
                {course.summary}
              </p>
              {facts.length > 0 && (
                <dl
                  className="enter mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6"
                  style={{ "--enter-delay": "210ms" } as React.CSSProperties}
                >
                  {facts.map((f) => (
                    <div key={f.label}>
                      <dt className="text-xs text-muted">{f.label}</dt>
                      <dd className="mt-1 text-[1rem] font-semibold">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            <div className="enter-fade lg:col-span-5" style={{ "--enter-delay": "120ms" } as React.CSSProperties}>
              <ViewTransition name={`course-visual-${course.slug}`} default="none" share="course-morph">
                <CoursePlate
                  course={course}
                  size="page"
                  priority
                  className="aspect-[4/3] rounded-panel shadow-card lg:aspect-[4/4.2]"
                />
              </ViewTransition>
            </div>
          </div>
        </Container>
      </section>

      <ReadingProgress target="course-content" />
      {/* Body: the educational content (atmosphere «learn», reading progress) */}
      <div id="course-content" data-atmo="learn">
      <Container className="py-14 lg:py-24">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-6">
          <div className="space-y-16 lg:col-span-8 lg:space-y-24">
            <Reveal>
              <Eyebrow>О курсе</Eyebrow>
              <p className="mt-5 text-lead text-ink/85">{course.description}</p>
            </Reveal>

            <Reveal>
              <section aria-labelledby="audience-title">
                <SectionTitle id="audience-title">Для кого этот курс</SectionTitle>
                <ul className="mt-8 border-t border-line">
                  {course.audienceDetails.map((a) => (
                    <li key={a} className="flex gap-4 border-b border-line py-4 text-[1.0625rem]">
                      <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                      {a}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            <Reveal>
              <section aria-labelledby="outcomes-title">
                <SectionTitle id="outcomes-title">Чему вы научитесь</SectionTitle>
                <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {course.outcomes.map((o) => (
                    <li key={o} className="flex gap-3 rounded-2xl bg-mist p-5">
                      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                        <Check aria-hidden className="size-3.5" strokeWidth={2.5} />
                      </span>
                      <span className="text-[0.9375rem] leading-relaxed">{o}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            <Reveal>
              <section aria-labelledby="curriculum-title">
                <SectionTitle id="curriculum-title">Программа курса</SectionTitle>
                <CourseJourney id={course.slug} modules={course.curriculum} />
              </section>
            </Reveal>

            {sessions.length > 0 && (
              <Reveal>
                <section aria-labelledby="schedule-title">
                  <SectionTitle id="schedule-title">Расписание</SectionTitle>
                  <ul className="mt-8 space-y-3">
                    {sessions.map((s) => (
                      <li
                        key={`${s.start}-${s.city}`}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line p-5"
                      >
                        <span className="inline-flex items-center gap-3 font-semibold">
                          <CalendarDays aria-hidden className="size-5 text-accent" strokeWidth={1.5} />
                          {formatDateRange(s.start, s.end)}
                        </span>
                        <span className="text-muted">
                          {s.city}
                          {s.note ? ` · ${s.note}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            )}

            {(course.includes.length > 0 || course.certificate) && (
              <Reveal>
                <section aria-labelledby="included-title">
                  <SectionTitle id="included-title">Что входит в обучение</SectionTitle>
                  {course.includes.length > 0 && (
                    <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {course.includes.map((x) => (
                        <li key={x} className="flex gap-3 text-[0.9375rem]">
                          <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2} />
                          {x}
                        </li>
                      ))}
                    </ul>
                  )}
                  {course.certificate && (
                    <div className="mt-8 rounded-2xl bg-mist p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Документ об обучении</p>
                      <p className="mt-2">{course.certificate}</p>
                    </div>
                  )}
                </section>
              </Reveal>
            )}

            <Reveal>
              <section aria-labelledby="instructor-title">
                <SectionTitle id="instructor-title">Преподаватель</SectionTitle>
                <Link
                  href="/about"
                  className="group mt-8 flex items-center gap-5 rounded-card border border-line p-4 transition-[border-color,box-shadow] duration-300 hover:border-transparent hover:shadow-lift sm:p-5"
                >
                  <Visual image={founder.portrait} tone="dark" seed={7} marker={false} className="size-20 shrink-0 rounded-2xl sm:size-24" imgClassName="object-[50%_30%]" sizes="96px" />
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-semibold">{founderDisplayName()}</p>
                    <p className="mt-1 text-[0.9375rem] text-muted">{founder.role}</p>
                  </div>
                  <ArrowUpRight aria-hidden className="size-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </section>
            </Reveal>

            {course.gallery.length > 0 && (
              <Reveal>
                <section aria-labelledby="gallery-title">
                  <SectionTitle id="gallery-title">Фото с обучения</SectionTitle>
                  <ul className="mt-8 grid grid-cols-2 gap-3">
                    {course.gallery.map((img, i) => (
                      <li key={img.src} className={i === 0 ? "col-span-2" : undefined}>
                        <Visual image={img} className="aspect-[4/3] rounded-2xl" sizes="(min-width: 1024px) 30vw, 50vw" />
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            )}

            {faq.length > 0 && (
              <Reveal>
                <section aria-labelledby="faq-title">
                  <SectionTitle id="faq-title">Вопросы и ответы</SectionTitle>
                  <div className="mt-8">
                    <Faq items={faq} />
                  </div>
                </section>
              </Reveal>
            )}
          </div>

        </div>
      </Container>

      </div>

      {/* Enrolment form */}
      <section id="zapis" aria-labelledby="enroll-title" className="scroll-mt-[var(--header-h)] bg-veil py-20 lg:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
            <Reveal className="lg:col-span-5">
              <Eyebrow>Запись</Eyebrow>
              <h2 id="enroll-title" className="mt-4 text-h2 font-semibold">
                Записаться на курс
              </h2>
              <p className="mt-5 max-w-md text-lead text-muted">
                «{course.title}». Оставьте контакты — мы уточним детали и подтвердим место в группе.
              </p>
              <WhatsAppAlt message={`Здравствуйте! Хочу записаться на курс «${course.title}».`} />
            </Reveal>
            <Reveal className="lg:col-span-6 lg:col-start-7" delay={80}>
              <div className="rounded-panel bg-card p-5 shadow-card sm:p-8 lg:p-10">
                <LeadForm type="course" fields={courseEnrollFields(course)} submitLabel={t.common.enroll} tone="mist" />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section data-atmo="courses" aria-labelledby="related-title" className="py-20 lg:py-28">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <h2 id="related-title" className="text-h2 font-semibold">
                Другие программы
              </h2>
              <ButtonLink href="/courses" variant="outline" arrow className="hidden sm:inline-flex">
                {t.common.allCourses}
              </ButtonLink>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              {related.map((c, i) => (
                <Reveal as="li" key={c.slug} delay={i * 70}>
                  <CourseCard course={c} />
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      )}


    </>
  );
}
