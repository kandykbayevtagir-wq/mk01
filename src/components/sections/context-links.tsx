import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export type ContextLink = { href: string; title: string; text: string };

/**
 * Quiet cross-links that surface secondary pages (products, partners,
 * reviews) where they are relevant, without competing with the page's
 * main call to action.
 */
export function ContextLinks({
  items,
  label = "Читайте также",
  className,
}: {
  items: ContextLink[];
  label?: string;
  className?: string;
}) {
  return (
    <section aria-label={label} className={cn("border-t border-line py-10 lg:py-14", className)}>
      <Container>
        <Reveal>
          <ul className={cn("grid grid-cols-1 gap-3", items.length > 1 && "md:grid-cols-2", items.length > 2 && "lg:grid-cols-3")}>
            {items.map((i) => (
              <li key={i.href}>
                <Link
                  href={i.href}
                  className="group press flex h-full items-center justify-between gap-4 rounded-card border border-line bg-card p-5 transition-[border-color,box-shadow] duration-[var(--dur-card)] ease-out-soft hover:border-ink/15 hover:shadow-card"
                >
                  <span>
                    <span className="block font-semibold tracking-tight">{i.title}</span>
                    <span className="mt-1 block text-[0.9375rem] text-muted">{i.text}</span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="size-5 shrink-0 text-muted transition-[transform,color] duration-[var(--dur-press)] group-hover:translate-x-0.5 group-hover:text-ink"
                    strokeWidth={1.75}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
