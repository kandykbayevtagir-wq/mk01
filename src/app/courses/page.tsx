import type { Metadata } from "next";
import { audiences, commonCourseFaq, getCourses } from "@/data/courses";
import { pageMetadata } from "@/lib/seo";
import { plural } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { CourseCatalog } from "@/components/course/course-catalog";
import { PageHero } from "@/components/sections/page-hero";
import { Faq } from "@/components/sections/faq";
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
  return (
    <>
      <PageHero
        crumbs={[{ href: "/courses", label: "Курсы" }]}
        eyebrow="Обучение"
        title="Курсы подологии"
        lead={`${courses.length} ${plural(courses.length, ["программа", "программы", "программ"])} для ${audiences.length} аудиторий — от первого знакомства с профессией до преподавательской практики.`}
      />

      <section aria-label="Каталог программ" className="py-14 lg:py-20">
        <Container>
          <CourseCatalog courses={courses} headingLevel="h2" />
        </Container>
      </section>

      <section aria-labelledby="consult-title" className="border-t border-line bg-mist py-20 lg:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-6">
            <Reveal className="lg:col-span-5">
              <SectionHeader
                eyebrow="Консультация"
                title={<span id="consult-title">Поможем выбрать программу</span>}
                lead="Расскажите о своём опыте — мы предложим курс, который подходит вашему уровню и задачам."
              />
              <div className="mt-12 hidden lg:block">
                <h3 className="text-sm font-semibold text-muted">Частые вопросы</h3>
                <div className="mt-4">
                  <Faq items={commonCourseFaq} />
                </div>
              </div>
            </Reveal>
            <Reveal className="lg:col-span-6 lg:col-start-7" delay={80}>
              <div className="rounded-panel bg-paper p-5 shadow-card sm:p-8 lg:p-10">
                <LeadForm type="course" fields={courseEnrollFields()} tone="mist" />
              </div>
            </Reveal>
            <div className="lg:hidden">
              <h3 className="text-sm font-semibold text-muted">Частые вопросы</h3>
              <div className="mt-4">
                <Faq items={commonCourseFaq} withSchema={false} />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
