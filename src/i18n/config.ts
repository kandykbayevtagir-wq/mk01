/**
 * Localisation foundation.
 *
 * The site currently ships in Russian only. Kazakh («kk») is planned:
 *   1. add "kk" to `locales`;
 *   2. create `src/i18n/kk.ts` mirroring `ru.ts` (the `Dictionary` type
 *      will flag every missing key);
 *   3. move routes under `src/app/[lang]/` and pass `lang` to
 *      `getDictionary()` and the content getters in `src/data`;
 *   4. `alternates.languages` in `src/lib/seo.ts` already derives hreflang
 *      tags from this list.
 */
export const locales = ["ru"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

export const localeMeta: Record<Locale, { htmlLang: string; ogLocale: string; label: string }> = {
  ru: { htmlLang: "ru", ogLocale: "ru_KZ", label: "Русский" },
};
