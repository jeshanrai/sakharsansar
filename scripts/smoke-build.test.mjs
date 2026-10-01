/**
 * Proves the smoke test fails when the site is broken.
 *
 * A post-deploy check is only worth having if it goes red on the thing it was
 * written to catch, and the way you find out that it does not is the same way
 * we found out last time: an audit reports a stale route, the check is green,
 * and there is no way to tell whether the site is fine or the check is blind.
 * `smoke-build.mjs` reads the live network, so it cannot be exercised against a
 * real regression without breaking production first.
 *
 * So this stands up a server that lies in each of the specific ways a bad
 * deploy lies, and runs the real script — unmodified, as a subprocess, over
 * real HTTP — against it. What is asserted is the exit code, because that is
 * the whole contract with CI: non-zero fails the deploy, and a check that only
 * logs is decoration.
 *
 * The scenarios are the four failures that have actually happened or were
 * plausibly next:
 *
 *   1. every route on one build            → passes
 *   2. one route on an older build         → fails (the CDN split)
 *   3. one route with no build-ID meta     → fails (this was /shop: HTML from
 *                                            before the build-ID tag existed,
 *                                            so it could not report drift)
 *   4. whole site consistent but not the   → fails only with --expect (the
 *      build that was just deployed          deploy that silently did not run)
 *   5. one route current but serving the   → fails (old copy restored by a
 *      old ratings and footer                revert, not a cache)
 *
 *   npm run smoke:test
 */
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";

const CURRENT = "aaaaaaaaaaaa";
const STALE = "bbbbbbbbbbbb";

/** The routes the fake sitemap advertises, plus the two the script adds itself. */
const ROUTES = ["/", "/shop", "/shop/blocks", "/blog"];

function page(buildId, body = "x") {
  const meta =
    buildId === null ? "" : `<meta name="x-build-id" content="${buildId}">`;
  return `<!doctype html><html><head>${meta}<title>t</title></head><body>${body}</body></html>`;
}

/** The old /shop: ratings and footer copy that were removed from the site. */
const OLD_SHOP_BODY =
  `<span>4.6 (491)</span><footer>a cooperative of 42 farming families` +
  `<a href="https://instagram.com/sakharsansar">ig</a></footer>`;

/**
 * @param builds  path → build id, or null for "serves HTML with no meta tag"
 * @param bodies  path → page body, for routes that serve particular copy
 */
function startServer(builds, bodies = {}) {
  const server = createServer((req, res) => {
    const path = new URL(req.url, "http://x").pathname;

    if (path === "/sitemap.xml") {
      const xml =
        `<?xml version="1.0" encoding="UTF-8"?><urlset>` +
        ROUTES.map((p) => `<loc>http://127.0.0.1:${port}${p}</loc>`).join("") +
        `</urlset>`;
      res.writeHead(200, { "content-type": "application/xml" });
      return res.end(xml);
    }

    // The script deliberately probes a path that will never exist.
    if (path.startsWith("/this-page-does-not-exist")) {
      res.writeHead(404, { "content-type": "text/html" });
      return res.end(page(builds["/"] ?? CURRENT));
    }

    if (!(path in builds)) {
      res.writeHead(404, { "content-type": "text/html" });
      return res.end(page(null));
    }

    res.writeHead(200, { "content-type": "text/html" });
    res.end(page(builds[path], bodies[path]));
  });

  server.listen(0, "127.0.0.1");
  var port = 0;
  return once(server, "listening").then(() => {
    port = server.address().port;
    return { server, base: `http://127.0.0.1:${port}` };
  });
}

/** Run the real smoke script and resolve its exit code and output. */
function runSmoke(base, extra = []) {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      ["scripts/smoke-build.mjs", `--base=${base}`, ...extra],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (out += d));
    child.on("close", (code) => resolve({ code, out }));
  });
}

/** Every route the fake site serves, all on `id`. */
const allOn = (id) =>
  Object.fromEntries([...ROUTES, "/favourites"].map((p) => [p, id]));

const SCENARIOS = [
  {
    name: "every route on one build",
    builds: allOn(CURRENT),
    args: [],
    expect: 0,
  },
  {
    name: "one route left on an older build (CDN split)",
    builds: { ...allOn(CURRENT), "/shop": STALE },
    args: [],
    expect: 1,
  },
  {
    name: "one route serving HTML with no build-ID meta at all",
    builds: { ...allOn(CURRENT), "/shop": null },
    args: [],
    expect: 1,
  },
  {
    name: "site internally consistent but not the build just deployed",
    builds: allOn(STALE),
    args: [`--expect=${CURRENT}`],
    expect: 1,
  },
  {
    name: "one route on the current build but serving retired copy",
    builds: allOn(CURRENT),
    bodies: { "/shop": OLD_SHOP_BODY },
    args: [],
    expect: 1,
  },
];

let failures = 0;

for (const s of SCENARIOS) {
  const { server, base } = await startServer(s.builds, s.bodies);
  const { code, out } = await runSmoke(base, s.args);
  server.close();
  await once(server, "close");

  const ok = code === s.expect;
  if (!ok) failures++;

  console.log(`${ok ? "✓" : "✗"} ${s.name}`);
  console.log(`    expected exit ${s.expect}, got ${code}`);
  const summary = out
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("✓") || l.startsWith("✗") || /^\/|^build |^whole site/.test(l))
    .slice(0, 5);
  for (const line of summary) console.log(`      ${line}`);
  console.log("");
}

if (failures > 0) {
  console.error(`✗ ${failures} of ${SCENARIOS.length} scenarios did not behave as specified`);
  process.exit(1);
}

console.log(`✓ all ${SCENARIOS.length} scenarios behaved as specified — the smoke test fails a deploy on drift`);
