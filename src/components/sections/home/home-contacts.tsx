import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { channels } from "@/data/site";
import { SocialIconRow } from "@/components/contact/contact-channels";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";

/**
 * The homepage's last block: how to reach us. Verified channels only —
 * addresses, maps and payment methods are one link away on /contacts.
 */
export function HomeContacts() {
  return (
    <section aria-labelledby="home-contacts-title" className="pb-14 pt-4 sm:pb-20 lg:pb-24">
      <Container>
        <Reveal className="rounded-panel bg-mist px-6 py-9 sm:px-10 sm:py-12 lg:px-14">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-6">
              <Eyebrow>Контакты</Eyebrow>
              <h2 id="home-contacts-title" className="mt-4 text-h2 font-semibold">
                Телефон и мессенджеры
              </h2>
              <Link
                href="/contacts"
                className="group mt-5 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold underline decoration-line underline-offset-4 hover:decoration-ink"
              >
                Адреса, карта и способы оплаты
                <ArrowRight aria-hidden className="size-4 transition-transform duration-[var(--dur-press)] group-hover:translate-x-0.5" strokeWidth={1.75} />
              </Link>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <a
                href={channels.phone.url}
                className="inline-flex min-h-11 items-center text-[1.625rem] font-semibold tracking-tight transition-colors hover:text-ink/80 sm:text-[2rem]"
              >
                {channels.phone.value}
              </a>
              <p className="mt-1 text-[0.875rem] text-muted">Телефон и WhatsApp</p>
              <SocialIconRow tone="light" className="mt-4" />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
