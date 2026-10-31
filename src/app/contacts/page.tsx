import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { contacts, site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { FormSection } from "@/components/sections/form-section";
import { contactFields } from "@/components/forms/presets";

export const metadata: Metadata = pageMetadata({
  title: "Контакты",
  description: `Связаться с командой «${site.name}»: запись на курсы, сотрудничество, центр подологии и продукция.`,
  path: "/contacts",
});

const routes = [
  { href: "/courses", title: "Записаться на курс", text: "Выберите программу и оставьте заявку на странице курса." },
  { href: "/partners#zayavka", title: "Организовать обучение", text: "Заявка для организаторов из других городов." },
  { href: "/center#zapis", title: "Записаться в центр", text: "Приём специалиста центра подологии." },
  { href: "/products#zapros", title: "Подобрать продукцию", text: "Стельки, материалы и средства ухода." },
];

export default function ContactsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/contacts", label: "Контакты" }]}
        eyebrow="Контакты"
        title="Свяжитесь с нами"
        lead="Выберите тему обращения — так мы быстрее ответим по существу. Или напишите нам через форму ниже."
      />

      <section aria-label="Темы обращения" className="py-16 lg:py-24">
        <Container>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {routes.map((r, i) => (
              <Reveal as="li" key={r.href} delay={i * 60}>
                <Link
                  href={r.href}
                  className="group flex h-full flex-col rounded-card border border-line p-6 transition-[border-color,box-shadow,transform] duration-500 ease-out-soft hover:-translate-y-1 hover:border-transparent hover:shadow-lift"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-full bg-mist transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                    <ArrowUpRight aria-hidden className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="mt-8 text-lg font-semibold tracking-tight">{r.title}</span>
                  <span className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{r.text}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <FormSection
        id="napisat"
        eyebrow="Обратная связь"
        title="Написать нам"
        lead="Задайте вопрос — мы ответим в рабочее время."
        type="contact"
        fields={contactFields}
        submitLabel="Отправить"
      >
        {(contacts.address || contacts.hours) && (
          <p className="mt-8 leading-relaxed">
            {contacts.city ? `${contacts.city}, ` : ""}
            {contacts.address}
            {contacts.hours && (
              <>
                <br />
                <span className="text-muted">{contacts.hours}</span>
              </>
            )}
          </p>
        )}
      </FormSection>
    </>
  );
}
