import type { ImageAsset, Testimonial } from "./types";

/**
 * Student testimonials. Publish ONLY real reviews with written consent of
 * the author (set `consent: true`). Entries without consent are filtered out.
 *
 * ЗАПОЛНИТЬ: пример записи —
 * {
 *   id: "aigerim-2026",
 *   author: "Айгерим К.",
 *   city: "Алматы",
 *   courseSlug: "podologiya-bazovyy-kurs",
 *   text: "…",
 *   date: "2026-09-12",
 *   photo: null,
 *   videoUrl: null,
 *   consent: true,
 * }
 */
const testimonials: Testimonial[] = [];

// ЗАПОЛНИТЬ: фотографии с обучения (с согласия участников).
export const trainingPhotos: ImageAsset[] = [];

export function getTestimonials() {
  return testimonials.filter((t) => t.consent);
}
