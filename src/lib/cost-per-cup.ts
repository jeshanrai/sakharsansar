import content from "@/data/content.json";
import { parsePrice } from "./seo";

/**
 * The per-cup arithmetic, in one place.
 *
 * /sakhar-price already works this out and publishes the table:
 * a level teaspoon of grated sakhar is 4 to 5 grams, our chiya method suggests
 * 1 to 1.5 teaspoons a cup, so a kilo at Rs. 400 sweetens roughly 140 to 250
 * cups. The calculator does the same division with your numbers instead of
 * ours, which is the only thing it adds.
 *
 * Everything here is either division or a figure the site already publishes.
 * No constant is invented: the prices come from the catalogue, the gram
 * weights come from the article, and the 25 g daily figure is the WHO's.
 */

/** WHO's suggested ceiling on free sugars, grams per day for an adult.
 *  https://www.who.int/news/item/04-03-2015-who-calls-on-countries-to-reduce-sugars-intake-among-adults-and-children */
export const WHO_DAILY_FREE_SUGAR_G = 25;

/** The article's range: a level teaspoon is 4–5 g, a cup takes 1–1.5 of them. */
export const GRAMS_PER_CUP_MIN = 3;
export const GRAMS_PER_CUP_MAX = 10;
export const GRAMS_PER_CUP_DEFAULT = 5;

/** Grams in a kilo. Named because it appears in the arithmetic below. */
const GRAMS_PER_KG = 1000;

export interface CatalogueReference {
  name: string;
  slug: string;
  /** What a kilo of it costs, in NPR. */
  pricePerKg: number;
  /** How it is actually sold, for the label: "1kg", "250g". */
  soldAs: string;
}

/**
 * Our own products, priced per kilo so they sit on the same axis as whatever
 * the reader types in.
 *
 * The powder works out far more expensive per kilo than the block, and that is
 * shown rather than hidden — the price article makes the same point and tells
 * people to buy the block and grate it if they use a lot.
 */
export function catalogueReferences(): CatalogueReference[] {
  return content.products.flatMap((p) => {
    const price = Number(parsePrice(p.price));
    const match = p.weight.match(/(\d+(?:\.\d+)?)\s*(kg|g)\b/i);
    if (!price || !match) return [];
    const grams = Number(match[1]) * (match[2].toLowerCase() === "kg" ? 1000 : 1);
    if (!grams) return [];
    return [{
      name: p.name,
      slug: p.slug,
      pricePerKg: Math.round((price / grams) * GRAMS_PER_KG),
      soldAs: p.weight,
    }];
  });
}

export interface CupCost {
  /** Cups a kilo sweetens at this strength. */
  cupsPerKg: number;
  /** NPR per cup. */
  perCup: number;
  /** Cups that reach the WHO daily free-sugar figure. */
  cupsToDailyLimit: number;
}

/** The whole calculation. Division, and nothing else. */
export function costPerCup(pricePerKg: number, gramsPerCup: number): CupCost {
  const grams = Math.max(gramsPerCup, 0.1);
  const cupsPerKg = GRAMS_PER_KG / grams;
  return {
    cupsPerKg,
    perCup: pricePerKg / cupsPerKg,
    cupsToDailyLimit: WHO_DAILY_FREE_SUGAR_G / grams,
  };
}
