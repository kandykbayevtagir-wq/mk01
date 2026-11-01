import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { locations, site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/typography";
import { PageHero } from "@/components/sections/page-hero";
import { FormSection } from "@/components/sections/form-section";
import { contactFields } from "@/components/forms/presets";
import { ContactChannels } from "@/components/contact/contact-channels";
import { LocationCard } from "@/components/contact/location-card";
import { PaymentMethods } from "@/components/contact/payment-methods";

export const metadata: Metadata = pageMetadata({
  title: "Контакты",
  description: `${site.name}, Актобе: WhatsApp и телефон +7 778 056 9356, Telegram и Instagram @marina_kandykbayeva, два филиала в 2ГИС и способы оплаты.`,
  path: "/contacts",
});

const routes = [
  { href: "/courses", title: "Записаться на курс" },
  { href: "/partners#zayavka", title: "Организовать обучение в своём городе" },
  { href: "/center#zapis", title: "Записаться в центр" },
  { href: "/products#zapros", title: "Подобрать продукцию" },
];

export default function ContactsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/contacts", label: "Контакты" }]}
        eyebrow={`${site.name} · Актобе`}
        title="Контакты"
        lead="Быстрее всего ответим в WhatsApp. Также на связи в Telegram и Instagram."
        aside={<ContactChannels layout="stack" whatsappMessage="Здравствуйте! У меня вопрос." />}
      />

      <section aria-labelledby="locations-title" className="py-16 lg:py-24">
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Адреса"
              title={<span id="locations-title">Два филиала в Актобе</span>}
              lead="Откройте карточку филиала в 2ГИС, чтобы построить маршрут."
            />
          </Reveal>
          <ul className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6 lg:mt-12">
            {locations.map((l, i) => (
              <Reveal as="li" key={l.id} delay={i * 70}>
                <LocationCard location={l} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="payment-title" className="border-t border-line py-16 lg:py-24">
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Оплата"
              title={<span id="payment-title">Способы оплаты</span>}
              lead="Доступные способы оплаты услуг и обучения."
            />
          </Reveal>
          <Reveal className="mt-10 lg:mt-12" delay={60}>
            <PaymentMethods />
            <p className="mt-5 max-w-2xl text-[0.8125rem] leading-relaxed text-muted">
              Онлайн-оплата на сайте не проводится. Подробности оплаты уточняйте при записи.
            </p>
          </Reveal>
        </Container>
      </section>

      <FormSection
        id="napisat"
        eyebrow="Обратная связь"
        title="Написать нам"
        lead="Оставьте вопрос — мы ответим в рабочее время."
        type="contact"
        fields={contactFields}
        submitLabel="Отправить"
        showDirectContacts={false}
      >
        <nav aria-label="Быстрые ссылки" className="mt-8">
          <ul className="border-t border-line">
            {routes.map((r) => (
              <li key={r.href} className="border-b border-line">
                <Link
                  href={r.href}
                  className="group flex min-h-12 items-center justify-between gap-4 py-3 text-[0.9375rem] font-medium"
                >
                  {r.title}
                  <ArrowRight
                    aria-hidden
                    className="size-4 text-muted transition-transform duration-[var(--dur-press)] group-hover:translate-x-0.5 group-hover:text-ink"
                    strokeWidth={1.75}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </FormSection>
    </>
  );
}
