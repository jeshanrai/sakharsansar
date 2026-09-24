import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Footer from "@/components/layout/Footer";
import ShopContent from "@/components/shop/ShopContent";
import { productCards } from "@/lib/product-cards";
import JsonLd from "@/components/seo/JsonLd";
import { CATEGORIES, categoryPaths, findCategory, productsIn } from "@/lib/categories";
import { breadcrumbLd, itemListLd, productNodeId } from "@/lib/seo";
import { alternates, openGraph, twitter } from "@/lib/metadata";
import { OG_CONTENT_TYPE } from "@/lib/og";

/**
 * /shop/[category] — a real URL per shop category.
 *
 * These views existed already as client-side filter state, which meant the
 * shop's own structure was unlinkable and uncrawlable: nothing on the site
 * matched "jaggery powder Nepal" except a single product page. Each category
 * now renders on the server with its own heading, written intro and canonical.
 *
 * The grid below the header is the same <ShopContent> the parent /shop uses,
 * handed the category to open on. It keeps working as a filter — switching
 * category from here pushes the sibling URL rather than silently changing what
 * is on screen under an address that no longer describes it.
 */

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

/**
 * The categories are fully enumerated above, so any other segment is invalid.
 * Without this a mistyped /shop/anything returned 200 with the 404 page inside
 * it — a soft 404, which Google reports as an error rather than dropping.
 */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = findCategory(category);
  if (!cat) return { title: "Not Found", robots: { index: false } };

  // The card art comes from the colocated opengraph-image.tsx, but it is
  // named here rather than left to be resolved, because `export const alt` in
  // that file is one string for the whole [category] segment — so all three
  // categories would advertise the same description of three different
  // pictures. Same reasoning, and the same workaround, as the journal posts.
  const card = {
    url: `/shop/${cat.slug}/opengraph-image`,
    width: 1200,
    height: 630,
    type: OG_CONTENT_TYPE,
    alt: `${cat.heading}: ${cat.description}`,
  };

  return {
    // Absolute, so the root layout's "| SakharSansar" is not appended. With it
    // every one of these ran past the width Google renders and the brand was
    // the part cut off; the keyword these pages exist to catch is worth more
    // here than a suffix nobody reads.
    title: { absolute: cat.title },
    description: cat.description,
    alternates: alternates({ canonical: `/shop/${cat.slug}` }),
    openGraph: openGraph({
      title: cat.heading,
      description: cat.description,
      url: `/shop/${cat.slug}`,
      images: [card],
    }),
    twitter: twitter({
      title: cat.heading,
      description: cat.description,
      images: [{ ...card, url: `/shop/${cat.slug}/twitter-image` }],
    }),
  };
}

export default async function ShopCategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = findCategory(category);
  if (!cat) notFound();

  const products = productsIn(cat.name);
  // A category that has lost its last product is a page with a heading and an
  // empty grid. Better a 404 than an indexable empty result.
  if (products.length === 0) notFound();

  return (
    <>
      {/* The product cards' backdrop is a CSS background, which the browser
          cannot discover until it has parsed the stylesheet — and on this page
          a card is the LCP element. Preloading makes it visible in the first
          byte. The raw path is correct here: CSS backgrounds do not pass
          through next/image, so this is the URL that is actually fetched. */}
      <link rel="preload" as="image" href="/cane-texture.jpg" fetchPriority="high" />
      <JsonLd
        data={itemListLd(
          cat.heading,
          products.map((p) => ({
            name: p.name,
            path: `/products/${p.slug}`,
            id: productNodeId(p.slug),
          })),
        )}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Shop", path: "/shop" },
          { name: cat.name, path: `/shop/${cat.slug}` },
        ])}
      />


      {/* The navbar is fixed and 108px tall, so pt-10 left the eyebrow and
          the top of the H1 behind it. */}
      <main className="overflow-x-hidden pt-32 sm:pt-36">
        <header className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pb-7 sm:pb-9">
          {/* Trail matches the BreadcrumbList above it. */}
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 label-caps text-jaggery/70 min-w-0">
              <li className="shrink-0">
                <Link href="/" className="hover:text-grove transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-3 h-3 shrink-0 text-jaggery/30" strokeWidth={2.5} aria-hidden />
              <li className="shrink-0">
                <Link href="/shop" className="hover:text-grove transition-colors">
                  Shop
                </Link>
              </li>
              <ChevronRight className="w-3 h-3 shrink-0 text-jaggery/30" strokeWidth={2.5} aria-hidden />
              <li aria-current="page" className="text-grove truncate">
                {cat.name}
              </li>
            </ol>
          </nav>

          <p className="text-[11px] font-bold tracking-caps uppercase text-jaggery/70 mb-3">
            {products.length} {products.length === 1 ? "form" : "forms"} · Shipped pan-Nepal
          </p>
          <h1 className="font-marker uppercase text-jaggery leading-[0.9] tracking-tight text-[clamp(2rem,5vw,3.25rem)]">
            {cat.heading}
          </h1>

          <div className="mt-4 max-w-2xl space-y-4 text-[15px] sm:text-base text-jaggery/70 leading-relaxed">
            {cat.intro.map((para) => (
              <p key={para.slice(0, 32)}>{para}</p>
            ))}
          </div>
        </header>

        <ShopContent
          products={productCards()}
          categoryPaths={categoryPaths()}
          initialCategory={cat.name}
        />
      </main>

      <Footer />
    </>
  );
}
