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
import { headingsOf, liveBaseFrom, loadPages, sitemapPaths, textOf } from "./lib/pages.mjs";

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

/** Three clicks from the home page. Past that a page is, in practice, not part
 *  of the site as far as a crawler's budget is concerned. */
const MAX_DEPTH = 3;

/** Every internal link on a page, normalised to a bare path. */
function internalLinks(html) {
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, " ");
  const hrefs = [...body.matchAll(/<a\b[^>]*?href="([^"]*)"/gi)].map((m) => m[1]);
  const paths = new Set();
  for (let href of hrefs) {
    if (href.startsWith(SITE_URL)) href = href.slice(SITE_URL.length) || "/";
    if (!href.startsWith("/")) continue; // external, mailto:, tel:, #anchor
    const path = href.split("#")[0].split("?")[0];
    paths.add(path.length > 1 ? path.replace(/\/$/, "") : "/");
  }
  return paths;
}

/**
 * Architecture — Phase E.
 *
 * The orphan check is the one that cannot be done by looking at a page. A URL
 * can be in the sitemap, render perfectly, carry flawless markup, and still be
 * reachable from nowhere — which is what "orphan" means and why it survives
 * every per-page review. The only way to see it is to walk the site from the
 * home page the way a crawler does and diff what you reached against what you
 * submitted.
 *
 * Breadcrumbs are checked as a pair rather than separately: a `BreadcrumbList`
 * describing a trail the page does not display is markup Google is entitled to
 * distrust, and a displayed trail with no markup earns nothing in a result.
 */
function checkArchitecture(pages, sitemap) {
  const problems = [];
  const byRoute = new Map(pages.map((p) => [p.route, p]));

  // ── Reachability: breadth-first from the home page, exactly as a crawler.
  const depth = new Map([["/", 0]]);
  const queue = ["/"];
  while (queue.length > 0) {
    const route = queue.shift();
    const d = depth.get(route);
    if (d >= MAX_DEPTH) continue;
    const page = byRoute.get(route);
    if (!page) continue;
    for (const link of internalLinks(page.html)) {
      if (!depth.has(link)) {
        depth.set(link, d + 1);
        queue.push(link);
      }
    }
  }

  for (const path of sitemap) {
    if (!depth.has(path)) {
      problems.push([path, `in the sitemap but not reachable from / within ${MAX_DEPTH} clicks`]);
    }
  }

  // ── Internal links have to go somewhere.
  for (const { route, html } of pages) {
    for (const link of internalLinks(html)) {
      if (byRoute.has(link)) continue;
      if (KNOWN_NON_PAGE.some((re) => re.test(link))) continue;
      problems.push([route, `links to ${link}, which is not a page on this site`]);
    }
  }

  // ── Breadcrumbs: shown and described, or neither.
  for (const { route, html } of pages) {
    if (route === "/") continue;
    const noindex = /<meta name="robots" content="[^"]*noindex/i.test(html);
    const visible = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .match(/<nav aria-label="Breadcrumb"[\s\S]*?<\/nav>/i);
    const schema = html.match(/"@type":"BreadcrumbList","itemListElement":\[([\s\S]*?)\]\}/);

    if (!visible && !schema) {
      problems.push([route, "no breadcrumb, visible or structured"]);
      continue;
    }
    // A noindex page earns nothing from the markup, so it may show a trail
    // without describing one.
    if (visible && !schema && !noindex) problems.push([route, "shows a breadcrumb trail but emits no BreadcrumbList"]);
    if (schema && !visible) problems.push([route, "emits a BreadcrumbList for a trail the page never shows"]);

    if (visible && schema) {
      const shown = textOf(visible[0]);
      const named = [...schema[1].matchAll(/"name":"([^"]*)"/g)].map((m) => m[1]);
      const missing = named.filter((n) => !shown.includes(n.replace(/&amp;/g, "&")));
      if (missing.length > 0) {
        problems.push([route, `BreadcrumbList names crumbs the page does not show: ${missing.join(", ")}`]);
      }
    }
  }

  return problems;
}

/** Paths that are real routes but not HTML pages, so the crawl will not find
 *  a document for them. */
const KNOWN_NON_PAGE = [/^\/feed$/, /^\/llms\.txt$/, /^\/sitemap\.xml$/, /^\/robots\.txt$/, /^\/portfolio/];

/**
 * i18n — Phase F.
 *
 * The reciprocity rule is the one worth having. Google honours an `hreflang`
 * annotation only when the page it names points back; a one-way pair is not a
 * weak signal, it is discarded entirely. That is invisible on either page on
 * its own — each looks perfectly correct — and only shows up when you hold the
 * two side by side, which is what this does for every pair at once.
 *
 * The chrome check is the other half of Phase F: a Devanagari article wrapped
 * in an English nav reads as a translation somebody abandoned, and it is the
 * kind of thing that regresses silently the moment a new label is added to the
 * header without a Nepali counterpart.
 */
