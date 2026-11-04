/**
 * Fails the build when any internal URL a page points at answers 4xx or 5xx.
 *
 * seo-audit's architecture check asks "is this path a page in the build?",
 * which is a filesystem question. This one asks the network question a
 * crawler asks: start the built site, request every internal URL every page
 * references — links, images, srcset candidates, stylesheets, scripts,
 * icons, preloads, og:image — and read the status code. Dynamic routes,
 * redirects in next.config.ts, /_next/image and the OG image routes are all
 * exercised the way they are served.
 *
 * Two rules:
 *   - any 4xx or 5xx is a failure, on any URL type
 *   - an <a href> to an internal URL that redirects is a failure too. Retired
 *     slugs redirect so that old inbound links keep working; our own pages
 *     should link to the destination, not through the redirect.
 *
 * The crawl starts at /, /ne, every route in the build and every URL in the
 * sitemap, then follows internal links until nothing new turns up, so the /ne
 * mirror and anything linked but unlisted are covered.
 *
 * In `--live` mode it reads what is actually served, Cloudflare included. On
 * 4 Nov 2026 that was the only place the Semrush "71 broken internal links"
 * showed up: Cloudflare Email Obfuscation rewrites the footer's mailto: on
 * every page into /cdn-cgi/l/email-protection, which 404s to a crawler.
 *
 *   npm run check:links                        # starts `next start` on the build
 *   npm run check:links -- --live              # the published site
 *   npm run check:links -- --live=https://…
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { BUILD_ROOT, liveBaseFrom, loadPages } from "./lib/pages.mjs";

const OWN_HOSTS = new Set(["www.sakharsansar.com.np", "sakharsansar.com.np"]);
const CONCURRENCY = 8;

/** Admin portal: robots-disallowed and behind auth. Not crawled, and not linked
 *  from public pages anyway (seo-audit would catch that). */
const SKIP = [/^\/portfolio(\/|$)/];

const liveBase = liveBaseFrom(process.argv.slice(2));

// ─── Server ─────────────────────────────────────────────────────────────────

function freePort() {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.unref();
    srv.on("error", reject);
    srv.listen(0, "127.0.0.1", () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

async function startServer() {
  const port = await freePort();
  const child = spawn("npx", ["next", "start", "-p", String(port), "-H", "127.0.0.1"], {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NODE_ENV: "production" },
  });
  let log = "";
  child.stdout.on("data", (d) => (log += d));
  child.stderr.on("data", (d) => (log += d));
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 120; i++) {
    if (child.exitCode !== null) throw new Error(`next start exited:\n${log}`);
    try {
      await fetch(`${base}/robots.txt`);
      return { base, stop: () => child.kill("SIGTERM") };
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  child.kill("SIGTERM");
  throw new Error(`next start did not answer within 60s:\n${log}`);
}

// ─── Extraction ─────────────────────────────────────────────────────────────

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');

/** Every URL a page references, as [kind, raw value]. Scripts' bodies (the RSC
 *  payload, JSON-LD) are excluded: they are data, not references a crawler
 *  follows. `<script src>` is kept. */
function referencesIn(html) {
  const out = [];
  const tags = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (m) => m.slice(0, m.indexOf(">") + 1));
  for (const [, name, attrs] of tags.matchAll(/<(a|img|link|source|script|meta|video|iframe)\b([^>]*)>/gi)) {
    const el = name.toLowerCase();
    const attr = (a) => attrs.match(new RegExp(`\\s${a}="([^"]*)"`, "i"))?.[1];
    if (el === "a" && attr("href")) out.push(["link", attr("href")]);
    if (el === "link" && attr("href")) {
      const rel = (attr("rel") ?? "").toLowerCase();
      // preconnect / dns-prefetch name an origin, not a resource.
      if (!/preconnect|dns-prefetch/.test(rel)) out.push([`link rel=${rel}`, attr("href")]);
    }
    if (["img", "script", "source", "video", "iframe"].includes(el) && attr("src")) out.push([el, attr("src")]);
    if (el === "video" && attr("poster")) out.push(["video poster", attr("poster")]);
    for (const set of [attr("srcset"), attr("imagesrcset")]) {
      if (!set) continue;
      for (const candidate of decode(set).split(/,\s+/)) {
        const url = candidate.trim().split(/\s+/)[0];
        if (url) out.push([`${el} srcset`, url]);
      }
    }
    if (el === "meta") {
      const content = attr("content");
      if (content && /^https?:\/\//.test(content)) out.push([`meta ${attr("property") ?? attr("name")}`, content]);
    }
  }
  return out;
}

/** Normalise a reference to an absolute URL on `base`, or null if external. */
function internalUrl(raw, pageUrl, base) {
  const value = decode(raw).trim();
  if (!value || /^(mailto|tel|sms|javascript|data|viber|whatsapp):/i.test(value) || value.startsWith("#")) {
    return null;
  }
  let url;
  try {
    url = new URL(value, pageUrl);
  } catch {
    return `${base}/__malformed__/${encodeURIComponent(value)}`;
  }
  const origin = new URL(base);
  if (url.host !== origin.host && !OWN_HOSTS.has(url.hostname)) return null;
  url.protocol = origin.protocol;
  url.host = origin.host;
  url.hash = "";
  return url.toString();
}

// ─── Crawl ──────────────────────────────────────────────────────────────────

async function pool(items, worker) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length > 0) await worker(queue.shift());
    }),
  );
}

