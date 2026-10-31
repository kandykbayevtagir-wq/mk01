import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { productCategories } from "@/data/products";
import { Visual } from "@/components/ui/visual";
import { Reveal } from "@/components/ui/reveal";

export function ProductCategoryGrid({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
      {productCategories.map((c, i) => (
        <Reveal as="li" key={c.id} delay={i * 80}>
          <article className="group relative flex h-full flex-col overflow-hidden rounded-card bg-mist transition-shadow duration-500 ease-out-soft hover:shadow-lift">
            <Visual
              image={null}
              seed={30 + i}
              className="aspect-[5/4]"
              imgClassName="transition-transform duration-700 ease-out-soft group-hover:scale-[1.05]"
              marker={i === 0}
            />
            <div className="flex flex-1 flex-col p-6">
              <H className="text-h3 font-semibold">
                <Link
                  href={`/products#${c.id}`}
                  className="outline-none after:absolute after:inset-0 after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
                >
                  {c.title}
                </Link>
              </H>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{c.description}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold">
                Подробнее
                <ArrowUpRight
                  aria-hidden
                  className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </article>
        </Reveal>
      ))}
    </ul>
  );
}
