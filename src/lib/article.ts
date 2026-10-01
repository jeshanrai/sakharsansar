import { COMMERCE, SITE, formatRs } from "./site";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The journal's article format.
 *
 * Posts are stored in `src/data/blog.json` as one markdown-ish string, and
 * this module turns that string into a block list the renderer walks. It is a
 * deliberately small subset of markdown — headings, paragraphs, lists, links,
 * images, plus two custom blocks — rather than a dependency, because the whole
 * site is statically generated and a real markdown pipeline would buy nothing
 * the posts actually use.
 *
 * The important property is that the *structured data* on a post is derived
 * from these same blocks (see `howToSteps` and `faqEntries`) rather than
 * hand-written alongside them. Google penalises schema that describes content
 * the page does not render, and the only reliable way to prevent that drift is
 * to make the markup a function of the prose.
 *
 * Server-only: reads image dimensions off disk at build time.
 */

// ─── Inline ────────────────────────────────────────────────────────────────

export type Inline =
  | { kind: "text"; text: string }
  | { kind: "strong"; text: string }
  | { kind: "em"; text: string }
  | { kind: "link"; text: string; href: string; external: boolean };

/** `**bold**`, `*italic*`, `[label](href)`. No nesting — posts don't need it. */
const INLINE = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

function parseInline(raw: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;

  for (const m of raw.matchAll(INLINE)) {
    if (m.index > last) out.push({ kind: "text", text: raw.slice(last, m.index) });

    if (m[1] !== undefined) out.push({ kind: "strong", text: m[1] });
    else if (m[2] !== undefined) out.push({ kind: "em", text: m[2] });
    else {
      const href = m[4];
      out.push({
        kind: "link",
        text: m[3],
        href,
        // Anything not rooted at "/" or "#" leaves the site, and every such
        // link on a post is an outbound citation that opens in a new tab.
        external: !href.startsWith("/") && !href.startsWith("#"),
      });
    }
    last = m.index + m[0].length;
  }

  if (last < raw.length) out.push({ kind: "text", text: raw.slice(last) });
  return out;
}

/** Inline nodes flattened back to prose — for schema, alt text and counting. */
export function plainText(inline: Inline[]): string {
  return inline.map((n) => n.text).join("");
}

// ─── Blocks ────────────────────────────────────────────────────────────────

export interface CompareRow {
  label: string;
  inline: Inline[];
}

export type Block =
  | { kind: "h2"; id: string; text: string }
  | { kind: "h3"; id: string; text: string }
  | { kind: "p"; inline: Inline[] }
  | { kind: "list"; ordered: boolean; items: Inline[][] }
  | { kind: "note"; inline: Inline[] }
  | { kind: "compare"; rows: CompareRow[] }
  | { kind: "table"; caption?: string; head: string[]; rows: Inline[][][] }
  | {
      kind: "figure";
      src: string;
      alt: string;
      caption?: string;
      width: number;
      height: number;
    };

/**
 * Heading → anchor id. Must stay stable: HowTo and Recipe schema point at these.
 *
 * The character class is Unicode-aware rather than `a-z0-9`. On the English
 * posts the two are identical, because an English heading has nothing in it
 * but ASCII letters, digits and punctuation. On the Nepali posts they are not:
 * stripping to `a-z0-9` reduced every Devanagari heading to the empty string,
 * so a page ended up with several `id=""` anchors, no working in-page links
 * and no way to tell one section from another.
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’"“”]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * The heading that opens a post's Q&A, in each language we publish.
 * FAQPage schema is keyed off it, so a Nepali post has to be able to say it
 * in Nepali and still be marked up.
 */
const FAQ_HEADINGS = new Set([
  slugifyHeading("Frequently Asked Questions"),
  slugifyHeading("बारम्बार सोधिने प्रश्नहरू"),
]);

const FIGURE = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/;
const ORDERED_ITEM = /^\d+\.\s+/;
const BULLET_ITEM = /^-\s+/;

