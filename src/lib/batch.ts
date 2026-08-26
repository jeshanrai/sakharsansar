/**
 * Harvest, packing, and the difference between them.
 *
 * The product cards carried one date — `harvest: "November 2025"` — and the
 * details panel a few lines below carried a shelf life. Read together they said
 * the dry fruits, with three months on them, expired half a year ago. That
 * reading was wrong, but the page had no way to say so, which is its own defect:
 * two different dates were being collapsed into one field.
 *
 *   **Harvest** is when the cane was cut. It is annual and it is seasonal —
 *   Mangsir, the month Nepali cane comes in — and it is provenance. It is the
 *   same date for every product in a year, and it is *supposed* to age: sakhar
 *   from this year's Mangsir is what "this year's sakhar" means.
 *
 *   **Packed** is when this pouch was made, and it is the date shelf life
 *   actually runs from. The powder is blocks milled later; the dry fruits are
 *   sorted and turned through melted sakhar later still. Neither is made on the
 *   terrace at harvest.
 *
 * So shelf life is measured from `packed`, never from `harvest`, and the two are
 * separate fields. `scripts/check-batch-dates.mjs` enforces exactly that.
 *
 * Dates are Bikram Sambat because the harvest is a BS season — "Mangsir" names
 * a month of the agricultural year in a way "November" does not, and every
 * grower this cane comes from thinks in it. The Gregorian range is carried
 * alongside for a reader who does not.
 */

/**
 * The harvest seasons this site has sold from, with their Gregorian spans.
 *
 * A lookup rather than a Bikram Sambat conversion library: the site sells one
 * harvest a year, this is a handful of rows, and a full BS↔AD converter is a
 * dependency and a class of bug for a value that changes every twelve months.
 * Add a row each Mangsir.
 */
export const HARVEST_SEASONS: Record<
  string,
  { devanagari: string; from: string; to: string; gregorian: string }
> = {
  "Mangsir 2082": {
    devanagari: "मंसिर २०८२",
    from: "2025-11-17",
    to: "2025-12-16",
    gregorian: "November–December 2025",
  },
  "Mangsir 2083": {
    devanagari: "मंसिर २०८३",
    from: "2026-11-17",
    to: "2026-12-16",
    gregorian: "November–December 2026",
  },
};

/** The Gregorian span of a harvest season, or null if it is not on the list. */
export function harvestSeason(harvest: string) {
  return HARVEST_SEASONS[harvest] ?? null;
}

/**
 * Shelf life is written as prose ("6-12 months when stored in a cool, dry
 * place") because that is what belongs on the page. The bounds are pulled back
 * out of it rather than duplicated into a second field that could disagree with
 * the sentence a customer actually reads.
 */
export function shelfLifeMonths(shelfLife: string): [number, number] | null {
  const range = shelfLife.match(/(\d+)\s*[-–—]\s*(\d+)\s*months?/i);
  if (range) return [Number(range[1]), Number(range[2])];
  const single = shelfLife.match(/(\d+)\s*months?/i);
  if (single) return [Number(single[1]), Number(single[1])];
  return null;
}

/** A packed date is "YYYY-MM". Empty means nobody has recorded one yet. */
export function packedDate(packed: string): Date | null {
  if (!/^\d{4}-\d{2}$/.test(packed)) return null;
  const d = new Date(`${packed}-01T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * "Best before <month year>", counted from packing at the *lower* bound of the
 * stated shelf life. The lower bound because a range is a promise about the
 * worst case, and the number on a pack should be the one we will stand behind
 * rather than the most flattering one available.
 *
 * Returns null when there is no packed date, which is the state today — the
 * page then shows provenance and says nothing it cannot support.
 */
export function bestBefore(packed: string, shelfLife: string): string | null {
  const from = packedDate(packed);
  const bounds = shelfLifeMonths(shelfLife);
  if (!from || !bounds) return null;

  const d = new Date(from);
  d.setUTCMonth(d.getUTCMonth() + bounds[0]);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
