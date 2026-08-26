/**
 * The parts of the journal that are pure functions, with no data behind them.
 *
 * They live apart from lib/blog.ts for one reason, and it is worth stating
 * plainly because the file otherwise looks like pointless indirection:
 * lib/blog.ts imports src/data/blog.json at the top, and that file is 156 KB
 * of full article bodies. Any client component that imports *anything* from
 * lib/blog.ts — even a one-line `postPath` — drags the entire journal into the
 * browser bundle, because a bundler cannot tree-shake a JSON import.
 *
 * That is exactly what was happening. Navbar is a client component, it renders
 * on all thirty-six pages, and it imported `BLOG_ENABLED`. So every visitor to
 * the shop, a product page or a policy page downloaded ten articles they were
 * never going to read, to decide whether to show one nav link.
 *
 * Nothing here touches the data, so nothing here can pull it in. lib/blog.ts
 * re-exports all of it, so server-side callers are unaffected and there is one
 * import path to remember.
 */

/** The shape `postPath` needs — deliberately not the full BlogPost. */
export interface PostRef {
  slug: string;
  lang?: string;
}

/** Where a post lives. Nepali articles sit under /ne/. */
export function postPath(post: PostRef): string {
  return post.lang === "ne" ? `/ne/blog/${post.slug}` : `/blog/${post.slug}`;
}

/** BCP-47 for a post. `lang` on the record is the short form. */
export function postLocale(post: Pick<PostRef, "lang">): string {
  return post.lang === "ne" ? "ne-NP" : "en-NP";
}

/** "Buying Guide" → "buying-guide". */
export function blogCategorySlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const MONTHS: Record<string, string[]> = {
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
  // Gregorian months in Nepali, not Bikram Sambat. The stored dates are
  // Gregorian, and converting the calendar is a different job from translating
  // the label — getting it half-right would put articles in the wrong year.
  ne: [
    "जनवरी", "फेब्रुअरी", "मार्च", "अप्रिल", "मे", "जुन",
    "जुलाई", "अगस्ट", "सेप्टेम्बर", "अक्टोबर", "नोभेम्बर", "डिसेम्बर",
  ],
};

/**
 * "2026-08-07" → "7 August 2026", or "७ अगस्ट २०२६".
 *
 * Formatted from the string parts rather than through `Date` or
 * `toLocaleDateString`: the stored dates are timezone-less calendar days, and
 * both of those would shift them by one in some timezones — which on a client
 * component shows up as a hydration mismatch.
 *
 * The Nepali numerals follow the articles' own convention, which writes १०, २५
 * and १०० in prose and keeps Latin digits only for citations.
 */
export function formatPostDate(iso: string, locale: "en" | "ne" = "en"): string {
  const [year, month, day] = iso.split("-");
  const name = MONTHS[locale]?.[Number(month) - 1];
  if (!name || !day || !year) return iso;
  const n = (value: string) =>
    locale === "ne"
      ? Number(value).toLocaleString("ne-NP", { useGrouping: false })
      : String(Number(value));
  return `${n(day)} ${name} ${n(year)}`;
}
