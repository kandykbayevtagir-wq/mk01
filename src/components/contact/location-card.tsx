import { ArrowUpRight, Clock3, MapPin, Phone } from "lucide-react";
import type { BusinessLocation } from "@/data/types";
import { cn } from "@/lib/utils";

/**
 * Branch card: verified street address first, then floor / landmark.
 * A map button is rendered only when this branch has a confirmed map
 * destination (`mapUrl`) — an unverified link is never attached. No embedded
 * map, which keeps mobile fast.
 */
export function LocationCard({ location, className }: { location: BusinessLocation; className?: string }) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-card p-5 sm:p-6",
        "transition-[border-color,box-shadow] duration-[var(--dur-card)] ease-out-soft hover:border-ink/15 hover:shadow-lift",
        className,
      )}
    >
      {/* Map-plate texture — decorative */}
      <div aria-hidden className="pattern-dots pointer-events-none absolute -right-8 -top-8 size-40 rounded-full [mask-image:radial-gradient(circle,black,transparent_70%)]" />

      <div className="relative flex items-start gap-4">
        <span aria-hidden className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-mist">
          <MapPin className="size-5 text-ink" strokeWidth={1.75} />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-accent" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{location.label}</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">{location.name}</h3>
        </div>
      </div>

      <address className="relative mt-5 text-[1.0625rem] font-medium not-italic leading-snug">
        <span className="sr-only">Адрес: </span>
        {location.city}, {location.address}
        {location.detail && <span className="mt-1.5 block text-[0.9375rem] font-normal text-muted">{location.detail}</span>}
      </address>

      {(location.hours || location.phone) && (
        <dl className="relative mt-4 space-y-2 text-[0.9375rem] text-muted">
          {location.hours && (
            <div className="flex items-center gap-2">
              <dt className="sr-only">Часы работы</dt>
              <Clock3 aria-hidden className="size-4" strokeWidth={1.75} />
              <dd>{location.hours}</dd>
            </div>
          )}
          {location.phone && (
            <div className="flex items-center gap-2">
              <dt className="sr-only">Телефон филиала</dt>
              <Phone aria-hidden className="size-4" strokeWidth={1.75} />
              <dd>
                <a href={`tel:${location.phone.replace(/[^\d+]/g, "")}`} className="underline-offset-4 hover:underline">
                  {location.phone}
                </a>
              </dd>
            </div>
          )}
        </dl>
      )}

      {location.mapUrl && (
        <div className="relative mt-auto pt-6">
          <a
            href={location.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-ripple=""
            className="press inline-flex h-12 w-full items-center justify-between gap-3 rounded-full border border-ink/15 bg-card pl-5 pr-1.5 text-[0.9375rem] font-medium transition-colors duration-[var(--dur-press)] hover:border-ink/40 active:bg-mist sm:w-auto sm:min-w-64"
          >
            <span>
              {location.mapLabel ?? "Открыть на карте"}
              <span className="sr-only">: {location.label} (откроется в новой вкладке)</span>
            </span>
            <span aria-hidden className="inline-flex size-9 items-center justify-center rounded-full bg-mist transition-colors duration-[var(--dur-press)] group-hover:bg-ink group-hover:text-white">
              <ArrowUpRight className="size-[18px]" strokeWidth={1.75} />
            </span>
          </a>
        </div>
      )}
    </article>
  );
}
