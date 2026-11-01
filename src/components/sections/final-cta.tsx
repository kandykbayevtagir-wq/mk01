import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ArchLines, PressureFeet } from "@/components/ui/podo-art";

export function FinalCta({
  title = "Выберите следующий шаг в профессиональном развитии",
  cta = { href: "/courses", label: "Смотреть программы обучения" },
  showLinks = true,
}: {
  title?: string;
  cta?: { href: string; label: string };
  showLinks?: boolean;
}) {
  return (
    <section aria-labelledby="final-cta-title" className="py-6 lg:py-10">
      <Container>
        <Reveal className="grain relative isolate overflow-hidden rounded-panel bg-mist px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-24">
          <div aria-hidden className="pattern-dots absolute inset-0 -z-10 opacity-90 [mask-image:linear-gradient(to_left,black,transparent_75%)]" />
          <div aria-hidden className="glow-red absolute -right-24 -top-24 -z-10 size-[460px]" />
          <PressureFeet className="absolute bottom-[-8%] right-[4%] -z-10 h-[115%] opacity-90 max-lg:hidden" />
          <ArchLines draw className="draw-scroll absolute -bottom-1 -left-24 -z-10 h-48 w-[460px]" />
          <div className="max-w-3xl">
          <h2 id="final-cta-title" className="text-h1 font-semibold">
            {title}
            <span className="text-accent">.</span>
          </h2>
          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
            <ButtonLink href={cta.href} variant="accent" size="lg" arrow className="w-full sm:w-auto">
              {cta.label}
            </ButtonLink>
            {showLinks && (
              <p className="text-[0.9375rem] text-muted">
                или{" "}
                <Link href="/partners" className="font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
                  организуйте обучение в своём городе
                </Link>
              </p>
            )}
          </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
