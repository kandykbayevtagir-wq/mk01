import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { center, services } from "@/data/center";
import { founder } from "@/data/founder";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import { Parallax } from "@/components/ui/parallax";
import { Reveal } from "@/components/ui/reveal";
import { SectionDecor } from "@/components/ui/section-decor";
import { Visual } from "@/components/ui/visual";

/** Centre overview: what is offered, in one list. Details, addresses and booking live on /center. */
export function CenterTeaser() {
  return (
    <section data-atmo="deep" aria-labelledby="center-title" className="relative overflow-clip py-14 sm:py-20 lg:py-24">
      <SectionDecor variant={["dots-corner", "footprints"]} />
      <Container className="relative">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
          <Reveal className="order-2 lg:order-1 lg:col-span-6">
            <Parallax className="aspect-[16/10] rounded-panel bg-sand shadow-card lg:aspect-[5/6]" distance={30}>
              <Visual
                image={center.gallery[0] ?? founder.practicePhoto}
                seed={21}
                tone="sand"
                art="pressure"
                reveal
                className="h-full w-full"
                imgClassName="object-[50%_25%]"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </Parallax>
          </Reveal>

          <div className="order-1 flex flex-col lg:order-2 lg:col-span-5 lg:col-start-8">
            <Reveal>
              <Eyebrow>{center.name}</Eyebrow>
              <h2 id="center-title" className="mt-4 text-h2 font-semibold">
                Приём в Актобе
              </h2>
            </Reveal>

            <ul className="mt-6 border-t border-line">
              {services.slice(0, 5).map((s, i) => (
                <Reveal as="li" key={s.id} delay={i * 50} className="border-b border-line py-3 text-[1rem] font-medium">
                  {s.title}
                </Reveal>
              ))}
            </ul>

            <Reveal>
              <Link
                href="/center"
                className="group mt-6 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold underline decoration-line underline-offset-4 hover:decoration-ink"
              >
                О центре и запись на приём
                <ArrowRight aria-hidden className="size-4 transition-transform duration-[var(--dur-press)] group-hover:translate-x-0.5" strokeWidth={1.75} />
              </Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
