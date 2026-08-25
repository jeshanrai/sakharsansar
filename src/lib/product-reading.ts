import { posts } from "./blog";

/**
 * The articles worth reading from each product page.
 *
 * The product pages used to end on one button — "Read stories from
 * Sankhuwasabha" — pointing at /blog. That is the weakest link on the page: it
 * arrives at the moment a reader has just decided they are interested, and
 * spends that on an archive index they then have to search. The journal itself
 * already links the other way properly, naming the product in the sentence
 * that mentions it, so this brings the product pages up to the same standard.
 *
 * Anchor text describes what the reader gets rather than repeating the
 * headline, and each pairing is chosen for the product it sits on: the block
 * page leads with the purity tests because a block is what you run them on;
 * the powder page leads with chiya because that is what the powder is for.
 *
 * Slugs are checked against the journal at build time (see `readingFor`), so a
 * retired or renamed post cannot leave a product page linking into a 404.
 */

interface Reading {
  slug: string;
  /** Natural, descriptive link text. Not the article's headline. */
  anchor: string;
  /** One line on why it is worth the click. */
  note: string;
}

const READING: Record<string, Reading[]> = {
  "organic-jaggery-block": [
    {
      slug: "how-to-identify-pure-jaggery-sakhar",
      anchor: "seven ways to tell pure sakhar from adulterated",
      note: "Water, iodine and your own hands. Run them on ours too.",
    },
    {
      slug: "jaggery-vs-sugar",
      anchor: "how sakhar actually compares with white sugar",
      note: "What the difference is, and where it has been overstated.",
    },
    {
      slug: "chaku-recipe-maghe-sankranti",
      anchor: "making chaku from a block for Maghe Sankranti",
      note: "The block is the ingredient. Here is the method.",
    },
  ],
  "jaggery-powder": [
    {
      slug: "jaggery-tea-without-curdling",
      anchor: "sakhar chiya without curdling the milk",
      note: "The one thing that goes wrong, and the order that prevents it.",
    },
    {
      slug: "sakhar-price-in-nepal",
      anchor: "why the powder costs more per kilo than the block",
      note: "Two to three rupees a cup, worked out in full.",
    },
    {
      slug: "jaggery-vs-sugar",
      anchor: "swapping sakhar in for refined sugar",
      note: "Where it works, and where it honestly does not.",
    },
  ],
  "mixed-dry-fruits": [
    {
      slug: "himalayan-jaggery-sankhuwasabha",
      anchor: "what makes hill sakhar different",
      note: "The coating is the same wood-fired batch as the blocks.",
    },
    {
      slug: "jaggery-vs-sugar",
      anchor: "sakhar and sugar, compared honestly",
      note: "It is still sugar. Here is what that means.",
    },
    {
      slug: "is-jaggery-safe-for-diabetics",
      anchor: "whether sakhar is safe if you have diabetes",
      note: "A straight answer, with the sources behind it.",
    },
  ],
};

export interface ProductReading extends Reading {
  title: string;
  href: string;
}

/** The reading list for a product, dropping anything no longer published. */
export function readingFor(productSlug: string): ProductReading[] {
  return (READING[productSlug] ?? []).flatMap((item) => {
    const post = posts.find((p) => p.slug === item.slug);
    if (!post) return [];
    return [{ ...item, title: post.title, href: `/blog/${post.slug}` }];
  });
}
