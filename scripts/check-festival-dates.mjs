/**
 * Catches festival date lines that have gone out of date.
 *
 * The recipe posts carry a line under the answer box naming this year's
 * festival dates — "**Tihar 2026:** Laxmi Puja is on Sunday 8 November…" — and
 * the meta description repeats it. That line is the most useful sentence on
 * the page for six weeks and actively wrong the day after, and nothing about a
 * static site reminds anyone to change it.
 *
 * Every such line carries the date it stops being true, as a comment the
 * parser strips before rendering:
 *
 *   **Tihar 2026:** Laxmi Puja is on Sunday 8 November and Bhai Tika on …
 *   <!-- festival-date: 2026-11-11 -->
 *
 * The date is the LAST day the line names, so a multi-day festival is not
 * flagged halfway through. What this enforces:
 *
 *   - a "**Name YYYY:**" line with no festival-date comment    → error
 *   - the visible date and the comment disagree               → error
 *   - the date has passed                                     → warning
 *   - the date passed more than GRACE_DAYS ago                → error
 *
 * A warning rather than an error the day after, so a deploy the week after
 * Tihar is not blocked by a line nobody has had time to update. After the
 * grace period it fails the build: by then it is not a reminder, it is a page
 * telling readers the wrong year.
 *
 *   npm run check:festivals
 *   npm run check:festivals -- --today=2026-11-12    (see what it will say)
 */
import { readFile } from "node:fs/promises";

const DATA = "src/data/blog.json";
const GRACE_DAYS = 30;

const EN_MONTHS = ["january", "february", "march", "april", "may", "june", "july",
  "august", "september", "october", "november", "december"];
const NE_MONTHS = ["जनवरी", "फेब्रुअरी", "मार्च", "अप्रिल", "मे", "जुन", "जुलाई",
  "अगस्ट", "सेप्टेम्बर", "अक्टोबर", "नोभेम्बर", "डिसेम्बर"];

/** "२४" -> 24 */
const digits = (s) => Number(s.replace(/[०-९]/g, (d) => "०१२३४५६७८९".indexOf(d)));

/** Every Gregorian day-and-month the line shows, as [month, day] pairs. */
function visibleDates(line) {
  const found = [];
  const en = new RegExp(`\\b(\\d{1,2}) (${EN_MONTHS.join("|")})\\b`, "gi");
  for (const m of line.matchAll(en)) found.push([EN_MONTHS.indexOf(m[2].toLowerCase()) + 1, Number(m[1])]);
  const ne = new RegExp(`(${NE_MONTHS.join("|")}) ([०-९]{1,2})`, "g");
  for (const m of line.matchAll(ne)) found.push([NE_MONTHS.indexOf(m[1]) + 1, digits(m[2])]);
  return found;
}

const arg = process.argv.find((a) => a.startsWith("--today="));
const today = arg ? new Date(`${arg.slice(8)}T00:00:00Z`) : new Date();
const DAY = 24 * 60 * 60 * 1000;

const data = JSON.parse(await readFile(DATA, "utf8"));
const posts = Array.isArray(data) ? data : data.posts;

const errors = [];
const warnings = [];
const lines = [];

for (const post of posts) {
  for (const chunk of post.content.split(/\n{2,}/)) {
    const head = chunk.match(/^\*\*([^*]+?)\s+(\d{4}|[०-९]{4}):\*\*/);
    if (!head) continue;
    const where = `${post.slug}: "${head[1]} ${head[2]}"`;

    const marker = chunk.match(/<!--\s*festival-date:\s*(\d{4})-(\d{2})-(\d{2})\s*-->/);
    if (!marker) {
      errors.push(`${where} has no <!-- festival-date: YYYY-MM-DD --> comment, so nobody will be told when it goes stale.`);
      continue;
    }
    const [, y, mo, d] = marker.map(Number);
    const date = new Date(Date.UTC(y, mo - 1, d));

    // The comment must say what the reader sees: the last date on the line.
    const shown = visibleDates(chunk.replace(/<!--[\s\S]*?-->/g, ""));
    const last = shown.at(-1);
    if (last && (last[0] !== mo || last[1] !== d)) {
      errors.push(`${where} shows ${last[1]}/${last[0]} as its last date, but the comment says ${d}/${mo}.`);
    }
    // A Gregorian year in the label must match; a Bikram Sambat one cannot be checked this simply.
    if (/^\d{4}$/.test(head[2]) && Number(head[2]) !== y) {
      errors.push(`${where} is labelled ${head[2]}, but the comment's date is in ${y}.`);
    }

    const late = Math.floor((today - date) / DAY);
    lines.push({ where, date, late });
    if (late > GRACE_DAYS) {
      errors.push(`${where} ended ${late} days ago (${marker[1]}-${marker[2]}-${marker[3]}). Update it, and the description, to next year's dates.`);
    } else if (late > 0) {
      warnings.push(`${where} ended ${late} day(s) ago. Update it to next year's dates; the build fails ${GRACE_DAYS - late + 1} day(s) from now.`);
    }
  }
}

for (const w of warnings) console.warn(`⚠ ${w}`);
if (errors.length > 0) {
  console.error(`✗ ${errors.length} festival date problem(s):\n`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

const upcoming = lines.filter((l) => l.late <= 0).sort((a, b) => a.date - b.date);
const next = upcoming[0];
console.log(
  `✓ ${lines.length} festival date lines, ${upcoming.length} still ahead` +
    (next ? `; next to expire: ${next.where} on ${next.date.toISOString().slice(0, 10)}` : ""),
);
