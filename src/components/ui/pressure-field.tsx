"use client";

import { useEffect, useRef } from "react";
import { artSrc, pressureFile } from "@/lib/art/files";
import {
  FOOT_DOTS,
  inBox,
  levelOf,
  palettes,
  place,
  radiusOf,
  views,
  type ArtTone,
  type PressureView,
} from "@/lib/art/pressure";
import { cn } from "@/lib/utils";

/**
 * Signature visual: a living plantar-pressure map.
 *
 * The static SVG file renders first (no JS needed, cached, identical to the
 * canvas's resting frame). Once hydrated, ONE shared controller animates at
 * most ONE field — the one the reader is looking at — so two ambient
 * animations never compete in the same viewport:
 *  • a gait cycle: the load rolls heel → midfoot → forefoot → hallux, the
 *    red peak travelling with the centre of pressure; feet alternate;
 *  • a heel-strike wave propagating through the sensor grid;
 *  • dots swell and shift slightly away from the load (coordinated motion);
 *  • a touch anywhere on the host card sends a ripple from the finger.
 * Canvas only (no per-dot DOM; cached dot sprites), 25 fps (60 during a
 * ripple), paused offscreen and in background
 * tabs, off with prefers-reduced-motion and on low-capability devices.
 */

type Ripple = { x: number; y: number; t0: number };
type Field = {
  el: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  view: PressureView;
  tone: ArtTone;
  order: number;
  visible: boolean;
  target: number;
  energy: number;
  boostUntil: number;
  ripples: Ripple[];
  lastDraw: number;
  w: number;
  h: number;
  dpr: number;
  shown: boolean;
};

const PERIOD = 4.8; // s, one gait cycle
const STANCE = 0.64; // share of the cycle the foot is loaded
const FRAME_MS = 40; // 25 fps is plenty for the slow gait…
const RIPPLE_FRAME_MS = 16; // …while a touch ripple expands, full rate
// Centre-of-pressure path through a stance phase, foot space (u, x, y).
const COP: [number, number, number][] = [
  [0, 100, 428],
  [0.16, 100, 398],
  [0.45, 124, 292],
  [0.76, 103, 168],
  [1, 64, 74],
];

function cop(u: number): [number, number] {
  for (let i = 1; i < COP.length; i++) {
    if (u <= COP[i][0]) {
      const [u0, x0, y0] = COP[i - 1];
      const [u1, x1, y1] = COP[i];
      const k = (u - u0) / (u1 - u0);
      const e = k * k * (3 - 2 * k);
      return [x0 + (x1 - x0) * e, y0 + (y1 - y0) * e];
    }
  }
  return [COP[COP.length - 1][1], COP[COP.length - 1][2]];
}

