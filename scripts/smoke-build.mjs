/**
 * Proves that every route on the live site is serving the same build.
 *
 * This exists because of a stale-content report that nobody could confirm or
 * refute. The claim was that /shop, /blog and the product pages were serving
 * HTML from an older deploy than / and /wholesale — different footer copy,
 * ratings that had been deleted, a shipping figure that had been changed. The
 * copy in the repo was correct, so the only way to check was to read the pages
 * and compare their wording, one phrase at a time, and hope you had thought of
 * every phrase that changed.
 *
 * That is not a check, it is an argument. A page that cannot say which build
 * it came from cannot be shown to be current, and "I purged the cache and it
 * looks right now" is not evidence that survives the next deploy.
 *
 * So every page stamps `<meta name="x-build-id">` (see src/lib/build-id.ts),
 * and this reads it back off the network. One value across every URL in the
 * sitemap means one build is serving the whole site. Two values is a split,
 * and the script prints which routes are on which.
 *
 * Deliberately does NOT bust the cache. The question is what a visitor and a
 * crawler are served right now, including every layer of CDN in front of the
 * app — a request with cache-busting headers answers a question nobody asked.
 *
 *   npm run smoke:build
 *   npm run smoke:build -- --base=https://staging.example.com
 *   npm run smoke:build -- --expect=$VERCEL_GIT_COMMIT_SHA
 *
 * `--expect` is the stronger assertion, and the one worth running after a
 * deploy: it fails when the site is internally consistent but consistently
 * old, which is what a deploy that silently did not happen looks like.
 */

const DEFAULT_BASE = "https://www.sakharsansar.com.np";

/**
 * Checked even though the sitemap does not list them.
 *
 * /favourites and the 404 are noindex, so listing them in a sitemap would be a
 * Search Console warning — but they are still pages people are served, and a
 * split that only affects them is still a split. The 404 path is deliberately
 * one that will never exist.
 */
const EXTRA_PATHS = ["/favourites", "/this-page-does-not-exist-smoke-test"];

/** Paths whose HTTP status is expected to be something other than 200. */
const EXPECTED_STATUS = new Map([["/this-page-does-not-exist-smoke-test", 404]]);

/** Polite concurrency. The site is small; hammering it proves nothing. */
const CONCURRENCY = 6;

const args = process.argv.slice(2);
const flag = (name) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
};

const base = (flag("base") ?? process.env.SMOKE_BASE_URL ?? DEFAULT_BASE).replace(/\/$/, "");
const expected = (flag("expect") ?? process.env.SMOKE_EXPECT_BUILD_ID)?.slice(0, 12);

/** Pull every <loc> out of the live sitemap. Regex rather than an XML parser
 *  because the shape is ours and adding a dependency to a smoke test that runs
 *  in CI is a worse trade than the regex. */
async function sitemapUrls() {
  const res = await fetch(`${base}/sitemap.xml`, { redirect: "follow" });
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (urls.length === 0) throw new Error("sitemap.xml parsed but listed no URLs");
  return urls;
}

async function probe(url) {
  const path = new URL(url).pathname || "/";
  try {
    const res = await fetch(url, { redirect: "manual" });
    const html = res.headers.get("content-type")?.includes("text/html")
      ? await res.text()
      : "";
    const match = html.match(/<meta name="x-build-id" content="([^"]*)"/);
    return {
      url,
      path,
      status: res.status,
      buildId: match?.[1] ?? null,
      // Kept for the failure report — a split is almost always a cache layer,
      // and these two headers say which one and how old the copy is.
      cache: res.headers.get("x-vercel-cache") ?? res.headers.get("cf-cache-status") ?? "",
      age: res.headers.get("age") ?? "",
    };
  } catch (err) {
    return { url, path, status: 0, buildId: null, error: String(err), cache: "", age: "" };
  }
}

/** Run `worker` over `items`, at most CONCURRENCY in flight. */
async function pool(items, worker) {
  const results = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (next < items.length) results.push(await worker(items[next++]));
    }),
  );
  return results;
}

const urls = [...(await sitemapUrls()), ...EXTRA_PATHS.map((p) => `${base}${p}`)];
console.log(`Probing ${urls.length} URLs on ${base}\n`);

const results = await pool(urls, probe);
results.sort((a, b) => a.path.localeCompare(b.path));

const problems = [];

for (const r of results) {
  const want = EXPECTED_STATUS.get(r.path) ?? 200;
  if (r.status !== want) {
    problems.push(`${r.path} — HTTP ${r.status || r.error}, expected ${want}`);
  } else if (!r.buildId) {
    problems.push(`${r.path} — no <meta name="x-build-id"> in the served HTML`);
  }
}

// Group by build id. One bucket is the pass condition; the buckets themselves
// are the diagnosis when it fails.
const buckets = new Map();
for (const r of results) {
  if (!r.buildId) continue;
  if (!buckets.has(r.buildId)) buckets.set(r.buildId, []);
  buckets.get(r.buildId).push(r);
}

if (buckets.size > 1) {
  problems.push(`${buckets.size} different build IDs are serving at once`);
} else if (expected && buckets.size === 1 && !buckets.has(expected)) {
  problems.push(
    `whole site is on build ${[...buckets.keys()][0]}, but this deploy is ${expected} — ` +
      `the site is consistent but not current`,
  );
}

if (problems.length > 0) {
  console.error(`✗ ${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`  ${p}`);

  if (buckets.size > 1) {
    console.error(`\nThe split:\n`);
    for (const [id, rows] of [...buckets].sort((a, b) => b[1].length - a[1].length)) {
      console.error(`  build ${id} — ${rows.length} route(s)`);
      for (const r of rows) {
        console.error(`    ${r.path}${r.cache ? `  [${r.cache}${r.age ? ` age=${r.age}s` : ""}]` : ""}`);
      }
      console.error("");
    }
    console.error(
      `A split means one deploy did not reach every route. Check the deploy log\n` +
        `for a partial build, then purge the CDN for the routes on the older ID.\n`,
    );
  }
  process.exit(1);
}

const [id] = [...buckets.keys()];
console.log(`✓ all ${results.length} routes are serving build ${id}${expected ? " (matches this deploy)" : ""}`);
