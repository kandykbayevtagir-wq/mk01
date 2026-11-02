import type { Metadata } from "next";
import Link from "next/link";
import { getTestimonials, trainingPhotos } from "@/data/testimonials";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { Visual } from "@/components/ui/visual";
import { PageHero } from "@/components/sections/page-hero";
import { TestimonialGrid } from "@/components/sections/testimonials";

export const metadata: Metadata = pageMetadata({
  title: "Отзывы",
  description: "Отзывы выпускников курсов подологии.",
  path: "/reviews",
});

export default function ReviewsPage() {
  const count = getTestimonials().length;
  return (
    <>
      <PageHero
        crumbs={[{ href: "/reviews", label: "Отзывы" }]}
        eyebrow="Отзывы"
        title="Отзывы выпускников"
        lead={
          count > 0 ? (
            "Публикуются с согласия участников, с указанием курса и города."
          ) : (
            <>
              Опубликованных отзывов пока нет: мы размещаем только те, на которые участники дали согласие.{" "}
              <Link href="/contacts" className="font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
                Поделиться отзывом
              </Link>
            </>
          )
        }
      />

      {count > 0 && (
        <section aria-label="Отзывы" className="py-16 lg:py-24">
          <Container>
            <TestimonialGrid />
          </Container>
        </section>
      )}

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
    </>
  );
}
