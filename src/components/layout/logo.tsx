import Link from "next/link";
import { site } from "@/data/site";
import { assetPath } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * The owner's official logo (brand/podology-logo-original.png, derived files in
 * public/brand — see brand/README.md). The mark is never redrawn, recoloured or
 * rotated; the wordmark already contains the name, so no text is added beside it.
 *
 * tone     — the background it sits on: "light" → dark ink, "dark" → white ink.
 * variant  — "responsive": the PODOLOGY wordmark on phones, the full lockup
 *            ("… by Marina Kandykbayeva") from 640 px; "full": always the lockup.
 * reveal   — header only: one gentle left-to-right reveal on first load.
 *
 * Sizes are fixed in CSS per breakpoint (no layout shift whichever file loads);
 * <picture> means a phone downloads only the compact file.
 */
export function Logo({
  tone = "light",
  variant = "responsive",
  reveal = false,
  lazy = false,
  className,
}: {
  tone?: "light" | "dark";
  variant?: "responsive" | "full";
  reveal?: boolean;
  /** Below the fold (footer): defer the download. */
  lazy?: boolean;
  className?: string;
}) {
  const file = (name: "full" | "compact") => assetPath(`/brand/logo-${name}${tone === "dark" ? "-light" : ""}.png`);
  const lockupOnly = variant === "full";

  return (
    <Link
      href="/"
      className={cn("inline-flex min-h-11 items-center rounded-lg", className)}
      aria-label={`${site.name} — на главную`}
    >
      <picture className={cn("block", reveal && "logo-reveal")}>
        {!lockupOnly && <source media="(min-width: 640px)" srcSet={file("full")} />}
        {/* fixed brand asset with an explicit CSS size; <picture> picks the file per breakpoint */}
        <img
          src={file(lockupOnly ? "full" : "compact")}
          alt={site.name}
          width={720}
          height={lockupOnly ? 168 : 99}
          draggable={false}
          decoding="async"
          loading={lazy ? "lazy" : "eager"}
          className={cn(
            "block select-none object-contain",
            lockupOnly ? "h-11 w-[189px]" : "h-[22px] w-[160px] sm:h-9 sm:w-[154px] lg:h-10 lg:w-[171px]",
          )}
        />
      </picture>
    </Link>
  );
}
