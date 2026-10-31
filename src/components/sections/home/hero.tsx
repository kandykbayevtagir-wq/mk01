import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { audiences, getCourses, nextSession } from "@/data/courses";
import { founder, founderDisplayName } from "@/data/founder";
import { t } from "@/i18n";
import { formatDateRange, plural } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import { Parallax } from "@/components/ui/parallax";
import { Visual } from "@/components/ui/visual";
import { ArchLines } from "@/components/ui/podo-art";

function delay(ms: number) {
  return { "--enter-delay": `${ms}ms` } as React.CSSProperties;
}

export function Hero() {
  const courses = getCourses();
  const upcoming = courses
    .map((c) => ({ c, s: nextSession(c) }))
    .filter((x) => x.s)
    .sort((a, b) => a.s!.start.localeCompare(b.s!.start))[0];
  const spotlight = upcoming?.c ?? courses.find((c) => c.featured) ?? courses[0];

  const facts = [
    { value: String(courses.length), label: plural(courses.length, ["программа", "программы", "программ"]) + " обучения" },
    { value: String(audiences.length), label: "направления для разных уровней подготовки" },
    { value: "Ваш город", label: "выездные группы с местными организаторами" },
  ];

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Decorative backdrop: sand panel with sensor-plate dots, arches, footprints */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute inset-y-0 right-0 w-full bg-mist max-lg:top-[46%] lg:w-[38%]">
          <div className="pattern-dots absolute inset-0 opacity-80 [mask-image:linear-gradient(to_left,black,transparent)]" />
        </div>
        <ArchLines className="absolute -bottom-2 -left-24 h-56 w-[520px] max-sm:hidden" count={8} />
        <div className="absolute -right-24 -top-24 size-72 rounded-full border border-clay/30 max-lg:hidden" />
        <div className="absolute -right-10 -top-10 size-44 rounded-full border border-clay/25 max-lg:hidden" />
      </div>
      <Container className="relative z-10 pb-16 pt-6 sm:pt-10 lg:pb-28 lg:pt-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="flex flex-col lg:col-span-7 lg:pr-8 lg:pt-6">
            <div className="enter" style={delay(0)}>
              <Eyebrow>Школа подологии · Обучение и практика</Eyebrow>
            </div>
            <h1
              id="hero-title"
              className="enter-rise mt-6 text-display font-semibold lg:mt-8 lg:text-[length:clamp(3rem,5vw,4.875rem)]"
              style={delay(80)}
            >
              Профессиональное обучение подологии<span className="text-accent">.</span>
            </h1>
            <p className="enter mt-6 max-w-xl text-lead text-muted lg:mt-8" style={delay(160)}>
              Авторские курсы, практические знания и профессиональное развитие специалистов.
            </p>
            <div className="enter mt-8 flex flex-col gap-3 sm:flex-row lg:mt-10" style={delay(240)}>
              <ButtonLink href="/courses" variant="accent" size="lg" arrow>
                {t.common.chooseCourse}
              </ButtonLink>
              <ButtonLink href="/about" variant="outline" size="lg">
                О преподавателе
              </ButtonLink>
            </div>

            <dl className="enter mt-12 grid grid-cols-1 border-t border-line sm:grid-cols-3 lg:mt-auto lg:pt-0" style={delay(320)}>
              {facts.map((f, i) => (
                <div
                  key={f.label}
                  className={
                    "flex items-baseline gap-3 border-b border-line py-4 sm:block sm:border-b-0 sm:py-6 " +
                    (i > 0 ? "sm:border-l sm:pl-5" : "sm:pr-5")
                  }
                >
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="min-w-[5.5rem] text-xl font-semibold tracking-tight sm:min-w-0 sm:text-2xl lg:text-[2rem]">{f.value}</dd>
                  <dd className="text-[0.8125rem] leading-snug text-muted sm:mt-2">{f.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="enter-fade relative lg:col-span-5" style={delay(120)}>
            <div aria-hidden className="absolute -bottom-6 -left-6 size-40 rounded-full bg-clay/25 blur-2xl" />
            <div aria-hidden className="absolute -right-3 -top-3 hidden size-24 rounded-[28px] border border-clay/40 sm:block" />
            <Parallax className="aspect-[4/4.6] rounded-panel bg-graphite shadow-float sm:aspect-[4/4] lg:aspect-[4/5]" distance={28}>
              <Visual
                image={founder.portrait}
                tone="dark"
                art="feet"
                seed={7}
                priority
                className="h-full w-full"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </Parallax>

            <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 sm:inset-x-6 sm:bottom-6">
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-white backdrop-blur-md">
                <p className="text-[0.9375rem] font-semibold">{founderDisplayName()}</p>
                <p className="mt-0.5 text-[0.8125rem] text-white/75">{founder.role}</p>
              </div>
            </div>

            {spotlight && (
              <Link
                href={`/courses/${spotlight.slug}`}
                className="group absolute -top-4 right-4 hidden w-[260px] rounded-card bg-card p-5 shadow-float transition-transform duration-300 ease-out-soft hover:-translate-y-1 sm:block lg:-left-10 lg:right-auto lg:top-10"
              >
                <p className="flex items-center gap-2 text-xs font-medium text-muted">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/40 motion-reduce:hidden" />
                    <span className="relative inline-flex size-2 rounded-full bg-accent" />
                  </span>
                  {upcoming ? "Ближайший старт" : "Рекомендуем начать"}
                </p>
                <p className="mt-2 font-semibold leading-snug">{spotlight.title}</p>
                <p className="mt-3 flex items-center justify-between text-[0.8125rem] text-muted">
                  {upcoming?.s ? `${formatDateRange(upcoming.s.start, upcoming.s.end)} · ${upcoming.s.city}` : "Набор по заявкам"}
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 text-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </p>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
