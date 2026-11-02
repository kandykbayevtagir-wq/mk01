import type { ImageAsset } from "./types";

/**
 * Founder profile. Do not add credentials, numbers or achievements that
 * cannot be confirmed with documents — empty lists are simply hidden.
 */
export const founder = {
  // ЗАПОЛНИТЬ: имя и фамилия основателя.
  name: null as string | null,
  role: "Подолог, преподаватель, основатель центра подологии",
  // ЗАПОЛНИТЬ: опыт в годах (число). null — блок не показывается.
  yearsOfExperience: null as number | null,
  // ЗАПОЛНИТЬ: портрет 4:5, не менее 1200×1500 px. Положите файл в /public/images/founder/.
  portrait: null as ImageAsset | null,

  // ЗАПОЛНИТЬ (проверить): краткое вступление. Две части, чтобы главная и /about
  // не повторяли друг друга: `summary` — на главной, `intro` — на /about.
  summary:
    "Обучение построено так же, как работа в кабинете подолога: через понимание причин, аккуратную технику и ответственность перед клиентом.",
  intro: "Каждая программа опирается на практические задачи, с которыми специалист сталкивается ежедневно.",

  // ЗАПОЛНИТЬ (проверить): профессиональная философия.
  philosophy: [
    "Подология — это прежде всего внимание к деталям и понимание границ своей компетенции.",
    "Сильная практика начинается с системных знаний: от анатомии стопы до выбора техники и инструмента.",
    "Обучение должно давать навыки, которые специалист применяет уже на следующий рабочий день.",
  ],

  // ЗАПОЛНИТЬ: направления специализации, например «Коррекция вросшего ногтя».
  specializations: [] as string[],

  // ЗАПОЛНИТЬ: опыт преподавания — где и чему обучает.
  teaching: null as string | null,

  // ЗАПОЛНИТЬ: подтверждённые профессиональные достижения.
  achievements: [] as string[],

  // ЗАПОЛНИТЬ: дипломы, сертификаты, повышения квалификации (название, организация, год).
  qualifications: [] as { title: string; issuer: string | null; year: number | null }[],

  // ЗАПОЛНИТЬ: сканы/фото сертификатов для галереи.
  certificateImages: [] as ImageAsset[],
};

/** First name only until the full name is supplied (the site already says «О Марине»). */
export function founderDisplayName() {
  return founder.name ?? "Марина";
}

export function founderInitials() {
  if (!founder.name) return null;
  return founder.name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}
