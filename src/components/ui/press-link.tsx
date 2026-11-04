"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * Link with an immediate, continuous press: pressed from the pointerdown
 * frame, and — when the tap navigates — it stays pressed (`data-pressed="nav"`)
 * until the page changes, so the shared-element morph starts from the pressed
 * card instead of the card springing back and then waiting for the route.
 * Pointer cancellation (a scroll starting) restores the surface.
 */
export function PressLink({ onPointerDown, onPointerUp, onPointerCancel, onPointerLeave, onClick, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      onPointerDown={(event) => {
        if (event.isPrimary && event.button === 0) event.currentTarget.dataset.pressed = "true";
        onPointerDown?.(event);
      }}
      onPointerUp={(event) => {
        if (event.currentTarget.dataset.pressed !== "nav") delete event.currentTarget.dataset.pressed;
        onPointerUp?.(event);
      }}
      onPointerCancel={(event) => {
        delete event.currentTarget.dataset.pressed;
        onPointerCancel?.(event);
      }}
      onPointerLeave={(event) => {
        if (event.currentTarget.dataset.pressed !== "nav") delete event.currentTarget.dataset.pressed;
        onPointerLeave?.(event);
      }}
      onClick={(event) => {
        onClick?.(event);
        const plain = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
        if (event.defaultPrevented || !plain) return;
        const el = event.currentTarget;
        el.dataset.pressed = "nav";
        // safety: same-page links or a failed navigation never stay pressed
        window.setTimeout(() => {
          if (el.isConnected && el.dataset.pressed === "nav") delete el.dataset.pressed;
        }, 1400);
      }}
    />
  );
}
