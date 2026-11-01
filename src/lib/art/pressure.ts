/**
 * Plantar pressure map — one deterministic model shared by
 *  • the static SVG files served from /art/*.svg (no-JS, first paint), and
 *  • the canvas animation in components/ui/pressure-field.tsx.
 * The static frame of the animation is pixel-identical to the SVG file, so
 * the canvas can take over without a visible jump.
 */

export type ArtTone = "light" | "dark";
export type PressureView = "foot-v" | "pair-v" | "foot-h" | "forefoot-h" | "stride-h";

type Ellipse = { cx: number; cy: number; rx: number; ry: number };

// Right foot, plantar view, toes up, in a 200 × 480 foot space.
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

/** Sensor dots in foot space with their static (standing) pressure 0–1. */
export const FOOT_DOTS: readonly { x: number; y: number; v: number }[] = (() => {
  const step = 12;
  const out: { x: number; y: number; v: number }[] = [];
  for (let y = 30; y <= 465; y += step) {
    for (let x = 22; x <= 182; x += step) {
      const ox = x + ((y / step) % 2 ? step / 2 : 0);
      if (inside(ox, y)) out.push({ x: ox, y, v: Math.pow(intensity(ox, y), 0.75) });
    }
  }
  return out;
})();

/** 6 levels: gray ramp → near-black; red only for absolute peaks. */
export const levelOf = (v: number) => (v >= 0.94 ? 5 : Math.min(4, Math.max(0, Math.floor(v * 5))));
export const radiusOf = (v: number) => 2.6 + v * 2.4;

/** Baked token values (mirrors --art-* in styles/tokens.css). */
export const palettes: Record<ArtTone, { color: string; alpha: number }[]> = {
  light: [
    { color: "#e4e4e4", alpha: 1 },
    { color: "#c9c9c9", alpha: 1 },
    { color: "#9c9c9c", alpha: 1 },
    { color: "#5e5e5e", alpha: 1 },
    { color: "#2b2b2b", alpha: 1 },
    { color: "#b3262d", alpha: 1 },
  ],
  dark: [
    { color: "#ffffff", alpha: 0.14 },
    { color: "#ffffff", alpha: 0.3 },
    { color: "#ffffff", alpha: 0.52 },
    { color: "#ffffff", alpha: 0.78 },
    { color: "#ffffff", alpha: 0.92 },
    { color: "#d2343b", alpha: 1 },
  ],
};

export type Placement = { mirror: boolean; horizontal: boolean; dx: number; dy: number; phase: number };

/** Each view: a viewBox [x, y, w, h] and the feet placed in it. */
export const views: Record<PressureView, { box: [number, number, number, number]; feet: Placement[] }> = {
  // single foot, toes up
  "foot-v": { box: [0, 0, 200, 480], feet: [{ mirror: false, horizontal: false, dx: 0, dy: 0, phase: 0 }] },
  // left + right foot, left slightly ahead (hero)
  "pair-v": {
    box: [0, -28, 424, 508],
    feet: [
      { mirror: true, horizontal: false, dx: 0, dy: -28, phase: 0.5 },
      { mirror: false, horizontal: false, dx: 224, dy: 0, phase: 0 },
    ],
  },
  // single foot lying on its side, toes pointing right (walking forward)
  "foot-h": { box: [0, 0, 480, 200], feet: [{ mirror: false, horizontal: true, dx: 0, dy: 0, phase: 0 }] },
  // close-up of the forefoot and toes (nail courses)
  "forefoot-h": { box: [236, 4, 236, 196], feet: [{ mirror: false, horizontal: true, dx: 0, dy: 0, phase: 0 }] },
  // a step: left foot above, right foot below and ahead
  "stride-h": {
    box: [0, 0, 600, 412],
    feet: [
      { mirror: true, horizontal: true, dx: 0, dy: 0, phase: 0.5 },
      { mirror: false, horizontal: true, dx: 120, dy: 212, phase: 0 },
    ],
  },
};

/** Foot space → view space. */
export function place(p: Placement, fx: number, fy: number): [number, number] {
  const x = p.mirror ? 200 - fx : fx;
  return p.horizontal ? [480 - fy + p.dx, x + p.dy] : [x + p.dx, fy + p.dy];
}

const r1 = (n: number) => Math.round(n * 10) / 10;

export function pressureSvg(view: PressureView, tone: ArtTone) {
  const { box, feet } = views[view];
  const [bx, by, bw, bh] = box;
  const buckets: string[][] = [[], [], [], [], [], []];
  for (const foot of feet) {
    for (const d of FOOT_DOTS) {
      const [x, y] = place(foot, d.x, d.y);
      const r = radiusOf(d.v);
      if (x + r < bx || x - r > bx + bw || y + r < by || y - r > by + bh) continue;
      buckets[levelOf(d.v)].push(`M${r1(x - r)} ${r1(y)}a${r1(r)} ${r1(r)} 0 1 0 ${r1(2 * r)} 0a${r1(r)} ${r1(r)} 0 1 0 ${r1(-2 * r)} 0`);
    }
  }
  const pal = palettes[tone];
  const paths = buckets
    .map((b, i) =>
      b.length
        ? `<path fill="${pal[i].color}"${pal[i].alpha < 1 ? ` fill-opacity="${pal[i].alpha}"` : ""} d="${b.join("")}"/>`
        : "",
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.join(" ")}">${paths}</svg>`;
}
