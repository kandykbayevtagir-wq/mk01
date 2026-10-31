import Image from "next/image";
import type { ImageAsset } from "@/data/types";
import { cn } from "@/lib/utils";
import { assetPath } from "@/lib/seo";
import { ContourArt } from "./contour-art";

const tones = {
  light: "bg-mist",
  dark: "bg-graphite",
  paper: "bg-paper",
} as const;

/**
 * Image slot. Renders an optimised next/image when an asset is provided,
 * otherwise a branded contour placeholder of the same size — so layouts
 * never shift when real photography is added.
 */
export function Visual({
  image,
  seed = 1,
  tone = "light",
  className,
  imgClassName,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
  marker,
  children,
}: {
  image: ImageAsset | null | undefined;
  seed?: number;
  tone?: keyof typeof tones;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  marker?: boolean;
  children?: React.ReactNode;
}) {
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
        <>
          {tone === "dark" && (
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_20%,rgba(255,255,255,0.10),transparent_60%)]"
            />
          )}
          <ContourArt
            seed={seed}
            tone={tone === "dark" ? "dark" : "light"}
            marker={marker}
            className={cn("absolute inset-0 h-full w-full", imgClassName)}
          />
        </>
      )}
      {children}
    </div>
  );
}
