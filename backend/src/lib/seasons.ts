import prisma from "./prisma";

/**
 * Business years ("Year 1", "Year 2", …), like seasons in a game.
 *
 * Nothing is moved or copied when a year closes: orders, sales and expenses
 * keep their own dates, and a year is just the span between two start dates.
 * Year 1 has no start (it holds everything before Year 2). The start of each
 * later year is kept in one Setting row, so closing a year needs no migration
 * and reopening it is just dropping the last date.
 *
 * Records belong to the year of their own date: orders by createdAt, sales
 * and expenses by date.
 */
const SEASONS_KEY = "seasons";

type StoredStart = { startsAt: string; startedBy?: string };

export type Season = {
  number: number;
  startsAt: string | null; // null for Year 1
  endsAt: string | null; // null for the current year
  current: boolean;
};

/** A Prisma DateTime filter; empty means "no bound". */
export type DateRange = { gte?: Date; lt?: Date };

async function readStarts(): Promise<StoredStart[]> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: SEASONS_KEY } });
    if (!row) return [];
    const parsed: unknown = JSON.parse(row.value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (s): s is StoredStart => !!s && typeof s.startsAt === "string" && !Number.isNaN(Date.parse(s.startsAt)),
    );
  } catch (err) {
    // Missing Setting table or a bad value: behave as if Year 1 is still open.
    console.error("⚠ Could not read seasons; treating everything as Year 1:");
    console.error(err instanceof Error ? err.message : err);
    return [];
  }
}

async function writeStarts(starts: StoredStart[], adminId?: string): Promise<void> {
  const value = JSON.stringify(starts);
  await prisma.setting.upsert({
    where: { key: SEASONS_KEY },
    create: { key: SEASONS_KEY, value, updatedBy: adminId },
    update: { value, updatedBy: adminId },
  });
}

function build(starts: StoredStart[]): Season[] {
  const boundaries = [null, ...starts.map((s) => s.startsAt)];
  return boundaries.map((startsAt, i) => ({
    number: i + 1,
    startsAt,
    endsAt: boundaries[i + 1] ?? null,
    current: i === boundaries.length - 1,
  }));
}

export async function getSeasons(): Promise<Season[]> {
  return build(await readStarts());
}

export function currentSeason(seasons: Season[]): Season {
  return seasons[seasons.length - 1];
}

export function rangeOf(season: Season): DateRange {
  const range: DateRange = {};
  if (season.startsAt) range.gte = new Date(season.startsAt);
  if (season.endsAt) range.lt = new Date(season.endsAt);
  return range;
}

export function seasonOfDate(seasons: Season[], date: Date): Season {
  const t = date.getTime();
  for (let i = seasons.length - 1; i > 0; i--) {
    if (t >= Date.parse(seasons[i].startsAt as string)) return seasons[i];
  }
  return seasons[0];
}

/**
 * The year a list or total was asked for with `?season=N`. Absent or "all"
 * gives null: no date filter, which is what callers that predate years expect.
 */
export async function seasonFromQuery(raw: unknown): Promise<{ season: Season | null; error?: string }> {
  if (raw === undefined || raw === "" || raw === "all") return { season: null };
  const n = Number(raw);
  const seasons = await getSeasons();
  const season = seasons.find((s) => s.number === n);
  if (!season) return { season: null, error: `No Year ${String(raw)}` };
  return { season };
}

/** Narrow a range to a year: the later start and the earlier end win. */
export function within(range: DateRange, season: Season | null): DateRange {
  if (!season) return range;
  const y = rangeOf(season);
  const out: DateRange = { ...range };
  if (y.gte && (!out.gte || y.gte > out.gte)) out.gte = y.gte;
  if (y.lt && (!out.lt || y.lt < out.lt)) out.lt = y.lt;
  return out;
}

/** Start the next year now. Returns the new list. */
export async function closeCurrentSeason(adminId?: string): Promise<Season[]> {
  const starts = await readStarts();
  starts.push({ startsAt: new Date().toISOString(), startedBy: adminId });
  await writeStarts(starts, adminId);
  return build(starts);
}

/** Undo the last close: the previous year becomes current again. */
export async function reopenPreviousSeason(adminId?: string): Promise<Season[]> {
  const starts = await readStarts();
  starts.pop();
  await writeStarts(starts, adminId);
  return build(starts);
}
