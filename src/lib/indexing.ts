import { products } from "@/data/products";
import { getTestimonials } from "@/data/testimonials";

/**
 * Pages whose only content is an honest "nothing here yet" are kept out of
 * search results and the sitemap until real records exist. They stay
 * reachable and functional; adding the first testimonial / product flips
 * the flag automatically.
 */
export const indexable = {
  reviews: getTestimonials().length > 0,
  products: products.length > 0,
};
