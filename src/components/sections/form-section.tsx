import { channels, whatsappLink } from "@/data/site";
import { ChannelTile } from "@/components/ui/brand-icons";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { LeadForm, type FieldDef } from "@/components/forms/lead-form";
import type { LeadType } from "@/lib/leads/schema";

export function DirectContacts({ message }: { message?: string }) {
  const items = [
    { kind: "whatsapp" as const, ...channels.whatsapp, url: whatsappLink(message) },
    { kind: "telegram" as const, ...channels.telegram },
    { kind: "phone" as const, ...channels.phone },
  ];
  return (
    <div className="mt-10 border-t border-line pt-6">
      <p className="text-sm text-muted">Удобнее написать напрямую?</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((i) => (
          <li key={i.kind}>
            <a
              href={i.url}
              {...(i.url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="press inline-flex h-11 items-center gap-2.5 rounded-full border border-line bg-card pl-1.5 pr-4 text-sm font-medium transition-colors duration-[var(--dur-press)] hover:border-ink/30 active:bg-mist"
            >
              <ChannelTile kind={i.kind} className="size-8 rounded-full" />
              {i.kind === "phone" ? i.value : i.name}
              {i.url.startsWith("http") && <span className="sr-only"> (откроется в новой вкладке)</span>}
            </a>
          </li>
        ))}
      </ul>
    </div>
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
  showDirectContacts = true,
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
  showDirectContacts?: boolean;
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
            {showDirectContacts && <DirectContacts message={contactMessage} />}
          </Reveal>
          <Reveal className="lg:col-span-6 lg:col-start-7" delay={80}>
            <div className="rounded-panel bg-card p-5 shadow-card sm:p-8 lg:p-10">
              <LeadForm type={type} fields={fields} submitLabel={submitLabel} successText={successText} tone="mist" />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
