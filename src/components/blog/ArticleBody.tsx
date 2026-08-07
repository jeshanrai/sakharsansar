import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, TriangleAlert } from "lucide-react";
import type { Block, Inline } from "@/lib/article";

/**
 * Renders a parsed journal article.
 *
 * The body column is 720px, so everything here is tuned for one measure of
 * text on a phone: short paragraphs, headings that survive being scanned past,
 * and the two custom blocks — the answer box and the pure/adulterated verdict
 * pair — carrying the weight that a wall of prose can't.
 */
export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  // The drop cap belongs to the opening paragraph only, wherever it falls.
  const leadIndex = blocks.findIndex((b) => b.kind === "p");

  return (
    <>
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} lead={i === leadIndex} />
      ))}
    </>
  );
}

function BlockView({ block, lead }: { block: Block; lead: boolean }) {
  switch (block.kind) {
    case "h2":
      return (
        <h2
          id={block.id}
          className="scroll-mt-28 font-serif text-h3 text-jaggery mt-16 mb-5 tracking-[-0.012em] text-balance"
        >
          {block.text}
        </h2>
      );

    case "h3":
      return (
        <h3
          id={block.id}
          className="scroll-mt-28 font-display font-bold text-jaggery text-h4 mt-11 mb-4 text-balance"
        >
          {block.text}
        </h3>
      );

    case "p":
      return (
        <p className={`text-jaggery/85 text-lede mb-7 ${lead ? "has-dropcap" : ""}`}>
          <InlineView nodes={block.inline} />
        </p>
      );

    case "note":
      return <AnswerBox inline={block.inline} />;

    case "list":
      return <ListView ordered={block.ordered} items={block.items} />;

    case "compare":
      return <CompareCard rows={block.rows} />;

    case "figure":
      return <FigureView block={block} />;
  }
}

/**
 * The featured-snippet answer block.
 *
 * Set apart visually, but still a plain <p> inside — Google lifts paragraph
 * text into position zero and a box built out of divs gives it nothing to
 * lift.
 */
function AnswerBox({ inline }: { inline: Inline[] }) {
  return (
    <aside className="my-10 rounded-2xl bg-ivory border border-jaggery/10 border-l-4 border-l-honey px-6 sm:px-8 py-7 shadow-sm">
      <span className="label-caps text-caramel mb-3 block">The short answer</span>
      <p className="text-jaggery/90 text-lede">
        <InlineView nodes={inline} />
      </p>
    </aside>
  );
}

/** The pure vs adulterated verdict pair that closes each test. */
function CompareCard({
  rows,
}: {
  rows: { label: string; inline: Inline[] }[];
}) {
  return (
    <div className="my-8 rounded-2xl overflow-hidden ring-1 ring-jaggery/10 bg-ivory">
      {rows.map((row, i) => {
        // First row is always the pure result, second the adulterated one.
        const pure = i === 0;
        const Icon = pure ? Check : TriangleAlert;
        return (
          <div
            key={row.label}
            className={`flex gap-4 px-5 sm:px-6 py-5 ${
              i > 0 ? "border-t border-jaggery/10" : ""
            } ${pure ? "bg-grove/[0.04]" : "bg-terracotta/[0.04]"}`}
          >
            <span
              aria-hidden
              className={`mt-0.5 h-7 w-7 shrink-0 rounded-full flex items-center justify-center ${
                pure ? "bg-grove/12 text-grove" : "bg-terracotta/12 text-terracotta"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={2.25} />
            </span>
            <div>
              <span
                className={`label-caps block mb-1.5 ${
                  pure ? "text-grove" : "text-terracotta"
                }`}
              >
                {row.label}
              </span>
              <p className="text-jaggery/85 text-body">
                <InlineView nodes={row.inline} />
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ListView({
  ordered,
  items,
}: {
  ordered: boolean;
  items: Inline[][];
}) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className="my-8 space-y-3.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4 items-baseline">
          <span
            aria-hidden
            className={
              ordered
                ? "shrink-0 w-7 text-right font-serif text-caramel-deep text-lg nums-tabular"
                : "shrink-0 w-2 h-2 rounded-full bg-caramel/60 translate-y-[-0.15em]"
            }
          >
            {ordered ? i + 1 : null}
          </span>
          <span className="text-jaggery/85 text-lede">
            <InlineView nodes={item} />
          </span>
        </li>
      ))}
    </Tag>
  );
}

function FigureView({ block }: { block: Block & { kind: "figure" } }) {
  return (
    <figure className="my-10 -mx-2 sm:mx-0">
      <Image
        src={block.src}
        alt={block.alt}
        width={block.width}
        height={block.height}
        sizes="(max-width: 768px) 100vw, 720px"
        className="w-full h-auto max-h-[85vh] object-contain rounded-2xl bg-ivory ring-1 ring-jaggery/8"
      />
      {block.caption && (
        <figcaption className="mt-3.5 px-2 sm:px-0 font-serif italic text-jaggery/55 text-meta">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

function InlineView({ nodes }: { nodes: Inline[] }) {
  return (
    <>
      {nodes.map((node, i) => {
        switch (node.kind) {
          case "text":
            return <React.Fragment key={i}>{node.text}</React.Fragment>;

          case "strong":
            return (
              <strong key={i} className="font-medium text-jaggery">
                {node.text}
              </strong>
            );

          case "em":
            return <em key={i}>{node.text}</em>;

          case "link":
            // Outbound citations open in a new tab and say so, so the reader
            // knows before they tap that they are leaving the article.
            return node.external ? (
              <a
                key={i}
                href={node.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-grove underline decoration-grove/30 underline-offset-[3px] hover:decoration-grove transition-colors"
              >
                {node.text}
                <ArrowUpRight
                  className="inline-block w-3.5 h-3.5 ml-0.5 -translate-y-px"
                  strokeWidth={2}
                  aria-label="(opens in a new tab)"
                />
              </a>
            ) : (
              <Link
                key={i}
                href={node.href}
                className="text-grove underline decoration-grove/30 underline-offset-[3px] hover:decoration-grove transition-colors"
              >
                {node.text}
              </Link>
            );
        }
      })}
    </>
  );
}
