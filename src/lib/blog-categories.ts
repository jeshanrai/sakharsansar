import { posts, type BlogPost } from "./blog";
export { blogCategorySlug } from "./blog-format";
import { blogCategorySlug } from "./blog-format";

/**
 * Journal categories, as real URLs.
 *
 * The eight filter pills on /blog were client state, so a reader could narrow
 * the journal to recipes and have nothing to send anyone, and a crawler saw
 * one index page rather than eight topic hubs. Each tag that carries written
 * copy below now has a route.
 *
 * The tags themselves live on the posts in blog.json and stay the source of
 * truth; slugs are derived, so retagging a post moves it between hubs without
 * touching this file.
 *
 * Note on "Sakhar 101": it is on every post, so its hub would be the journal
 * index under a second URL — two pages listing the same ten articles, competing
 * with each other. It is deliberately left without a route (see `intro` being
 * required below) and keeps working as an on-page filter.
 */

export interface BlogCategory {
  /** URL segment: "buying-guide". */
  slug: string;
  /** The tag as written on the posts: "Buying Guide". */
  tag: string;
  /** On-page H1. */
  heading: string;
  title: string;
  description: string;
  /** 100–150 words of unique copy. Without it the page is a list of links. */
  intro: string;
}


const COPY: Record<string, Omit<BlogCategory, "slug" | "tag">> = {
  "buying-guide": {
    heading: "Buying Sakhar",
    title: "How to Buy Sakhar in Nepal: Guides & Prices",
    description:
      "What sakhar costs in Nepal, how to spot an adulterated block, and when you should buy someone else's jaggery instead of ours.",
    intro:
      "Everything here is about the decision in the shop: what a fair price looks like, what a very cheap block usually means, and how to check what is in front of you before you pay for it. We sell sakhar, so treat all of it with the scepticism that deserves — which is exactly why these pieces name the cases where cheaper Terai gur is the sensible buy, and why the price article works out what a kilo costs per cup and then suggests using less of it. If a guide here only ever concluded that you should buy from us, it would not be worth reading.",
  },
  "jaggery-purity": {
    heading: "Is It Real Sakhar?",
    title: "Pure Jaggery Tests: How to Spot Adulterated Sakhar",
    description:
      "The home tests for adulterated jaggery — water, iodine, colour, hardness — and what gets added to a block to make it cheaper.",
    intro:
      "Sakhar is easy to adulterate and the adulterations make it look better, not worse. Cheap sugar boiled in to bulk out a block, starch or flour for weight, a clarifier or bleaching agent to lift the colour to the bright gold that sells on a shelf. The counter-intuitive rule runs through everything here: the glossy, uniformly golden block deserves more suspicion than the dull dark one. These pieces set out the tests you can run at home with water, iodine and your hands, and what each result actually tells you. Run them on ours as well.",
  },
  comparison: {
    heading: "Sakhar Compared",
    title: "Sakhar vs Sugar, Gur & Alternatives Compared",
    description:
      "Honest comparisons: sakhar against refined sugar, hill sakhar against Terai gur, and where the differences have been overstated.",
    intro:
      "Comparisons are where most jaggery writing stops being honest, because the conclusion is decided before the article starts. These try not to. Sakhar against refined white sugar, hill sakhar against Terai gur made at scale on flat land, block against powder — each with the case for the cheaper option stated properly rather than waved at. The short version, which you will find argued at length inside: sakhar is still sugar, the mineral content is real but small, and Terai gur is a good product that is cheaper for reasons that make sense. Read them before you pay a premium for anything, ours included.",
  },
  nutrition: {
    heading: "What's Actually In It",
    title: "Jaggery Nutrition: Minerals, Sugar & the Evidence",
    description:
      "What unrefined cane sugar actually contains, what the published research says, and how much of it is marketing.",
    intro:
      "Unrefined cane sugar keeps some of what refining strips out — iron, magnesium, potassium — and the amounts are smaller than the marketing around jaggery implies. These pieces stay with what has been published rather than with what sells: the composition of non-centrifugal cane sugar varies with cane variety, soil and processing method, which is documented, and the per-serving mineral figures are modest once you scale them to a teaspoon. Where the honest answer is uncomfortable, it is written that way. Nothing here is a health claim, and nothing here has been lab tested by us — when that changes, we will publish the results rather than the adjectives.",
  },
  health: {
    heading: "Sakhar & Health",
    title: "Is Sakhar Healthy? Diabetes, Sugar Intake & Honest Answers",
    description:
      "Whether jaggery is safe for diabetics, what the WHO says about daily sugar, and where the health claims run ahead of the evidence.",
    intro:
      "Food and health writing is the category where being wrong does actual damage, so these are the most carefully sourced pieces on the site and the most willing to disappoint. Whether sakhar is safe if you have diabetes has a short answer that our accountant dislikes. What the WHO suggests about free sugars applies to sakhar exactly as it applies to white sugar. None of this is medical advice and none of it comes from us — it cites published guidance, and where a popular claim about jaggery is not supported, it says so plainly instead of quietly leaving it out.",
  },
  recipes: {
    heading: "Cooking With Sakhar",
    title: "Sakhar Recipes: Chiya, Chaku & Nepali Cooking",
    description:
      "Recipes that use sakhar properly — chaku for Maghe Sankranti, chiya that does not curdle, and how jaggery behaves in cooking.",
    intro:
      "Jaggery does not behave like white sugar in a pan. It carries moisture, it browns faster, it is acidic enough to curdle milk if you add it at the wrong moment, and it brings its own woodsmoke to whatever you put it in. These recipes are written with that in mind, tested with our own sakhar, and specific about the step where things go wrong rather than glossing it. Chaku for Maghe Sankranti, chiya that stays smooth, and the ordinary everyday uses that need no method at all beyond grating a block.",
  },
  "how-to": {
    heading: "How To",
    title: "How to Use, Store & Test Sakhar: Practical Guides",
    description:
      "Step-by-step guides to using and storing sakhar, from making chiya without curdling to testing a block for adulteration.",
    intro:
      "Practical, step-numbered pieces for the things people actually get stuck on: making chiya without curdling the milk, working a block into something you can measure, storing sakhar so it does not cake in monsoon, and running the home tests for adulteration. Each one is written as a sequence you can follow with what is already in your kitchen, and each says why the step matters rather than only what to do — the order in which you add sakhar to tea is not arbitrary, and knowing the reason is what stops it going wrong the next time.",
  },
};

