import { ArrowUpRight, Clock3, MapPin, Phone } from "lucide-react";
import type { BusinessLocation } from "@/data/types";
import { cn } from "@/lib/utils";

/**
 * Lightweight branch card that links to the official 2GIS listing.
 * No embedded map (keeps mobile fast). Only verified fields are shown;
 * unverified ones are simply omitted — nothing is guessed.
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
      {/* Map-plate texture + pin — decorative */}
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

      <dl className="relative mt-5 space-y-2.5 text-[0.9375rem]">
        <div className="flex gap-3">
          <dt className="sr-only">Адрес</dt>
          <dd>
            {location.address ? (
              <>
                {location.city}, {location.address}
              </>
            ) : (
              <>
                {location.city}
                <span className="block text-[0.8125rem] text-muted">Точный адрес и маршрут — в карточке 2ГИС</span>
              </>
            )}
          </dd>
        </div>
        {location.hours && (
          <div className="flex items-center gap-2 text-muted">
            <dt className="sr-only">Часы работы</dt>
            <Clock3 aria-hidden className="size-4" strokeWidth={1.75} />
            <dd>{location.hours}</dd>
          </div>
        )}
        {location.phone && (
          <div className="flex items-center gap-2 text-muted">
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

      <div className="relative mt-auto pt-6">
        <a
          href={location.twoGisUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="press inline-flex h-12 w-full items-center justify-between gap-3 rounded-full border border-ink/15 bg-card pl-5 pr-1.5 text-[0.9375rem] font-medium transition-colors duration-[var(--dur-press)] hover:border-ink/40 active:bg-mist sm:w-auto sm:min-w-56"
        >
          <span>
            Открыть в 2ГИС<span className="sr-only">: {location.label} (откроется в новой вкладке)</span>
          </span>
          <span aria-hidden className="inline-flex size-9 items-center justify-center rounded-full bg-mist transition-colors duration-[var(--dur-press)] group-hover:bg-ink group-hover:text-white">
            <ArrowUpRight className="size-[18px]" strokeWidth={1.75} />
          </span>
        </a>
      </div>
    </article>
  );
}
