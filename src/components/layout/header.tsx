"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation } from "@/data/site";
import { t } from "@/i18n";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-[var(--header-h)] transition-[background-color,border-color,backdrop-filter] duration-300 ease-out-soft",
        "border-b",
        scrolled
          ? "border-line bg-paper/85 backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-paper",
      )}
    >
      <Container className="flex h-full items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Основная навигация" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {navigation.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-10 items-center rounded-full px-3 text-[0.875rem] font-medium transition-colors duration-200",
                      active ? "text-ink" : "text-muted hover:text-ink",
                    )}
                  >
                    {t.nav[item.key]}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent transition-[opacity,transform] duration-300 ease-out-soft",
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
          <ButtonLink href="/courses" variant="accent" size="sm" className="hidden sm:inline-flex">
            {t.common.chooseCourse}
          </ButtonLink>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
