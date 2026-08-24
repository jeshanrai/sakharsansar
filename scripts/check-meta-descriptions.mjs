/**
 * Fails the build when a page ships a bad meta description.
 *
 * This exists because the product pages used to derive their description with
 * `longDescription.slice(0, 160)`, which cut all three mid-word — the block's
 * ended "...skimmed by hand and poure", and that is what Google printed under
 * the result. A truncation bug is invisible in review (the source line looks
 * deliberate) and invisible in the browser, so it needs a check that reads the
 * built HTML rather than the source.
 *
 * Run against `.next/server/app` after `next build`. Every route is prerendered
 * in this project, so the built HTML is the whole truth about what ships.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = ".next/server/app";
const MIN = 70;
const MAX = 160;

/**
 * Sentence-ending punctuation.
 *
 * The danda (।) and double danda (॥) are here because three of the posts are
 * written in Nepali, where the danda is the full stop — a Latin-only check
 * reports every correct Devanagari description as truncated. The ellipsis is
 * accepted as deliberate; a description that genuinely trails off is a choice,
 * a description that stops mid-word is a bug.
 */
const TERMINATORS = /[.!?।॥…]["'”’)]?$/u;

/** Routes that are not indexable, so their descriptions are not a ranking
 *  surface. The admin portal is robots-disallowed and /_not-found is a status
 *  page, not a document. */
const EXEMPT = [/^_/, /^portfolio(\/|$)/];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

const problems = [];
let checked = 0;

for await (const file of walk(ROOT)) {
  const route = relative(ROOT, file).replace(/\.html$/, "");
  if (EXEMPT.some((re) => re.test(route))) continue;

  const html = await readFile(file, "utf8");
  const match = html.match(/<meta name="description" content="([^"]*)"/);
  if (!match) {
    problems.push([route, "no meta description at all"]);
    continue;
  }

  // The HTML is escaped; compare against what a crawler actually parses.
  const description = match[1]
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  checked++;
  // Count by code point: Devanagari sits outside the BMP-safe assumptions of
  // .length for some combining sequences, and search engines count characters.
  const length = [...description].length;

  if (length > MAX) problems.push([route, `${length} chars, over ${MAX}`, description.slice(-60)]);
  else if (length < MIN) problems.push([route, `${length} chars, under ${MIN}`, description]);
  else if (!TERMINATORS.test(description.trim()))
    problems.push([route, "does not end on a sentence — likely truncated", `…${description.slice(-60)}`]);
}

if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} bad meta description(s) of ${checked} checked:\n`);
  for (const [route, reason, sample] of problems) {
    console.error(`  /${route}\n    ${reason}`);
    if (sample) console.error(`    ${JSON.stringify(sample)}`);
  }
  console.error(`\nDescriptions must be ${MIN}–${MAX} characters and end on a sentence.\n`);
  process.exit(1);
}

console.log(`✓ ${checked} meta descriptions are ${MIN}–${MAX} chars and end cleanly`);
