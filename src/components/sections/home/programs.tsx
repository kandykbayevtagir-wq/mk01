import { getFeaturedCourses } from "@/data/courses";
import { t } from "@/i18n";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { SectionDecor } from "@/components/ui/section-decor";
import { CourseCard } from "@/components/course/course-card";

export function ProgramsSection() {
  const courses = getFeaturedCourses();
  return (
    <section id="programmy" aria-labelledby="programs-title" className="motion-programs surface-mist relative overflow-hidden py-16 sm:py-20 lg:py-28">
      <SectionDecor variant={["dots-corner", "arches-left"]} />
      <Container className="relative">
        <Reveal>
          <SectionHeader
            eyebrow="Обучение"
            title={<span id="programs-title">Популярные курсы</span>}
            lead="Практические программы для начинающих и практикующих специалистов."
            action={
              <ButtonLink href="/courses" variant="outline" arrow className="hidden lg:inline-flex">
                {t.common.allCourses}
              </ButtonLink>
            }
          />
        </Reveal>
        <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:mt-14 xl:grid-cols-3">
          {courses.map((c, i) => (
            <Reveal as="li" key={c.slug} delay={i * 70}>
              <CourseCard course={c} featuredMotion={i === 0} />
            </Reveal>
          ))}
        </ul>
        <div className="mt-8 lg:hidden">
          <ButtonLink href="/courses" variant="outline" arrow className="w-full">
            {t.common.allCourses}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