const smooth = (a: number, b: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

/** Pre-rendered dots: one tiny bitmap per colour level and radius (¼ device px
 *  steps). Blitting these is far cheaper than building ~600 arc paths per frame. */
const sprites = new Map<number, HTMLCanvasElement>();
function sprite(tone: ArtTone, level: number, rDev: number) {
  const key = (tone === "dark" ? 100000 : 0) + level * 10000 + rDev * 4;
  let c = sprites.get(key);
  if (!c) {
    c = document.createElement("canvas");
    const size = Math.ceil(rDev * 2) + 2;
    c.width = c.height = size;
    const g = c.getContext("2d");
    if (g) {
      const { color, alpha } = palettes[tone][level];
      g.globalAlpha = alpha;
      g.fillStyle = color;
      g.beginPath();
      g.arc(size / 2, size / 2, rDev, 0, Math.PI * 2);
      g.fill();
    }
    sprites.set(key, c);
  }
  return c;
}

/** Per view, computed once: every visible dot as flat numbers (no per-frame
 *  allocation): view x/y, foot x/y, static pressure, heel distance, foot index. */
type Layout = { n: number; data: Float32Array; feet: number };
const layouts = new Map<PressureView, Layout>();
const STRIDE = 7;
function layout(view: PressureView): Layout {
  let l = layouts.get(view);
  if (l) return l;
  const { feet, box } = views[view];
  const rows: number[] = [];
  feet.forEach((foot, fi) => {
    for (const d of FOOT_DOTS) {
      const [x, y] = place(foot, d.x, d.y);
      if (!inBox(box, x, y, radiusOf(d.v))) continue;
      rows.push(x, y, d.x, d.y, d.v, Math.sqrt((d.x - 100) ** 2 + (d.y - 410) ** 2), fi);
    }
  });
  l = { n: rows.length / STRIDE, data: Float32Array.from(rows), feet: feet.length };
  layouts.set(view, l);
  return l;
}

const fields = new Set<Field>();
let order = 0;
let raf = 0;
let pickTimer = 0;
let lastPick = 0;
let io: IntersectionObserver | null = null;
let ro: ResizeObserver | null = null;
let listening = false;

function schedule() {
  if (!raf && !document.hidden) raf = requestAnimationFrame(frame);
}

function schedulePick() {
  if (pickTimer) return;
  pickTimer = window.setTimeout(() => {
    pickTimer = 0;
    pick(performance.now());
    schedule();
  }, 120);
}

/** The reader's focus: most of the field inside the central band, not covered. */
function pick(now: number) {
  lastPick = now;
  const vh = window.innerHeight;
  let best: Field | null = null;
  let bestScore = 0;
  for (const f of fields) {
    f.target = 0;
    if (!f.visible) continue;
    const r = f.el.getBoundingClientRect();
    if (r.height === 0) continue;
    const top = Math.max(r.top, vh * 0.08);
    const bottom = Math.min(r.bottom, vh * 0.86);
    let score = Math.max(0, bottom - top) / Math.min(r.height, vh * 0.78);
    // prefer the field nearest the reader's focal line (upper-middle)
    score -= (Math.abs((r.top + r.bottom) / 2 - vh * 0.42) / vh) * 0.5;
    if (score > 0.2) {
      // Stacked cards: ignore a field that another card is covering.
      const hit = document.elementFromPoint(r.left + r.width / 2, Math.max(1, Math.min(vh - 1, r.top + r.height / 2)));
      if (hit && !f.el.contains(hit) && !f.el.closest("[data-pressure-host]")?.contains(hit)) score = 0;
    }
    if (now < f.boostUntil) score += 2;
    score += f.order * 1e-5; // later (upper) layer wins an exact tie
    if (score > bestScore) {
      bestScore = score;
      best = f;
    }
  }
  if (best && bestScore > 0.2) best.target = 1;
}

function resize(f: Field) {
  const r = f.el.getBoundingClientRect();
  f.dpr = Math.min(window.devicePixelRatio || 1, 2);
  f.w = Math.max(1, Math.round(r.width));
  f.h = Math.max(1, Math.round(r.height));
  f.canvas.width = Math.round(f.w * f.dpr);
  f.canvas.height = Math.round(f.h * f.dpr);
}

function viewTransform(f: Field) {
  const [bx, by, bw, bh] = views[f.view].box;
  const s = Math.min(f.w / bw, f.h / bh);
  return { s, ox: (f.w - bw * s) / 2 - bx * s, oy: (f.h - bh * s) / 2 - by * s };
}

function draw(f: Field, now: number) {
  const ctx = f.ctx;
  if (!ctx) return;
  if (!f.canvas.width) resize(f);
  const { s, ox, oy } = viewTransform(f);
  const t = now / 1000;
  const E = f.energy;
  const k = f.dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, f.canvas.width, f.canvas.height);
  const { feet } = views[f.view];
  const horizontal = feet[0].horizontal;
  f.ripples = f.ripples.filter((r) => now - r.t0 < 1300);

  const L = layout(f.view);
  const D = L.data;
  // per-foot gait state
  const st: number[] = [];
  for (const foot of feet) {
    const phase = (t / PERIOD + foot.phase) % 1;
    const stance = phase < STANCE;
    const u = stance ? phase / STANCE : 1;
    const load = stance ? smooth(0, 0.1, u) * (1 - smooth(0.88, 1, u)) : 0;
    const [cx, cy] = cop(u);
    const age = phase * PERIOD; // seconds since heel strike
    st.push(load, cx, cy, age * 190, stance ? 0.5 * Math.pow(Math.max(0, 1 - age / 1.5), 2) : 0, foot.mirror ? 1 : 0);
  }
  const rip = f.ripples.map((r) => {
    const ra = (now - r.t0) / 1000;
    return [r.x, r.y, ra * 330, 0.85 * Math.pow(1 - ra / 1.3, 2)];
  });
  const inv = 1 / (2 * 34 * 34);
  const invW = 1 / (2 * 15 * 15);
  const invR = 1 / (2 * 18 * 18);
  for (let i = 0; i < L.n; i++) {
    const o = i * STRIDE;
    const fi = D[o + 6] * 6;
    const load = st[fi];
    const dx = D[o + 2] - st[fi + 1];
    const dy = D[o + 3] - st[fi + 2];
    const dist2 = dx * dx + dy * dy;
    const dyn = load > 0 ? load * Math.exp(-dist2 * inv) : 0;
    const waveA = st[fi + 4];
    const hd = D[o + 5] - st[fi + 3];
    const wave = waveA > 0 ? waveA * Math.exp(-hd * hd * invW) : 0;
    let v = D[o + 4] * (1 - 0.4 * E) + E * (0.9 * dyn + wave);
    let x = D[o];
    let y = D[o + 1];
    // coordinated micro-motion: dots yield slightly away from the load
    // (foot-space direction mapped into the view: mirror flips x; horizontal views swap axes)
    if (dyn > 0.01) {
      const push = (E * dyn * 2.2) / (Math.sqrt(dist2) || 1);
      const px = (st[fi + 5] ? -dx : dx) * push;
      const py = dy * push;
      if (horizontal) {
        x -= py;
        y += px;
      } else {
        x += px;
        y += py;
      }
    }
    for (let j = 0; j < rip.length; j++) {
      const r = rip[j];
      const qx = x - r[0];
      const qy = y - r[1];
      const len = Math.sqrt(qx * qx + qy * qy) || 1;
      const rd = len - r[2];
      const kk = r[3] * Math.exp(-rd * rd * invR);
      v += kk;
      if (kk > 0.02) {
        x += (qx / len) * kk * 3;
        y += (qy / len) * kk * 3;
      }
    }
    v = v < 0 ? 0 : v > 1 ? 1 : v;
    const rDev = Math.round(radiusOf(v) * s * (1 + 0.1 * E * dyn) * k * 4) / 4;
    const img = sprite(f.tone, levelOf(v), rDev);
    const half = img.width / 2;
    ctx.drawImage(img, (x * s + ox) * k - half, (y * s + oy) * k - half);
  }
  f.lastDraw = now;
  if (!f.shown) {
    f.shown = true;
    f.el.dataset.live = "true";
  }
}

