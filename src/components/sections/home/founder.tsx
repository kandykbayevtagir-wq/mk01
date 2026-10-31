import { founder, founderDisplayName } from "@/data/founder";
import { plural } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { Visual } from "@/components/ui/visual";

export function FounderSection() {
  return (
    <section aria-labelledby="founder-title" className="bg-mist py-20 lg:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)]">
              <Visual
                image={founder.portrait}
                tone="paper"
                seed={11}
                className="aspect-[4/5] rounded-panel"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
              {founder.yearsOfExperience && (
                <div className="mt-4 flex items-baseline gap-3 rounded-card bg-paper p-5">
                  <span className="text-4xl font-semibold tracking-tight">{founder.yearsOfExperience}</span>
                  <span className="text-sm text-muted">
                    {plural(founder.yearsOfExperience, ["год", "года", "лет"])} профессионального опыта
                  </span>
                </div>
              )}
            </div>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <Eyebrow>О преподавателе</Eyebrow>
              <h2 id="founder-title" className="mt-4 text-h2 font-semibold">
                {founder.name ?? "Преподаватель-практик и основатель центра подологии"}
              </h2>
              {founder.name && <p className="mt-3 text-lead text-muted">{founder.role}</p>}
              <p className="mt-6 text-lead text-ink/85">{founder.intro}</p>
            </Reveal>

            <ol className="mt-12 border-t border-line">
              {founder.philosophy.map((p, i) => (
                <Reveal as="li" key={p} delay={i * 70} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-6">
                  <span className="text-sm font-semibold tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-[1.0625rem] leading-relaxed">{p}</p>
                </Reveal>
              ))}
            </ol>

            {founder.specializations.length > 0 && (
              <Reveal className="mt-10">
                <h3 className="text-sm font-semibold text-muted">Специализация</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {founder.specializations.map((s) => (
                    <li key={s} className="rounded-full border border-line bg-paper px-4 py-2 text-sm">
                      {s}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            <Reveal className="mt-10">
              <ButtonLink href="/about" variant="primary" arrow>
                {founder.name ? `Подробнее — ${founderDisplayName()}` : "Подробнее о преподавателе"}
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
