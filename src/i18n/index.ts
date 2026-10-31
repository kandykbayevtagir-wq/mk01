import { defaultLocale, type Locale } from "./config";
import { ru, type Dictionary } from "./ru";

const dictionaries: Record<Locale, Dictionary> = { ru };

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale];
}

/** Default dictionary — convenient for components while the site is single-locale. */
export const t = dictionaries[defaultLocale];

export * from "./config";
