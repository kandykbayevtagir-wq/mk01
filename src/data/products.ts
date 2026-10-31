import type { Product, ProductCategory } from "./types";

export const productCategories: ProductCategory[] = [
  {
    id: "insoles",
    title: "Ортопедические стельки",
    description: "Индивидуальные и готовые стельки для повседневной носки, спорта и профессиональной обуви.",
    points: ["Подбор под задачу клиента", "Консультация по использованию"],
  },
  {
    id: "supplies",
    title: "Подологические материалы",
    description: "Расходные материалы и средства, которые используются в работе подолога.",
    points: ["Для кабинета подолога", "Консультация по выбору"],
  },
  {
    id: "special",
    title: "Специализированная продукция",
    description: "Средства ухода и защитные изделия для стоп, рекомендуемые специалистами.",
    points: ["Для домашнего ухода", "Рекомендации специалиста"],
  },
];

/**
 * ЗАПОЛНИТЬ: реальные товары. Пример:
 * {
 *   slug: "stelki-sport",
 *   categoryId: "insoles",
 *   title: "Стельки для спорта",
 *   description: "…",
 *   price: 25000,
 *   image: { src: "/images/products/sport.jpg", alt: "…", width: 1200, height: 1200 },
 *   inStock: true,
 * }
 */
export const products: Product[] = [];

export function productsByCategory(categoryId: string) {
  return products.filter((p) => p.categoryId === categoryId);
}
