import type { Metadata } from "next";
import { getTestimonials, trainingPhotos } from "@/data/testimonials";
import { pageMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { Visual } from "@/components/ui/visual";
import { PageHero } from "@/components/sections/page-hero";
import { TestimonialGrid } from "@/components/sections/testimonials";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = pageMetadata({
  title: "Отзывы и результаты",
  description: "Отзывы выпускников курсов подологии, фотографии с обучения и результаты участников.",
  path: "/reviews",
});

export default function ReviewsPage() {
  const count = getTestimonials().length;
  return (
    <>
      <PageHero
        crumbs={[{ href: "/reviews", label: "Отзывы" }]}
        eyebrow="Отзывы и результаты"
        title="Отзывы выпускников"
        lead="Реальные впечатления участников обучения — публикуются с их согласия, с указанием курса и города."
        actions={
          <ButtonLink href="/courses" variant="accent" size="lg" arrow>
            Выбрать курс
          </ButtonLink>
        }
      />

      <section aria-label="Отзывы" className="py-16 lg:py-24">
        <Container>
          {count > 0 && <p className="mb-8 text-sm text-muted">Опубликовано отзывов: {count}</p>}
          <TestimonialGrid />
        </Container>
      </section>

      {trainingPhotos.length > 0 && (
        <section aria-labelledby="photos-title" className="border-t border-line py-20 lg:py-28">
          <Container>
            <Reveal>
              <SectionHeader eyebrow="Фото" title={<span id="photos-title">С обучения</span>} />
            </Reveal>
            <ul className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
              {trainingPhotos.map((img, i) => (
                <Reveal as="li" key={img.src} delay={(i % 4) * 60} className={i % 5 === 0 ? "col-span-2 row-span-2" : undefined}>
                  <Visual image={img} className="aspect-square h-full rounded-card" sizes="(min-width: 1024px) 25vw, 50vw" />
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <FinalCta />
    </>
  );
}
