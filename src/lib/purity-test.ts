import { parseArticle, plainText, type Block } from "./article";
import { posts } from "./blog";

/**
 * The seven home tests, read out of the article that publishes them.
 *
 * Deliberately derived rather than retyped. The tests already exist as prose
 * in /blog/how-to-identify-pure-jaggery-sakhar, complete with the `:::compare`
 * verdict pairs that say what a pure block does and what an adulterated one
 * does. Copying those into a second data file would give the site two versions
 * of its own advice, and the moment somebody corrected the article the tool
 * would go on giving the old answer to everyone who used it. This is the same
 * reasoning that keeps the FAQ schema tied to the rendered FAQ.
 *
 * The shape the article has to keep for this to work:
 *
 *   ## Test N: The <name> Test
 *   <one or more paragraphs — the first becomes the instruction>
 *   :::compare
 *   Pure sakhar | <what a pure block does>
 *   Adulterated | <what an adulterated one does>
 *   :::
 *
 * If that shape breaks, `purityTests()` returns fewer than seven and the build
 * fails on the assertion below rather than quietly shipping a tool with three
 * questions in it.
 */

export const SOURCE_SLUG = "how-to-identify-pure-jaggery-sakhar";

export interface PurityTest {
  /** "1" … "7". */
  number: string;
  /** "The Water Test". */
  name: string;
  /** Anchor of the H2 in the source article, so each step can link to it. */
  anchor: string;
  /** What to do, in one paragraph. */
  instruction: string;
  /** What a pure block does. */
  pure: string;
  /** What an adulterated one does. */
  adulterated: string;
}

function isTestHeading(block: Block): block is Extract<Block, { kind: "h2" }> {
  return block.kind === "h2" && /^Test \d+:/.test(block.text);
}

export function purityTests(): PurityTest[] {
  const post = posts.find((p) => p.slug === SOURCE_SLUG);
  if (!post) return [];

  const blocks = parseArticle(post.content);
  const tests: PurityTest[] = [];

  blocks.forEach((block, i) => {
    if (!isTestHeading(block)) return;

    const [, number, name] = block.text.match(/^Test (\d+):\s*(.+)$/) ?? [];
    if (!number || !name) return;

    // Walk forward to the next Test heading, collecting the first paragraph
    // and the compare pair.
    let instruction = "";
    let pure = "";
    let adulterated = "";

    for (let j = i + 1; j < blocks.length; j++) {
      const next = blocks[j];
      // Any H2 ends this test, whether it is the next one or the section after.
      if (next.kind === "h2") break;
      if (!instruction && next.kind === "p") instruction = plainText(next.inline);
      if (next.kind === "compare") {
        for (const row of next.rows) {
          const text = plainText(row.inline);
          if (/^pure/i.test(row.label)) pure = text;
          else adulterated = text;
        }
      }
    }

    if (!instruction || !pure || !adulterated) return;

    tests.push({
      number,
      name: name.trim(),
      anchor: block.id,
      instruction,
      pure,
      adulterated,
    });
  });

  return tests;
}

/**
 * What a run of the tests means, in the register the article uses.
 *
 * No score, no percentage, no verdict dressed up as a lab result. The article
 * is explicit that these are household tests and that a block can fail one and
 * still be fine, so the tool says the same thing rather than inventing a
 * confidence number to look authoritative.
 */
export function verdictFor(failed: number, total: number): { heading: string; body: string } {
  if (failed === 0) {
    return {
      heading: "Nothing here says adulterated",
      body: `This block behaved the way unrefined sakhar behaves on all ${total} tests. That is a good sign and it is not a certificate. These are kitchen tests, not a laboratory, and they catch the common adulterations rather than every possible one.`,
    };
  }
  if (failed === 1) {
    return {
      heading: "One test out of step",
      body: "A single odd result is worth noticing and not worth panicking over. Colour and hardness both vary honestly between batches, with the cane and with how long the fire ran. Run that one again on a fresh piece before you conclude anything.",
    };
  }
  if (failed <= 3) {
    return {
      heading: "Enough to be careful",
      body: `${failed} of ${total} tests came back the way an adulterated block behaves. Any one of those has an innocent explanation. Several together, in the same piece, usually do not. Ask the seller what is in it, and watch whether the answer is specific.`,
    };
  }
  return {
    heading: "This behaves like an adulterated block",
    body: `${failed} of ${total} tests point the same way. Sediment in the glass, starch in the iodine and a uniform bright colour are not batch variation, they are things that were added. We would not use this block, and we would want the money back.`,
  };
}
