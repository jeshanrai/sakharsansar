/**
 * Loading the site's pages, for the checks that read them.
 *
 * Two sources, same shape. The build output is the default: every route in
 * this project is prerendered, so `.next/server/app` is the whole truth about
 * what ships, it needs no network, and a check that reads it fails the build
 * instead of reporting on a deploy that already happened. `--live` crawls the
 * published sitemap instead, which answers a different and occasionally
 * necessary question — what is actually being served right now.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

export const BUILD_ROOT = ".next/server/app";
export const DEFAULT_BASE = "https://www.sakharsansar.com.np";

/**
 * Routes excluded from every check.
 *
 * Next's internal pages (`_not-found`, `_global-error`) are status responses
 * rather than documents, and the admin portal is robots-disallowed — none of
 * them are a ranking surface, and holding them to rules about unique titles
 * and canonical URLs produces noise that gets checks switched off.
 */
export const EXEMPT = [/^\/_/, /^\/portfolio(\/|$)/];

/** Read `--live` / `--live=https://…` off argv. Returns null when absent. */
export function liveBaseFrom(argv) {
  const arg = argv.find((a) => a === "--live" || a.startsWith("--live="));
  if (!arg) return null;
  return (arg.split("=")[1] || DEFAULT_BASE).replace(/\/$/, "");
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

async function fromBuild() {
  const pages = [];
  for await (const file of walk(BUILD_ROOT)) {
    const route =
      "/" + relative(BUILD_ROOT, file).replace(/\.html$/, "").replace(/^index$/, "");
    if (EXEMPT.some((re) => re.test(route))) continue;
    pages.push({
      route: route.length > 1 ? route.replace(/\/$/, "") : "/",
      html: await readFile(file, "utf8"),
    });
  }
  return pages;
}

async function fromLive(base) {
  const res = await fetch(`${base}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const urls = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    m[1].trim(),
  );
  const pages = [];
  for (const url of urls) {
    const page = await fetch(url);
    pages.push({
      route: new URL(url).pathname || "/",
      html: await page.text(),
      status: page.status,
    });
  }
  return pages;
}

/** `[{ route, html }]` for every page the checks should look at. */
export async function loadPages(liveBase = null) {
  const pages = liveBase ? await fromLive(liveBase) : await fromBuild();
  return pages.sort((a, b) => a.route.localeCompare(b.route));
}

/**
 * Tags out, text as a reader sees it.
 *
 * Tags are removed without substituting a space, which looks wrong and is not:
 * JSX keeps the real whitespace between elements in the output, so "Your
 * <span>favourites</span>." collapses to "Your favourites." rather than
 * "Your favourites ." — and a heading split across lines in the source still
 * separates, because the newline and indent are themselves text.
 */
export function textOf(html) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The words a visitor actually sees on a page.
 *
 * Scripts go first, and that matters more than it looks: Next inlines the RSC
 * payload, which repeats every price, product name and heading as JSON. A
 * check that searched the raw HTML for rendered text would pass on a page that
 * renders none of it — it would be measuring itself.
 */
export function visibleText(html) {
  return textOf(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, ""),
  );
}

/** Every heading on the page, in document order, scripts excluded. */
export function headingsOf(html) {
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, "");
  return [...body.matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => ({
    level: Number(m[1][1]),
    text: textOf(m[2]),
  }));
}
