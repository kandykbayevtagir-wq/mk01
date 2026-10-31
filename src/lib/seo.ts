import type { Metadata } from "next";
import { site } from "@/data/site";
import { defaultLocale, localeMeta, locales } from "@/i18n/config";

export function absoluteUrl(path = "/") {
  return `${site.url}${path === "/" ? "" : path}`;
}

/**
 * Builds consistent per-page metadata: title, description, canonical URL,
 * hreflang alternates and Open Graph / Twitter cards.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  noIndex,
}: {
  title?: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title ? `${title} — ${site.name}` : `${site.tagline} — ${site.name}`;
  return {
    title: title ?? { absolute: fullTitle },
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(locales.map((l) => [localeMeta[l].htmlLang, url])),
    },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: fullTitle,
      description,
      locale: localeMeta[defaultLocale].ogLocale,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: fullTitle,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Serialises JSON-LD safely for a <script> tag. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
