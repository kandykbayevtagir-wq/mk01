import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { t } from "@/i18n";
import { absoluteUrl, jsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import { ArchLines, Insole } from "@/components/ui/podo-art";

export type Crumb = { href: string; label: string };

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const all = [{ href: "/", label: t.common.home }, ...items];
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: absoluteUrl(c.href),
    })),
  };
  return (
    <nav aria-label="Хлебные крошки" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[0.8125rem] text-muted">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={c.href} className="inline-flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-ink">
                  {c.label}
                </span>
              ) : (
                <>
                  <Link href={c.href} className="transition-colors hover:text-ink">
                    {c.label}
                  </Link>
                  <ChevronRight aria-hidden className="size-3.5" strokeWidth={1.5} />
                </>
              )}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
    </nav>
  );
}

function d(ms: number) {
  return { "--enter-delay": `${ms}ms` } as React.CSSProperties;
}

/** Shared editorial header for inner pages. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  actions,
  aside,
  className,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden bg-mist", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="pattern-dots absolute inset-y-0 right-0 w-2/3 [mask-image:linear-gradient(to_left,black,transparent)]" />
        <ArchLines count={9} className="absolute -bottom-1 -right-24 h-64 w-[600px] max-md:h-40 max-md:-right-40" />
        {!aside && (
          <>
            <div className="absolute right-[8%] top-1/2 hidden size-[380px] -translate-y-1/2 rounded-full bg-clay-soft lg:block" />
            <Insole className="absolute right-[13%] top-1/2 hidden h-[340px] w-auto -translate-y-1/2 rotate-[16deg] lg:block" />
          </>
        )}
      </div>
      <Container className="relative pb-14 pt-6 sm:pt-8 lg:pb-24 lg:pt-10">
        <Breadcrumbs items={crumbs} className="enter" />
        <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-6">
          <div className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
            {eyebrow && (
              <div className="enter" style={d(40)}>
                <Eyebrow>{eyebrow}</Eyebrow>
              </div>
            )}
            <h1 className="enter-rise mt-5 text-h1 font-semibold" style={d(90)}>
              {title}
            </h1>
            {lead && (
              <p className="enter mt-6 max-w-2xl text-lead text-muted" style={d(150)}>
                {lead}
              </p>
            )}
            {actions && (
              <div className="enter mt-8 flex flex-col gap-3 sm:flex-row lg:mt-10" style={d(210)}>
                {actions}
              </div>
            )}
          </div>
          {aside && (
            <div className="enter-fade lg:col-span-5" style={d(120)}>
              {aside}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
