/**
 * Fails the build when the site makes a claim it has retired, or hardcodes a
 * figure that lives in site-config.
 *
 * The site tells one story about itself, and it took a reconciliation to get
 * there. The footer, /contact and /our-story used to describe "a cooperative
 * of 42 farming families" working "since seven generations", while the Meet
 * the Maker section and every article byline said Rashmita founded the
 * business in 2024 and pours every block herself. Both cannot be true, and a
 * brand whose whole argument is honesty cannot be caught choosing.
 *
 * The reconciliation (see STORY in src/lib/site.ts): the business is hers and
 * was founded in 2024; she makes the sakhar; forty-two households across six
 * villages grow and supply the cane, and have made it that way for seven
 * generations. The generations belong to the families and the craft, not to
 * the company.
 *
 * That was fixed in the footer and left standing in ten other places, which is
 * exactly the failure mode this file exists for: a claim corrected once, in
 * the file somebody happened to be looking at, while the same sentence sits in
 * nine components nobody grepped for. Wording drifts back one component at a
 * time, and no test notices, because none of it is wrong in a way that throws.
 *
 * Reads source, not build output — a retired claim should fail review before
 * it is rendered, and some of these live in data files that never become a
 * page of their own.
 *
 *   npm run check:claims
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOTS = ["src"];

/** Files that are allowed to contain the strings, because they are the record
 *  of the decision rather than a claim being made to a visitor. */
const EXEMPT_FILES = [
  /^src\/lib\/site\.ts$/,        // documents the superseded wording in a comment
  /^scripts\//,
];

/**
 * Each rule is a phrase and the reason it is banned.
 *
 * Deliberately narrow. A check that flags every use of "organic" would be
 * switched off within a week; these are specific strings with specific
 * histories, and each one names what to write instead.
 */
const BANNED = [
  {
    pattern: /\b12,000\b/,
    why: "an unsourced figure retired from the origin story. If a real number is needed, cite where it comes from.",
  },
  {
    pattern: /since seven generations/i,
    why: 'superseded phrasing. The generations belong to the farming families and the craft, not to the company — write "the way those families have made it for seven generations".',
  },
  {
    pattern: /certified organic/i,
    why:
      'we hold no organic certification, so this may only appear where the text goes on to say so. ' +
      '/wholesale and the /shop FAQ both raise it and then draw the distinction explicitly, which is the ' +
      'honest treatment and is why they pass. A bare claim does not — write "chemical-free", or ' +
      '"100% organic" as an ingredient claim, never "certified".',
    // The phrase is not the problem; asserting it without the distinction is.
    // Both places that use it deny holding certification within a few lines,
    // and that denial is what this looks for. Reword the disclaimer and the
    // check fires again, which for a claim this sensitive is correct: it
    // should need a person to re-confirm, not pass on a substring.
    nearby: /(rather than|not the same thing as|do not hold|whether we hold|we do not have)\s+(a\s+)?certificat|what we mean by chemical-free|can and cannot provide/i,
  },
  {
    pattern: /\b(our|the)\s+(\w+\s+){0,2}cooperative\b/i,
    why: 'SakharSansar is not a cooperative — it is Rashmita\'s business, founded 2024, buying cane from forty-two families. Name the families, or the place. (The kraft-paper supplier is "a women\'s cooperative in the next valley", which is a different organisation and reads as one.)',
    // The packaging supplier genuinely is a cooperative and is named as
    // somebody else's, so that exact phrasing is allowed through.
    allow: [/a women's cooperative in the next valley/i],
  },
  {
    pattern: /cooperative of (42|forty-two)/i,
    why: "the superseded wording in full. See STORY in src/lib/site.ts.",
  },
  {
    pattern: /Rs\.?\s?2,?000/,
    why: "the old free-shipping threshold. It is COMMERCE.freeShippingThreshold in src/lib/site.ts, currently Rs. 1,500 — read it from there via formatRs().",
  },
  {
    pattern: /\+?977[-\s]?98\d{8}/,
    why: "a hardcoded phone number. It is SITE.phone in src/lib/site.ts.",
  },
];

/** Where a figure may legitimately be written as a literal. */
const CONFIG_FILES = [/^src\/lib\/site\.ts$/];

const EXTENSIONS = [".ts", ".tsx", ".json", ".css", ".mjs"];

/** Lines either side of a hit that count as "nearby" for a qualifying rule. */
const WINDOW = 4;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      yield* walk(path);
    } else if (EXTENSIONS.some((e) => entry.name.endsWith(e))) {
      yield path;
    }
  }
}

const problems = [];
let scanned = 0;

for (const root of ROOTS) {
  for await (const file of walk(root)) {
    const rel = relative(".", file);
    if (EXEMPT_FILES.some((re) => re.test(rel))) continue;
    scanned++;

    const source = await readFile(file, "utf8");
    const lines = source.split("\n");

    for (const rule of BANNED) {
      if (CONFIG_FILES.some((re) => re.test(rel)) && rule.configOk) continue;
      lines.forEach((line, i) => {
        const hit = line.match(rule.pattern);
        if (!hit) return;
        if (rule.allow?.some((re) => re.test(line))) return;
        // Some claims are legitimate when the surrounding copy qualifies them.
        // The window is generous because a JSON data file keeps a whole
        // article on one line while a .tsx keeps a question and its answer on
        // two.
        if (rule.nearby) {
          const window = lines.slice(Math.max(0, i - WINDOW), i + WINDOW + 1).join(" ");
          if (rule.nearby.test(window)) return;
        }
        problems.push({ file: rel, line: i + 1, text: hit[0], why: rule.why, source: line.trim() });
      });
    }
  }
}

if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} retired claim(s) across ${scanned} files:\n`);
  for (const p of problems) {
    console.error(`  ${p.file}:${p.line} — ${JSON.stringify(p.text)}`);
    console.error(`    ${p.why}`);
    console.error(`    ${p.source.slice(0, 110)}\n`);
  }
  process.exit(1);
}

console.log(`✓ ${scanned} files carry no retired claims or hardcoded figures`);