/**
 * Tags that are deliberately not routes.
 *
 * A tag with no hub used to be invisible: `COPY` simply had no entry, the
 * `flatMap` below dropped it, and the filter pill went on rendering with
 * nothing behind it. That is indistinguishable from having forgotten to write
 * the hub — which is the actual failure mode, and the reason
 * `scripts/check-blog-categories.mjs` now reads this list and fails the build
 * on any tag that is in neither it nor `COPY`.
 *
 * "Sakhar 101" is on every post. Its hub would be the journal index under a
 * second URL: two pages listing the same articles, each competing with the
 * other for the same queries, and neither of them the one we want to rank.
 * It stays a client-side filter, which is what it always was in practice.
 */
export const ROUTELESS_TAGS = ["Sakhar 101"] as const;

/** Every tag in the journal that has written copy, most-used first. */
export const BLOG_CATEGORIES: BlogCategory[] = Array.from(
  posts.reduce((counts, post) => {
    post.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
    return counts;
  }, new Map<string, number>()),
)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .flatMap(([tag]) => {
    const slug = blogCategorySlug(tag);
    const copy = COPY[slug];
    // No written intro, no route. A hub whose only unique text is its heading
    // is a list of links, and "Sakhar 101" would additionally be a second copy
    // of the journal index.
    if (!copy) return [];
    return [{ slug, tag, ...copy }];
  });

export function findBlogCategory(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug);
}

/** Posts carrying a tag, newest first. */
export function postsTagged(tag: string): BlogPost[] {
  return posts
    .filter((p) => p.tags.includes(tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
