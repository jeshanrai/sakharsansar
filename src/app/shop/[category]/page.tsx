import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Footer from "@/components/layout/Footer";
import OrderDrawer from "@/components/layout/OrderDrawer";
import ShopContent from "@/components/shop/ShopContent";
import JsonLd from "@/components/seo/JsonLd";
import { CATEGORIES, findCategory, productsIn } from "@/lib/categories";
import { breadcrumbLd, itemListLd } from "@/lib/seo";
import { alternates, openGraph, twitter } from "@/lib/metadata";

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

  return {
    title: cat.title,
    description: cat.description,
    alternates: alternates({ canonical: `/shop/${cat.slug}` }),
    openGraph: openGraph({
      title: cat.heading,
      description: cat.description,
      url: `/shop/${cat.slug}`,
    }),
    twitter: twitter({ title: cat.heading, description: cat.description }),
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
          products.map((p) => ({ name: p.name, path: `/products/${p.slug}` })),
        )}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Shop", path: "/shop" },
          { name: cat.name, path: `/shop/${cat.slug}` },
        ])}
      />

      <OrderDrawer />

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

        <ShopContent initialCategory={cat.name} />
      </main>

      <Footer />
    </>
  );
}
