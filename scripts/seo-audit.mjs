/**
 * The audit suite. Every rule this site has decided to hold itself to, checked
 * against the pages it actually ships.
 *
 * The point is not to find problems once. It is that a fix, once made, cannot
 * quietly come undone — an H1 nested back inside a hero, a heading level
 * skipped by a component reused in a new place, two pages drifting onto the
 * same title. None of those throw, none show up in review, and all of them are
 * only visible in aggregate across every route at once, which is exactly what
 * no human does before a deploy.
 *
 * Reads the build output by default, so it gates the deploy rather than
 * reporting on one that already happened; `--live` crawls the published
 * sitemap instead.
 *
 *   npm run seo:audit
 *   npm run seo:audit -- --live
 *
 * Checks are grouped, and each group is a function returning problems. Later
 * phases add groups here rather than new scripts, so there is one command and
 * one report.
 */
import { headingsOf, liveBaseFrom, loadPages } from "./lib/pages.mjs";

/** Google truncates well before this, and a heading past it is usually two
 *  headings that grew together. */
const H1_MAX = 70;

/**
 * Headings — Phase C.
 *
 * `h1 is unique across the site` is the one worth explaining. Two pages with
 * the same H1 compete for the same query, and the thinner one is treated as a
 * duplicate of the other. It caught /shop/powder and /products/jaggery-powder
 * both saying "Sakhar Powder", which nobody would have found by reading either
 * page on its own.
 */
function checkHeadings(pages) {
  const problems = [];
  const seenH1 = new Map();

  for (const { route, html } of pages) {
    const headings = headingsOf(html);
    const h1s = headings.filter((h) => h.level === 1);

    if (h1s.length === 0) problems.push([route, "no h1"]);
    else if (h1s.length > 1) {
      problems.push([route, `${h1s.length} h1s: ${h1s.map((h) => JSON.stringify(h.text)).join(", ")}`]);
    }

    for (const h1 of h1s) {
      const length = [...h1.text].length;
      if (length === 0) problems.push([route, "h1 is empty"]);
      else if (length > H1_MAX) {
        problems.push([route, `h1 is ${length} chars, over ${H1_MAX}: ${JSON.stringify(h1.text)}`]);
      }
      if (h1.text) {
        const other = seenH1.get(h1.text);
        if (other) problems.push([route, `h1 duplicates ${other}: ${JSON.stringify(h1.text)}`]);
        else seenH1.set(h1.text, route);
      }
    }

    let previous = 0;
    for (const h of headings) {
      if (previous && h.level > previous + 1) {
        problems.push([
          route,
          `heading level skips h${previous} → h${h.level} at ${JSON.stringify(h.text.slice(0, 50))}`,
        ]);
      }
      previous = h.level;
    }
  }

  return problems;
}

const GROUPS = [["headings", checkHeadings]];

// ─── Run ────────────────────────────────────────────────────────────────────

const pages = await loadPages(liveBaseFrom(process.argv.slice(2)));
if (pages.length === 0) {
  console.error("✗ no pages found. Run `next build` first, or pass --live.");
  process.exit(1);
}

const problems = [];
const ran = [];
for (const [name, check] of GROUPS) {
  const found = check(pages);
  ran.push(`${name} (${found.length === 0 ? "clean" : `${found.length} problem${found.length === 1 ? "" : "s"}`})`);
  problems.push(...found);
}

if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} problem(s) across ${pages.length} pages:\n`);
  const byRoute = new Map();
  for (const [route, reason] of problems) {
    if (!byRoute.has(route)) byRoute.set(route, []);
    byRoute.get(route).push(reason);
  }
  for (const [route, reasons] of [...byRoute].sort()) {
    console.error(`  ${route}`);
    for (const reason of reasons) console.error(`    ${reason}`);
  }
  console.error("");
  process.exit(1);
}

console.log(`✓ ${pages.length} pages — ${ran.join(", ")}`);