let prev = 0;
function frame(now: number) {
  raf = 0;
  if (document.hidden) return;
  const dt = prev ? Math.min(0.1, (now - prev) / 1000) : 0.016;
  prev = now;
  if (now - lastPick > 400) pick(now);
  let again = false;
  for (const f of fields) {
    if (!f.visible) {
      f.energy = 0;
      continue;
    }
    const goal = f.target;
    const before = f.energy;
    // arrive gently (~1 s), hand over quickly (~0.5 s) so two never compete
    f.energy += (goal - f.energy) * Math.min(1, dt * (goal > f.energy ? 2.6 : 6));
    if (Math.abs(goal - f.energy) < 0.005) f.energy = goal;
    const busy = f.energy > 0 || f.ripples.length > 0;
    if (!busy) {
      // settle on the exact resting frame (identical to the static file)
      if (before > 0 && f.shown) draw(f, now);
      continue;
    }
    again = true;
    if (now - f.lastDraw >= (f.ripples.length ? RIPPLE_FRAME_MS : FRAME_MS) - 2) draw(f, now);
  }
  if (again) raf = requestAnimationFrame(frame);
  else prev = 0;
}

function onVisibility() {
  prev = 0;
  if (!document.hidden) schedulePick();
}

function ensureObservers() {
  if (listening) return;
  listening = true;
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        for (const f of fields) if (f.el === e.target) f.visible = e.isIntersecting;
      }
      schedulePick();
    },
    { rootMargin: "60px 0px" },
  );
  ro = new ResizeObserver((entries) => {
    for (const e of entries) {
      for (const f of fields) {
        if (f.el !== e.target) continue;
        resize(f);
        if (f.shown) draw(f, performance.now());
      }
    }
  });
  window.addEventListener("scroll", schedulePick, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
}

function canAnimate() {
  return (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !document.documentElement.classList.contains("motion-lite") &&
    typeof IntersectionObserver !== "undefined" &&
    typeof ResizeObserver !== "undefined"
  );
}

export function PressureField({
  view,
  tone = "dark",
  className,
  eager = false,
}: {
  view: PressureView;
  tone?: ArtTone;
  className?: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current;
    const canvas = canvasRef.current;
    if (!el || !canvas || !canAnimate()) return;
    ensureObservers();
    const f: Field = {
      el,
      canvas,
      ctx: canvas.getContext("2d"),
      view,
      tone,
      order: order++,
      visible: false,
      target: 0,
      energy: 0,
      boostUntil: 0,
      ripples: [],
      lastDraw: 0,
      w: 0,
      h: 0,
      dpr: 1,
      shown: false,
    };
    fields.add(f);
    io!.observe(el);
    ro!.observe(el);

    // Touch / click anywhere on the host card sends a ripple from the finger.
    const host = (el.closest("[data-pressure-host]") as HTMLElement | null) ?? el;
    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary || !f.ctx) return;
      if (!f.w) resize(f);
      const r = el.getBoundingClientRect();
      const lx = Math.min(r.width, Math.max(0, e.clientX - r.left));
      const ly = Math.min(r.height, Math.max(0, e.clientY - r.top));
      const { s, ox, oy } = viewTransform(f);
      f.ripples.push({ x: (lx - ox) / s, y: (ly - oy) / s, t0: performance.now() });
      if (f.ripples.length > 3) f.ripples.shift();
      f.boostUntil = performance.now() + 4000;
      pick(performance.now());
      schedule();
    };
    host.addEventListener("pointerdown", onDown, { passive: true });

    return () => {
      host.removeEventListener("pointerdown", onDown);
      io?.unobserve(el);
      ro?.unobserve(el);
      fields.delete(f);
    };
  }, [view, tone]);

  return (
    <div ref={ref} aria-hidden className={cn("pressure-field relative", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static generated SVG, identical to the resting frame */}
      <img
        src={artSrc(pressureFile(view, tone))}
        alt=""
        draggable={false}
        decoding="async"
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        className="pressure-field__still pointer-events-none absolute inset-0 h-full w-full select-none"
      />
      <canvas ref={canvasRef} className="pressure-field__live pointer-events-none absolute inset-0 h-full w-full" />
    </div>
  );
}
