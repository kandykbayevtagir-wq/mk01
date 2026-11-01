/**
 * Podology / orthopaedics illustration kit — pure server-rendered SVG.
 *
 *  • PressureFoot   — baropodometry-style plantar pressure map made of dots
 *                     (rendered as ≤5 <path>s, so the DOM stays tiny)
 *  • Insole         — orthotic insole outline with arch & metatarsal zones
 *  • ArchLines      — concentric foot-arch curves
 *  • Footprints     — a walking trail of stylised footprints
 *
 * All decorative: aria-hidden, no JS. Colours come from the --art-* tokens
 * in src/styles/tokens.css (applied via style, so CSS variables resolve).
 */

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Pressure foot                                                       */
/* ------------------------------------------------------------------ */

type Ellipse = { cx: number; cy: number; rx: number; ry: number };

// Right foot, plantar view, toes up. viewBox 0 0 200 480.
const footShape: Ellipse[] = [
  { cx: 100, cy: 398, rx: 50, ry: 62 }, // heel
  { cx: 120, cy: 285, rx: 40, ry: 92 }, // lateral midfoot band
  { cx: 97, cy: 168, rx: 72, ry: 56 }, // forefoot
  { cx: 62, cy: 72, rx: 26, ry: 30 }, // hallux
  { cx: 103, cy: 80, rx: 15, ry: 17 },
  { cx: 129, cy: 92, rx: 13, ry: 15 },
  { cx: 151, cy: 106, rx: 12, ry: 13 },
  { cx: 168, cy: 124, rx: 10, ry: 11 },
];

const peaks = [
  { x: 100, y: 410, s: 34, w: 1 },
  { x: 66, y: 168, s: 26, w: 0.95 },
  { x: 102, y: 158, s: 24, w: 0.75 },
  { x: 137, y: 170, s: 22, w: 0.55 },
  { x: 62, y: 70, s: 20, w: 0.8 },
  { x: 128, y: 290, s: 32, w: 0.32 },
];

const inside = (x: number, y: number) =>
  footShape.some((e) => ((x - e.cx) / e.rx) ** 2 + ((y - e.cy) / e.ry) ** 2 <= 1);

const intensity = (x: number, y: number) =>
  Math.min(
    1,
    peaks.reduce((sum, p) => sum + p.w * Math.exp(-((x - p.x) ** 2 + (y - p.y) ** 2) / (2 * p.s ** 2)), 0),
  );

// Gray ramp → near-black, with red reserved for the absolute pressure peaks.
const lightRamp = ["--art-1", "--art-2", "--art-3", "--art-4", "--art-ink", "--art-5"].map((v) => `var(${v})`);
const darkRamp = ["--art-d1", "--art-d2", "--art-d3", "--art-d4", "--art-d-ink", "--art-d5"].map((v) => `var(${v})`);

function dotPath(points: { x: number; y: number; r: number }[]) {
  return points
    .map(({ x, y, r }) => `M${(x - r).toFixed(1)} ${y}a${r} ${r} 0 1 0 ${(2 * r).toFixed(1)} 0a${r} ${r} 0 1 0 ${(-2 * r).toFixed(1)} 0`)
    .join("");
}

const footBuckets = (() => {
  const step = 12;
  const buckets: { x: number; y: number; r: number }[][] = [[], [], [], [], [], []];
  for (let y = 30; y <= 465; y += step) {
    for (let x = 22; x <= 182; x += step) {
      const ox = x + ((y / step) % 2 ? step / 2 : 0);
      if (!inside(ox, y)) continue;
      const v = Math.pow(intensity(ox, y), 0.75);
      const level = v >= 0.94 ? 5 : Math.min(4, Math.floor(v * 5));
      buckets[level].push({ x: ox, y, r: 2.6 + v * 2.4 });
    }
  }
  return buckets.map(dotPath);
})();

export function PressureFoot({
  className,
  mirror = false,
  tone = "light",
}: {
  className?: string;
  mirror?: boolean;
  tone?: "light" | "dark";
}) {
  const ramp = tone === "dark" ? darkRamp : lightRamp;
  return (
    <svg viewBox="0 0 200 480" className={className} aria-hidden focusable="false">
      <g transform={mirror ? "translate(200 0) scale(-1 1)" : undefined}>
        {footBuckets.map((d, i) => (
          <path key={i} d={d} className={i === 5 ? "pressure-peak" : undefined} style={{ fill: ramp[i] }} />
        ))}
      </g>
    </svg>
  );
}

export function PressureFeet({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <div className={cn("flex items-end gap-[6%]", className)} aria-hidden>
      <PressureFoot mirror tone={tone} className="h-full w-auto -translate-y-[6%]" />
      <PressureFoot tone={tone} className="h-full w-auto" />
    </div>
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
