import type { Metadata } from "next";
import Link from "next/link";
import { Building2, GraduationCap, Store } from "lucide-react";
import { partnerContent } from "@/data/content";
import { getCourses } from "@/data/courses";
import { pageMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ContourArt } from "@/components/ui/contour-art";
import { Eyebrow, SectionHeader } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { FormSection } from "@/components/sections/form-section";
import { partnerFields } from "@/components/forms/presets";

export const metadata: Metadata = pageMetadata({
  title: "Организаторам обучения",
  description:
    "Организуйте профессиональное обучение подологии в своём городе: соберите группу, предоставьте площадку — мы привезём программу и проведём курс.",
  path: "/partners",
});

const whoIcons = [Building2, GraduationCap, Store];

export default function PartnersPage() {
  const courses = getCourses();
  return (
    <>
      <PageHero
        crumbs={[{ href: "/partners", label: "Организаторам" }]}
        eyebrow="Партнёрство"
        title="Организуйте профессиональное обучение в вашем городе"
        lead="Мы предоставляем авторские образовательные программы и проводим или координируем обучение. Местный организатор помогает собрать группу и подобрать подходящую площадку."
        actions={
          <ButtonLink href="#zayavka" variant="accent" size="lg" arrow>
            Стать организатором
          </ButtonLink>
        }
        aside={
          <div data-tone="dark" className="relative isolate overflow-hidden rounded-panel bg-graphite p-6 text-white sm:p-8">
            <ContourArt seed={9} tone="dark" className="absolute inset-0 -z-10 h-full w-full opacity-70" marker={false} />
            <p className="text-eyebrow font-semibold uppercase text-muted-dark">Модель сотрудничества</p>
            <div className="mt-8 grid grid-cols-1 gap-3 xs:grid-cols-2">
              <div className="rounded-2xl bg-white/[0.06] p-5 backdrop-blur-sm">
                <p className="text-sm text-muted-dark">Организатор</p>
                <p className="mt-2 font-semibold leading-snug">Группа участников и площадка</p>
              </div>
              <div className="rounded-2xl bg-white/[0.06] p-5 backdrop-blur-sm">
                <p className="text-sm text-muted-dark">Школа</p>
                <p className="mt-2 font-semibold leading-snug">Программа и проведение обучения</p>
              </div>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-muted-dark">
              Условия сотрудничества обсуждаются индивидуально для каждого города и формата.
            </p>
          </div>
        }
      />

      <section aria-labelledby="who-title" className="py-20 lg:py-28">
        <Container>
          <Reveal>
            <SectionHeader eyebrow="Кому подходит" title={<span id="who-title">Кто может стать организатором</span>} />
          </Reveal>
          <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {partnerContent.who.map((w, i) => {
              const Icon = whoIcons[i % whoIcons.length];
              return (
                <Reveal as="li" key={w} delay={i * 70} className="rounded-card border border-line p-6 sm:p-8">
                  <Icon aria-hidden className="size-6 text-accent" strokeWidth={1.5} />
                  <p className="mt-8 text-lg font-semibold leading-snug tracking-tight">{w}</p>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </section>

      <section aria-label="Роли сторон" className="pb-20 lg:pb-28">
        <Container>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <Reveal className="rounded-panel bg-mist p-6 sm:p-10 lg:p-12">
              <Eyebrow>Организатор</Eyebrow>
              <h2 className="mt-4 text-h3 font-semibold lg:text-[2rem]">За что отвечает организатор</h2>
              <ul className="mt-8 border-t border-line">
                {partnerContent.organizerDoes.map((x, i) => (
                  <li key={x} className="grid grid-cols-[2.5rem_1fr] border-b border-line py-4">
                    <span className="text-sm font-semibold tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal data-tone="dark" delay={80} className="rounded-panel bg-graphite p-6 text-white sm:p-10 lg:p-12">
              <Eyebrow tone="dark">Образовательная команда</Eyebrow>
              <h2 className="mt-4 text-h3 font-semibold lg:text-[2rem]">Что предоставляем мы</h2>
              <ul className="mt-8 border-t border-line-dark">
                {partnerContent.teamProvides.map((x, i) => (
                  <li key={x} className="grid grid-cols-[2.5rem_1fr] border-b border-line-dark py-4">
                    <span className="text-sm font-semibold tabular-nums text-white/50">{String(i + 1).padStart(2, "0")}</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      <section aria-labelledby="steps-title" className="border-t border-line py-20 lg:py-28">
        <Container>
          <Reveal>
            <SectionHeader eyebrow="Процесс" title={<span id="steps-title">Как начинается сотрудничество</span>} />
          </Reveal>
          <ol className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {partnerContent.steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 70} className="relative border-t-2 border-ink pt-6">
                <span
                  aria-hidden
                  className="absolute -top-[5px] left-0 size-2 rounded-full bg-accent"
                />
                <p className="text-sm font-semibold tabular-nums text-muted">Шаг {i + 1}</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{s.text}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-16 rounded-card border border-line p-6 sm:p-8">
            <p className="text-sm font-semibold text-muted">Программы, доступные для выездного обучения</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {courses.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/courses/${c.slug}`}
                    className="inline-flex h-10 items-center rounded-full border border-line px-4 text-sm font-medium transition-colors hover:border-ink"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <FormSection
        id="zayavka"
        eyebrow="Заявка"
        title="Стать организатором"
        lead="Расскажите о своём городе и аудитории. Мы свяжемся с вами, чтобы обсудить формат, программу и возможные даты."
        type="partner"
        fields={partnerFields}
        submitLabel="Отправить заявку"
        successText="Спасибо! Мы получили заявку организатора и свяжемся с вами, чтобы обсудить детали."
        contactMessage="Здравствуйте! Хочу организовать обучение в своём городе."
      />
    </>
  );
}
