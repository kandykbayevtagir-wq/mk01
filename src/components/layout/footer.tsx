import Link from "next/link";
import { MapPin } from "lucide-react";
import { channels, locations, navigation, secondaryNavigation, site } from "@/data/site";
import { t } from "@/i18n";
import { SocialIconRow } from "@/components/contact/contact-channels";
import { Container } from "@/components/ui/container";
import { ArchLines } from "@/components/ui/podo-art";
import { Logo } from "./logo";

/**
 * Quiet footer: logo, one list of pages, the verified phone and both branch
 * addresses, legal link. Payment methods and the longer description live on
 * /contacts and the homepage — they are not repeated here.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const links = [...navigation, ...secondaryNavigation];

  return (
    <footer data-atmo="deep" data-tone="dark" className="footer-sheet grain relative z-10 -mt-6 overflow-clip rounded-t-[28px] bg-graphite text-white sm:-mt-8 sm:rounded-t-[40px]">
      <div aria-hidden className="pattern-dots-dark pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black)]" />
      <ArchLines tone="dark" count={9} className="pointer-events-none absolute -bottom-1 -right-32 h-64 w-[620px] max-md:hidden" />
      <Container className="relative pb-6 pt-12 lg:pt-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="dark" variant="full" lazy />
            <nav aria-label="Навигация в подвале" className="mt-5">
              <ul className="grid grid-cols-2 gap-x-6">
                {links.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex min-h-11 items-center text-[0.9375rem] text-white/85 transition-colors hover:text-white"
                    >
                      {t.nav[item.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="lg:col-span-4 lg:col-start-6">
            <p className="text-eyebrow font-semibold uppercase text-muted-dark">Связаться</p>
            <a
              href={channels.phone.url}
              className="mt-2 inline-flex min-h-11 items-center text-xl font-semibold tracking-tight text-white transition-colors hover:text-white/80"
            >
              {channels.phone.value}
            </a>
            <SocialIconRow className="mt-2" />
          </div>

          <div className="lg:col-span-3">
            <p className="text-eyebrow font-semibold uppercase text-muted-dark">Актобе</p>
            <ul className="mt-3 space-y-3">
              {locations.map((l) => (
                <li key={l.id} className="flex gap-2.5 text-[0.9375rem] leading-snug">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-dark" strokeWidth={1.75} />
                  <span>
                    <span className="block text-white/90">{l.address}</span>
                    <span className="block text-[0.8125rem] text-muted-dark">{l.label}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-1 border-t border-line-dark pt-4 text-sm text-muted-dark sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}
          </p>
          <Link href="/privacy" className="inline-flex min-h-11 items-center transition-colors hover:text-white">
            Политика обработки персональных данных
          </Link>
        </div>
      </Container>
    </footer>
  );
}
