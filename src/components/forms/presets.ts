import type { FieldDef } from "./lead-form";
import { getCourses, upcomingSessions } from "@/data/courses";
import { services } from "@/data/center";
import { productCategories } from "@/data/products";
import type { Course } from "@/data/types";
import { t } from "@/i18n";
import { formatDateRange } from "@/lib/utils";

const f = t.form;

export const nameField: FieldDef = {
  name: "name",
  label: f.name,
  kind: "text",
  required: true,
  autoComplete: "name",
  placeholder: f.namePlaceholder,
};

export const phoneField: FieldDef = {
  name: "phone",
  label: f.phone,
  kind: "tel",
  required: true,
  autoComplete: "tel",
  placeholder: f.phonePlaceholder,
};

const messageField: FieldDef = {
  name: "message",
  label: f.messageOptional,
  kind: "textarea",
  placeholder: "Вопросы, пожелания, удобное время для звонка",
};

/** Enrolment form. With `course`, the course is preselected and dates are offered. */
export function courseEnrollFields(course?: Course): FieldDef[] {
  const all = getCourses();
  const fields: FieldDef[] = [
    nameField,
    phoneField,
    {
      name: "course",
      label: f.course,
      kind: "select",
      required: true,
      wide: true,
      defaultValue: course?.title ?? "",
      options: [
        ...(course ? [] : [{ value: "", label: "Выберите программу" }]),
        ...all.map((c) => ({ value: c.title, label: c.title })),
        { value: "Нужна консультация по выбору", label: "Нужна консультация по выбору" },
      ],
    },
  ];

  const sessions = course ? upcomingSessions(course) : [];
  if (sessions.length > 0) {
    fields.push({
      name: "preferredDate",
      label: f.preferredDate,
      kind: "select",
      wide: true,
      options: [
        ...sessions.map((s) => {
          const label = `${formatDateRange(s.start, s.end)} · ${s.city}`;
          return { value: label, label };
        }),
        { value: f.preferredDateAny, label: f.preferredDateAny },
      ],
    });
  } else {
    fields.push({
      name: "city",
      label: "Город, в котором удобно обучаться",
      kind: "text",
      autoComplete: "address-level2",
      wide: true,
      placeholder: "Например, Алматы",
    });
  }

  fields.push(messageField);
  return fields;
}

export const partnerFields: FieldDef[] = [
  nameField,
  {
    name: "city",
    label: f.city,
    kind: "text",
    required: true,
    autoComplete: "address-level2",
    placeholder: "Город проведения обучения",
  },
  phoneField,
  {
    name: "email",
    label: f.emailOptional,
    kind: "email",
    autoComplete: "email",
    placeholder: "name@example.com",
  },
  {
    name: "background",
    label: "Организация или профессиональный опыт",
    kind: "text",
    required: true,
    wide: true,
    placeholder: "Например: кабинет подологии, учебный центр, мастер педикюра",
  },
  {
    name: "groupSize",
    label: "Ожидаемый размер группы",
    kind: "select",
    wide: true,
    options: [
      { value: "Пока не знаю", label: "Пока не знаю" },
      { value: "до 6 человек", label: "до 6 человек" },
      { value: "6–10 человек", label: "6–10 человек" },
      { value: "10–15 человек", label: "10–15 человек" },
      { value: "более 15 человек", label: "более 15 человек" },
    ],
  },
  {
    name: "message",
    label: f.messageOptional,
    kind: "textarea",
    placeholder: "Какие курсы интересны, есть ли площадка, предпочтительные даты",
  },
];

export const appointmentFields: FieldDef[] = [
  nameField,
  phoneField,
  {
    name: "service",
    label: "Услуга",
    kind: "select",
    wide: true,
    options: [
      { value: "Нужна консультация", label: "Нужна консультация — не знаю, что выбрать" },
      ...services.map((s) => ({ value: s.title, label: s.title })),
    ],
  },
  {
    name: "message",
    label: f.messageOptional,
    kind: "textarea",
    placeholder: "Коротко опишите ситуацию и удобное время визита",
  },
];

export const productFields: FieldDef[] = [
  nameField,
  phoneField,
  {
    name: "product",
    label: "Что вас интересует",
    kind: "select",
    options: productCategories.map((c) => ({ value: c.title, label: c.title })),
  },
  {
    name: "city",
    label: "Город",
    kind: "text",
    autoComplete: "address-level2",
    placeholder: "Для расчёта доставки",
  },
  {
    name: "message",
    label: f.messageOptional,
    kind: "textarea",
    placeholder: "Модель, размер, количество или вопрос специалисту",
  },
];

export const contactFields: FieldDef[] = [
  nameField,
  phoneField,
  {
    name: "message",
    label: f.messageOptional,
    kind: "textarea",
    placeholder: "Ваш вопрос",
  },
];
