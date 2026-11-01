/**
 * Content model. Every business fact on the site comes from `src/data/*`.
 * The shapes are intentionally CMS-friendly (flat, serialisable, slug-keyed)
 * so they can later be fetched from Sanity / Strapi / Notion etc. without
 * touching the components.
 *
 * Convention: `null` or an empty array means «not provided yet». Components
 * hide or soften the corresponding UI instead of inventing a value.
 */

export type ImageAsset = {
  /** Path in /public (e.g. "/images/courses/basic.jpg") or remote URL allowed in next.config. */
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type AudienceId = "beginners" | "practicing" | "pedicure" | "educators";

export type Audience = {
  id: AudienceId;
  label: string;
  short: string;
};

export type CourseSession = {
  /** ISO date YYYY-MM-DD */
  start: string;
  end?: string;
  city: string;
  /** Free text, e.g. «осталось несколько мест» — only if true. */
  note?: string;
};

export type CourseModule = {
  title: string;
  topics: string[];
};

export type FaqItem = { q: string; a: string };

export type Course = {
  slug: string;
  title: string;
  /** One-sentence promise used on cards and in metadata. */
  summary: string;
  /** Longer intro on the course page. */
  description: string;
  /** Professional category label shown on the card, e.g. «Базовый уровень». */
  category: string;
  audiences: AudienceId[];
  /** Who the course is for — bullet points. */
  audienceDetails: string[];
  outcomes: string[];
  curriculum: CourseModule[];
  format: string | null;
  duration: string | null;
  /** Default city if the course is always held in one place. */
  city: string | null;
  /** Price in KZT. null → «Стоимость уточняется». */
  price: number | null;
  priceNote: string | null;
  sessions: CourseSession[];
  includes: string[];
  /** Only fill with verified information about the issued document. */
  certificate: string | null;
  image: ImageAsset | null;
  gallery: ImageAsset[];
  faq: FaqItem[];
  featured: boolean;
  /** Order in listings — lower first. */
  order: number;
};

export type Contacts = {
  phone: string | null;
  whatsapp: string | null;
  telegram: string | null;
  instagram: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  hours: string | null;
  mapUrl: string | null;
};

export type Specialist = {
  name: string;
  role: string;
  bio: string | null;
  qualifications: string[];
  photo: ImageAsset | null;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  /** Optional price in KZT («от …»). */
  priceFrom: number | null;
};

export type ProductCategory = {
  id: string;
  title: string;
  description: string;
  points: string[];
};

export type Product = {
  slug: string;
  categoryId: string;
  title: string;
  description: string;
  price: number | null;
  image: ImageAsset | null;
  inStock: boolean | null;
};

export type Testimonial = {
  id: string;
  /** Publish only with the author's consent. */
  author: string;
  city: string | null;
  courseSlug: string | null;
  text: string;
  /** ISO date of the review. */
  date: string | null;
  photo: ImageAsset | null;
  /** e.g. YouTube / Instagram link to a video testimonial. */
  videoUrl: string | null;
  consent: boolean;
};

export type BusinessLocation = {
  id: string;
  /** Short area name shown on cards, e.g. «Батыс-2». */
  label: string;
  name: string;
  city: string;
  /** Street + building, as shown to visitors. */
  address: string;
  /** Floor / entrance / landmark. */
  detail: string | null;
  /** Branch-specific hours — only if verified. */
  hours: string | null;
  /** Branch-specific phone — only if verified (otherwise the main number applies). */
  phone: string | null;
  /**
   * Map destination for THIS branch — set only when its mapping is verified.
   * `null` → no map button is rendered.
   */
  mapUrl: string | null;
  /** Label of the map action (depends on the service behind `mapUrl`). */
  mapLabel: string | null;
};

/** An official 2GIS record whose branch mapping is not yet established. */
export type UnmappedMapRecord = { id: string; url: string };

export type PaymentMethodId = "kaspi" | "halyk" | "applepay" | "googlepay" | "cash";

export type PaymentMethod = {
  id: PaymentMethodId;
  /** Accessible / text name. */
  name: string;
  /** Short supporting line under the mark. */
  note: string;
};
