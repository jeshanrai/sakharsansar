/**
 * Fails the build when a page's structured data is wrong, incomplete, or
 * disagrees with what the page renders.
 *
 * Structured data is the one part of a page nobody proofreads, because nobody
 * sees it. A property written the wrong way round, an `@id` pointing at a node
 * that was renamed, a price that drifted from the price on the page — all of
 * them are invisible in review, invisible in the browser, and none of them
 * throw. They surface weeks later as a Merchant Center rejection or a rich
 * result that quietly stops appearing.
 *
 * Two of those had already happened here. The Person node carried
 * `founder: {@id: organization}` — "Rashmita was founded by SakharSansar" —
 * which is not a property a Person has, so the site's central claim about who
 * is behind it was never actually being made. And the return policy markup
 * said `ReturnByMail` while /refund-policy asks for photographs and posts
 * nothing back.
 *
 * What it asserts, per Phase B.3:
 *   - every page carries at least one JSON-LD block, and every block parses
 *   - every `@id` reference resolves to a node defined somewhere on the site
 *   - required fields are present for each type
 *   - a Product's schema price is the price the page actually renders
 *   - no `aggregateRating` on a page that renders no visible review
 *
 * Runs against `.next/server/app` after `next build`, like check-meta: every
 * route here is prerendered, so the built HTML is the whole truth and the
 * check gates the deploy rather than reporting on it afterwards.
 *
 *   npm run check:schema
 *   npm run check:schema -- --live            # crawl the live sitemap instead
 *   npm run check:schema -- --live=https://…  # or another origin
 */
import { liveBaseFrom, loadPages, visibleText } from "./lib/pages.mjs";

/**
 * Fields each type must carry, keyed by the type name.
 *
 * Kept to what Google actually requires for the corresponding rich result plus
 * what this site has committed to emitting — not the full schema.org surface.
 * A checklist nobody can satisfy gets switched off, which is worse than a
 * short one that stays on.
 */
const REQUIRED = {
  Organization: ["name", "url"],
  WebSite: ["url", "name", "publisher", "inLanguage"],
  Person: ["name"],
  Product: ["name", "image", "description", "offers", "sku", "brand"],
  Offer: ["price", "priceCurrency", "availability", "url"],
  BlogPosting: [
    "headline",
    "description",
    "image",
    "datePublished",
    "dateModified",
    "author",
    "publisher",
    "inLanguage",
    "mainEntityOfPage",
  ],
  BreadcrumbList: ["itemListElement"],
  FAQPage: ["mainEntity"],
  ItemList: ["itemListElement", "numberOfItems"],
  Recipe: ["name", "image", "recipeIngredient", "recipeInstructions", "author"],
  WebPage: ["name", "url", "description"],
  CollectionPage: ["name", "url", "description"],
  AboutPage: ["name", "url", "description"],
  ContactPage: ["name", "url", "description"],
  ProfilePage: ["name", "url", "mainEntity"],
  Blog: ["name", "url"],
};

/** Google truncates a BlogPosting headline past this and flags it as a warning. */
const HEADLINE_MAX = 110;

const liveBase = liveBaseFrom(process.argv.slice(2));

// ─── Reading the markup ─────────────────────────────────────────────────────

/** Every JSON-LD node on a page, flattened out of its @graph wrappers. */
function nodesIn(html, route, problems) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  if (blocks.length === 0) {
    problems.push([route, "no JSON-LD on the page at all"]);
    return [];
  }
  const nodes = [];
  for (const [, raw] of blocks) {
    let data;
    try {
      // JsonLd escapes "<" so a stray "</script>" cannot close the tag early.
      data = JSON.parse(raw.replace(/\\u003c/gi, "<"));
    } catch (err) {
      problems.push([route, `a JSON-LD block does not parse: ${err.message}`]);
      continue;
    }
    nodes.push(...(data["@graph"] ?? [data]));
  }
  return nodes;
}

const typesOf = (node) => {
  const t = node?.["@type"];
  return Array.isArray(t) ? t : t ? [t] : [];
};

/**
 * Walk a node tree, separating definitions from references.
 *
 * A definition is any object carrying an `@id` alongside something else — it
 * says what that entity is. A reference is an object whose only key is `@id`;
 * it points at a definition made elsewhere, possibly on another page. The
 * distinction is the whole check: a reference nothing defines is a dangling
 * pointer, and a crawler drops it silently.
 */
