import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const kztFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
});

/** Formats a KZT amount as «150 000 ₸». */
export function formatKzt(amount: number) {
  return `${kztFormatter.format(amount)} ₸`;
}

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  timeZone: "Asia/Almaty",
});

const dateWithYearFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Almaty",
});

/** ISO date (YYYY-MM-DD) → «12 марта» / «12 марта 2027». */
export function formatDate(iso: string, withYear = false) {
  const d = new Date(`${iso}T12:00:00+05:00`);
  return (withYear ? dateWithYearFormatter : dateFormatter).format(d);
}

export function formatDateRange(start: string, end?: string) {
  if (!end || end === start) return formatDate(start, true);
  const s = new Date(`${start}T12:00:00+05:00`);
  const e = new Date(`${end}T12:00:00+05:00`);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()}–${formatDate(end, true)}`;
  }
  return `${formatDate(start)} — ${formatDate(end, true)}`;
}

/** Russian plural helper: plural(3, ["курс", "курса", "курсов"]). */
export function plural(n: number, forms: [string, string, string]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

/** Keeps only digits and a leading «+» — used for tel: links. */
export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(phone: string, text?: string) {
  const digits = phone.replace(/\D/g, "");
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${q}`;
}
