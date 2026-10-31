import type { Metadata } from "next";
import { Award, BookOpenCheck, Sparkles } from "lucide-react";
import { getFeaturedCourses } from "@/data/courses";
import { founder, founderDisplayName } from "@/data/founder";
import { site } from "@/data/site";
import { jsonLd, pageMetadata, absoluteUrl } from "@/lib/seo";
import { plural } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow, SectionHeader } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { Visual } from "@/components/ui/visual";
import { PageHero } from "@/components/sections/page-hero";
import { CourseCard } from "@/components/course/course-card";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = pageMetadata({
  title: "О преподавателе",
  description: `${founderDisplayName()} — ${founder.role.toLowerCase()}. Профессиональный путь, подход к обучению и квалификация.`,
  path: "/about",
  image: founder.portrait?.src,
});

export default function AboutPage() {
  const courses = getFeaturedCourses();
  const personLd = founder.name
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: founder.name,
        jobTitle: founder.role,
        url: absoluteUrl("/about"),
        worksFor: { "@type": "EducationalOrganization", name: site.name, url: site.url },
        ...(founder.portrait ? { image: absoluteUrl(founder.portrait.src) } : {}),
      }
    : null;

  const hasCredentials =
    founder.specializations.length > 0 ||
    founder.achievements.length > 0 ||
    founder.qualifications.length > 0 ||
    Boolean(founder.teaching);

  return (
    <>
      {personLd && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(personLd)} />}
      <PageHero
        crumbs={[{ href: "/about", label: "О преподавателе" }]}
        eyebrow="О преподавателе"
        title={founder.name ?? "Преподаватель-практик и основатель центра подологии"}
        lead={founder.intro}
        actions={
          <>
            <ButtonLink href="/courses" variant="accent" size="lg" arrow>
              Курсы преподавателя
            </ButtonLink>
            <ButtonLink href="/center" variant="outline" size="lg">
              Центр подологии
            </ButtonLink>
          </>
        }
        aside={
          <div className="relative">
            <Visual
              image={founder.portrait}
              tone="dark"
              seed={7}
              priority
              className="aspect-[4/5] rounded-panel"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/10 px-4 py-3 text-white backdrop-blur-md sm:inset-x-6 sm:bottom-6">
              <p className="font-semibold">{founderDisplayName()}</p>
              <p className="mt-0.5 text-[0.8125rem] text-white/75">{founder.role}</p>
            </div>
          </div>
        }
      />

      {founder.yearsOfExperience && (
        <section aria-label="Опыт" className="border-b border-line">
          <Container className="py-10">
            <p className="flex items-baseline gap-4">
              <span className="text-h1 font-semibold">{founder.yearsOfExperience}</span>
              <span className="text-muted">
                {plural(founder.yearsOfExperience, ["год", "года", "лет"])} профессионального опыта в подологии
              </span>
            </p>
          </Container>
        </section>
      )}

      <section aria-labelledby="philosophy-title" className="py-20 lg:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
            <Reveal className="lg:col-span-4">
              <Eyebrow>Подход</Eyebrow>
              <h2 id="philosophy-title" className="mt-4 text-h2 font-semibold">
                Профессиональная философия
              </h2>
            </Reveal>
            <ol className="lg:col-span-7 lg:col-start-6">
              {founder.philosophy.map((p, i) => (
                <Reveal
                  as="li"
                  key={p}
                  delay={i * 70}
                  className="grid grid-cols-[3rem_1fr] gap-4 border-t border-line py-8 last:border-b"
                >
                  <span className="text-sm font-semibold tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-[1.1875rem] leading-relaxed lg:text-[1.375rem]">{p}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {hasCredentials && (
        <section aria-labelledby="credentials-title" className="bg-mist py-20 lg:py-28">
          <Container>
            <Reveal>
              <SectionHeader eyebrow="Квалификация" title={<span id="credentials-title">Опыт и квалификация</span>} />
            </Reveal>
            <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
              {founder.specializations.length > 0 && (
                <Reveal className="rounded-card bg-paper p-6 sm:p-8">
                  <Sparkles aria-hidden className="size-6 text-accent" strokeWidth={1.5} />
                  <h3 className="mt-6 text-lg font-semibold">Специализация</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {founder.specializations.map((s) => (
                      <li key={s} className="rounded-full border border-line px-4 py-2 text-sm">
                        {s}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
              {founder.teaching && (
                <Reveal className="rounded-card bg-paper p-6 sm:p-8" delay={60}>
                  <BookOpenCheck aria-hidden className="size-6 text-accent" strokeWidth={1.5} />
                  <h3 className="mt-6 text-lg font-semibold">Преподавательская деятельность</h3>
                  <p className="mt-4 leading-relaxed text-muted">{founder.teaching}</p>
                </Reveal>
              )}
              {founder.achievements.length > 0 && (
                <Reveal className="rounded-card bg-paper p-6 sm:p-8" delay={120}>
                  <Award aria-hidden className="size-6 text-accent" strokeWidth={1.5} />
                  <h3 className="mt-6 text-lg font-semibold">Профессиональные достижения</h3>
                  <ul className="mt-4 space-y-3">
                    {founder.achievements.map((a) => (
                      <li key={a} className="flex gap-3 leading-relaxed">
                        <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
              {founder.qualifications.length > 0 && (
                <Reveal className="rounded-card bg-paper p-6 sm:p-8 md:col-span-2" delay={180}>
                  <h3 className="text-lg font-semibold">Дипломы и сертификаты</h3>
                  <ul className="mt-6 border-t border-line">
                    {founder.qualifications.map((q) => (
                      <li key={q.title} className="flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:items-baseline sm:justify-between">
                        <span className="font-medium">{q.title}</span>
                        <span className="text-sm text-muted">{[q.issuer, q.year].filter(Boolean).join(", ")}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </div>
            {founder.certificateImages.length > 0 && (
              <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {founder.certificateImages.map((img) => (
                  <li key={img.src}>
                    <Visual image={img} tone="paper" className="aspect-[3/4] rounded-2xl" imgClassName="object-contain p-3" sizes="25vw" />
                  </li>
                ))}
              </ul>
            )}
          </Container>
        </section>
      )}

      <section aria-labelledby="author-courses-title" className="border-t border-line py-20 lg:py-28">
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Обучение"
              title={<span id="author-courses-title">Авторские программы</span>}
              action={
                <ButtonLink href="/courses" variant="outline" arrow>
                  Все курсы
                </ButtonLink>
              }
            />
          </Reveal>
          <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
            {courses.map((c, i) => (
              <Reveal as="li" key={c.slug} delay={i * 70}>
                <CourseCard course={c} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}
