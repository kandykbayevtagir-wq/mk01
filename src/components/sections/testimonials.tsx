import Link from "next/link";
import { Play, Quote } from "lucide-react";
import { getCourse } from "@/data/courses";
import { getTestimonials } from "@/data/testimonials";
import type { Testimonial } from "@/data/types";
import { formatDate } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { Visual } from "@/components/ui/visual";

export function TestimonialCard({ item }: { item: Testimonial }) {
  const course = item.courseSlug ? getCourse(item.courseSlug) : null;
  return (
    <figure className="flex h-full flex-col rounded-card border border-line bg-paper p-6 sm:p-8">
      <Quote aria-hidden className="size-7 text-accent" strokeWidth={1.5} />
      <blockquote className="mt-5 flex-1 text-[1.0625rem] leading-relaxed">{item.text}</blockquote>
      <figcaption className="mt-8 flex items-center gap-4 border-t border-line pt-5">
        {item.photo && (
          <Visual image={item.photo} className="size-12 shrink-0 rounded-full" sizes="48px" />
        )}
        <div className="min-w-0">
          <p className="font-semibold">{item.author}</p>
          <p className="truncate text-[0.8125rem] text-muted">
            {[item.city, course?.title, item.date && formatDate(item.date, true)].filter(Boolean).join(" · ")}
          </p>
        </div>
        {item.videoUrl && (
          <a
            href={item.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-accent"
            aria-label={`Видеоотзыв: ${item.author}`}
          >
            <Play aria-hidden className="size-4" fill="currentColor" />
          </a>
        )}
      </figcaption>
    </figure>
  );
}

/** Grid of verified testimonials, or an honest empty state. */
export function TestimonialGrid({ limit }: { limit?: number }) {
  const items = getTestimonials().slice(0, limit);
  if (items.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-8 rounded-panel border border-line bg-paper p-6 sm:p-10 lg:grid-cols-12 lg:items-end lg:gap-6">
        <div className="lg:col-span-7">
          <Quote aria-hidden className="size-8 text-accent" strokeWidth={1.5} />
          <p className="mt-6 max-w-2xl text-h3 font-medium">
            Мы публикуем только реальные отзывы выпускников — с их согласия, с указанием курса и города.
          </p>
          <p className="mt-4 max-w-xl text-muted">Раздел пополняется после каждого потока обучения.</p>
        </div>
        <div className="lg:col-span-4 lg:col-start-9 lg:text-right">
          <Link
            href="/contacts"
            className="inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
          >
            Вы выпускник? Поделитесь отзывом
          </Link>
        </div>
      </div>
    );
  }
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
      {items.map((item, i) => (
        <Reveal as="li" key={item.id} delay={(i % 3) * 70}>
          <TestimonialCard item={item} />
        </Reveal>
      ))}
    </ul>
  );
}