function checkI18n(pages) {
  const problems = [];
  const byRoute = new Map(pages.map((p) => [p.route, p]));

  /** hreflang links on a page, as [hreflang, path]. Next emits the attribute
   *  as `hrefLang`; HTML attribute names are case-insensitive, so is this. */
  const alternatesOf = (html) =>
    [...html.split("</head>")[0].matchAll(
      /<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/gi,
    )].map((m) => [m[1], m[2].replace(SITE_URL, "") || "/"]);

  for (const { route, html } of pages) {
    const alternates = alternatesOf(html);
    if (alternates.length === 0) continue; // no counterpart declared, nothing to check

    const paths = new Map(alternates);
    if (!paths.has("x-default")) {
      problems.push([route, "declares hreflang alternates but no x-default"]);
    }

    for (const [lang, path] of alternates) {
      if (!byRoute.has(path)) {
        problems.push([route, `hreflang="${lang}" points at ${path}, which is not a page`]);
        continue;
      }
      if (lang === "x-default") continue;

      // Reciprocity: the page named must name this one back, under some lang.
      const back = alternatesOf(byRoute.get(path).html).map(([, p]) => p);
      if (path !== route && !back.includes(route)) {
        problems.push([route, `hreflang="${lang}" names ${path}, which does not point back`]);
      }
    }
  }

  // Chrome: a Nepali page should not be sitting inside an English header.
  for (const { route, html } of pages) {
    if (!route.startsWith("/ne/") && route !== "/ne") continue;
    const nav = html.replace(/<script[\s\S]*?<\/script>/gi, " ")
      .match(/<nav aria-label="Main navigation"[\s\S]*?<\/nav>/i);
    if (!nav) {
      problems.push([route, "no main navigation found to check"]);
      continue;
    }
    const text = textOf(nav[0]);
    for (const english of ENGLISH_NAV_LABELS) {
      if (text.includes(english)) {
        problems.push([route, `main navigation still renders the English label "${english}"`]);
      }
    }
    if (!/[\u0900-\u097F]/.test(text)) {
      problems.push([route, "main navigation renders no Devanagari at all"]);
    }
  }

  return problems;
}

/** Labels that must not appear in the header of a Nepali page. Deliberately
 *  not "Home" — it is a substring of too much else. */
const ENGLISH_NAV_LABELS = ["Our Story", "Blogs", "Contact", "Favourites"];

/**
 * Links — Phase G.
 *
 * Anchor text is the strongest signal a page can send about what it is
 * linking to, and the three ways it goes wrong are all invisible in a browser:
 * a link whose text is a URL says nothing about the destination, a link with
 * no text at all says nothing to a screen reader, and an image-only link with
 * no alt is a dead end for both.
 *
 * They survive review because each looks fine on the page — a raw URL renders
 * as a URL and reads as a link, an icon renders as an icon. Only reading the
 * markup of every anchor on the site at once turns them up.
 */
function checkLinks(pages) {
  const problems = [];

  for (const { route, html } of pages) {
    const body = html.replace(/<script[\s\S]*?<\/script>/gi, " ");
    for (const m of body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
      const [, attrs, inner] = m;
      const href = attrs.match(/href="([^"]*)"/i)?.[1] ?? "";
      const ariaLabel = attrs.match(/aria-label="([^"]*)"/i)?.[1] ?? "";
      const text = textOf(inner);

      // An accessible name from any of the three places one can come from.
      const imgAlt = [...inner.matchAll(/<img\b[^>]*?\balt="([^"]*)"/gi)]
        .map((x) => x[1]).filter(Boolean).join(" ");
      const name = (text || ariaLabel || imgAlt).trim();

      if (!name) {
        problems.push([route, `link to ${href || "(no href)"} has no text, aria-label or image alt`]);
        continue;
      }

      // Only judge the *visible* text — a raw URL behind a proper aria-label
      // is still a raw URL to a sighted reader and to a crawler reading anchor
      // text, so this deliberately checks `text`, not `name`.
      if (text) {
        if (/^https?:\/\//i.test(text) || /^www\./i.test(text)) {
          problems.push([route, `anchor text is a URL: ${JSON.stringify(text.slice(0, 60))}`]);
        } else if (text.startsWith("/") && text.length > 1) {
          problems.push([route, `anchor text is a path: ${JSON.stringify(text.slice(0, 60))}`]);
        }
      }
    }
  }

  return problems;
}

const GROUPS = [
  ["headings", checkHeadings],
  ["meta", checkMeta],
  ["architecture", checkArchitecture],
  ["i18n", checkI18n],
  ["links", checkLinks],
];

// ─── Run ────────────────────────────────────────────────────────────────────

const pages = await loadPages(liveBaseFrom(process.argv.slice(2)));
if (pages.length === 0) {
  console.error("✗ no pages found. Run `next build` first, or pass --live.");
  process.exit(1);
}

const sitemap = await sitemapPaths(liveBaseFrom(process.argv.slice(2)));

const problems = [];
const ran = [];
for (const [name, check] of GROUPS) {
  const found = check(pages, sitemap);
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
