/**
 * Fails the build when robots.txt is not valid robots.txt.
 *
 * Semrush flagged "Invalid robots.txt format" on 4 Nov 2026. Two things in
 * the served file caused it, and neither throws anywhere:
 *
 *   - `Host:` from src/app/robots.ts. It is a Yandex-only directive whose
 *     value is a bare hostname; we were emitting a full URL. Nothing else
 *     reads it, and validators treat it as an unknown line.
 *   - Cloudflare's managed robots.txt, prepended at the edge. It adds a
 *     `Content-Signal:` line (not a robots.txt field) and a second group for
 *     `*`, GPTBot, ClaudeBot, Google-Extended and others, so the same crawler
 *     is told both `Disallow: /` and `Allow: /`. That one can only be seen in
 *     `--live` mode, because it does not exist in the build.
 *
 * The rules are RFC 9309 plus `Sitemap`, which every major crawler reads:
 *
 *   - every non-comment line is `field: value`
 *   - the field is user-agent, allow, disallow or sitemap
 *   - allow/disallow come after a user-agent line, and their value is empty
 *     or starts with "/" or "*"
 *   - no user-agent is named in two groups (crawlers disagree on whether to
 *     merge them or take the first, so the file means different things to
 *     different bots)
 *   - at least one sitemap, as an absolute http(s) URL
 *
 *   npm run check:robots
 *   npm run check:robots -- --live            # the file actually served
 *   npm run check:robots -- --live=https://…
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { BUILD_ROOT, liveBaseFrom } from "./lib/pages.mjs";

const FIELDS = new Set(["user-agent", "allow", "disallow", "sitemap"]);

const liveBase = liveBaseFrom(process.argv.slice(2));

let text;
let source;
if (liveBase) {
  source = `${liveBase}/robots.txt`;
  const res = await fetch(source);
  if (!res.ok) {
    console.error(`✗ ${source} returned ${res.status}`);
    process.exit(1);
  }
  text = await res.text();
} else {
  source = join(BUILD_ROOT, "robots.txt.body");
  try {
    text = await readFile(source, "utf8");
  } catch {
    console.error(`✗ ${source} not found. Run \`next build\` first, or pass --live.`);
    process.exit(1);
  }
}

const problems = [];
/** lower-cased user-agent -> line numbers of the groups that name it */
const groups = new Map();
let inGroup = false; // a user-agent line has opened a group
let sitemaps = 0;
let rules = 0;

text.split(/\r?\n/).forEach((raw, i) => {
  const n = i + 1;
  const line = raw.replace(/#.*/, "").trim();
  if (line === "") return;

  const colon = line.indexOf(":");
  if (colon === -1) {
    problems.push([n, `not a "field: value" line: ${raw.trim()}`]);
    return;
  }
  const field = line.slice(0, colon).trim().toLowerCase();
  const value = line.slice(colon + 1).trim();

  if (!FIELDS.has(field)) {
    problems.push([n, `"${line.slice(0, colon).trim()}" is not a robots.txt field: ${raw.trim()}`]);
    return;
  }

  if (field === "user-agent") {
    if (!value) problems.push([n, "user-agent with no value"]);
    const agent = value.toLowerCase();
    if (!groups.has(agent)) groups.set(agent, []);
    groups.get(agent).push(n);
    inGroup = true;
    return;
  }

  if (field === "sitemap") {
    sitemaps++;
    if (!/^https?:\/\/[^\s/]+\/\S*$/.test(value)) {
      problems.push([n, `sitemap must be an absolute URL: ${value || "(empty)"}`]);
    }
    return;
  }

  // allow / disallow
  rules++;
  if (!inGroup) problems.push([n, `${field} before any user-agent line`]);
  if (value !== "" && !value.startsWith("/") && !value.startsWith("*")) {
    problems.push([n, `${field} path must start with "/" or "*": ${value}`]);
  }
});

for (const [agent, lines] of groups) {
  if (lines.length > 1) {
    problems.push([lines[1], `user-agent "${agent}" has more than one group (lines ${lines.join(", ")})`]);
  }
}
if (sitemaps === 0) problems.push([0, "no Sitemap line"]);
if (groups.size === 0) problems.push([0, "no user-agent group at all"]);

if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} robots.txt problem(s) in ${source}:\n`);
  for (const [n, reason] of problems.sort((a, b) => a[0] - b[0])) {
    console.error(`  ${n ? `line ${n}` : "file"}: ${reason}`);
  }
  console.error("");
  process.exit(1);
}

console.log(`✓ robots.txt: ${groups.size} user-agent groups, ${rules} rules, ${sitemaps} sitemap (${source})`);
