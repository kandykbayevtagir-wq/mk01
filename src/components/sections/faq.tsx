import { Plus } from "lucide-react";
import type { FaqItem } from "@/data/types";
import { jsonLd } from "@/lib/seo";

/** Accessible accordion built on native <details>/<summary> — zero JS. */
export function Faq({ items, withSchema = true }: { items: FaqItem[]; withSchema?: boolean }) {
  if (items.length === 0) return null;
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
  return (
    <>
      <ul className="border-t border-line">
        {items.map((item) => (
          <li key={item.q} className="border-b border-line">
            <details className="group">
              <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-5 text-left text-[1.0625rem] font-semibold transition-colors hover:text-ink/80">
                {item.q}
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line transition-[transform,background-color,border-color,color] duration-300 ease-out-soft group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-white">
                  <Plus aria-hidden className="size-4" strokeWidth={1.75} />
                </span>
              </summary>
              <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out-soft group-open:grid-rows-[1fr]">
                <p className="overflow-hidden pb-6 pr-12 leading-relaxed text-muted">{item.a}</p>
              </div>
            </details>
          </li>
        ))}
      </ul>
      {withSchema && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />}
    </>
  );
}
