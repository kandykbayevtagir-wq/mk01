import { z } from "zod";
import { t } from "@/i18n";

const v = t.validation;

const name = z.string().trim().min(2, v.name).max(120, v.tooLong);
const phone = z
  .string()
  .trim()
  .max(40, v.tooLong)
  .refine((s) => {
    const digits = s.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }, v.phone);
const email = z
  .string()
  .trim()
  .max(160, v.tooLong)
  .refine((s) => s === "" || z.email().safeParse(s).success, v.email)
  .optional();
const optionalText = (max = 2000) => z.string().trim().max(max, v.tooLong).optional();

/** Hidden anti-spam field — must stay empty. */
const honeypot = z.string().max(0).optional();

export const leadSchemas = {
  course: z.object({
    type: z.literal("course"),
    name,
    phone,
    course: z.string().trim().min(1, v.course).max(200),
    preferredDate: optionalText(120),
    city: optionalText(120),
    message: optionalText(),
    website: honeypot,
  }),
  partner: z.object({
    type: z.literal("partner"),
    name,
    city: z.string().trim().min(2, v.city).max(120, v.tooLong),
    phone,
    email,
    background: z.string().trim().min(3, v.background).max(500, v.tooLong),
    groupSize: optionalText(60),
    message: optionalText(),
    website: honeypot,
  }),
  appointment: z.object({
    type: z.literal("appointment"),
    name,
    phone,
    service: optionalText(200),
    message: optionalText(),
    website: honeypot,
  }),
  product: z.object({
    type: z.literal("product"),
    name,
    phone,
    product: optionalText(200),
    city: optionalText(120),
    message: optionalText(),
    website: honeypot,
  }),
  contact: z.object({
    type: z.literal("contact"),
    name,
    phone,
    message: optionalText(),
    website: honeypot,
  }),
} as const;

export const leadSchema = z.discriminatedUnion("type", [
  leadSchemas.course,
  leadSchemas.partner,
  leadSchemas.appointment,
  leadSchemas.product,
  leadSchemas.contact,
]);

export type LeadType = keyof typeof leadSchemas;
export type Lead = z.infer<typeof leadSchema>;

export const leadTypeLabels: Record<LeadType, string> = {
  course: "Запись на курс",
  partner: "Заявка организатора",
  appointment: "Запись в центр",
  product: "Запрос по продукции",
  contact: "Обращение с сайта",
};

export const leadFieldLabels: Record<string, string> = {
  name: "Имя",
  phone: "Телефон",
  email: "E-mail",
  city: "Город",
  course: "Курс",
  preferredDate: "Удобная дата",
  background: "Организация / опыт",
  groupSize: "Размер группы",
  service: "Услуга",
  product: "Продукция",
  message: "Комментарий",
};

export type LeadResponse =
  | { ok: true }
  | {
      ok: false;
      code: "validation" | "not_configured" | "delivery_failed" | "rate_limited" | "bad_request";
      fieldErrors?: Record<string, string>;
    };
