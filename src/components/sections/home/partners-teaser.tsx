import { partnerContent } from "@/data/content";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ContourArt } from "@/components/ui/contour-art";
import { Footprints } from "@/components/ui/podo-art";
import { Eyebrow } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";

export function PartnersTeaser() {
  return (
    <section aria-labelledby="partners-title" className="py-10 sm:py-14 lg:py-20">
      <Container>
        <Reveal>
          <div
            data-tone="dark"
            className="scroll-rise grain relative isolate overflow-hidden rounded-panel bg-graphite px-6 py-14 text-white sm:px-10 lg:px-16 lg:py-24"
          >
            <div aria-hidden className="pattern-dots-dark absolute inset-0 -z-10 [mask-image:linear-gradient(to_left,black,transparent_70%)]" />
            <ContourArt
              seed={4}
              tone="dark"
              marker={false}
              className="absolute -right-24 -top-10 -z-10 h-[140%] w-[70%] opacity-60 max-lg:hidden"
            />
            <Footprints tone="dark" steps={5} className="absolute -bottom-4 left-[44%] -z-10 h-[300px] w-auto rotate-[28deg] max-lg:hidden" />
            <div aria-hidden className="absolute -left-24 -top-24 -z-10 size-[420px] bg-[radial-gradient(closest-side,rgb(179_38_45/0.22),transparent)]" />
            <div aria-hidden className="absolute -bottom-32 right-0 -z-10 size-[520px] bg-[radial-gradient(closest-side,rgb(255_255_255/0.06),transparent)]" />
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-6">
              <div className="lg:col-span-6">
                <Eyebrow tone="dark">Партнёрство</Eyebrow>
                <h2 id="partners-title" className="mt-4 text-h2 font-semibold">
                  Организуйте обучение в своём городе
                </h2>
                <p className="mt-6 max-w-lg text-lead text-muted-dark">
                  Местные партнёры собирают группы и подбирают площадку, а мы привозим профессиональную программу и
                  проводим обучение.
                </p>
                <ButtonLink href="/partners" variant="accent" size="lg" arrow className="mt-10 w-full sm:w-auto">
                  Стать организатором
                </ButtonLink>
              </div>
              <ol className="lg:col-span-5 lg:col-start-8">
                {partnerContent.steps.map((s, i) => (
                  <li key={s.title} className="grid grid-cols-[2.75rem_1fr] gap-4 border-t border-line-dark py-5 last:border-b">
                    <span className="text-sm font-semibold tabular-nums text-white/50">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="font-semibold">{s.title}</p>
                      <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted-dark">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
