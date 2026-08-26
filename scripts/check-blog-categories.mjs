/**
 * Fails when a tag in use on the journal has no category page behind it.
 *
 * The filter row on /blog renders one pill per tag found on the posts, and the
 * pills are links to /blog/category/<slug>. The list of hubs, though, comes
 * from `COPY` in src/lib/blog-categories.ts — a hand-written map. The two are
 * derived from different things, so they can disagree, and when they do the
 * failure is silent in both directions:
 *
 *   - a tag with no `COPY` entry is dropped from BLOG_CATEGORIES and its hub
 *     never exists, while the tag goes on being applied to posts;
 *   - nothing anywhere says whether that was a decision or an oversight.
 *
 * "Sakhar 101" is the deliberate case and is listed in `ROUTELESS_TAGS`. This
 * script reads that list from the source rather than keeping a second copy, so
 * the exemption cannot be granted here and forgotten there.
 *
 * Checks the built routes, not the constant: the question is whether the page
 * a reader clicks through to actually exists in the output, which is a
 * stronger assertion than whether an object had a key.
 *
 *   npm run check:categories
 */
import { access, readFile, readdir } from "node:fs/promises";

const POSTS = "src/data/blog.json";
const SOURCE = "src/lib/blog-categories.ts";
const BUILT = ".next/server/app/blog/category";

/** Mirrors `blogCategorySlug` in src/lib/blog-format.ts. */
const slugify = (tag) =>
  tag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Pull ROUTELESS_TAGS out of the TS source so there is one list, not two. */
async function routelessTags() {
  const src = await readFile(SOURCE, "utf8");
  const block = src.match(/export const ROUTELESS_TAGS\s*=\s*\[([^\]]*)\]/);
  if (!block) {
    console.error(`✗ could not find ROUTELESS_TAGS in ${SOURCE}.`);
    console.error(`  It is the allowlist this check reads; renaming it silently disables the check.`);
    process.exit(1);
  }
  return new Set([...block[1].matchAll(/["']([^"']+)["']/g)].map((m) => m[1]));
}

const posts = JSON.parse(await readFile(POSTS, "utf8"));
const exempt = await routelessTags();

/** Every tag actually applied to a post, with how many carry it. */
const tags = new Map();
for (const post of posts) {
  for (const tag of post.tags ?? []) tags.set(tag, (tags.get(tag) ?? 0) + 1);
}

// The built hubs. Absent when the check runs before `next build`, in which
// case fall back to asserting against the source map instead of guessing.
let built = null;
try {
  await access(BUILT);
  built = new Set(
    (await readdir(BUILT))
      .filter((f) => f.endsWith(".html"))
      .map((f) => f.replace(/\.html$/, "")),
  );
} catch {
  console.warn(`  ! ${BUILT} not found — run \`next build\` first to check the built routes.`);
  console.warn(`    Falling back to the COPY map in ${SOURCE}.`);
  const src = await readFile(SOURCE, "utf8");
  const copy = src.match(/const COPY[^=]*=\s*\{([\s\S]*?)\n\};/);
  built = new Set(
    copy ? [...copy[1].matchAll(/^\s{2}"?([a-z0-9-]+)"?:\s*\{/gm)].map((m) => m[1]) : [],
  );
}

const problems = [];
for (const [tag, count] of [...tags].sort((a, b) => b[1] - a[1])) {
  if (exempt.has(tag)) continue;
  const slug = slugify(tag);
  if (!built.has(slug)) {
    problems.push(
      `${JSON.stringify(tag)} is on ${count} post(s) but /blog/category/${slug} does not exist.`,
    );
  }
}

// The other direction: a hub nobody tags is an empty page in the sitemap.
for (const slug of built) {
  const tagged = [...tags.keys()].some((t) => slugify(t) === slug);
  if (!tagged) {
    problems.push(`/blog/category/${slug} exists but no post carries its tag — the hub would be empty.`);
  }
}

if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} problem(s) between the journal's tags and its category pages:\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error(
    `\nEither write the hub's copy in ${SOURCE} (a hub with no intro is a bare\n` +
      `list of links), or add the tag to ROUTELESS_TAGS there with the reason.\n`,
  );
  process.exit(1);
}

console.log(
  `✓ ${tags.size} tag(s) in use: ${tags.size - exempt.size} resolve to a category page, ` +
    `${exempt.size} deliberately route-less (${[...exempt].join(", ")})`,
);
