import Link from "next/link";
import { ArrowUpRight, GraduationCap, Stethoscope } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ArchLines } from "@/components/ui/podo-art";

const paths = [
  {
    href: "/courses",
    icon: GraduationCap,
    kicker: "Для специалистов",
    title: "Обучение подологии",
    text: "Курсы для начинающих и практикующих специалистов.",
  },
  {
    href: "/center",
    icon: Stethoscope,
    kicker: "Для клиентов",
    title: "Приём в центре",
    text: "Консультация и уход за стопами в Актобе.",
  },
];

/** Two journeys, one glance: learn podology, or book a visit to the centre. */
export function AudiencePaths() {
  return (
    <section aria-label="Выберите направление" className="relative z-10 overflow-x-clip pb-4 pt-2 lg:pb-8">
      {/* Seam: an arch contour that starts inside the hero and settles here,
          so the two sections read as one continuous surface. */}
      <ArchLines
        draw
        count={7}
        className="draw-scroll seam-drift pointer-events-none absolute -top-24 right-[-120px] -z-10 h-48 w-[420px] sm:-top-32 lg:right-[-60px]"
      />
      <Container>
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6">
          {paths.map((p, i) => (
            <Reveal as="li" key={p.href} delay={i * 70}>
              <Link
                href={p.href}
                className="group press flex h-full items-center gap-4 rounded-card border border-line bg-card p-5 transition-[border-color,box-shadow,transform] duration-[var(--dur-card)] ease-out-soft hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-lift sm:p-6"
              >
                <span aria-hidden className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-mist text-ink transition-colors duration-[var(--dur-card)] group-hover:bg-ink group-hover:text-white">
                  <p.icon className="size-5" strokeWidth={1.5} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium text-muted">{p.kicker}</span>
                  <span className="mt-0.5 block text-lg font-semibold tracking-tight">{p.title}</span>
                  <span className="mt-1 block text-[0.9375rem] leading-snug text-muted">{p.text}</span>
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="size-5 shrink-0 text-muted transition-[transform,color] duration-[var(--dur-card)] ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                  strokeWidth={1.75}
                />
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
