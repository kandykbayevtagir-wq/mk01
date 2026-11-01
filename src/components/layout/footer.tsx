import Link from "next/link";
import { MapPin } from "lucide-react";
import { channels, locations, navigation, site } from "@/data/site";
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
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 lg:grid-cols-1">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.9375rem] text-white/85 transition-colors hover:text-white"
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
            <ul className="mt-3 space-y-1">
              {locations.map((l) => (
                <li key={l.id}>
                  <a
                    href={l.twoGisUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] text-white/85 transition-colors hover:text-white"
                  >
                    <MapPin aria-hidden className="size-4 text-muted-dark" strokeWidth={1.75} />
                    {l.address ? `${l.label} — ${l.address}` : l.label}
                    <span className="text-muted-dark">· 2ГИС</span>
                    <span className="sr-only">(откроется в новой вкладке)</span>
                  </a>
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
