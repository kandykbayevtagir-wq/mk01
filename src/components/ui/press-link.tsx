"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

/** Immediate touch feedback, including browsers that defer :active until release.
 * Pointer cancellation restores the surface when native touch scrolling begins.
 */
export function PressLink({ onPointerDown, onPointerUp, onPointerCancel, onPointerLeave, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      onPointerDown={(event) => {
        if (event.isPrimary && event.button === 0) event.currentTarget.dataset.pressed = "true";
        onPointerDown?.(event);
      }}
      onPointerUp={(event) => {
        delete event.currentTarget.dataset.pressed;
        onPointerUp?.(event);
      }}
      onPointerCancel={(event) => {
        delete event.currentTarget.dataset.pressed;
        onPointerCancel?.(event);
      }}
      onPointerLeave={(event) => {
        delete event.currentTarget.dataset.pressed;
        onPointerLeave?.(event);
      }}
    />
  );
}
