import { channels, whatsappLink } from "@/data/site";
import { ChannelTile } from "@/components/ui/brand-icons";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { LeadForm, type FieldDef } from "@/components/forms/lead-form";
import type { LeadType } from "@/lib/leads/schema";

/** Quiet alternative next to a form: one WhatsApp link, never a button. */
export function WhatsAppAlt({ message, className }: { message?: string; className?: string }) {
  return (
    <p className={className ?? "mt-8"}>
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="press group inline-flex min-h-11 items-center gap-2.5 text-[0.9375rem] text-muted transition-colors duration-[var(--dur-press)] hover:text-ink"
      >
        <ChannelTile kind="whatsapp" className="size-7 rounded-full" />
        <span>
          Или напишите в WhatsApp{" "}
          <span className="font-medium text-ink underline decoration-line underline-offset-4 group-hover:decoration-ink">{channels.whatsapp.value}</span>
        </span>
        <span className="sr-only"> (откроется в новой вкладке)</span>
      </a>
    </p>
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
            {showDirectContacts && <WhatsAppAlt message={contactMessage} />}
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
