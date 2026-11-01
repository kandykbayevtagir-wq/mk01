import { cn } from "@/lib/utils";
import { ArchLines, Footprints, Insole, PressureFoot } from "./podo-art";

type Variant = "arches-right" | "arches-left" | "dots-corner" | "insole" | "footprints" | "foot";

/**
 * Decorative podology motifs placed behind section content.
 * The parent section must be `relative overflow-hidden`; content should sit
 * in a `relative` container so it layers above.
 */
export function SectionDecor({
  variant,
  tone = "light",
  className,
}: {
  variant: Variant | Variant[];
  tone?: "light" | "dark";
  className?: string;
}) {
  const list = Array.isArray(variant) ? variant : [variant];
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {list.includes("arches-right") && (
        <ArchLines tone={tone} count={8} draw className="draw-scroll absolute -bottom-1 -right-28 h-60 w-[560px] max-md:-right-40 max-md:h-40" />
      )}
      {list.includes("arches-left") && (
        <ArchLines tone={tone} count={8} draw className="draw-scroll absolute -bottom-1 -left-28 h-60 w-[560px] max-md:-left-40 max-md:h-40" />
      )}
      {list.includes("dots-corner") && (
        <div
          className={cn(
            "absolute -right-10 -top-10 h-72 w-[46%] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]",
            tone === "dark" ? "pattern-dots-dark" : "pattern-dots",
          )}
        />
      )}
      {list.includes("insole") && (
        <Insole tone={tone} filled={false} className="absolute -right-10 -top-6 h-[360px] w-auto rotate-[18deg] opacity-45 max-lg:hidden" />
      )}
      {list.includes("footprints") && (
        <Footprints tone={tone} steps={6} className="absolute -bottom-6 right-10 h-[320px] w-auto rotate-[24deg] max-lg:hidden" />
      )}
      {list.includes("foot") && (
        <PressureFoot tone={tone} className="absolute -right-8 bottom-0 h-[360px] w-auto rotate-[-12deg] opacity-40 max-lg:hidden" />
      )}
    </div>
  );
}