/**
 * Values the prose is allowed to quote, resolved from config as it is parsed.
 *
 * /wholesale printed the WhatsApp number three times, written out by hand in
 * the article body. It was correct, and it was correct only for as long as
 * nobody changed it — the number lives in SITE.phone, every other surface on
 * the site reads it from there, and the one place a bulk buyer is actually
 * told to message was the one place that would have gone stale silently.
 *
 * Tokens rather than a component, because the article body is markdown in a
 * JSON file and has to stay writable by whoever writes the copy.
 */
const TOKENS: Record<string, string> = {
  "{{phone}}": SITE.phone,
  "{{email}}": SITE.email,
  "{{freeShipping}}": formatRs(COMMERCE.freeShippingThreshold),
};

function interpolate(markdown: string): string {
  return Object.entries(TOKENS).reduce(
    (text, [token, value]) => text.split(token).join(value),
    markdown,
  );
}

/**
 * `<!-- -->` notes are for whoever edits the copy (where the owner's
 * first-hand lines go, what a reviewer should check) and never reach the page.
 * Without this they would fall through to a paragraph and render verbatim.
 */
function stripComments(markdown: string): string {
  return markdown.replace(/<!--[\s\S]*?-->/g, "");
}

export function parseArticle(markdown: string): Block[] {
  const blocks: Block[] = [];

  for (const chunk of interpolate(stripComments(markdown)).trim().split(/\n{2,}/)) {
    const raw = chunk.trim();
    if (!raw) continue;
    const lines = raw.split("\n").map((l) => l.trim());

    // Headings
    if (raw.startsWith("### ")) {
      const text = raw.slice(4).trim();
      blocks.push({ kind: "h3", id: slugifyHeading(text), text });
      continue;
    }
    if (raw.startsWith("## ")) {
      const text = raw.slice(3).trim();
      blocks.push({ kind: "h2", id: slugifyHeading(text), text });
      continue;
    }

    // Featured-snippet answer box
    if (raw.startsWith("> ")) {
      const text = lines.map((l) => l.replace(/^>\s?/, "")).join(" ");
      blocks.push({ kind: "note", inline: parseInline(text) });
      continue;
    }

    // Pure / adulterated verdict pair
    if (raw.startsWith(":::compare")) {
      const rows = lines
        .slice(1)
        .filter((l) => l && l !== ":::")
        .map((l) => {
          const [label, ...rest] = l.split("|");
          return {
            label: label.trim(),
            inline: parseInline(rest.join("|").trim()),
          };
        });
      if (rows.length) blocks.push({ kind: "compare", rows });
      continue;
    }

    // Side-by-side comparison grid. Deliberately a real <table>: Google can
    // read one and may lift it into the result, and it cannot read a picture
    // of one. First row is the header; the text after ":::table" is the
    // caption, which is where the comparison keyword belongs.
    if (raw.startsWith(":::table")) {
      const caption = lines[0].slice(":::table".length).trim();
      const cells = lines
        .slice(1)
        .filter((l) => l && l !== ":::")
        .map((l) => l.split("|").map((c) => c.trim()));
      const [head, ...body] = cells;
      if (head && body.length) {
        blocks.push({
          kind: "table",
          ...(caption ? { caption } : {}),
          head,
          rows: body.map((row) => row.map((cell) => parseInline(cell))),
        });
      }
      continue;
    }

    // Photograph
    const figure = raw.match(FIGURE);
    if (figure) {
      const [, alt, src, caption] = figure;
      const size = imageSize(src);
      // A slot whose photo has not been shot yet simply doesn't render. The
      // article ships without it and the figure appears on the next build,
      // the moment the file lands in public/ under the planned filename.
      if (size) {
        blocks.push({ kind: "figure", src, alt, caption, ...size });
      }
      continue;
    }

    // Lists — every line has to be an item, so a paragraph that happens to
    // start with a number isn't swallowed.
    if (lines.every((l) => ORDERED_ITEM.test(l))) {
      blocks.push({
        kind: "list",
        ordered: true,
        items: lines.map((l) => parseInline(l.replace(ORDERED_ITEM, ""))),
      });
      continue;
    }
    if (lines.every((l) => BULLET_ITEM.test(l))) {
      blocks.push({
        kind: "list",
        ordered: false,
        items: lines.map((l) => parseInline(l.replace(BULLET_ITEM, ""))),
      });
      continue;
    }

    blocks.push({ kind: "p", inline: parseInline(lines.join(" ")) });
  }

  return blocks;
}

