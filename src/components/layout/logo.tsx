import Link from "next/link";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export function LogoMark({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8 shrink-0", className)} aria-hidden focusable="false">
      <rect width="32" height="32" rx="9" fill={tone === "light" ? "#171717" : "#ffffff"} />
      <g fill="none" stroke={tone === "light" ? "#ffffff" : "#171717"} strokeWidth="1.4" opacity="0.9">
        <ellipse cx="16" cy="12.5" rx="6.5" ry="4.6" />
        <ellipse cx="16" cy="12.5" rx="3.6" ry="2.4" opacity="0.6" />
        <ellipse cx="16" cy="22.5" rx="4.4" ry="3.6" />
      </g>
      <circle cx="16" cy="22.5" r="1.7" style={{ fill: "var(--color-accent)" }} />
    </svg>
  );
}

export function Logo({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex min-h-11 items-center gap-2.5 rounded-lg", className)}
      aria-label={`${site.name} — на главную`}
    >
      <LogoMark tone={tone} className="transition-transform duration-300 ease-out-soft group-hover:rotate-[-6deg]" />
      <span
        className={cn(
          "text-[0.9375rem] font-semibold tracking-[-0.01em]",
          tone === "light" ? "text-ink" : "text-white",
        )}
      >
        {site.name}
      </span>
    </Link>
  );
}
