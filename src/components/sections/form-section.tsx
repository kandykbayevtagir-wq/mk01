import { contacts } from "@/data/site";
import { phoneHref, whatsappHref } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { LeadForm, type FieldDef } from "@/components/forms/lead-form";
import type { LeadType } from "@/lib/leads/schema";

export function DirectContacts({ message }: { message?: string }) {
  const items = [
    contacts.whatsapp && { label: "WhatsApp", value: contacts.whatsapp, href: whatsappHref(contacts.whatsapp, message) },
    contacts.phone && { label: "Телефон", value: contacts.phone, href: phoneHref(contacts.phone) },
    contacts.telegram && { label: "Telegram", value: `@${contacts.telegram}`, href: `https://t.me/${contacts.telegram}` },
    contacts.email && { label: "E-mail", value: contacts.email, href: `mailto:${contacts.email}` },
  ].filter(Boolean) as { label: string; value: string; href: string }[];
  if (!items.length) return null;
  return (
    <dl className="mt-10 space-y-4 border-t border-line pt-6">
      {items.map((i) => (
        <div key={i.label} className="flex items-baseline justify-between gap-4">
          <dt className="text-sm text-muted">{i.label}</dt>
          <dd>
            <a
              href={i.href}
              className="font-semibold underline decoration-transparent underline-offset-4 transition-colors hover:decoration-ink"
              {...(i.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {i.value}
            </a>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function FormSection({
  id,
  eyebrow,
  title,
  lead,
  type,
  fields,
  submitLabel,
  successText,
  children,
  contactMessage,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  type: LeadType;
  fields: FieldDef[];
  submitLabel?: string;
  successText?: string;
  children?: React.ReactNode;
  contactMessage?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-[var(--header-h)] bg-mist py-20 lg:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-5">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id={`${id}-title`} className="mt-4 text-h2 font-semibold">
              {title}
            </h2>
            <p className="mt-5 max-w-md text-lead text-muted">{lead}</p>
            {children}
            <DirectContacts message={contactMessage} />
          </Reveal>
          <Reveal className="lg:col-span-6 lg:col-start-7" delay={80}>
            <div className="rounded-panel bg-paper p-5 shadow-card sm:p-8 lg:p-10">
              <LeadForm type={type} fields={fields} submitLabel={submitLabel} successText={successText} tone="mist" />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
