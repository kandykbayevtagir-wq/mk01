import type { Contacts } from "./types";

/**
 * Global brand & contact configuration.
 *
 * Search the project for «ЗАПОЛНИТЬ» (npm run content:todo) to find every
 * value that still needs real business information.
 */
export const site = {
  // ЗАПОЛНИТЬ: финальное название бренда / школы.
  name: "Школа подологии",
  // ЗАПОЛНИТЬ: короткое название для вкладки браузера и PWA.
  shortName: "Школа подологии",
  tagline: "Профессиональное обучение подологии",
  description:
    "Авторские курсы подологии для начинающих и практикующих специалистов, центр подологии и профессиональная продукция.",
  /** Country used in copy & structured data. */
  country: "Казахстан",
  /** Absolute production URL — set NEXT_PUBLIC_SITE_URL in the environment. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
} as const;

/**
 * Contact details. `null` hides the corresponding link everywhere.
 * Phone numbers: international format, e.g. "+7 700 000 00 00".
 */
export const contacts: Contacts = {
  // ЗАПОЛНИТЬ: телефон для звонков.
  phone: null,
  // ЗАПОЛНИТЬ: номер WhatsApp (можно тот же, что и телефон).
  whatsapp: null,
  // ЗАПОЛНИТЬ: имя пользователя Telegram без @.
  telegram: null,
  // ЗАПОЛНИТЬ: имя аккаунта Instagram без @.
  instagram: null,
  // ЗАПОЛНИТЬ: e-mail для связи.
  email: null,
  // ЗАПОЛНИТЬ: адрес центра / учебного класса.
  address: null,
  // ЗАПОЛНИТЬ: город.
  city: null,
  // ЗАПОЛНИТЬ: часы работы, например «Пн–Сб, 10:00–19:00».
  hours: null,
  // ЗАПОЛНИТЬ: ссылка на 2ГИС / Google Maps.
  mapUrl: null,
};

export const legal = {
  // ЗАПОЛНИТЬ: юридическое наименование (ИП / ТОО) и БИН/ИИН для политики конфиденциальности.
  entity: null as string | null,
  bin: null as string | null,
};

export const navigation = [
  { href: "/courses", key: "courses" },
  { href: "/about", key: "about" },
  { href: "/center", key: "center" },
  { href: "/products", key: "products" },
  { href: "/reviews", key: "reviews" },
  { href: "/partners", key: "partners" },
  { href: "/contacts", key: "contacts" },
] as const;

export function hasAnyContact() {
  return Boolean(
    contacts.phone || contacts.whatsapp || contacts.telegram || contacts.instagram || contacts.email,
  );
}
