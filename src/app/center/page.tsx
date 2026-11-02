import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { center, services, specialists } from "@/data/center";
import { channels, locations, site, socialProfiles } from "@/data/site";
import { absoluteUrl, jsonLd, pageMetadata } from "@/lib/seo";
import { formatKzt } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { Visual } from "@/components/ui/visual";
import { PageHero } from "@/components/sections/page-hero";
import { FormSection } from "@/components/sections/form-section";
import { LocationCard } from "@/components/contact/location-card";
import { appointmentFields } from "@/components/forms/presets";

export const metadata: Metadata = pageMetadata({
  title: center.name,
  description: `${center.name}: подологический осмотр, работа с вросшими и утолщёнными ногтями, обработка кожи стоп и подбор индивидуальных стелек. Запись онлайн.`,
  path: "/center",
});

export default function CenterPage() {
  // LocalBusiness data per branch — emitted only for branches whose street
  // address has been verified (no invented addresses or coordinates).
  const businessLd = locations
    .filter((l) => l.address)
    .map((l) => ({
      "@context": "https://schema.org",
      "@type": "HealthAndBeautyBusiness",
      "@id": `${absoluteUrl("/center")}#${l.id}`,
      name: `${l.name} — ${l.label}`,
      description: l.detail ?? undefined,
      url: absoluteUrl("/center"),
      telephone: l.phone ?? channels.phone.value,
      ...(l.mapUrl ? { hasMap: l.mapUrl } : {}),
      sameAs: socialProfiles,
      ...(l.hours ? { openingHours: l.hours } : {}),
      address: {
        "@type": "PostalAddress",
        streetAddress: l.address,
        addressLocality: l.city,
        addressCountry: "KZ",
      },
    }));

  return (
    <>
      {businessLd.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(businessLd)} />}
      <PageHero
        crumbs={[{ href: "/center", label: "Центр" }]}
        eyebrow={`${site.name} · Актобе`}
        title={center.name}
        lead={center.intro}
        aside={
          <Visual
            image={center.gallery[0]}
            seed={21}
            priority
            className="aspect-[4/3] rounded-panel lg:aspect-[4/4.4]"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        }
      />

      <section aria-labelledby="services-title" className="py-14 lg:py-24">
        <Container>
          <Reveal>
            <SectionHeader eyebrow="Направления" title={<span id="services-title">Услуги центра</span>} />
          </Reveal>
          <ul className="mt-8 grid grid-cols-1 gap-x-10 border-t border-line md:grid-cols-2 lg:mt-12">
            {services.map((s, i) => (
              <Reveal as="li" key={s.id} delay={(i % 2) * 60} className="flex items-baseline justify-between gap-4 border-b border-line py-4">
                <span className="flex items-baseline gap-4">
                  <span className="text-xs font-semibold tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[1.0625rem] font-medium">{s.title}</span>
                </span>
                {s.priceFrom && <span className="shrink-0 font-semibold">от {formatKzt(s.priceFrom)}</span>}
              </Reveal>
            ))}
          </ul>
          <p className="mt-8 flex max-w-3xl gap-3 text-[0.875rem] leading-relaxed text-muted">
            <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-ink" strokeWidth={1.5} />
            {center.disclaimer}
          </p>
          {center.licenses.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {center.licenses.map((l) => (
                <li key={l} className="rounded-full border border-line px-4 py-2 text-sm">
                  {l}
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      {specialists.length > 0 && (
        <section aria-labelledby="team-title" className="border-t border-line py-20 lg:py-28">
          <Container>
            <Reveal>
              <SectionHeader eyebrow="Команда" title={<span id="team-title">Специалисты центра</span>} />
            </Reveal>
            <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {specialists.map((p, i) => (
                <Reveal as="li" key={p.name} delay={(i % 4) * 70}>
                  <Visual image={p.photo} seed={40 + i} className="aspect-[4/5] rounded-card" sizes="(min-width: 1024px) 25vw, 50vw" />
                  <h3 className="mt-5 text-lg font-semibold">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted">{p.role}</p>
                  {p.bio && <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{p.bio}</p>}
                  {p.qualifications.length > 0 && (
                    <ul className="mt-3 space-y-1 text-sm">
                      {p.qualifications.map((q) => (
                        <li key={q}>{q}</li>
                      ))}
                    </ul>
                  )}
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {center.gallery.length > 1 && (
        <section aria-label="Фотографии центра" className="pb-20 lg:pb-28">
          <Container>
            <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-6">
              {center.gallery.slice(1).map((img, i) => (
                <Reveal as="li" key={img.src} delay={(i % 3) * 70} className={i === 0 ? "col-span-2 lg:col-span-2 lg:row-span-2" : undefined}>
                  <Visual image={img} className="aspect-[4/3] h-full rounded-card" sizes="(min-width: 1024px) 33vw, 50vw" />
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section id="adresa" aria-labelledby="locations-title" className="scroll-mt-[var(--header-h)] border-t border-line py-16 lg:py-24">
        <Container>
          <Reveal>
            <SectionHeader eyebrow="Адреса" title={<span id="locations-title">Где нас найти</span>} lead="Два филиала в Актобе." />
          </Reveal>
          <ul className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6">
            {locations.map((l, i) => (
              <Reveal as="li" key={l.id} delay={i * 70}>
                <LocationCard location={l} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <FormSection
        id="zapis"
        eyebrow="Запись"
        title="Записаться в центр"
        lead="Оставьте контакты — мы свяжемся с вами и согласуем время визита."
        type="appointment"
        fields={appointmentFields}
        submitLabel="Записаться"
        successText="Спасибо! Мы свяжемся с вами, чтобы согласовать время визита."
        contactMessage="Здравствуйте! Хочу записаться в центр подологии."
      />

    </>
  );
}
