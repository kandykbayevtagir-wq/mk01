import { cn } from "@/lib/utils";
import { ArchLines } from "./podo-art";

/**
 * Zero-height boundary ornament: a fine arch contour centred on the line
 * between two sections, drifted by the scroll position (CSS view timeline,
 * transform only — strokes are static so scrolling never repaints SVG). It belongs to neither section, which is what makes the page
 * read as one continuous surface. Decorative only.
 */
export function Seam({ side = "right", className }: { side?: "left" | "right"; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none relative z-10 h-0 overflow-x-clip overflow-y-visible", className)}>
      <ArchLines
        count={6}
        accent={false}
        className={cn(
          "seam-drift absolute -top-20 h-40 w-[360px] opacity-80 sm:-top-28 sm:h-56 sm:w-[520px]",
          side === "right" ? "-right-28 sm:right-[4%]" : "-left-28 sm:left-[4%]",
        )}
      />
    </div>
  );
}
