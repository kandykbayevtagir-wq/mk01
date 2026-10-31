import { center, services } from "@/data/center";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import { Parallax } from "@/components/ui/parallax";
import { Reveal } from "@/components/ui/reveal";
import { SectionDecor } from "@/components/ui/section-decor";
import { Visual } from "@/components/ui/visual";

export function CenterTeaser() {
  return (
    <section aria-labelledby="center-title" className="relative overflow-hidden bg-mist py-20 lg:py-32">
      <SectionDecor variant={["dots-corner", "footprints"]} />
      <Container className="relative">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-6">
          <Reveal className="order-2 lg:order-1 lg:col-span-6">
            <Parallax className="aspect-[4/3] rounded-panel bg-sand shadow-card lg:aspect-[5/6]" distance={30}>
              <Visual
                image={center.gallery[0]}
                seed={21}
                tone="sand"
                art="pressure"
                className="h-full w-full"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </Parallax>
          </Reveal>

          <div className="order-1 flex flex-col lg:order-2 lg:col-span-5 lg:col-start-8">
            <Reveal>
              <Eyebrow>{center.name}</Eyebrow>
              <h2 id="center-title" className="mt-4 text-h2 font-semibold">
                Забота о здоровье стоп — в нашем центре
              </h2>
              <p className="mt-6 text-lead text-muted">{center.intro}</p>
            </Reveal>

            <ul className="mt-10 border-t border-line">
              {services.slice(0, 5).map((s, i) => (
                <Reveal as="li" key={s.id} delay={i * 50} className="flex items-baseline gap-4 border-b border-line py-4">
                  <span className="text-xs font-semibold tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[1.0625rem] font-medium">{s.title}</span>
                </Reveal>
              ))}
            </ul>

            <Reveal className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/center#zapis" variant="primary" arrow>
                Записаться в центр
              </ButtonLink>
              <ButtonLink href="/center" variant="ghost">
                О центре
              </ButtonLink>
            </Reveal>
            <p className="mt-6 text-[0.8125rem] leading-relaxed text-muted">{center.disclaimer}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