function collect(node, route, defs, refs, seen = new Set()) {
  if (node === null || typeof node !== "object") return;
  if (seen.has(node)) return;
  seen.add(node);

  if (Array.isArray(node)) {
    for (const item of node) collect(item, route, defs, refs, seen);
    return;
  }

  const keys = Object.keys(node);
  const id = node["@id"];
  if (typeof id === "string") {
    if (keys.length === 1) refs.push({ id, route });
    else if (!defs.has(id)) defs.set(id, { types: typesOf(node), route });
  }

  for (const key of keys) {
    if (key === "@id" || key === "@type" || key === "@context") continue;
    collect(node[key], route, defs, refs, seen);
  }
}

// ─── The checks ─────────────────────────────────────────────────────────────

const pages = await loadPages(liveBase);
if (pages.length === 0) {
  console.error(`✗ no pages found. Run \`next build\` first, or pass --live.`);
  process.exit(1);
}

const problems = [];
/** @id -> { types, route } for every node defined anywhere on the site. */
const definitions = new Map();
const references = [];
let nodeCount = 0;

for (const { route, html } of pages) {
  const nodes = nodesIn(html, route, problems);
  nodeCount += nodes.length;
  const text = visibleText(html);

  for (const node of nodes) {
    collect(node, route, definitions, references);

    for (const type of typesOf(node)) {
      const required = REQUIRED[type];
      if (!required) continue;
      const missing = required.filter((f) => node[f] === undefined || node[f] === null);
      if (missing.length > 0) {
        problems.push([route, `${type} is missing: ${missing.join(", ")}`]);
      }
    }

    if (typesOf(node).includes("BlogPosting")) {
      const headline = node.headline ?? "";
      if ([...headline].length > HEADLINE_MAX) {
        problems.push([
          route,
          `BlogPosting headline is ${[...headline].length} chars, over ${HEADLINE_MAX} — Google truncates it`,
        ]);
      }
    }

    if (typesOf(node).includes("Product")) {
      const offer = node.offers;
      const offers = Array.isArray(offer) ? offer : offer ? [offer] : [];
      for (const o of offers) {
        for (const f of REQUIRED.Offer) {
          if (o[f] === undefined) problems.push([route, `Product Offer is missing: ${f}`]);
        }
        // The drift that gets an offer rejected: schema says one number, the
        // page shows another. Accept the grouped form the page prints.
        const price = String(o.price ?? "");
        if (price) {
          const grouped = Number(price).toLocaleString("en-US");
          const shown = text.includes(price) || text.includes(grouped);
          if (!shown) {
            problems.push([
              route,
              `Product offer price ${price} does not appear anywhere the visitor can see it`,
            ]);
          }
        }
      }
    }

    // Phase H owns earning real reviews. Until it lands, rating markup on a
    // page with nothing to back it is a manual action waiting to happen — so
    // the value and the count both have to be readable on the page itself.
    const rating = node.aggregateRating;
    if (rating) {
      const value = String(rating.ratingValue ?? "");
      const count = String(rating.reviewCount ?? rating.ratingCount ?? "");
      if (!value || !text.includes(value) || !count || !text.includes(count)) {
        problems.push([
          route,
          `aggregateRating (${value || "?"} from ${count || "?"}) is not rendered as visible review content`,
        ]);
      }
    }
  }
}

for (const { id, route } of references) {
  if (!definitions.has(id)) {
    problems.push([route, `@id reference resolves to nothing: ${id}`]);
  }
}

// ─── Report ─────────────────────────────────────────────────────────────────

if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} structured-data problem(s) across ${pages.length} pages:\n`);
  const byRoute = new Map();
  for (const [route, reason] of problems) {
    if (!byRoute.has(route)) byRoute.set(route, []);
    byRoute.get(route).push(reason);
  }
  for (const [route, reasons] of [...byRoute].sort()) {
    console.error(`  ${route}`);
    for (const r of [...new Set(reasons)]) console.error(`    ${r}`);
  }
  console.error("");
  process.exit(1);
}

console.log(
  `✓ ${nodeCount} JSON-LD nodes across ${pages.length} pages: ` +
    `${definitions.size} entities defined, ${references.length} references all resolve`,
);
