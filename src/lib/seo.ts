import type { Metadata } from "next";
import { site } from "@/data/site";
import { defaultLocale, localeMeta, locales } from "@/i18n/config";

const trailingSlash = process.env.NEXT_PUBLIC_TRAILING_SLASH === "true";

/** Absolute URL for a site path (site.url already includes any base path). */
export function absoluteUrl(path = "/") {
  if (path === "/") return trailingSlash ? `${site.url}/` : site.url;
  const isFile = /\.[a-z0-9]+$/i.test(path);
  return `${site.url}${path}${trailingSlash && !isFile && !path.endsWith("/") ? "/" : ""}`;
}

/** Prefixes local asset paths (e.g. "/images/x.jpg") with the deploy base path. */
export function assetPath(src: string) {
  return src.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}` : src;
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
      ...(image ? { images: [{ url: image.startsWith("http") ? image : absoluteUrl(image) }] } : {}),
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
