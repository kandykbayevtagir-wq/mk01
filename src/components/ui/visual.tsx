import Image from "next/image";
import type { ImageAsset } from "@/data/types";
import { cn } from "@/lib/utils";
import { assetPath } from "@/lib/seo";
import { ContourArt } from "./contour-art";
import { ArchLines, Insole, PressureFeet, PressureFoot } from "./podo-art";

const tones = {
  light: "bg-mist",
  sand: "bg-sand",
  dark: "bg-graphite",
  paper: "bg-paper",
  clay: "bg-clay-soft",
} as const;

export type Art = "pressure" | "feet" | "insole" | "contour";
const artCycle: Art[] = ["pressure", "insole", "contour", "feet"];

/**
 * Image slot. Renders an optimised next/image when an asset is provided,
 * otherwise a podology-themed illustration (pressure map, insole, contour)
 * of exactly the same size — so layouts never shift when real photography
 * is added.
 */
export function Visual({
  image,
  seed = 1,
  tone = "light",
  art,
  className,
  imgClassName,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
  marker,
  live = false,
  children,
}: {
  image: ImageAsset | null | undefined;
  seed?: number;
  tone?: keyof typeof tones;
  art?: Art;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  marker?: boolean;
  /** Animated pressure peak (hero only; paused offscreen by MotionRegion). */
  live?: boolean;
  children?: React.ReactNode;
}) {
  const kind = art ?? artCycle[seed % artCycle.length];
  const dark = tone === "dark";
  const artTone = dark ? "dark" : "light";

  return (
    <div className={cn("relative isolate overflow-hidden", tones[tone], className)}>
      {image ? (
        <Image
          src={assetPath(image.src)}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imgClassName)}
        />
      ) : (
        <div aria-hidden className={cn("absolute inset-0", imgClassName)}>
          {/* warm light + sensor-plate texture */}
          <div
            className={cn(
              "absolute inset-0",
              dark
                ? "bg-[radial-gradient(110%_80%_at_75%_10%,rgb(255_255_255/0.10),transparent_55%),radial-gradient(80%_60%_at_20%_100%,var(--glow-red),transparent_70%)]"
                : "bg-[radial-gradient(90%_70%_at_80%_10%,rgba(255,255,255,0.75),transparent_60%)]",
            )}
          />
          <div className={cn("absolute inset-0 fade-edges", dark ? "pattern-dots-dark" : "pattern-dots")} />
          {/* large soft disc */}
          <div
            className={cn(
              "absolute left-1/2 top-1/2 aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full",
              dark ? "bg-white/[0.04] ring-1 ring-white/10" : "bg-paper/70 ring-1 ring-line",
            )}
          />

          {kind === "pressure" && (
            <PressureFoot
              tone={artTone}
              breathe={live}
              mirror={seed % 2 === 0}
              className="absolute left-1/2 top-1/2 h-[82%] w-auto -translate-x-1/2 -translate-y-1/2"
            />
          )}
          {kind === "feet" && (
            <PressureFeet tone={artTone} breathe={live} className="absolute left-1/2 top-[43%] h-[64%] -translate-x-1/2 -translate-y-1/2" />
          )}
          {kind === "insole" && (
            <>
              <ArchLines tone={artTone} className="absolute inset-x-0 bottom-0 h-[45%] w-full" />
              <Insole
                tone={artTone}
                className={cn(
                  "absolute left-1/2 top-1/2 h-[80%] w-auto -translate-x-1/2 -translate-y-1/2",
                  seed % 2 ? "rotate-[14deg]" : "-rotate-[14deg]",
                )}
              />
            </>
          )}
          {kind === "contour" && (
            <ContourArt seed={seed} tone={artTone} marker={marker ?? true} className="absolute inset-0 h-full w-full" />
          )}
        </div>
      )}
      {children}
    </div>
  );
}
