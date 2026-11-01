import { artSrc, contourFile } from "@/lib/art/files";

/**
 * Brand motif: hairline iso-contours inspired by a plantar pressure map.
 * Deterministic (seeded) and served as a cached static SVG file from /art
 * (generated at build time by lib/art/contour.ts), so it never inflates the
 * page HTML or the RSC payload. Fills its box like `object-fit: cover`.
 */
export function ContourArt({
  seed = 1,
  tone = "light",
  className,
  marker = true,
  eager = false,
}: {
  seed?: number;
  tone?: "light" | "dark";
  className?: string;
  marker?: boolean;
  eager?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static generated SVG
    <img
      src={artSrc(contourFile(seed, tone, marker))}
      alt=""
      aria-hidden
      draggable={false}
      decoding="async"
      loading={eager ? "eager" : "lazy"}
      className={className ? `pointer-events-none select-none ${className}` : "pointer-events-none select-none"}
    />
  );
}
