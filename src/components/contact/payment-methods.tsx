import { Banknote } from "lucide-react";
import { paymentMethods } from "@/data/site";
import type { PaymentMethod } from "@/data/types";
import { cn } from "@/lib/utils";
import { brandMarks, markViewBox, SimpleIconSvg } from "@/components/ui/brand-icons";

/**
 * Accepted payment methods — informational only. The site has no online
 * checkout; nothing here is a payment action.
 *
 * Apple Pay / Google Pay: official marks (Simple Icons, unmodified, single
 * colour as permitted by both brands' guidelines).
 * Kaspi / Halyk: no verified open-source mark available → plain text
 * wordmark fallback, deliberately not an imitation of their logos.
 * Cash: Lucide «banknote» icon.
 */
function Mark({ method, tone }: { method: PaymentMethod; tone: "light" | "dark" }) {
  switch (method.id) {
    case "applepay":
      return <SimpleIconSvg icon={brandMarks.applepay} viewBox={markViewBox.applepay} title="Apple Pay" className="h-8 w-auto" />;
    case "googlepay":
      return <SimpleIconSvg icon={brandMarks.googlepay} viewBox={markViewBox.googlepay} title="Google Pay" className="h-[22px] w-auto" />;
    case "cash":
      return (
        <span className="inline-flex items-center gap-2 text-[1.0625rem] font-semibold tracking-tight">
          <Banknote aria-hidden className="size-6" strokeWidth={1.6} />
          {method.name}
        </span>
      );
    default:
      return (
        <span
          className={cn(
            "text-[1.375rem] font-extrabold leading-none tracking-[-0.03em]",
            tone === "dark" ? "text-white" : "text-ink",
          )}
        >
          {method.name}
        </span>
      );
  }
}

export function PaymentMethods({ className }: { className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4", className)}>
      {paymentMethods.map((m, i) => (
        <li
          key={m.id}
          className={cn(
            "card-settle flex min-h-28 flex-col items-center justify-center gap-3 rounded-card border border-line bg-card px-3 py-5 text-center",
            "transition-[border-color,box-shadow,transform] duration-[var(--dur-card)] ease-out-soft hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-card",
            // 5 items in 2 columns: let the last one span the row on phones
            i === paymentMethods.length - 1 && "col-span-2 sm:col-span-1",
          )}
        >
          <span className="flex h-9 items-center text-ink">
            <Mark method={m} tone="light" />
          </span>
          <span className="text-xs text-muted">{m.note}</span>
        </li>
      ))}
    </ul>
  );
}

/** Minimal strip for the footer. */
export function PaymentStrip({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)} aria-label="Способы оплаты">
      {paymentMethods.map((m) => (
        <li
          key={m.id}
          className="inline-flex h-9 items-center rounded-lg border border-line-dark px-3 text-white/85"
        >
          {m.id === "applepay" || m.id === "googlepay" ? (
            <SimpleIconSvg
              icon={brandMarks[m.id]}
              viewBox={markViewBox[m.id]}
              title={m.name}
              className={m.id === "applepay" ? "h-5 w-auto" : "h-3.5 w-auto"}
            />
          ) : m.id === "cash" ? (
            <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium">
              <Banknote aria-hidden className="size-4" strokeWidth={1.6} />
              {m.name}
            </span>
          ) : (
            <span className="text-[0.875rem] font-extrabold tracking-[-0.02em]">{m.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
