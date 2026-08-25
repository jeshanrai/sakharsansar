import content from "@/data/content.json";

/**
 * Shop categories, as real URLs.
 *
 * The "All / Blocks / Powder / Dry Fruits" control on /shop was client state.
 * It filtered the grid perfectly well and produced no URL, which meant a
 * filtered view could not be linked, shared, or crawled — so a query like
 * "jaggery powder Nepal" had nothing on this site to match beyond the product
 * page itself, and the shop's own category structure was invisible to search.
 *
 * Each category now has a route that renders server-side, and the client
 * filter pushes the matching URL as you use it. The category name in
 * content.json stays the single source of truth: slugs are derived from it, so
 * adding a fourth category to the catalogue creates its route automatically
 * rather than requiring an edit here.
 *
 * `intro` is the one thing that cannot be derived. A category page whose only
 * unique text is its heading is a doorway page, and Google has been explicit
 * about those since 2015 — the copy is what makes each one a page rather than
 * a filtered view with a URL.
 */

export interface ShopCategory {
  /** URL segment: "dry-fruits". */
  slug: string;
  /** As written in content.json: "Dry Fruits". */
  name: string;
  /** On-page H1. */
  heading: string;
  title: string;
  description: string;
  /** 100–200 words of unique copy, in the site's register. */
  intro: string[];
}

/** "Dry Fruits" → "dry-fruits". */
export function categorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Per-category copy, keyed by the slug derived above.
 *
 * Written rather than templated. Three pages that differ only by a swapped
 * noun read as one page repeated, which is most of why the retired catalogue
 * was left out of the index in the first place.
 */
const COPY: Record<
  string,
  Pick<ShopCategory, "heading" | "title" | "description" | "intro">
> = {
  blocks: {
    heading: "Sakhar Blocks",
    title: "Sakhar Blocks: Buy Jaggery Blocks Online in Nepal",
    description:
      "Wood-fired sakhar blocks from Sankhuwasabha, poured by hand into amber discs and sold by the kilo. Chemical-free, shipped pan-Nepal.",
    intro: [
      "The block is the original form, and everything else on this shop is made from it. Cane pressed on the terraces in Sankhuwasabha, reduced over an open wood fire in an iron kadhai, skimmed by hand, then poured into moulds while it is still molten and left overnight to set.",
      "What comes out is dense, dark and slightly uneven, with a cracked surface and a colour that shifts between batches depending on how late in the season the cane was cut and how long that fire ran. That variation is the point rather than a fault: a block that looks identical every time has usually been helped along with a clarifier, and we do not use one.",
      "Buy the block if you cook with sakhar, if you get through a kilo, or if you are making chaku for Maghe Sankranti and need something hard and low in moisture. Grate it, or break a piece off into your chiya. It is a third cheaper by weight than the powder, and it is the same sakhar.",
    ],
  },
  powder: {
    heading: "Sakhar Powder",
    title: "Sakhar Powder: Organic Jaggery Powder in Nepal",
    description:
      "Wood-fired sakhar crushed and sieved to an even grain. Dissolves cold, measures like sugar. 250g resealable pouch, shipped pan-Nepal.",
    intro: [
      "The powder is our block plus one step. Once a batch has fully set it is crushed, sieved to an even grain and sealed straight into a pouch — nothing is added at that stage, so there is no anti-caking agent, no starch and no flour in it.",
      "It exists for the way most people actually use a sweetener. It pours, it measures by the spoon the way sugar does, and it dissolves hot or cold without leaving grit at the bottom of the cup, which means no chipping at a block with a knife on a weekday morning. Spoon it into chiya, use it anywhere a recipe asks for brown sugar, or put it over curd and oats with no melting step in between.",
      "It costs more per kilo than the block, and we would rather say why than let you find out at checkout: you are paying for the extra processing and the smaller pack. If you use a lot of it, buy the block and grate it yourself.",
    ],
  },
  "dry-fruits": {
    heading: "Sakhar-Coated Dry Fruits",
    title: "Dry Fruits in Sakhar: Jaggery-Coated Nuts, Nepal",
    description:
      "Whole nuts turned through molten wood-fired sakhar and cooled loose, not pressed into a slab. No glucose syrup, no colour. 100g pouch.",
    intro: [
      "This is the one thing here that is a snack rather than an ingredient. Whole dry fruits are warmed and turned through molten sakhar until each piece carries a thin, matte coat, then spread out to cool loose instead of being pressed into a slab and cut.",
      "The sakhar is the same wood-fired batch that goes into the blocks, which is the whole reason it tastes of toasted molasses rather than of plain sugar. The nuts stay crisp underneath because the coat is thin and goes on quickly.",
      "The pieces look uneven and slightly dusty. That is what setting sakhar does when there is no glucose syrup keeping it glossy and no colour evening it out, and we have chosen not to add either. A 100g pouch is about a week of afternoons.",
    ],
  },
};

/** Every category present in the catalogue, in the order the shop displays. */
export const CATEGORIES: ShopCategory[] = Array.from(
  new Set(content.products.map((p) => p.category)),
).flatMap((name) => {
  const slug = categorySlug(name);
  const copy = COPY[slug];
  // A category with no written intro would ship as a heading over a grid, so
  // it is left without a route rather than published thin. Add it to COPY and
  // the route, the sitemap entry and the filter link all appear.
  if (!copy) return [];
  return [{ slug, name, ...copy }];
});

export function findCategory(slug: string): ShopCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** The products in a category, in catalogue order. */
export function productsIn(name: string) {
  return content.products.filter((p) => p.category === name);
}
