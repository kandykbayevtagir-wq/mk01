"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/data/site";
import { t } from "@/i18n";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { headerCta } from "./header-cta";

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const cta = headerCta(pathname);

  // One IntersectionObserver on a sentinel at the top of the page instead
  // of a global scroll listener.
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
    <div ref={sentinel} aria-hidden className="pointer-events-none absolute left-0 top-0 h-3 w-px" />
    <header
      data-scrolled={scrolled}
      className={cn(
        "header-glass sticky top-0 z-50 h-[var(--header-h)] border-b",
        "transition-[background-color,border-color,box-shadow] duration-[var(--dur-nav)] ease-out-soft",
        scrolled ? "border-line" : "border-transparent",
      )}
    >
      <Container className="flex h-full items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Основная навигация" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-3">
            {navigation.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-10 items-center rounded-full px-3.5 text-[0.9375rem] font-medium transition-colors duration-[var(--dur-press)]",
                      active ? "text-ink" : "text-muted hover:text-ink",
                    )}
                  >
                    {t.nav[item.key]}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent transition-[opacity,transform] duration-[var(--dur-nav)] ease-out-soft",
                        active ? "scale-100 opacity-100" : "scale-0 opacity-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href={cta.href} external={cta.external} variant="accent" size="sm" className="hidden sm:inline-flex">
            {cta.label}
          </ButtonLink>
          <MobileMenu />
        </div>
      </Container>
    </header>
    </>
  );
}
