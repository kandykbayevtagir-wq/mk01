import Link from "next/link";
import { MapPin } from "lucide-react";
import { channels, locations, navigation, secondaryNavigation, site } from "@/data/site";
import { t } from "@/i18n";
import { SocialIconRow } from "@/components/contact/contact-channels";
import { PaymentStrip } from "@/components/contact/payment-methods";
import { Container } from "@/components/ui/container";
import { ArchLines } from "@/components/ui/podo-art";
import { Logo } from "./logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-tone="dark" className="grain relative mt-auto overflow-hidden bg-graphite text-white">
      <div aria-hidden className="pattern-dots-dark pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black)]" />
      <ArchLines tone="dark" count={9} className="pointer-events-none absolute -bottom-1 -right-32 h-64 w-[620px] max-md:hidden" />
      <Container className="relative py-14 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo tone="dark" />
            <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-muted-dark">{site.description}</p>
          </div>

          <nav aria-label="Навигация в подвале" className="lg:col-span-3">
            <p className="text-eyebrow font-semibold uppercase text-muted-dark">Разделы</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 lg:grid-cols-1">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-[0.9375rem] text-white/90 transition-colors hover:text-white"
                  >
                    {t.nav[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-eyebrow font-semibold uppercase text-muted-dark">Ещё</p>
            <ul className="mt-2 flex flex-wrap gap-x-5 lg:flex-col">
              {secondaryNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-[0.9375rem] text-muted-dark transition-colors hover:text-white"
                  >
                    {t.nav[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <p className="text-eyebrow font-semibold uppercase text-muted-dark">Связаться</p>
            <a
              href={channels.phone.url}
              className="mt-3 inline-flex min-h-11 items-center text-xl font-semibold tracking-tight text-white transition-colors hover:text-white/80"
            >
              {channels.phone.value}
            </a>
            <p className="mt-1 text-[0.8125rem] text-muted-dark">Телефон и WhatsApp · {channels.telegram.value}</p>
            <SocialIconRow className="mt-4" />

            <p className="mt-8 text-eyebrow font-semibold uppercase text-muted-dark">Адреса · Актобе</p>
            <ul className="mt-3 space-y-3">
              {locations.map((l) => (
                <li key={l.id} className="flex gap-2.5 text-[0.9375rem] leading-snug">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-dark" strokeWidth={1.75} />
                  <span>
                    <span className="block text-white/90">{l.address}</span>
                    <span className="block text-[0.8125rem] text-muted-dark">
                      {l.label}
                      {l.detail && l.detail !== l.label ? ` · ${l.detail}` : ""}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-line-dark pt-6">
          <p className="text-eyebrow font-semibold uppercase text-muted-dark">Способы оплаты</p>
          <PaymentStrip className="mt-3" />
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-line-dark pt-6 text-sm text-muted-dark sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}
          </p>
          <Link href="/privacy" className="transition-colors hover:text-white">
            Политика обработки персональных данных
          </Link>
        </div>
      </Container>
    </footer>
  );
}
