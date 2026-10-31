import { getCourses } from "@/data/courses";
import { t } from "@/i18n";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { SectionDecor } from "@/components/ui/section-decor";
import { CourseCatalog } from "@/components/course/course-catalog";

export function ProgramsSection() {
  const courses = getCourses();
  return (
    <section id="programmy" aria-labelledby="programs-title" className="relative overflow-hidden bg-mist py-20 lg:py-32">
      <SectionDecor variant={["dots-corner", "arches-left"]} />
      <Container className="relative">
        <Reveal>
          <SectionHeader
            eyebrow="Обучение"
            title={<span id="programs-title">Программы обучения</span>}
            lead="Курсы для начинающих и практикующих специалистов. Выберите свою аудиторию — и подберите программу под свой уровень."
            action={
              <ButtonLink href="/courses" variant="outline" arrow className="hidden lg:inline-flex">
                {t.common.allCourses}
              </ButtonLink>
            }
          />
        </Reveal>
        <Reveal className="mt-10 lg:mt-14" delay={80}>
          <CourseCatalog courses={courses} limit={6} mobileLimit={3} />
        </Reveal>
        <div className="mt-10 lg:hidden">
          <ButtonLink href="/courses" variant="outline" arrow className="w-full">
            {t.common.allCourses}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
