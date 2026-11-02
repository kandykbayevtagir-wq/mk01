import type { Metadata } from "next";
import { productCategories, products, productsByCategory } from "@/data/products";
import { pageMetadata } from "@/lib/seo";
import { formatKzt } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Visual } from "@/components/ui/visual";
import { PageHero } from "@/components/sections/page-hero";
import { FormSection } from "@/components/sections/form-section";
import { productFields } from "@/components/forms/presets";

export const metadata: Metadata = pageMetadata({
  title: "Профессиональная продукция",
  description: "Ортопедические стельки, подологические материалы и средства ухода за стопами.",
  path: "/products",
});

/**
 * No product records exist yet, so this page is a short category list and a
 * request form — nothing is presented as in stock or priced. Once products
 * are added to data/products.ts they appear as cards under their category.
 */
export default function ProductsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/products", label: "Продукция" }]}
        title="Профессиональная продукция"
        lead={products.length > 0 ? undefined : "Три направления. Ассортимент, наличие и стоимость — по запросу."}
      />

      <section aria-label="Категории" className="py-14 lg:py-20">
        <Container>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {productCategories.map((c, i) => (
              <Reveal as="li" key={c.id} delay={i * 70} className="rounded-card border border-line bg-card p-6">
                <p className="text-sm font-semibold tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-5 text-xl font-semibold tracking-tight">{c.title}</h2>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">{c.description}</p>
              </Reveal>
            ))}
          </ul>

          {products.length > 0 &&
            productCategories.map((c) => {
              const items = productsByCategory(c.id);
              if (items.length === 0) return null;
              return (
                <div key={c.id} className="mt-14">
                  <h2 className="text-h3 font-semibold">{c.title}</h2>
                  <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                    {items.map((p, i) => (
                      <Reveal as="li" key={p.slug} delay={(i % 4) * 60}>
                        <article className="flex h-full flex-col overflow-hidden rounded-card border border-line">
                          <Visual image={p.image} seed={50 + i} className="aspect-square" sizes="(min-width: 1024px) 25vw, 50vw" />
                          <div className="flex flex-1 flex-col p-5">
                            <h3 className="font-semibold">{p.title}</h3>
                            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.description}</p>
                            {(p.price || p.inStock !== null) && (
                              <div className="mt-5 flex items-center justify-between">
                                {p.price && <span className="font-semibold">{formatKzt(p.price)}</span>}
                                {p.inStock !== null && <span className="text-xs text-muted">{p.inStock ? "В наличии" : "Под заказ"}</span>}
                              </div>
                            )}
                          </div>
                        </article>
                      </Reveal>
                    ))}
                  </ul>
                </div>
              );
            })}
        </Container>
      </section>

      <FormSection
        id="zapros"
        eyebrow="Запрос"
        title="Подобрать продукцию"
        lead="Опишите задачу — подскажем вариант, наличие и стоимость."
        type="product"
        fields={productFields}
        submitLabel="Отправить запрос"
        successText="Спасибо! Мы свяжемся с вами, чтобы помочь с выбором."
        contactMessage="Здравствуйте! Интересует профессиональная продукция."
      />
    </>
  );
}
