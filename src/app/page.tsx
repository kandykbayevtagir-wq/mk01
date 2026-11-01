import type { Metadata } from "next";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { Hero } from "@/components/sections/home/hero";
import { ProgramsSection } from "@/components/sections/home/programs";
import { FounderSection } from "@/components/sections/home/founder";
import { AdvantagesSection } from "@/components/sections/advantages";
import { PartnersTeaser } from "@/components/sections/home/partners-teaser";
import { CenterTeaser } from "@/components/sections/home/center-teaser";
import { ProductCategoryGrid } from "@/components/sections/product-categories";
import { TestimonialGrid } from "@/components/sections/testimonials";
import { getTestimonials } from "@/data/testimonials";
import { AudiencePaths } from "@/components/sections/home/audience-paths";
import { SectionDecor } from "@/components/ui/section-decor";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = pageMetadata({
  description: site.description,
  path: "/",
});

export default function HomePage() {
  const hasReviews = getTestimonials().length > 0;
  return (
    <>
      <Hero />
      <AudiencePaths />
      <ProgramsSection />
      <FounderSection />
      <AdvantagesSection />
      <CenterTeaser />

      <section aria-labelledby="products-title" className="relative overflow-hidden bg-mist py-16 sm:py-20 lg:py-28">
        <SectionDecor variant={["arches-right"]} />
        <Container className="relative">
          <Reveal>
            <SectionHeader
              eyebrow="Продукция"
              title={<span id="products-title">Профессиональная продукция</span>}
              lead="Стельки, материалы для подологов и средства ухода — с консультацией специалиста."
              action={
                <ButtonLink href="/products" variant="outline" arrow>
                  Весь каталог
                </ButtonLink>
              }
            />
          </Reveal>
          <div className="mt-10 lg:mt-14">
            <ProductCategoryGrid />
          </div>
        </Container>
      </section>

      {/* Shown only when verified testimonials exist — no empty placeholder on the homepage. */}
      {hasReviews && (
        <section aria-labelledby="reviews-title" className="py-16 sm:py-20 lg:py-28">
          <Container>
            <Reveal>
              <SectionHeader
                eyebrow="Отзывы"
                title={<span id="reviews-title">Что говорят выпускники</span>}
                action={
                  <ButtonLink href="/reviews" variant="outline" arrow>
                    Все отзывы
                  </ButtonLink>
                }
              />
            </Reveal>
            <Reveal className="mt-10 lg:mt-14" delay={80}>
              <TestimonialGrid limit={3} />
            </Reveal>
          </Container>
        </section>
      )}

      <PartnersTeaser />
      <FinalCta />
    </>
  );
}