async function crawl(base, seeds) {
  /** url -> { status, location } */
  const results = new Map();
  /** url -> [{ from, kind }] */
  const referrers = new Map();
  const pagesSeen = new Set();
  let frontier = seeds.map((p) => new URL(p, base).toString());

  const request = async (url) => {
    try {
      const res = await fetch(url, { redirect: "manual" });
      const type = res.headers.get("content-type") ?? "";
      const body = res.status === 200 && type.includes("text/html") ? await res.text() : null;
      if (body === null) await res.body?.cancel();
      results.set(url, { status: res.status, location: res.headers.get("location"), body });
    } catch (err) {
      results.set(url, { status: 0, location: String(err.cause?.code ?? err.message), body: null });
    }
  };

  while (frontier.length > 0) {
    const batch = [...new Set(frontier)].filter((u) => !pagesSeen.has(u));
    batch.forEach((u) => pagesSeen.add(u));
    frontier = [];
    await pool(batch.filter((u) => !results.has(u)), request);

    const found = [];
    for (const pageUrl of batch) {
      const page = results.get(pageUrl);
      if (!page?.body) continue;
      for (const [kind, raw] of referencesIn(page.body)) {
        const url = internalUrl(raw, pageUrl, base);
        if (!url) continue;
        if (SKIP.some((re) => re.test(new URL(url).pathname))) continue;
        if (!referrers.has(url)) referrers.set(url, []);
        referrers.get(url).push({ from: new URL(pageUrl).pathname, kind });
        found.push([url, kind]);
      }
    }
    await pool([...new Set(found.map(([u]) => u))].filter((u) => !results.has(u)), request);
    for (const [url, kind] of found) {
      if (kind === "link" && results.get(url)?.body && !pagesSeen.has(url)) frontier.push(url);
    }
  }
  return { results, referrers, pages: [...pagesSeen].filter((u) => results.get(u)?.body) };
}

// ─── Run ────────────────────────────────────────────────────────────────────

let server = null;
let base = liveBase;
const seeds = ["/", "/ne", "/favourites"];

if (!liveBase) {
  const built = await loadPages(null);
  if (built.length === 0) {
    console.error(`✗ no pages in ${BUILD_ROOT}. Run \`next build\` first, or pass --live.`);
    process.exit(1);
  }
  seeds.push(...built.map((p) => p.route));
  server = await startServer();
  base = server.base;
}

let exitCode = 0;
try {
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  for (const [, loc] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    seeds.push(new URL(loc.trim()).pathname);
  }

  const { results, referrers, pages } = await crawl(base, seeds);

  const failures = [];
  for (const [url, refs] of referrers) {
    const { status, location } = results.get(url) ?? {};
    const path = url.slice(base.length) || "/";
    const linkRefs = refs.filter((r) => r.kind === "link");
    if (status === 0 || status >= 400) {
      failures.push({ path, status: status || `ERR ${location}`, refs });
    } else if (status >= 300 && linkRefs.length > 0) {
      const to = location ? location.replace(base, "") : "?";
      failures.push({ path, status: `${status} → ${to} (link to the destination instead)`, refs: linkRefs });
    }
  }
  const nePages = pages.filter((u) => new URL(u).pathname.startsWith("/ne")).length;

  if (failures.length > 0) {
    exitCode = 1;
    console.error(`\n✗ ${failures.length} broken internal URL(s) across ${pages.length} pages (${base}):\n`);
    for (const { path, status, refs } of failures.sort((a, b) => b.refs.length - a.refs.length)) {
      const from = [...new Set(refs.map((r) => r.from))];
      console.error(`  ${status}  ${path}`);
      console.error(`    ${refs[0].kind}, from ${from.length} page(s): ${from.slice(0, 5).join(", ")}${from.length > 5 ? ", …" : ""}`);
    }
    console.error("");
  } else {
    console.log(
      `✓ ${referrers.size} internal URLs referenced from ${pages.length} pages (${nePages} under /ne): ` +
        `none 4xx/5xx, no links through a redirect`,
    );
  }
} finally {
  server?.stop();
}
process.exit(exitCode);
