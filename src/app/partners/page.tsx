import type { Metadata } from "next";
import { partnerContent } from "@/data/content";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
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

export default function PartnersPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/partners", label: "Организаторам" }]}
        eyebrow="Партнёрство"
        title="Организуйте профессиональное обучение в вашем городе"
        lead="Мы предоставляем авторские образовательные программы и проводим или координируем обучение. Местный организатор помогает собрать группу и подобрать подходящую площадку."
      />

      <section aria-label="Роли сторон" className="py-14 lg:py-20">
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

      <section aria-labelledby="steps-title" className="border-t border-line py-14 lg:py-20">
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
