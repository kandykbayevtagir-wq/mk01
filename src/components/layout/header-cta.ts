import { whatsappLink } from "@/data/site";
import { t } from "@/i18n";

export type HeaderCta = { label: string; href: string; external?: boolean };

/**
 * The single header call-to-action. A plain lookup by section — not routing
 * logic — so the CTA always matches the page's main goal.
 */
export function headerCta(pathname: string): HeaderCta {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path.startsWith("/courses/")) return { label: t.common.enroll, href: "#zapis" };
  if (path === "/center") return { label: "Записаться на приём", href: "#zapis" };
  if (path === "/products") return { label: "Уточнить наличие", href: "#zapros" };
  if (path === "/partners") return { label: "Стать организатором", href: "#zayavka" };
  if (path === "/contacts") return { label: "Написать в WhatsApp", href: whatsappLink(), external: true };
  return { label: t.common.chooseCourse, href: "/courses" };
}
