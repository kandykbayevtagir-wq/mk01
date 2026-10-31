import type { ImageAsset, Service, Specialist } from "./types";

/**
 * Podology centre. Services below are DRAFT categories — confirm each one
 * (and its legal status) before launch. Do not describe services as medical
 * unless the centre holds the corresponding licence.
 */
export const center = {
  // ЗАПОЛНИТЬ: название центра.
  name: "Центр подологии",
  intro:
    "Центр подологии — отдельное направление, где команда специалистов помогает клиентам с заботой о здоровье стоп. Здесь применяются те же стандарты аккуратности и безопасности, которым мы учим на курсах.",
  // ЗАПОЛНИТЬ (проверить): правовой статус услуг.
  disclaimer:
    "Подологические услуги не заменяют консультацию врача. При необходимости специалист порекомендует обратиться к профильному врачу.",
  // ЗАПОЛНИТЬ: фотографии центра (3:2 или 4:5).
  gallery: [] as ImageAsset[],
  // ЗАПОЛНИТЬ: лицензии / разрешения — только подтверждённые.
  licenses: [] as string[],
};

// ЗАПОЛНИТЬ (проверить): перечень и описания услуг, цены «от».
export const services: Service[] = [
  {
    id: "consultation",
    title: "Подологический осмотр и консультация",
    description: "Оценка состояния стоп и ногтей, рекомендации по уходу и дальнейшим шагам.",
    priceFrom: null,
  },
  {
    id: "ingrown",
    title: "Работа с вросшим ногтем",
    description: "Бережная обработка и, при показаниях, коррекция с помощью корректирующих систем.",
    priceFrom: null,
  },
  {
    id: "nails",
    title: "Обработка утолщённых ногтей",
    description: "Аккуратная аппаратная обработка изменённых ногтевых пластин.",
    priceFrom: null,
  },
  {
    id: "skin",
    title: "Обработка кожи стоп",
    description: "Работа с огрубевшей кожей, натоптышами и трещинами.",
    priceFrom: null,
  },
  {
    id: "insoles",
    title: "Подбор индивидуальных стелек",
    description: "Оценка нагрузки на стопу и подбор решения для повседневной носки.",
    priceFrom: null,
  },
];

// ЗАПОЛНИТЬ: специалисты центра (имя, роль, подтверждённые квалификации, фото).
export const specialists: Specialist[] = [];
