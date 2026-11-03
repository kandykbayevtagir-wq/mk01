import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { assetPath } from "@/lib/seo";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: assetPath("/"),
    display: "browser",
    background_color: "#fbf7f1",
    theme_color: "#fbf7f1",
    lang: "ru",
    icons: [
      { src: assetPath("/icons/icon-192.png"), sizes: "192x192", type: "image/png", purpose: "any" },
      { src: assetPath("/icons/icon-512.png"), sizes: "512x512", type: "image/png", purpose: "any" },
      { src: assetPath("/icons/icon-maskable-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
