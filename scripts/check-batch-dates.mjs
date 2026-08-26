/**
 * Fails when a product page advertises a harvest date older than the shelf
 * life that same page claims.
 *
 * The product cards carry a "Harvested" badge — one absolute month, written
 * once into src/data/content.json and never touched again. An absolute date
 * ages on its own: it was accurate the week it was written and is a liability
 * nine months later, because the page keeps asserting it with the same
 * confidence. Nobody notices, because nothing throws and the copy is still
 * technically true — the harvest really was in November.
 *
 * What makes it a real defect rather than an untidy one is that each product
 * also states a shelf life a few lines away, so the page contains both halves
 * of its own contradiction:
 *
 *   Mixed Dry Fruits — "Harvested November 2025", "3 months in a sealed pouch"
 *
 * A buyer who reads both is being told the thing in the photograph expired six
 * months ago. That is the most expensive kind of copy error on a site whose
 * entire argument is that it tells you the truth about what it sells.
 *
 * Two tiers, because the two failures are different:
 *
 *   - **Past the upper bound** → error. The page is making a false claim now.
 *   - **Past the lower bound** → warning. Still defensible, but the batch is
 *     into the tail of its own range and somebody should be asked.
 *
 * Deliberately does not know what the right date is. It cannot: only the
 * person who packed the batch does. It knows when the one on the page has
 * stopped being defensible, which is the part a script can own.
 *
 *   npm run check:batch
 */
import { readFile } from "node:fs/promises";

const DATA = "src/data/content.json";

/** "November 2025" → Date. Returns null for anything not in that shape, which
 *  is itself reported — a badge the parser cannot read is a badge nobody has
 *  checked. */
function parseHarvest(value) {
  const d = new Date(`1 ${value} UTC`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Pull the month bounds out of the prose: "6-12 months when stored…" → [6,12],
 *  "3 months in a sealed pouch…" → [3,3]. */
function shelfLifeMonths(value) {
  const range = value.match(/(\d+)\s*[-–—]\s*(\d+)\s*months?/i);
  if (range) return [Number(range[1]), Number(range[2])];
  const single = value.match(/(\d+)\s*months?/i);
  if (single) return [Number(single[1]), Number(single[1])];
  return null;
}

/** Whole months between two dates. */
function monthsBetween(from, to) {
  return (
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
    (to.getUTCMonth() - from.getUTCMonth())
  );
}

const now = new Date();
const { products } = JSON.parse(await readFile(DATA, "utf8"));

const errors = [];
const warnings = [];

for (const p of products) {
  if (!p.harvest) continue;

  const harvested = parseHarvest(p.harvest);
  if (!harvested) {
    errors.push(`${p.name} — harvest ${JSON.stringify(p.harvest)} is not a month this script can read ("November 2025").`);
    continue;
  }

  const bounds = p.shelfLife ? shelfLifeMonths(p.shelfLife) : null;
  if (!bounds) {
    warnings.push(`${p.name} — no month figure in shelfLife ${JSON.stringify(p.shelfLife ?? "")}, so the harvest date cannot be checked against it.`);
    continue;
  }

  const [low, high] = bounds;
  const age = monthsBetween(harvested, now);

  if (age > high) {
    errors.push(
      `${p.name} — harvested ${p.harvest}, which is ${age} months ago, but the page claims a shelf life of ${high} months. ` +
        `The product page is asserting the batch expired ${age - high} month(s) ago.`,
    );
  } else if (age > low) {
    warnings.push(
      `${p.name} — harvested ${p.harvest} (${age} months ago) against a stated ${low}-${high} months. ` +
        `Inside the claim, but into the tail of it; confirm the batch on sale is still this one.`,
    );
  }
}

for (const w of warnings) console.warn(`  ! ${w}`);

if (errors.length > 0) {
  console.error(`\n✗ ${errors.length} product(s) advertise a batch older than their own stated shelf life:\n`);
  for (const e of errors) console.error(`  ${e}`);
  console.error(
    `\nFix by setting "harvest" in ${DATA} to the batch actually being shipped.\n` +
      `Do not widen "shelfLife" to make this pass — that is the claim, not the workaround.\n`,
  );
  process.exit(1);
}

console.log(
  `✓ ${products.length} products carry a harvest date inside their stated shelf life` +
    (warnings.length ? ` (${warnings.length} warning(s) above)` : ""),
);
