import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { founder, founderDisplayName } from "@/data/founder";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { SectionDecor } from "@/components/ui/section-decor";
import { Visual } from "@/components/ui/visual";

/**
 * Marina, briefly: who she is and one line on how the teaching is built.
 * The longer text and the philosophy live on /about only.
 */
export function FounderSection() {
  return (
    <section aria-labelledby="founder-title" className="relative overflow-hidden bg-paper py-14 sm:py-20 lg:py-24">
      <SectionDecor variant={["arches-right"]} />
      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-5">
            <Visual
              image={founder.portrait}
              tone="light"
              art="insole"
              seed={11}
              className={
                founder.portrait
                  ? "media-settle relative aspect-square rounded-panel shadow-card sm:aspect-[4/3] lg:aspect-[4/5]"
                  : "media-settle relative aspect-[16/10] rounded-panel shadow-card sm:aspect-[16/9] lg:aspect-[4/5]"
              }
              imgClassName="object-[50%_30%]"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </Reveal>

          <Reveal className="lg:col-span-6 lg:col-start-7">
            <Eyebrow>О Марине</Eyebrow>
            <h2 id="founder-title" className="mt-4 text-h2 font-semibold">
              {founderDisplayName()}
            </h2>
            <p className="mt-3 text-lead text-muted">{founder.role}</p>
            <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-ink/85">{founder.summary}</p>
            <Link
              href="/about"
              className="group mt-6 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold underline decoration-line underline-offset-4 hover:decoration-ink"
            >
              Подробнее
              <ArrowRight aria-hidden className="size-4 transition-transform duration-[var(--dur-press)] group-hover:translate-x-0.5" strokeWidth={1.75} />
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
