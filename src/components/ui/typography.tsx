import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
  tone = "light",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 text-eyebrow font-semibold uppercase",
        tone === "light" ? "text-muted" : "text-muted-dark",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-accent" />
      {children}
    </p>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  action,
  tone = "light",
  className,
  as: H = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  action?: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12", className)}>
      <div className="max-w-3xl">
        {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
        <H className={cn(H === "h1" ? "text-h1" : "text-h2", "mt-4 font-semibold", eyebrow ? "" : "mt-0")}>
          {title}
        </H>
        {lead && (
          <p className={cn("mt-5 max-w-2xl text-lead", tone === "light" ? "text-muted" : "text-muted-dark")}>
            {lead}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
