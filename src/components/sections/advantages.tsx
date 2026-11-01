import { BookOpen, Hand, Layers, MessagesSquare, Target, Users } from "lucide-react";
import { advantages, type Advantage } from "@/data/content";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { SectionDecor } from "@/components/ui/section-decor";

const icons: Record<Advantage["icon"], typeof Hand> = {
  hand: Hand,
  layers: Layers,
  target: Target,
  users: Users,
  message: MessagesSquare,
  book: BookOpen,
};

export function AdvantagesSection({
  title = "Почему специалисты выбирают это обучение",
  className,
}: {
  title?: string;
  className?: string;
}) {
  const items = advantages.filter((a) => a.show);
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="advantages-title" className={cn("surface-mist relative overflow-hidden py-16 sm:py-20 lg:py-32", className)}>
      <SectionDecor variant={["insole"]} />
      <Container className="relative">
        <Reveal>
          <SectionHeader eyebrow="Подход" title={<span id="advantages-title">{title}</span>} />
        </Reveal>
        <ul
          className={cn(
            "mt-10 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:mt-16 lg:gap-6",
            items.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-4",
          )}
        >
          {items.map((a, i) => {
            const Icon = icons[a.icon];
            return (
              <Reveal
                as="li"
                key={a.id}
                delay={i * 70}
                className="group relative grid grid-cols-[3rem_1fr] gap-x-4 overflow-hidden rounded-card border border-line bg-card p-5 transition-[transform,box-shadow] duration-[var(--dur-card)] ease-out-soft hover:-translate-y-1 hover:shadow-lift sm:block sm:p-8"
              >
                <span aria-hidden className="pattern-dots absolute -right-6 -top-6 size-32 rounded-full opacity-70 [mask-image:radial-gradient(circle,black,transparent_70%)]" />
                <span aria-hidden className="absolute right-5 top-5 text-xs font-semibold tabular-nums text-clay sm:right-6 sm:top-6 sm:text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative row-span-2 inline-flex size-12 items-center justify-center rounded-2xl bg-mist text-ink ring-1 ring-line transition-colors duration-[var(--dur-card)] group-hover:bg-ink group-hover:text-white group-hover:ring-ink sm:size-14">
                  <Icon aria-hidden className="size-5" strokeWidth={1.5} />
                </span>
                <h3 className="relative self-center pr-8 text-[1.0625rem] font-semibold tracking-tight sm:mt-8 sm:pr-0 sm:text-lg">{a.title}</h3>
                <p className="col-start-2 mt-1.5 text-[0.9375rem] leading-relaxed text-muted sm:mt-3">{a.text}</p>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
