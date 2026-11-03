import { getFeaturedCourses } from "@/data/courses";
import { t } from "@/i18n";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { SectionDecor } from "@/components/ui/section-decor";
import { CourseCard } from "@/components/course/course-card";

/** Selected courses — three at most; the full catalogue is one link away. */
export function ProgramsSection() {
  const courses = getFeaturedCourses().slice(0, 3);
  return (
    <section data-atmo="courses" id="programmy" aria-labelledby="programs-title" className="motion-programs surface-mist relative overflow-clip py-14 sm:py-20 lg:py-24">
      <SectionDecor variant={["dots-corner", "arches-left"]} />
      <Container className="relative">
        <Reveal>
          <SectionHeader
            eyebrow="Обучение"
            title={<span id="programs-title">Курсы</span>}
            action={
              <ButtonLink href="/courses" variant="outline" arrow className="hidden lg:inline-flex">
                {t.common.allCourses}
              </ButtonLink>
            }
          />
        </Reveal>
        <ul className="course-stack mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:mt-12 xl:grid-cols-3">
          {courses.map((c, i) => (
            <li key={c.slug} style={{ "--stack-i": i } as React.CSSProperties}>
              <Reveal delay={i * 70} className="h-full">
                <CourseCard course={c} />
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="mt-7 lg:hidden">
          <ButtonLink href="/courses" variant="outline" arrow className="w-full">
            {t.common.allCourses}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
