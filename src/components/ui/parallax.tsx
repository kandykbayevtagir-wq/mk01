import { cn } from "@/lib/utils";

/**
 * Subtle vertical parallax for large editorial imagery.
 *
 * Pure CSS: a scroll-driven animation bound to this element's own view
 * timeline (see `.parallax` in globals.css). No JavaScript, no scroll
 * listeners, no hydration. Browsers without scroll-driven animations — and
 * users with reduced motion — get a static image.
 */
export function Parallax({
  children,
  className,
  distance = 40,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}) {
  return (
    <div
      className={cn("parallax relative overflow-hidden", className)}
      style={{ "--parallax-distance": `${distance}px` } as React.CSSProperties}
    >
      <div className="parallax-layer absolute inset-x-0" style={{ top: -distance, bottom: -distance }}>
        {children}
      </div>
    </div>
  );
}
