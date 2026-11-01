/**
 * Podology / orthopaedics illustration kit — pure server-rendered SVG.
 *
 *  • PressureFoot   — baropodometry-style plantar pressure map made of dots
 *                     (a cached static file from /art; animated version:
 *                     components/ui/pressure-field.tsx)
 *  • Insole         — orthotic insole outline with arch & metatarsal zones
 *  • ArchLines      — concentric foot-arch curves
 *  • Footprints     — a walking trail of stylised footprints
 *
 * All decorative: aria-hidden, no JS. Colours come from the --art-* tokens
 * in src/styles/tokens.css (applied via style, so CSS variables resolve).
 */

import { cn } from "@/lib/utils";
import { artSrc, pressureFile } from "@/lib/art/files";

/* ------------------------------------------------------------------ */
/*  Pressure foot — static files from /art (see lib/art/pressure.ts)    */
/* ------------------------------------------------------------------ */

type ArtImgProps = { className?: string; tone?: "light" | "dark"; eager?: boolean };

export function PressureFoot({ className, mirror = false, tone = "light", eager = false }: ArtImgProps & { mirror?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static generated SVG; next/image adds nothing here
    <img
      src={artSrc(pressureFile("foot-v", tone))}
      alt=""
      aria-hidden
      draggable={false}
      decoding="async"
      loading={eager ? "eager" : "lazy"}
      className={cn("pointer-events-none select-none", mirror && "-scale-x-100", className)}
    />
  );
}

export function PressureFeet({ className, tone = "light", eager = false }: ArtImgProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static generated SVG
    <img
      src={artSrc(pressureFile("pair-v", tone))}
      alt=""
      aria-hidden
      draggable={false}
      decoding="async"
      loading={eager ? "eager" : "lazy"}
      className={cn("pointer-events-none aspect-[424/508] w-auto select-none", className)}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Orthotic insole                                                     */
/* ------------------------------------------------------------------ */

const insoleOutline =
  "M80 10C130 10 152 60 150 122C148 172 128 204 122 252C116 300 130 340 128 382C126 420 104 432 80 432C56 432 36 420 34 384C32 344 46 300 42 252C38 204 14 172 12 122C10 60 30 10 80 10Z";

export function Insole({
  className,
  tone = "light",
  filled = true,
}: {
  className?: string;
  tone?: "light" | "dark";
  filled?: boolean;
}) {
  const dark = tone === "dark";
  const stroke = dark ? "var(--art-line-dark-strong)" : "var(--art-line-strong)";
  const soft = dark ? "var(--art-fill-dark)" : "var(--art-fill)";
  return (
    <svg viewBox="0 0 160 442" className={className} aria-hidden focusable="false">
      <path d={insoleOutline} style={{ fill: filled ? soft : "none", stroke }} strokeWidth="1.5" />
      <path
        d={insoleOutline}
        fill="none"
        style={{ stroke }}
        strokeWidth="1"
        strokeDasharray="3 5"
        transform="translate(80 221) scale(0.86) translate(-80 -221)"
        opacity="0.8"
      />
      {/* medial arch support */}
      <path d="M44 210C30 250 34 300 50 330C60 300 64 250 58 214Z" style={{ fill: dark ? "var(--art-d1)" : "var(--art-zone)" }} />
      {/* metatarsal pad */}
      <path d="M80 150C96 150 104 166 98 186C93 200 67 200 62 186C56 166 64 150 80 150Z" style={{ fill: dark ? "var(--art-d2)" : "var(--art-zone-2)" }} />
      {/* heel cup */}
      <ellipse cx="82" cy="380" rx="26" ry="30" fill="none" style={{ stroke }} strokeWidth="1" />
      <ellipse cx="82" cy="380" rx="13" ry="15" fill="none" style={{ stroke }} strokeWidth="1" opacity="0.7" />
      <circle cx="82" cy="380" r="3.5" style={{ fill: "var(--color-accent)" }} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Arch lines                                                          */
/* ------------------------------------------------------------------ */

export function ArchLines({
  className,
  tone = "light",
  count = 7,
  draw = false,
  accent = true,
}: {
  className?: string;
  tone?: "light" | "dark";
  count?: number;
  /** Line-drawing entrance when the parent reveal becomes visible (or on load in the hero). */
  draw?: boolean;
  /** Mark one curve with the red accent. */
  accent?: boolean;
}) {
  const stroke = tone === "dark" ? "var(--art-line-dark)" : "var(--art-line)";
  return (
    <svg
      viewBox="0 0 400 200"
      className={cn(draw && "draw-lines", className)}
      aria-hidden
      focusable="false"
      preserveAspectRatio="xMidYMax meet"
    >
      {Array.from({ length: count }, (_, i) => {
        const r = 40 + i * 24;
        const isAccent = accent && i === 2;
        return (
          <path
            key={i}
            d={`M${200 - r} 200A${r} ${r * 0.72} 0 0 1 ${200 + r} 200`}
            fill="none"
            pathLength={1}
            style={{
              stroke: isAccent ? "var(--color-accent)" : stroke,
              strokeOpacity: isAccent ? 0.5 : 1,
              ["--i" as string]: i,
            }}
            strokeWidth="1.25"
          />
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Footprint trail                                                     */
/* ------------------------------------------------------------------ */

function Footprint({ x, y, rot, left, fill }: { x: number; y: number; rot: number; left: boolean; fill: string }) {
  const s = left ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s} 1)`} style={{ fill }}>
      <ellipse cx="0" cy="0" rx="9" ry="15" />
      <ellipse cx="1" cy="21" rx="7" ry="8" />
      <circle cx="-6" cy="-19" r="3.6" />
      <circle cx="0" cy="-21" r="2.5" />
      <circle cx="4.5" cy="-19.5" r="2.2" />
      <circle cx="8" cy="-16.5" r="1.9" />
      <circle cx="10.5" cy="-13" r="1.6" />
    </g>
  );
}

export function Footprints({
  className,
  steps = 6,
  tone = "light",
}: {
  className?: string;
  steps?: number;
  tone?: "light" | "dark";
}) {
  const fill = tone === "dark" ? "var(--art-line-dark)" : "var(--art-dot)";
  const W = 120;
  const H = steps * 70 + 40;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden focusable="false">
      {Array.from({ length: steps }, (_, i) => {
        const left = i % 2 === 0;
        return (
          <Footprint
            key={i}
            x={left ? 42 : 78}
            y={H - 40 - i * 70}
            rot={left ? -8 : 8}
            left={left}
            fill={i === steps - 1 ? "var(--color-accent)" : fill}
          />
        );
      })}
    </svg>
  );
}
