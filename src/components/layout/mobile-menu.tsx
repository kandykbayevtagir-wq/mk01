"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight } from "lucide-react";
import { contacts, navigation } from "@/data/site";
import { t } from "@/i18n";
import { cn, phoneHref, whatsappHref } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "./logo";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- portal target exists only after mount
  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Close on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  // Scroll lock, Escape, focus trap.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const focusFirst = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    }, 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])',
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(focusFirst);
    };
  }, [open, close]);

  const quickLinks = [
    contacts.phone && { label: "Позвонить", href: phoneHref(contacts.phone) },
    contacts.whatsapp && { label: "WhatsApp", href: whatsappHref(contacts.whatsapp) },
    contacts.telegram && { label: "Telegram", href: `https://t.me/${contacts.telegram}` },
    contacts.instagram && { label: "Instagram", href: `https://instagram.com/${contacts.instagram}` },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={t.common.openMenu}
        className="press relative inline-flex size-11 items-center justify-center rounded-full border border-line bg-paper transition-colors duration-[var(--dur-press)] hover:border-ink/30 active:bg-mist lg:hidden"
      >
        <span aria-hidden className="flex w-[18px] flex-col gap-[5px]">
          <span className="h-[1.5px] w-full rounded-full bg-ink" />
          <span className="h-[1.5px] w-2/3 rounded-full bg-ink" />
        </span>
      </button>

      {mounted &&
        createPortal(
          <div
            className={cn(
              "fixed inset-0 z-[60] lg:hidden",
              open ? "visible" : "invisible [transition:visibility_0s_linear_300ms]",
            )}
            inert={!open}
          >
            <div
              aria-hidden
              onClick={close}
              className={cn(
                "absolute inset-0 bg-ink/40 transition-opacity duration-[var(--dur-nav)]",
                open ? "opacity-100" : "opacity-0",
              )}
            />
            <div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-label={t.common.menu}
              className={cn(
                "absolute inset-x-0 top-0 flex max-h-[100dvh] flex-col overflow-y-auto overscroll-contain rounded-b-[28px] bg-paper pt-[env(safe-area-inset-top)] pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-float",
                "transition-transform duration-300 ease-out-soft",
                open ? "translate-y-0" : "-translate-y-full",
              )}
            >
              <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between px-4 sm:px-6">
                <Logo />
                <button
                  type="button"
                  onClick={close}
                  aria-label={t.common.closeMenu}
                  className="press inline-flex size-11 items-center justify-center rounded-full border border-line active:bg-mist"
                >
                  <span aria-hidden className="relative block size-4">
                    <span className="absolute left-0 top-1/2 h-[1.5px] w-full rotate-45 rounded-full bg-ink" />
                    <span className="absolute left-0 top-1/2 h-[1.5px] w-full -rotate-45 rounded-full bg-ink" />
                  </span>
                </button>
              </div>

              <nav aria-label="Мобильная навигация" className="px-4 sm:px-6">
                <ul className="divide-y divide-line border-y border-line">
                  {[{ href: "/", key: "home" as const }, ...navigation].map((item, i) => {
                    const active =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const label = item.key === "home" ? t.common.home : t.nav[item.key];
                    return (
                      <li
                        key={item.href}
                        className={cn(
                          "transition-[opacity,transform] duration-[var(--dur-reveal)] ease-out-soft",
                          open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                        )}
                        style={{ transitionDelay: open ? `${60 + i * 25}ms` : "0ms" }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className="-mx-2 flex min-h-14 items-center justify-between rounded-xl px-2 py-3 text-[1.3125rem] font-semibold tracking-[-0.02em] transition-colors duration-[var(--dur-press)] active:bg-mist"
                        >
                          <span className="flex items-center gap-3">
                            <span
                              aria-hidden
                              className={cn(
                                "size-1.5 rounded-full transition-colors",
                                active ? "bg-accent" : "bg-transparent",
                              )}
                            />
                            {label}
                          </span>
                          <ArrowUpRight aria-hidden className="size-5 text-muted" strokeWidth={1.5} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div
                className={cn(
                  "mt-6 flex flex-col gap-4 px-4 transition-[opacity,transform] duration-[var(--dur-reveal)] ease-out-soft sm:px-6",
                  open ? "translate-y-0 opacity-100 delay-[260ms]" : "translate-y-2 opacity-0",
                )}
              >
                {quickLinks.length > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {quickLinks.map((l) => (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          className="inline-flex h-10 items-center rounded-full border border-line px-4 text-sm font-medium"
                          {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <ButtonLink href="/courses" variant="accent" size="lg" arrow className="w-full">
                  {t.common.chooseCourse}
                </ButtonLink>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
