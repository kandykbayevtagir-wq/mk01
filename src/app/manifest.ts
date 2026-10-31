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
    icons: [{ src: assetPath("/icon.svg"), sizes: "any", type: "image/svg+xml" }],
  };
}
