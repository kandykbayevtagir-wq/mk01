/**
 * Hairline iso-contours inspired by a plantar pressure map. Deterministic
 * (seeded); served as static SVG files from /art/*.svg so the markup never
 * travels inside page HTML or the RSC payload.
 */
import type { ArtTone } from "./pressure";

/** Distinct contour drawings. Seeds are folded into this many variants. */
export const CONTOUR_VARIANTS = 8;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function contourPath(cx: number, cy: number, r: number, sx: number, sy: number, phases: number[], amp: number) {
  const steps = 72;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const k =
      1 +
      amp * Math.sin(2 * t + phases[0]) +
      amp * 0.6 * Math.sin(3 * t + phases[1]) +
      amp * 0.35 * Math.sin(5 * t + phases[2]);
    const x = cx + Math.cos(t) * r * sx * k;
    const y = cy + Math.sin(t) * r * sy * k;
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join("") + "Z";
}

const strokes: Record<ArtTone, { line: string; strong: string }> = {
  light: { line: "rgb(23 23 23 / 0.14)", strong: "rgb(23 23 23 / 0.28)" },
  dark: { line: "rgb(255 255 255 / 0.13)", strong: "rgb(255 255 255 / 0.28)" },
};

export function contourSvg(variant: number, tone: ArtTone, marker: boolean) {
  const rand = mulberry32(variant * 9973);
  const W = 400;
  const H = 500;
  const centres = [
    { cx: 200 + (rand() - 0.5) * 60, cy: 360 + (rand() - 0.5) * 40, rings: 9, sx: 1, sy: 1.15 },
    { cx: 205 + (rand() - 0.5) * 70, cy: 150 + (rand() - 0.5) * 40, rings: 11, sx: 1.25, sy: 0.9 },
  ];
  const normal: string[] = [];
  const strong: string[] = [];
  for (const c of centres) {
    const phases = [rand() * 6.28, rand() * 6.28, rand() * 6.28];
    for (let i = 1; i <= c.rings; i++) {
      const r = i * 17 + rand() * 4;
      (i % 4 === 0 ? strong : normal).push(contourPath(c.cx, c.cy, r, c.sx, c.sy, phases, 0.06 + i * 0.006));
    }
  }
  const m = centres[variant % 2];
  const s = strokes[tone];
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">` +
    `<g fill="none" stroke-width="1" vector-effect="non-scaling-stroke">` +
    `<path stroke="${s.line}" vector-effect="non-scaling-stroke" d="${normal.join("")}"/>` +
    `<path stroke="${s.strong}" vector-effect="non-scaling-stroke" d="${strong.join("")}"/>` +
    `</g>` +
    (marker
      ? `<circle cx="${m.cx.toFixed(1)}" cy="${m.cy.toFixed(1)}" r="14" fill="none" stroke="#b3262d" stroke-opacity="0.35"/>` +
        `<circle cx="${m.cx.toFixed(1)}" cy="${m.cy.toFixed(1)}" r="4" fill="#b3262d"/>`
      : "") +
    `</svg>`
  );
}
