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
import { headingsOf, liveBaseFrom, loadPages, textOf } from "./lib/pages.mjs";

const SITE_URL = "https://www.sakharsansar.com.np";

/** Google truncates well before this, and a heading past it is usually two
 *  headings that grew together. */
const H1_MAX = 70;

/** Past roughly this, a result's title is cut and the tail is wasted. In
 *  practice the tail is the "| SakharSansar" suffix. */
const TITLE_MAX = 60;

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

/**
 * Meta — Phase D.
 *
 * Deliberately does NOT re-check description length or terminating
 * punctuation: check-meta-descriptions.mjs owns those and has since the
 * truncation bug that produced it. Two scripts enforcing one rule is two
 * places for the rule to drift. This covers what that one does not.
 *
 * On the 50–60 character title rule in the brief: the upper bound is real —
 * past roughly 60 Google truncates and the tail is wasted — so it is enforced.
 * The lower bound is not. "Privacy Policy | SakharSansar" is 29 characters and
 * exactly right, and the only way to reach 50 would be to pad it with words
 * that mean nothing. A rule that can only be satisfied by filler is a rule
 * that produces filler.
 */
function checkMeta(pages) {
  const problems = [];
  const seenTitle = new Map();
  const seenDescription = new Map();
  /** og:image URL (cache-busting query stripped) -> the alt it was given. */
  const altForImage = new Map();

  for (const { route, html } of pages) {
    const head = html.split("</head>")[0];
    const meta = (name) =>
      head.match(new RegExp(`<meta name="${name}" content="([^"]*)"`, "i"))?.[1] ?? null;
    const og = (prop) =>
      head.match(new RegExp(`<meta property="${prop}" content="([^"]*)"`, "i"))?.[1] ?? null;

    // ── Title
    const title = textOf(head.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
    if (!title) problems.push([route, "no <title>"]);
    else {
      if ([...title].length > TITLE_MAX) {
        problems.push([route, `title is ${[...title].length} chars, over ${TITLE_MAX}: ${JSON.stringify(title)}`]);
      }
      const other = seenTitle.get(title);
      if (other) problems.push([route, `title duplicates ${other}: ${JSON.stringify(title)}`]);
      else seenTitle.set(title, route);
    }

    // ── Description
    const description = meta("description");
    if (!description) problems.push([route, "no meta description"]);
    else {
      const other = seenDescription.get(description);
      if (other) problems.push([route, `description duplicates ${other}`]);
      else seenDescription.set(description, route);
    }

    // ── Canonical, self-referencing and exact
    const canonical = head.match(/<link rel="canonical" href="([^"]*)"/i)?.[1] ?? null;
    const expected = route === "/" ? SITE_URL : `${SITE_URL}${route}`;
    if (!canonical) problems.push([route, "no canonical"]);
    else if (canonical !== expected) {
      problems.push([route, `canonical points at ${canonical}, not ${expected}`]);
    }

    // ── Keywords: obsolete since 2009, and a spam signal on a shop
    if (meta("keywords") !== null) problems.push([route, "has a meta keywords tag"]);

    // ── Open Graph and the Twitter mirror
    for (const prop of ["og:title", "og:description", "og:url", "og:type", "og:image", "og:image:width", "og:image:height", "og:image:type", "og:image:alt", "og:locale"]) {
      if (og(prop) === null) problems.push([route, `missing ${prop}`]);
    }
    for (const name of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
      if (meta(name) === null) problems.push([route, `missing ${name}`]);
    }

    // ── One image, one description of it.
    //
    // Checked per image rather than per page: six pages legitimately share the
    // sitewide card, and an alt describes a picture, not a URL. What is wrong
    // is three different product photos all described as "SakharSansar
    // product: pure Himalayan jaggery" — which is what these pages did.
    const image = og("og:image")?.split("?")[0];
    const alt = og("og:image:alt");
    if (image && alt) {
      const previous = altForImage.get(alt);
      if (previous && previous !== image) {
        problems.push([route, `og:image:alt is reused for a different image: ${JSON.stringify(alt.slice(0, 50))}`]);
      } else altForImage.set(alt, image);
    }

    // ── Locale
    //
    // og:locale is now correct per page. The matching <html lang> is not: the
    // root layout renders one for the whole site, and giving /ne its own needs
    // the route-group split that Phase F does anyway. The assertion lands with
    // it rather than shipping here with an exception carved out for the three
    // pages it would fail on.
    const ogLocale = og("og:locale");
    const wantLocale = route.startsWith("/ne/") || route === "/ne" ? "ne_NP" : "en_NP";
    if (ogLocale && ogLocale !== wantLocale) {
      problems.push([route, `og:locale is ${ogLocale}, expected ${wantLocale}`]);
    }
  }

  return problems;
}

const GROUPS = [
  ["headings", checkHeadings],
  ["meta", checkMeta],
];

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
