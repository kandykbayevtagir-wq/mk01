import { assetPath } from "@/lib/seo";
import { CONTOUR_VARIANTS, contourSvg } from "./contour";
import { pressureSvg, views, type ArtTone, type PressureView } from "./pressure";

const tones: ArtTone[] = ["light", "dark"];

export const pressureFile = (view: PressureView, tone: ArtTone) => `pressure-${view}-${tone}.svg`;
export const contourFile = (seed: number, tone: ArtTone, marker: boolean) =>
  `contour-${Math.abs(seed) % CONTOUR_VARIANTS}-${tone}${marker ? "-m" : ""}.svg`;

/** Every generated art file (used for static generation). */
export function artFiles() {
  const out: string[] = [];
  for (const tone of tones) {
    for (const view of Object.keys(views) as PressureView[]) out.push(pressureFile(view, tone));
    for (let v = 0; v < CONTOUR_VARIANTS; v++) out.push(contourFile(v, tone, false), contourFile(v, tone, true));
  }
  return out;
}

export function renderArtFile(file: string): string | null {
  let m = /^pressure-([a-z-]+)-(light|dark)\.svg$/.exec(file);
  if (m && m[1] in views) return pressureSvg(m[1] as PressureView, m[2] as ArtTone);
  m = /^contour-(\d+)-(light|dark)(-m)?\.svg$/.exec(file);
  if (m && +m[1] < CONTOUR_VARIANTS) return contourSvg(+m[1], m[2] as ArtTone, !!m[3]);
  return null;
}

/** Public URL of an art file (base-path aware for GitHub Pages). */
export const artSrc = (file: string) => assetPath(`/art/${file}`);
