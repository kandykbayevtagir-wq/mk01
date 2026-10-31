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
    <section aria-labelledby="advantages-title" className={cn("relative overflow-hidden py-20 lg:py-32", className)}>
      <SectionDecor variant={["insole"]} />
      <Container className="relative">
        <Reveal>
          <SectionHeader eyebrow="Подход" title={<span id="advantages-title">{title}</span>} />
        </Reveal>
        <ul
          className={cn(
            "mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:gap-6",
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
                className="group relative overflow-hidden rounded-card bg-mist p-6 transition-[transform,box-shadow] duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-lift sm:p-8"
              >
                <span aria-hidden className="pattern-dots absolute -right-6 -top-6 size-32 rounded-full opacity-70 [mask-image:radial-gradient(circle,black,transparent_70%)]" />
                <span aria-hidden className="absolute right-6 top-6 text-sm font-semibold tabular-nums text-clay">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative inline-flex size-14 items-center justify-center rounded-2xl bg-clay-soft text-ink ring-1 ring-clay/25 transition-colors duration-300 group-hover:bg-accent group-hover:text-white group-hover:ring-accent">
                  <Icon aria-hidden className="size-5" strokeWidth={1.5} />
                </span>
                <h3 className="relative mt-8 text-lg font-semibold tracking-tight">{a.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{a.text}</p>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
