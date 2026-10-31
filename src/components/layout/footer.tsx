import Link from "next/link";
import { contacts, navigation, site } from "@/data/site";
import { center } from "@/data/center";
import { t } from "@/i18n";
import { phoneHref, whatsappHref } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";

export function Footer() {
  const contactItems = [
    contacts.phone && { label: contacts.phone, href: phoneHref(contacts.phone) },
    contacts.whatsapp && { label: "WhatsApp", href: whatsappHref(contacts.whatsapp) },
    contacts.telegram && { label: "Telegram", href: `https://t.me/${contacts.telegram}` },
    contacts.instagram && { label: "Instagram", href: `https://instagram.com/${contacts.instagram}` },
    contacts.email && { label: contacts.email, href: `mailto:${contacts.email}` },
  ].filter(Boolean) as { label: string; href: string }[];

  const year = new Date().getFullYear();

  return (
    <footer data-tone="dark" className="mt-auto bg-graphite text-white">
      <Container className="py-14 lg:py-20">
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
            {contactItems.length > 0 ? (
              <ul className="mt-5 space-y-3">
                {contactItems.map((c) => (
                  <li key={c.href}>
                    <a
                      href={c.href}
                      className="text-[0.9375rem] text-white/85 transition-colors hover:text-white"
                      {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-[0.9375rem] text-white/85">
                Оставьте заявку на странице{" "}
                <Link href="/contacts" className="underline decoration-white/30 underline-offset-4 hover:decoration-white">
                  «Контакты»
                </Link>{" "}
                — мы свяжемся с вами.
              </p>
            )}
            {(contacts.address || contacts.hours) && (
              <p className="mt-6 text-[0.9375rem] leading-relaxed text-muted-dark">
                {center.name}
                {contacts.address && (
                  <>
                    <br />
                    {contacts.city ? `${contacts.city}, ` : ""}
                    {contacts.address}
                  </>
                )}
                {contacts.hours && (
                  <>
                    <br />
                    {contacts.hours}
                  </>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line-dark pt-6 text-sm text-muted-dark sm:flex-row sm:items-center sm:justify-between">
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