// ─── Derived views ─────────────────────────────────────────────────────────

/** Prose word count — markdown syntax and captions excluded. */
export function wordCount(blocks: Block[]): number {
  const text = blocks
    .map((b) => {
      switch (b.kind) {
        case "h2":
        case "h3":
          return b.text;
        case "p":
        case "note":
          return plainText(b.inline);
        case "list":
          return b.items.map(plainText).join(" ");
        case "compare":
          return b.rows.map((r) => `${r.label} ${plainText(r.inline)}`).join(" ");
        case "table":
          return [
            b.caption ?? "",
            b.head.join(" "),
            ...b.rows.map((row) => row.map(plainText).join(" ")),
          ].join(" ");
        default:
          return "";
      }
    })
    .join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

/** The blocks belonging to each H2, in order. */
function sections(blocks: Block[]): { heading: Block & { kind: "h2" }; body: Block[] }[] {
  const out: { heading: Block & { kind: "h2" }; body: Block[] }[] = [];
  for (const block of blocks) {
    if (block.kind === "h2") out.push({ heading: block, body: [] });
    else out[out.length - 1]?.body.push(block);
  }
  return out;
}

export interface HowToStep {
  name: string;
  text: string;
  anchor: string;
  image?: string;
}

/**
 * Every H2 of the form "Test 3: The Taste Test" becomes a HowTo step.
 *
 * Step text is the instruction paragraph plus the pure/adulterated pair —
 * what to do and how to read the result — which is what a step is. The
 * trailing "Why it works" explanation is left out; it's background, and
 * Google truncates long step text anyway.
 */
export function howToSteps(blocks: Block[]): HowToStep[] {
  // The separator is a colon today; the dashes stay accepted so an older
  // post, or one written in a different editor, still yields its steps.
  const TEST_HEADING = /^Test\s+\d+\s*[:—–-]\s*(.+)$/;

  return sections(blocks).flatMap(({ heading, body }) => {
    const match = heading.text.match(TEST_HEADING);
    if (!match) return [];

    const instruction = body.find((b) => b.kind === "p");
    const verdicts = body.find((b) => b.kind === "compare");

    const text = [
      instruction ? plainText(instruction.inline) : "",
      ...(verdicts?.rows.map((r) => `${r.label}: ${plainText(r.inline)}`) ?? []),
    ]
      .filter(Boolean)
      .join(" ");

    const figure = body.find((b) => b.kind === "figure");

    return [
      {
        name: match[1].trim(),
        text,
        anchor: heading.id,
        image: figure?.src,
      },
    ];
  });
}

export interface RecipeParts {
  ingredients: string[];
  steps: HowToStep[];
}

/**
 * Ingredient lines and named method steps, for Recipe schema.
 *
 * Same contract as `howToSteps`: the markup is a function of the prose, so a
 * recipe card can never promise Google a step the page does not render.
 * Ingredients are the bullet list under the "Ingredients" H2; steps are the
 * H3s under the "Method" H2, each carrying its own paragraphs as the
 * instruction text. Anything else in either section — an aside about which
 * pan to use, a note on why a batch fails — is left out of the schema and
 * still renders normally.
 *
 * Returns null when the article is not laid out as a recipe, which is what
 * keeps this off the other posts.
 *
 * The Nepali recipes head the same two sections सामग्री and विधि, matched
 * the way FAQ_HEADINGS matches the Nepali FAQ heading.
 */
const INGREDIENT_HEADINGS = ["ingredients", slugifyHeading("सामग्री")];
const METHOD_HEADINGS = ["method", slugifyHeading("विधि")];

export function recipeParts(blocks: Block[]): RecipeParts | null {
  const all = sections(blocks);
  const opens = (s: { heading: { text: string } }, names: string[]) =>
    names.some((n) => slugifyHeading(s.heading.text).startsWith(n));
  const ingredientSection = all.find((s) => opens(s, INGREDIENT_HEADINGS));
  const methodSection = all.find((s) => opens(s, METHOD_HEADINGS));
  if (!ingredientSection || !methodSection) return null;

  const ingredients = ingredientSection.body.flatMap((b) =>
    b.kind === "list" && !b.ordered ? b.items.map(plainText) : [],
  );

  // Walk the method section in order, opening a new step at every H3 and
  // appending the paragraphs that follow it.
  const steps: HowToStep[] = [];
  for (const block of methodSection.body) {
    if (block.kind === "h3") {
      steps.push({ name: block.text, text: "", anchor: block.id });
      continue;
    }
    const current = steps[steps.length - 1];
    if (!current) continue;
    if (block.kind === "p") {
      current.text = `${current.text} ${plainText(block.inline)}`.trim();
    } else if (block.kind === "figure" && !current.image) {
      current.image = block.src;
    }
  }

  const named = steps.filter((s) => s.text);
  if (!ingredients.length || !named.length) return null;
  return { ingredients, steps: named };
}

/** The Q&A under the "Frequently Asked Questions" H2, for FAQPage schema. */
export function faqEntries(blocks: Block[]): { q: string; a: string }[] {
  const faq = sections(blocks).find((s) => FAQ_HEADINGS.has(slugifyHeading(s.heading.text)));
  if (!faq) return [];

  const out: { q: string; a: string }[] = [];
  for (const block of faq.body) {
    if (block.kind === "h3") out.push({ q: block.text, a: "" });
    else if (block.kind === "p" && out.length) {
      const current = out[out.length - 1];
      current.a = `${current.a} ${plainText(block.inline)}`.trim();
    }
  }
  return out.filter((f) => f.a);
}

// ─── Image dimensions ──────────────────────────────────────────────────────

const sizeCache = new Map<string, { width: number; height: number } | null>();

/**
 * Intrinsic dimensions of a `public/`-relative image, read straight from the
 * file header at build time.
 *
 * `next/image` needs width and height for anything that isn't a static import,
 * and hardcoding them in the post data would rot the first time a photo is
 * re-shot. Reading them here also doubles as the existence check that decides
 * whether a figure renders at all. Returns null if the file is missing or the
 * format isn't one we ship.
 */
function imageSize(src: string): { width: number; height: number } | null {
  const cached = sizeCache.get(src);
  if (cached !== undefined) return cached;

  let size: { width: number; height: number } | null = null;
  try {
    size = readImageHeader(readFileSync(join(process.cwd(), "public", src)));
  } catch {
    size = null;
  }

  sizeCache.set(src, size);
  return size;
}

function readImageHeader(buf: Buffer): { width: number; height: number } | null {
  // PNG — IHDR is always the first chunk.
  if (buf.length >= 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  // WebP — three sub-formats, each storing the size differently.
  if (
    buf.length >= 30 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    switch (buf.toString("ascii", 12, 16)) {
      case "VP8 ":
        return {
          width: buf.readUInt16LE(26) & 0x3fff,
          height: buf.readUInt16LE(28) & 0x3fff,
        };
      case "VP8L": {
        const bits = buf.readUInt32LE(21);
        return {
          width: (bits & 0x3fff) + 1,
          height: ((bits >> 14) & 0x3fff) + 1,
        };
      }
      case "VP8X":
        return {
          width: buf.readUIntLE(24, 3) + 1,
          height: buf.readUIntLE(27, 3) + 1,
        };
      default:
        return null;
    }
  }

  // JPEG — walk the segment chain to the start-of-frame marker.
  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) {
        i += 1;
        continue;
      }
      const marker = buf[i + 1];
      // Padding and the standalone markers carry no length field.
      if (marker === 0xff || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
        i += marker === 0xff ? 1 : 2;
        continue;
      }
      const isStartOfFrame =
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 && // Huffman table
        marker !== 0xc8 && // JPEG extensions
        marker !== 0xcc; // arithmetic coding conditioning
      if (isStartOfFrame) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }

  return null;
}
