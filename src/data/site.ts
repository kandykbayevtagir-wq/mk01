import type { BusinessLocation, Contacts, PaymentMethod, UnmappedMapRecord } from "./types";

/**
 * Global brand & contact configuration.
 *
 * Search the project for «ЗАПОЛНИТЬ» (npm run content:todo) to find every
 * value that still needs real business information.
 */
export const site = {
  /** Verified business name. */
  name: "Podology MK",
  shortName: "Podology MK",
  tagline: "Профессиональное обучение подологии",
  description:
    "Авторские курсы подологии для начинающих и практикующих специалистов, центр подологии и профессиональная продукция.",
  /** Country used in copy & structured data. */
  country: "Казахстан",
  /** Absolute production URL — set NEXT_PUBLIC_SITE_URL in the environment. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
} as const;

/* ------------------------------------------------------------------ */
/*  Verified contact channels — single source of truth for every link  */
/* ------------------------------------------------------------------ */

/** Main number (calls + WhatsApp), Aktobe. Verified by the owner. */
const PHONE_E164 = "+77780569356";
const PHONE_DISPLAY = "+7 778 056 9356";
const TELEGRAM = "marina_kandykbayeva";
const INSTAGRAM = "marina_kandykbayeva";

export const channels = {
  phone: {
    name: "Телефон",
    value: PHONE_DISPLAY,
    label: "Позвонить",
    url: `tel:${PHONE_E164}`,
  },
  whatsapp: {
    name: "WhatsApp",
    value: PHONE_DISPLAY,
    label: "Написать в WhatsApp",
    url: `https://wa.me/${PHONE_E164.slice(1)}`,
  },
  telegram: {
    name: "Telegram",
    value: `@${TELEGRAM}`,
    label: "Написать в Telegram",
    url: `https://t.me/${TELEGRAM}`,
  },
  instagram: {
    name: "Instagram",
    value: `@${INSTAGRAM}`,
    label: "Наш Instagram",
    // Canonical profile URL (tracking parameters removed).
    url: `https://www.instagram.com/${INSTAGRAM}/`,
  },
} as const;

/** WhatsApp chat link with an optional, safely encoded pre-filled message. */
export function whatsappLink(message?: string) {
  const text = message?.trim();
  return text ? `${channels.whatsapp.url}?text=${encodeURIComponent(text.slice(0, 500))}` : channels.whatsapp.url;
}

/** Social profiles for structured data (`sameAs`). */
export const socialProfiles = [channels.instagram.url, channels.telegram.url];

/**
 * Legacy flat contact record (kept for existing components / forms).
 * `null` hides the corresponding element.
 */
export const contacts: Contacts = {
  phone: PHONE_DISPLAY,
  whatsapp: PHONE_E164,
  telegram: TELEGRAM,
  instagram: INSTAGRAM,
  // ЗАПОЛНИТЬ: e-mail — не указан владельцем, не выдумывать.
  email: null,
  // Адреса — по филиалам, см. `locations` ниже.
  address: null,
  city: "Актобе",
  // ЗАПОЛНИТЬ: часы работы — только подтверждённые.
  hours: null,
  mapUrl: null,
};

/* ------------------------------------------------------------------ */
/*  Locations — two branches in Aktobe                                  */
/* ------------------------------------------------------------------ */

/**
 * Addresses are corroborated by two independent sources:
 *  • PodiaFarm partner directory — https://podiafarm.pro/archons/aktobe
 *  • Yandex Maps (Moldagulova branch) —
 *    https://yandex.kz/maps/ru/org/podology_mk/218261749751/
 * Hours and branch phones are not published in those sources → null.
 */
export const locations: BusinessLocation[] = [
  {
    id: "batys-2",
    label: "Батыс-2",
    name: "Podology MK",
    city: "Актобе",
    address: "проспект Алии Молдагуловой, 54А",
    detail: "1 этаж",
    hours: null,
    phone: null,
    // Yandex Maps listing for the Moldagulova location (owner-supplied source).
    mapUrl: "https://yandex.kz/maps/ru/org/podology_mk/218261749751/",
    mapLabel: "Открыть на Яндекс Картах",
  },
  {
    id: "akatsiya",
    label: "Район Акации",
    name: "Podology MK",
    city: "Актобе",
    address: "улица Кобланды, 12",
    detail: "Район Акации, вход со сквера Финансистов",
    hours: null,
    phone: null,
    // ЗАПОЛНИТЬ: ссылка на карту этого филиала (2ГИС), когда соответствие подтверждено.
    mapUrl: null,
    mapLabel: null,
  },
];

/**
 * Official 2GIS records of Podology MK in Aktobe.
 * ⚠️ UNRESOLVED: which record belongs to which address is NOT verified
 * (2gis.kz could not be opened). Do not attach either URL to a branch until
 * confirmed — then move it into `locations[i].mapUrl`.
 */
export const unmappedTwoGisRecords: UnmappedMapRecord[] = [
  { id: "2gis-1", url: "https://2gis.kz/aktobe/geo/70000001049714001" },
  { id: "2gis-2", url: "https://2gis.kz/aktobe/geo/70000001089583894" },
];

export function formatAddress(l: Pick<BusinessLocation, "city" | "address">) {
  return `${l.city}, ${l.address}`;
}

/* ------------------------------------------------------------------ */
/*  Accepted payment methods (offline/at the venue — no online checkout) */
/* ------------------------------------------------------------------ */

export const paymentMethods: PaymentMethod[] = [
  { id: "kaspi", name: "Kaspi", note: "Kaspi.kz" },
  { id: "halyk", name: "Halyk", note: "Halyk Bank" },
  { id: "applepay", name: "Apple Pay", note: "Бесконтактная оплата" },
  { id: "googlepay", name: "Google Pay", note: "Бесконтактная оплата" },
  { id: "cash", name: "Наличные", note: "Оплата наличными" },
];

export const legal = {
  // ЗАПОЛНИТЬ: юридическое наименование (ИП / ТОО) и БИН/ИИН для политики конфиденциальности.
  entity: null as string | null,
  bin: null as string | null,
};

/** Primary navigation — the two customer journeys plus trust and contact. */
export const navigation = [
  { href: "/courses", key: "courses" },
  { href: "/center", key: "center" },
  { href: "/about", key: "about" },
  { href: "/contacts", key: "contacts" },
] as const;

/** Secondary pages: kept out of the header, surfaced contextually and in the footer. */
export const secondaryNavigation = [
  { href: "/products", key: "products" },
  { href: "/partners", key: "partners" },
  { href: "/reviews", key: "reviews" },
] as const;

export function hasAnyContact() {
  return Boolean(
    contacts.phone || contacts.whatsapp || contacts.telegram || contacts.instagram || contacts.email,
  );
}
