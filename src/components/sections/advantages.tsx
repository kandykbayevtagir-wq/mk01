import { BookOpen, Hand, Layers, MessagesSquare, Target, Users } from "lucide-react";
import { advantages, type Advantage } from "@/data/content";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

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
    <section aria-labelledby="advantages-title" className={cn("py-20 lg:py-32", className)}>
      <Container>
        <Reveal>
          <SectionHeader eyebrow="Подход" title={<span id="advantages-title">{title}</span>} />
        </Reveal>
        <ul
          className={cn(
            "mt-12 grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:mt-16",
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
                className="group border-b border-line py-8 sm:px-6 sm:[&:nth-child(odd)]:pl-0 lg:border-b-0 lg:border-r lg:px-8 lg:py-10 lg:[&:nth-child(odd)]:pl-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
                  <Icon aria-hidden className="size-5" strokeWidth={1.5} />
                </span>
                <h3 className="mt-6 text-lg font-semibold tracking-tight">{a.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{a.text}</p>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
