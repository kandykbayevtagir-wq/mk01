import type { Metadata } from "next";
import { Check } from "lucide-react";
import { productCategories, productsByCategory } from "@/data/products";
import { pageMetadata } from "@/lib/seo";
import { formatKzt } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { Visual } from "@/components/ui/visual";
import { PageHero } from "@/components/sections/page-hero";
import { FormSection } from "@/components/sections/form-section";
import { productFields } from "@/components/forms/presets";

export const metadata: Metadata = pageMetadata({
  title: "Профессиональная продукция",
  description:
    "Ортопедические стельки, подологические материалы и специализированные средства ухода за стопами — с консультацией специалиста.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/products", label: "Продукция" }]}
        eyebrow="Продукция"
        title="Профессиональная продукция"
        lead="Решения, которые специалисты используют в работе и рекомендуют клиентам. Поможем подобрать продукт под задачу."
        actions={
          <ButtonLink href="#zapros" variant="accent" size="lg" arrow>
            Запросить консультацию
          </ButtonLink>
        }
      />

      <nav aria-label="Категории продукции" className="sticky top-[var(--header-h)] z-30 border-b border-line bg-paper/90 backdrop-blur-xl">
        <Container>
          <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
            {productCategories.map((c) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  className="inline-flex h-10 items-center whitespace-nowrap rounded-full px-4 text-sm font-medium text-muted transition-colors hover:bg-mist hover:text-ink"
                >
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      {productCategories.map((c, idx) => {
        const items = productsByCategory(c.id);
        return (
          <section
            key={c.id}
            id={c.id}
            aria-labelledby={`${c.id}-title`}
            className="scroll-mt-[calc(var(--header-h)+64px)] border-b border-line py-16 lg:py-24"
          >
            <Container>
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
                <Reveal className={idx % 2 ? "lg:order-2 lg:col-span-6 lg:col-start-7" : "lg:col-span-6"}>
                  <Visual image={null} seed={30 + idx} marker={idx === 0} className="aspect-[4/3] rounded-panel" />
                </Reveal>
                <Reveal
                  delay={80}
                  className={
                    "flex flex-col justify-center " +
                    (idx % 2 ? "lg:order-1 lg:col-span-5" : "lg:col-span-5 lg:col-start-8")
                  }
                >
                  <Eyebrow>{`0${idx + 1}`}</Eyebrow>
                  <h2 id={`${c.id}-title`} className="mt-4 text-h2 font-semibold">
                    {c.title}
                  </h2>
                  <p className="mt-5 text-lead text-muted">{c.description}</p>
                  <ul className="mt-8 space-y-3">
                    {c.points.map((p) => (
                      <li key={p} className="flex items-center gap-3">
                        <Check aria-hidden className="size-4 text-accent" strokeWidth={2} />
                        {p}
                      </li>
                    ))}
                  </ul>
                  {items.length === 0 && (
                    <p className="mt-8 text-[0.9375rem] text-muted">Ассортимент, наличие и стоимость уточняйте у специалиста.</p>
                  )}
                  <div className="mt-8">
                    <ButtonLink href="#zapros" variant="outline" arrow>
                      Узнать о наличии
                    </ButtonLink>
                  </div>
                </Reveal>
              </div>

              {items.length > 0 && (
                <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                  {items.map((p, i) => (
                    <Reveal as="li" key={p.slug} delay={(i % 4) * 60}>
                      <article className="group flex h-full flex-col overflow-hidden rounded-card border border-line">
                        <Visual
                          image={p.image}
                          seed={50 + i}
                          className="aspect-square"
                          imgClassName="transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
                          sizes="(min-width: 1024px) 25vw, 50vw"
                        />
                        <div className="flex flex-1 flex-col p-5">
                          <h3 className="font-semibold">{p.title}</h3>
                          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.description}</p>
                          <div className="mt-5 flex items-center justify-between">
                            <span className="font-semibold">{p.price ? formatKzt(p.price) : "Цена по запросу"}</span>
                            {p.inStock !== null && (
                              <span className="text-xs text-muted">{p.inStock ? "В наличии" : "Под заказ"}</span>
                            )}
                          </div>
                        </div>
                      </article>
                    </Reveal>
                  ))}
                </ul>
              )}
            </Container>
          </section>
        );
      })}

      <FormSection
        id="zapros"
        eyebrow="Запрос"
        title="Подобрать продукцию"
        lead="Опишите задачу — специалист подскажет подходящий вариант, наличие и стоимость."
        type="product"
        fields={productFields}
        submitLabel="Отправить запрос"
        successText="Спасибо! Специалист свяжется с вами, чтобы помочь с выбором."
        contactMessage="Здравствуйте! Интересует профессиональная продукция."
      />
    </>
  );
}
