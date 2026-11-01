import { ArrowUpRight } from "lucide-react";
import { channels, whatsappLink } from "@/data/site";
import { cn } from "@/lib/utils";
import { ChannelTile, type ChannelKind } from "@/components/ui/brand-icons";

type Channel = { kind: ChannelKind; name: string; value: string; label: string; url: string };

const external = (url: string) => url.startsWith("http");

function ChannelLink({ channel, primary = false }: { channel: Channel; primary?: boolean }) {
  return (
    <a
      href={channel.url}
      {...(external(channel.url) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      data-ripple=""
      className={cn(
        "group press flex items-center gap-4 rounded-card border border-line bg-card",
        "transition-[border-color,box-shadow,transform] duration-[var(--dur-card)] ease-out-soft",
        "hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-lift focus-visible:shadow-lift",
        primary ? "p-4 sm:p-6" : "p-4",
      )}
    >
      <ChannelTile
        kind={channel.kind}
        className={cn(
          "transition-transform duration-300 ease-out-soft group-hover:-rotate-6 group-hover:scale-105 group-active:scale-95",
          primary && "size-12 sm:size-14",
        )}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium text-muted">{channel.name}</span>
        <span className={cn("block truncate font-semibold tracking-tight", primary ? "text-lg sm:text-xl" : "text-[0.9375rem]")}>
          {channel.value}
        </span>
        <span className="mt-0.5 block text-[0.8125rem] text-muted">
          {channel.label}
          {external(channel.url) && <span className="sr-only"> (откроется в новой вкладке)</span>}
        </span>
      </span>
      <span
        aria-hidden
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full transition-colors duration-[var(--dur-press)]",
          primary
            ? "size-11 bg-ink text-white group-hover:bg-accent"
            : "size-9 bg-mist text-ink group-hover:bg-ink group-hover:text-white",
        )}
      >
        <ArrowUpRight className="size-[18px] transition-transform duration-[var(--dur-card)] ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.75} />
      </span>
    </a>
  );
}

/** WhatsApp as the primary action, then Telegram, Instagram and phone. */
export function ContactChannels({
  whatsappMessage,
  layout = "grid",
}: {
  whatsappMessage?: string;
  /** "stack": single column (narrow asides); "grid": 3 columns on desktop. */
  layout?: "grid" | "stack";
}) {
  const whatsapp: Channel = {
    kind: "whatsapp",
    ...channels.whatsapp,
    url: whatsappLink(whatsappMessage),
  };
  const rest: Channel[] = [
    { kind: "telegram", ...channels.telegram },
    { kind: "instagram", ...channels.instagram },
    { kind: "phone", ...channels.phone },
  ];
  return (
    <div className={cn("grid grid-cols-1 gap-3", layout === "grid" && "lg:grid-cols-3 lg:gap-4")}>
      <div className={cn(layout === "grid" && "lg:col-span-3")}>
        <ChannelLink channel={whatsapp} primary />
      </div>
      {rest.map((c) => (
        <ChannelLink key={c.kind} channel={c} />
      ))}
    </div>
  );
}

/** Compact icon-only row (footer, menus). Every link has an accessible name. */
export function SocialIconRow({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const items: Channel[] = [
    { kind: "whatsapp", ...channels.whatsapp },
    { kind: "telegram", ...channels.telegram },
    { kind: "instagram", ...channels.instagram },
  ];
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {items.map((c) => (
        <li key={c.kind}>
          <a
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${c.name}: ${c.value} (откроется в новой вкладке)`}
            data-ripple=""
            className={cn(
              "press inline-flex size-11 items-center justify-center rounded-full transition-[background-color,transform] duration-[var(--dur-press)]",
              tone === "dark" ? "bg-white/[0.06] hover:bg-white/[0.12]" : "bg-mist hover:bg-sand",
            )}
          >
            <ChannelTile kind={c.kind} className="size-7 rounded-[9px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
