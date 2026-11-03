import type { Metadata } from "next";
import { audiences, commonCourseFaq, getCourses } from "@/data/courses";
import { assertGuideReferences } from "@/data/course-guide";
import { pageMetadata } from "@/lib/seo";
import { plural } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { CourseCatalog } from "@/components/course/course-catalog";
import { PageHero } from "@/components/sections/page-hero";
import { Faq } from "@/components/sections/faq";
import { WhatsAppAlt } from "@/components/sections/form-section";
import { LeadForm } from "@/components/forms/lead-form";
import { courseEnrollFields } from "@/components/forms/presets";

export const metadata: Metadata = pageMetadata({
  title: "Курсы подологии",
  description:
    "Каталог курсов подологии: базовое обучение, специализации для практикующих подологов, программы для мастеров педикюра и преподавателей.",
  path: "/courses",
});

export default function CoursesPage() {
  const courses = getCourses();
  assertGuideReferences(courses); // a guide line that no longer exists in the data fails the build
  return (
    <>
      <PageHero
        crumbs={[{ href: "/courses", label: "Курсы" }]}
        eyebrow="Обучение"
        title="Курсы подологии"
        lead={`${courses.length} ${plural(courses.length, ["программа", "программы", "программ"])} для ${audiences.length} аудиторий — от первого знакомства с профессией до преподавательской практики.`}
      />

      <section aria-label="Каталог программ" className="pb-14 pt-6 sm:pt-10 lg:py-20">
        <Container>
          <CourseCatalog courses={courses} headingLevel="h2" />
        </Container>
      </section>

      <section aria-labelledby="consult-title" className="border-t border-line bg-mist py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
            <Reveal className="lg:col-span-5">
              <SectionHeader
                eyebrow="Запись"
                title={<span id="consult-title">Записаться на курс</span>}
                lead="Выберите программу в списке или укажите в комментарии, что вам подходит."
              />
              <WhatsAppAlt message="Здравствуйте! Хочу записаться на курс." />
            </Reveal>
            <Reveal className="lg:col-span-6 lg:col-start-7" delay={80}>
              <div className="rounded-panel bg-card p-5 shadow-card sm:p-8 lg:p-10">
                <LeadForm type="course" fields={courseEnrollFields()} tone="mist" />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section aria-labelledby="catalog-faq-title" className="py-14 lg:py-20">
        <Container>
          <h2 id="catalog-faq-title" className="text-h3 font-semibold">
            Вопросы и ответы
          </h2>
          <div className="mt-6 max-w-3xl">
            <Faq items={commonCourseFaq} />
          </div>
        </Container>
      </section>
    </>
  );
}
