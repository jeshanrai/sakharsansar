import commerce from "@/data/ne/commerce.json";
import content from "@/data/content.json";
import { formatMoney, formatPrice } from "./i18n";
import { COMMERCE } from "./site";
import { parsePrice } from "./seo";

/**
 * The Nepali commercial copy (src/data/ne/commerce.json), with its figures
 * filled in.
 *
 * The copy never writes a price or the delivery threshold. It writes
 * {blockPrice}, {powderPrice} and {freeShipping}, and they are filled from
 * content.json and COMMERCE, the same places the English pages read. A Nepali
 * page cannot quote a price the checkout contradicts, and the claims check
 * that bans hardcoded thresholds does not need a Devanagari variant.
 */

const priceOf = (slug: string) => {
  const product = content.products.find((p) => p.slug === slug);
  if (!product) throw new Error(`ne-content: no product "${slug}" in content.json`);
  return formatPrice(Number(parsePrice(product.price)), "ne");
};

const FIGURES: Record<string, string> = {
  blockPrice: priceOf("organic-jaggery-block"),
  powderPrice: priceOf("jaggery-powder"),
  freeShipping: formatMoney(COMMERCE.freeShippingThreshold, "ne"),
};

/** Replace every {placeholder}; an unknown one fails the build, loudly. */
export function fill(text: string): string {
  return text.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = FIGURES[key];
    if (value === undefined) throw new Error(`ne-content: unknown placeholder {${key}}`);
    return value;
  });
}

export type NeProduct = (typeof commerce.products)[keyof typeof commerce.products];

export const NE = commerce;

export function neProduct(slug: string): NeProduct | undefined {
  return (commerce.products as Record<string, NeProduct>)[slug];
}
