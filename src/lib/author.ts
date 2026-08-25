import { STORY, absoluteUrl } from "./site";

/**
 * The one person who writes here.
 *
 * Her name, role and bio were repeated on every post in blog.json and nowhere
 * else, which meant she had a byline on eleven pages and no page of her own.
 * For a food brand that is a real gap: Google's guidance on who is behind the
 * content asks for exactly this, and the site's strongest claim — that the
 * person making the sakhar is the person writing about it — had no URL to
 * point at. The `Person` node in every BlogPosting now resolves to a page.
 *
 * `path` is the canonical home. The bio on the posts stays where it is (it is
 * the short version, shown under each article); this is the long one.
 */
export const AUTHOR = {
  name: "Rashmita Bhandari",
  /** Matches `authorRole` on the posts. */
  role: "Founder · Farmer · Owner",
  path: "/about/rashmita-bhandari",
  image: "/team/rashmita.jpg",
  imageAlt:
    "Rashmita Bhandari, founder of SakharSansar, on her farm in Sankhuwasabha",
  /** One sentence, for the schema `description` and the page's own lede. */
  summary: `Rashmita Bhandari founded SakharSansar in ${STORY.founded}. She makes the sakhar herself in Sankhuwasabha and writes everything on this site.`,
} as const;

export const AUTHOR_ID = absoluteUrl(`${AUTHOR.path}#person`);

/**
 * The `Person` node, used both on her page and as the author of every post.
 *
 * Given a stable `@id` so a crawler merges the eleven bylines and the profile
 * page into one entity rather than twelve unrelated mentions of a name.
 */
export function authorLd(): Record<string, unknown> {
  return {
    "@type": "Person",
    "@id": AUTHOR_ID,
    name: AUTHOR.name,
    jobTitle: AUTHOR.role,
    description: AUTHOR.summary,
    url: absoluteUrl(AUTHOR.path),
    image: absoluteUrl(AUTHOR.image),
    knowsAbout: [
      "jaggery making",
      "sakhar",
      "wood-fired jaggery",
      "sugarcane farming",
      "Sankhuwasabha agriculture",
    ],
    nationality: { "@type": "Country", name: "Nepal" },
  };
}
