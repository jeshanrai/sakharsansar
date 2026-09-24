import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Breadcrumbs, { type Crumb } from "@/components/layout/Breadcrumbs";
import { AnimatedWave, Bee } from "@/components/ui/StoryArt";
import { Daisy } from "@/components/ui/Doodles";
import content from "@/data/content.json";
import { languageAlternates } from "@/lib/hreflang";
import { formatPrice, productName } from "@/lib/i18n";
import { alternates, openGraph, twitter } from "@/lib/metadata";
import { OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { neProduct } from "@/lib/ne-content";
import { parsePrice } from "@/lib/seo";

/**
 * The pieces every /ne/ commercial page shares.
 *
 * Built from the same parts as the English pages (the peach hero, the wave,
 * the breadcrumb, the article body) so the Nepali site looks like the same
 * shop in another language rather than a second one.
 */

/**
 * Metadata for a Nepali page: canonical to itself, the reciprocal hreflang
 * pair with its English counterpart, og:locale ne_NP, and the English page's
 * share card. The cards are pictures of the product with its name and price
 * on them; drawing Nepali ones is a separate job, and a missing card is worse
 * than an English one.
 */
export function neMetadata(opts: {
  title: string;
  description: string;
  path: string;
  enPath: string;
  /** The English route's colocated card, e.g. "/shop/opengraph-image". */
  card: string;
  cardAlt: string;
}): Metadata {
  const image = {
    url: opts.card,
    ...OG_SIZE,
    type: OG_CONTENT_TYPE,
    alt: opts.cardAlt,
  };
  return {
    title: opts.title,
    description: opts.description,
    alternates: alternates({
      canonical: opts.path,
      languages: languageAlternates({ en: opts.enPath, ne: opts.path }),
    }),
    openGraph: openGraph(
      {
        title: opts.title,
        description: opts.description,
        url: opts.path,
        images: [image],
      },
      { locale: "ne", hasTranslation: true },
    ),
    twitter: twitter({
      title: opts.title,
      description: opts.description,
      images: [image],
    }),
  };
}

/** The peach page header, as on /wholesale and the articles. */
export function NeHero({
  trail,
  eyebrow,
  title,
  lede,
  children,
}: {
  /** Omit on the home page, which has no trail. */
  trail?: Crumb[];
  eyebrow: string;
  title: string;
  lede: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative bg-peach overflow-hidden pt-28 sm:pt-36 pb-24 sm:pb-32 px-6 sm:px-10 lg:px-16">
      <Bee aria-hidden className="pointer-events-none absolute top-28 right-[8%] w-24 h-16 text-peach-line/70 hidden md:block" />
      <Daisy aria-hidden className="pointer-events-none absolute top-24 right-[27%] w-14 h-14 text-peach-line/50 -rotate-12 hidden md:block" />

      <div className="relative z-10 max-w-[820px] mx-auto">
        {trail && <Breadcrumbs trail={trail} className="mb-7" locale="ne" />}

        <span className="inline-flex items-center rounded-full bg-grove/10 border border-grove/15 px-3.5 py-1.5 label-caps text-grove">
          {eyebrow}
        </span>

        <h1 className="mt-6 font-marker uppercase text-jaggery leading-[1.05] tracking-tight text-[clamp(2.25rem,5.5vw,4.25rem)] text-balance">
          {title}
        </h1>

        <p className="font-serif italic text-jaggery/75 text-lede mt-6 max-w-2xl">{lede}</p>

        {children}
      </div>

      <AnimatedWave aria-hidden className="absolute bottom-0 left-0 w-full h-[48px] sm:h-[68px] text-cream" />
    </header>
  );
}

/** The three products as cards, each going to its Nepali page. */
export function NeProductGrid() {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {content.products.map((p) => {
        const ne = neProduct(p.slug);
        const name = ne?.name ?? productName(p.name, "ne");
        return (
          <li key={p.slug}>
            <Link
              href={`/ne/products/${p.slug}`}
              className="group block rounded-3xl bg-ivory ring-1 ring-jaggery/8 overflow-hidden hover:shadow-xl hover:shadow-jaggery/10 transition-shadow"
            >
              <div className="relative aspect-square">
                <Image
                  src={p.image}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <p className="font-serif text-lg text-jaggery">{name}</p>
                <p className="mt-1 flex items-center justify-between text-jaggery/70">
                  <span className="nums-price">
                    {formatPrice(Number(parsePrice(p.price)), "ne")} · {ne?.weight ?? p.weight}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} aria-hidden />
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
