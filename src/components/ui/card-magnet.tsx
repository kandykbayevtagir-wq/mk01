"use client";

import { useEffect } from "react";

/**
 * Reactive light for course cards — one delegated listener set, no React state.
 *
 * Fine pointer (desktop): while the pointer is over a card, `--mx/--my`
 * (−1…1) and `--lx/--ly` (px) are written once per animation frame; CSS
 * turns them into a few pixels of magnetic drift, a light that follows the
 * pointer, and a slight counter-move of the plate art. Leaving restores.
 *
 * Touch: on press the light flashes at the finger and fades on release —
 * the card's own press compression and the plate's pressure ripple stay as
 * they are, and navigation never waits for it.
 */
export function CardMagnet() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let card: HTMLElement | null = null;
    let x = 0;
    let y = 0;
    let frame = 0;

    const clear = (el: HTMLElement | null) => {
      if (!el) return;
      delete el.dataset.magnet;
      for (const v of ["--mx", "--my"]) el.style.removeProperty(v);
    };
    const paint = () => {
      frame = 0;
      if (!card) return;
      const r = card.getBoundingClientRect();
      const lx = x - r.left;
      const ly = y - r.top;
      card.style.setProperty("--lx", `${lx.toFixed(1)}px`);
      card.style.setProperty("--ly", `${ly.toFixed(1)}px`);
      card.style.setProperty("--mx", ((lx / r.width) * 2 - 1).toFixed(3));
      card.style.setProperty("--my", ((ly / r.height) * 2 - 1).toFixed(3));
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !fine.matches || reduce.matches) return;
      const next = (e.target as Element | null)?.closest<HTMLElement>(".course-card") ?? null;
      if (next !== card) {
        clear(card);
        card = next;
        if (card) card.dataset.magnet = "";
      }
      if (!card) return;
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onLeaveDoc = () => {
      clear(card);
      card = null;
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || reduce.matches) return;
      const el = (e.target as Element | null)?.closest<HTMLElement>(".course-card");
      if (!el) return;
      // measure in the next frame (shares that frame's layout) — never force
      // a synchronous layout inside the pointerdown that starts the press
      const { clientX, clientY } = e;
      requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--lx", `${(clientX - r.left).toFixed(1)}px`);
        el.style.setProperty("--ly", `${(clientY - r.top).toFixed(1)}px`);
        el.dataset.lit = "";
      });
      const off = () => {
        delete el.dataset.lit;
        window.removeEventListener("pointerup", off, true);
        window.removeEventListener("pointercancel", off, true);
      };
      window.addEventListener("pointerup", off, true);
      window.addEventListener("pointercancel", off, true);
    };

    const opts = { passive: true } as const;
    document.addEventListener("pointermove", onMove, opts);
    document.addEventListener("pointerleave", onLeaveDoc, opts);
    document.addEventListener("pointerdown", onDown, { passive: true, capture: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeaveDoc);
      document.removeEventListener("pointerdown", onDown, { capture: true });
    };
  }, []);
  return null;
}
