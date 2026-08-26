/**
 * Checks the dates on the product cards against the claims beside them.
 *
 * The cards used to carry one date — `harvest: "November 2025"` — while the
 * details panel a few lines below stated a shelf life. Subtract one from the
 * other in August and the dry fruits, with three months on them, had expired
 * six months ago. That reading was wrong, but the page gave a reader no way to
 * know it, which is the actual defect: two unrelated dates were collapsed into
 * one field.
 *
 *   `harvest` is when the cane was cut. Annual, seasonal, Bikram Sambat
 *   (Mangsir), the same for every product in a year. It is provenance, and it
 *   is meant to age — this year's Mangsir is what "this year's sakhar" means.
 *
 *   `packed` is when this pouch was filled, and it is the only date shelf life
 *   can honestly be measured from. The powder is blocks milled later; the dry
 *   fruits are sorted and coated later still.
 *
 * So this checks `packed` against `shelfLife`, and never `harvest`. What it
 * enforces:
 *
 *   - a `harvest` season that is not in HARVEST_SEASONS       → error
 *   - a `packed` date past the upper bound of its shelf life  → error
 *   - a `packed` date past the lower bound                    → warning
 *   - no `packed` date recorded at all                        → warning
 *
 * The last one is the state today and is deliberately not an error: the site
 * says nothing it cannot support (the best-before sentence simply does not
 * render), so it is incomplete rather than wrong. It becomes an error the day
 * someone wants the best-before on the page.
 *
 *   npm run check:batch
 */
import { readFile } from "node:fs/promises";

const DATA = "src/data/content.json";
const LIB = "src/lib/batch.ts";

/** The season keys, read from the lib so there is one list rather than two. */
async function knownSeasons() {
  const src = await readFile(LIB, "utf8");
  const block = src.match(/export const HARVEST_SEASONS[^{]*\{([\s\S]*?)\n\};/);
  if (!block) {
    console.error(`✗ could not find HARVEST_SEASONS in ${LIB}.`);
    process.exit(1);
  }
  return new Set([...block[1].matchAll(/^\s{2}"([^"]+)":/gm)].map((m) => m[1]));
}

/** Mirrors `shelfLifeMonths` in src/lib/batch.ts. */
function shelfLifeMonths(value) {
  const range = value.match(/(\d+)\s*[-–—]\s*(\d+)\s*months?/i);
  if (range) return [Number(range[1]), Number(range[2])];
  const single = value.match(/(\d+)\s*months?/i);
  if (single) return [Number(single[1]), Number(single[1])];
  return null;
}

function monthsBetween(from, to) {
  return (
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
    (to.getUTCMonth() - from.getUTCMonth())
  );
}

const now = new Date();
const seasons = await knownSeasons();
const { products } = JSON.parse(await readFile(DATA, "utf8"));

const errors = [];
const warnings = [];

for (const p of products) {
  if (p.harvest && !seasons.has(p.harvest)) {
    errors.push(
      `${p.name} — harvest ${JSON.stringify(p.harvest)} is not a season declared in ${LIB}. ` +
        `Add it to HARVEST_SEASONS with its Gregorian span, or correct the value.`,
    );
  }

  const bounds = p.shelfLife ? shelfLifeMonths(p.shelfLife) : null;
  if (!bounds) {
    warnings.push(`${p.name} — no month figure in shelfLife, so nothing can be checked against it.`);
    continue;
  }

  if (!p.packed) {
    warnings.push(
      `${p.name} — no packing date recorded, so the best-before sentence does not render. ` +
        `Set "packed" to the month this batch was filled ("YYYY-MM") to turn it on.`,
    );
    continue;
  }

  if (!/^\d{4}-\d{2}$/.test(p.packed)) {
    errors.push(`${p.name} — packed ${JSON.stringify(p.packed)} is not "YYYY-MM".`);
    continue;
  }

  const [low, high] = bounds;
  const age = monthsBetween(new Date(`${p.packed}-01T00:00:00Z`), now);

  if (age > high) {
    errors.push(
      `${p.name} — packed ${p.packed}, ${age} months ago, against a stated shelf life of ${high} months. ` +
        `The page is advertising stock it says expired ${age - high} month(s) ago.`,
    );
  } else if (age > low) {
    warnings.push(
      `${p.name} — packed ${p.packed} (${age} months ago) against a stated ${low}-${high} months. ` +
        `Inside the claim but into the tail of it; confirm this is still the batch shipping.`,
    );
  }
}

for (const w of warnings) console.warn(`  ! ${w}`);

if (errors.length > 0) {
  console.error(`\n✗ ${errors.length} problem(s) with the batch dates:\n`);
  for (const e of errors) console.error(`  ${e}`);
  console.error(
    `\nFix by setting "packed" in ${DATA} to the batch actually being shipped.\n` +
      `Do not widen "shelfLife" to make this pass — that is the claim, not the workaround.\n`,
  );
  process.exit(1);
}

console.log(
  `✓ ${products.length} products: harvest seasons declared, no batch past its stated shelf life` +
    (warnings.length ? ` (${warnings.length} warning(s) above)` : ""),
);
