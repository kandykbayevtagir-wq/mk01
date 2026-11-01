import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCourses, nextSession } from "@/data/courses";
import { founder, founderDisplayName } from "@/data/founder";
import { site } from "@/data/site";
import { t } from "@/i18n";
import { cn, formatDateRange } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import { Parallax } from "@/components/ui/parallax";
import { Visual } from "@/components/ui/visual";
import { ArchLines } from "@/components/ui/podo-art";

function delay(ms: number) {
  return { "--enter-delay": `${ms}ms` } as React.CSSProperties;
}

/**
 * Mobile-first hero.
 *
 * Phone order: eyebrow → headline → description → CTAs → visual (with the
 * upcoming-course card docked to it). On desktop the visual moves
 * into the right column and the course card floats over its edge.
 *
 * Motion: short CSS-only sequence (≤300 ms of delays). The headline only
 * moves — it never fades — so it is paintable for LCP from the first frame.
 */
export function Hero() {
  const courses = getCourses();
  const upcoming = courses
    .map((c) => ({ c, s: nextSession(c) }))
    .filter((x) => x.s)
    .sort((a, b) => a.s!.start.localeCompare(b.s!.start))[0];
  const spotlight = upcoming?.c ?? courses.find((c) => c.featured) ?? courses[0];

  const spotlightCard = spotlight && (
    <Link
      href={`/courses/${spotlight.slug}`}
      className={cn(
        "group press flex items-center gap-4 rounded-card border border-line bg-card p-4 shadow-float",
        "transition-[transform,border-color] duration-[var(--dur-card)] ease-out-soft hover:-translate-y-0.5 hover:border-ink/20",
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-xs font-medium text-muted">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/40 [animation-duration:2.4s] motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          {upcoming ? "Ближайший старт" : "Рекомендуем начать"}
        </p>
        <p className="mt-1.5 truncate text-[0.9375rem] font-semibold">{spotlight.title}</p>
        <p className="mt-0.5 truncate text-[0.8125rem] text-muted">
          {upcoming?.s ? `${formatDateRange(upcoming.s.start, upcoming.s.end)} · ${upcoming.s.city}` : "Набор по заявкам"}
        </p>
      </div>
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-mist transition-colors duration-[var(--dur-press)] group-hover:bg-ink group-hover:text-white">
        <ArrowUpRight aria-hidden className="size-[18px]" strokeWidth={1.75} />
      </span>
    </Link>
  );

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Backdrop: soft-gray panel (mobile: behind the visual; desktop: right third) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 bottom-0 top-[52%] bg-mist sm:top-[46%] lg:inset-y-0 lg:left-auto lg:w-[38%]">
          <div className="pattern-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)] lg:[mask-image:linear-gradient(to_left,black,transparent)]" />
        </div>
        <ArchLines draw accent className="draw-now absolute -bottom-1 -left-24 h-28 w-[300px] max-lg:hidden" count={8} />
      </div>

      <Container className="relative pb-12 pt-7 sm:pt-10 lg:pb-24 lg:pt-14">
        <div className="grid grid-cols-1 gap-9 lg:grid-cols-12 lg:gap-6">
          {/* Copy */}
          <div className="flex flex-col lg:col-span-7 lg:pr-8 lg:pt-6">
            <div className="enter-soft" style={delay(0)}>
              <Eyebrow>{site.name} · Актобе</Eyebrow>
            </div>
            <h1
              id="hero-title"
              className="enter-rise mt-4 text-display font-semibold lg:mt-7 lg:text-[length:clamp(3rem,5vw,4.875rem)]"
              style={delay(40)}
            >
              Профессиональное обучение подологии<span className="text-accent">.</span>
            </h1>
            <p className="enter mt-4 max-w-[34ch] text-lead text-muted lg:mt-7 lg:max-w-xl" style={delay(110)}>
              Авторские курсы, практические знания и профессиональное развитие специалистов.
            </p>
            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:gap-3 lg:mt-10">
              <ButtonLink href="/courses" variant="accent" size="lg" arrow className="enter" style={delay(170)}>
                {t.common.chooseCourse}
              </ButtonLink>
              <ButtonLink href="/about" variant="outline" size="lg" className="enter" style={delay(220)}>
                О Марине
              </ButtonLink>
            </div>
          </div>

          {/* Visual */}
          <div className="relative lg:col-span-5">
            <div aria-hidden className="glow-red absolute -inset-x-10 -top-10 bottom-0 lg:-inset-16" />
            <div aria-hidden className="glow-neutral absolute -bottom-16 -left-16 size-72" />

            <div className="enter-fade relative" style={delay(120)}>
              <Parallax
                className="grain aspect-[4/3.3] rounded-panel bg-graphite shadow-float sm:aspect-[16/11] lg:aspect-[4/5]"
                distance={24}
              >
                <Visual
                  image={founder.portrait}
                  tone="dark"
                  art="feet"
                  seed={7}
                  priority
                  className="h-full w-full"
                  imgClassName="object-[50%_20%]"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </Parallax>

              {/* Caption — gradient scrim guarantees legibility over photos */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-panel bg-gradient-to-t from-black/70 via-black/30 to-transparent px-5 pb-5 pt-14 text-white sm:px-6 sm:pb-6 max-sm:pb-14">
                <p className="text-[0.9375rem] font-semibold">{founderDisplayName()}</p>
                <p className="mt-0.5 line-clamp-1 max-w-[34ch] text-[0.8125rem] leading-snug text-white/80 sm:line-clamp-none">{founder.role}</p>
              </div>

              {/* Desktop/tablet floating course card */}
              {spotlight && (
                <div className="absolute right-4 top-4 hidden w-[290px] sm:block lg:-left-12 lg:right-auto lg:top-10">
                  {spotlightCard}
                </div>
              )}
            </div>

            {/* Mobile: course card docked under the visual */}
            {spotlight && (
              <div className="enter relative -mt-10 px-3 sm:hidden" style={delay(260)}>
                {spotlightCard}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
