import { siApplepay, siGooglepay, siInstagram, siTelegram, siWhatsapp } from "simple-icons";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Third-party brand marks.
 *
 * Source: Simple Icons (https://simpleicons.org, npm `simple-icons`), CC0 1.0.
 * The SVG paths are the brands' official marks as published by Simple Icons;
 * we render them unmodified (no distortion, original proportions). Trademarks
 * remain the property of their owners — see each brand's guidelines:
 *   WhatsApp, Instagram  https://about.meta.com/brand/resources/
 *   Telegram             https://telegram.org/tour/screenshots (press kit)
 *   Apple Pay            https://developer.apple.com/apple-pay/marketing/
 *   Google Pay           https://developers.google.com/pay/api/web/guides/brand-guidelines
 *
 * Kaspi and Halyk marks are not available from a verified open source, so
 * they are rendered as plain text wordmarks (see PaymentMethods) instead of
 * an inaccurate imitation.
 */

type SimpleIcon = { title: string; path: string };

export function SimpleIconSvg({
  icon,
  className,
  title,
  viewBox = "0 0 24 24",
}: {
  icon: SimpleIcon;
  className?: string;
  /** Provide when the icon is the only content of a control. */
  title?: string;
  /** Tight crop for wide wordmarks (path unchanged, proportions preserved). */
  viewBox?: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      className={cn("shrink-0", className)}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <path d={icon.path} />
    </svg>
  );
}

export const brandMarks = {
  whatsapp: siWhatsapp,
  telegram: siTelegram,
  instagram: siInstagram,
  applepay: siApplepay,
  googlepay: siGooglepay,
} as const;

/**
 * Measured bounding boxes of the wide payment marks inside Simple Icons'
 * 24×24 canvas — cropping to them lets the marks render at a legible size
 * without scaling them non-uniformly.
 */
export const markViewBox = {
  applepay: "0 4.317 24 15.365",
  googlepay: "0 7.235 24 9.531",
} as const;

export type ChannelKind = "whatsapp" | "telegram" | "instagram" | "phone";

const tileBackground: Record<ChannelKind, string> = {
  whatsapp: "var(--brand-whatsapp)",
  telegram: "var(--brand-telegram)",
  instagram: "var(--brand-instagram)",
  phone: "var(--color-ink)",
};

/**
 * App-icon style tile: brand colour background, white glyph — the form in
 * which these marks are most recognisable. Brand colour stays confined to
 * this small square.
 */
export function ChannelTile({ kind, className }: { kind: ChannelKind; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-flex size-11 shrink-0 items-center justify-center rounded-[14px] text-white", className)}
      style={{ background: tileBackground[kind] }}
    >
      {kind === "phone" ? (
        <Phone className="size-[45%]" strokeWidth={2} />
      ) : (
        <SimpleIconSvg icon={brandMarks[kind]} className="size-[52%]" />
      )}
    </span>
  );
}
