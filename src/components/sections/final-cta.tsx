import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

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
    <section aria-labelledby="final-cta-title" className="relative overflow-hidden border-t border-line py-24 lg:py-36">
      <div aria-hidden className="hairline-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />
      <Container className="relative">
        <Reveal className="max-w-4xl">
          <h2 id="final-cta-title" className="text-h1 font-semibold">
            {title}
            <span className="text-accent">.</span>
          </h2>
          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
            <ButtonLink href={cta.href} variant="accent" size="lg" arrow>
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
        </Reveal>
      </Container>
    </section>
  );
}
