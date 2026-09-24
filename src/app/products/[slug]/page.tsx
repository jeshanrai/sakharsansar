import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Footer from "@/components/layout/Footer";
import OrderDrawer from "@/components/layout/OrderDrawer";
import ProductActions from "@/components/product/ProductActions";
import ProductDetailSections from "@/components/product/ProductDetailSections";
import { AnimatedWave } from "@/components/ui/StoryArt";
import { Daisy } from "@/components/ui/Doodles";
import JsonLd from "@/components/seo/JsonLd";
import { BLOG_ENABLED } from "@/lib/blog";
import { readingFor } from "@/lib/product-reading";
import data from "@/data/content.json";
import { faqLd, parsePrice, productLd } from "@/lib/seo";
import { CATEGORIES } from "@/lib/categories";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { ArrowRight, Leaf, ShieldCheck, Truck } from "lucide-react";
import { alternates, openGraph, twitter } from "@/lib/metadata";
import { OG_CONTENT_TYPE } from "@/lib/og";
import { bestBefore, harvestSeason } from "@/lib/batch";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return data.products.map((product) => ({ slug: product.slug }));
}

/**
 * The catalogue is fully enumerated above, so an unlisted slug is invalid.
 * Without this, a mistyped or retired product URL returned HTTP 200 with the
 * 404 page inside it — a soft 404, which Google flags as an error rather than
 * dropping the URL. `false` makes those a real 404.
 */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = data.products.find((p) => p.slug === slug);
  if (!product) return { title: "Product Not Found", robots: { index: false } };

  const card = {
    url: `/products/${product.slug}/opengraph-image`,
    width: 1200,
    height: 630,
    type: OG_CONTENT_TYPE,
    alt: `${product.name}, ${product.weight}: ${product.description}`,
  };

  return {
    // No brand suffix — the root layout's `title.template` appends
    // "| SakharSansar". The weight is carried in the title because size is a
    // real qualifier people search on ("jaggery powder 250g"). The trailing
    // qualifier comes from the product's own record — the nut mix is not
    // "Pure Himalayan Sakhar", it is dry fruit with sakhar on it.
    // A product can set the whole title instead, where the phrase people
    // search for does not fit the pattern: "jaggery powder" (210 a month)
    // would push the powder past 60 characters as a trailing qualifier.
    title:
      "seoTitle" in product && product.seoTitle
        ? product.seoTitle
        : `${product.name} — ${product.weight} ${product.seoQualifier}`,
    // Hand-written per product, not sliced out of the body copy. The old
    // `longDescription.slice(0, 160)` cut every one of these mid-word — the
    // block's ended "...skimmed by hand and poure" — which is what Google
    // showed in the result. A description is a piece of copy with a job, not
    // the first 160 characters of a different piece of copy.
    description: product.metaDescription,
    alternates: alternates({ canonical: `/products/${product.slug}` }),
    openGraph: openGraph({
      title: `${product.name} · ${product.price}`,
      description: product.description,
      url: `/products/${product.slug}`,
      // The card art comes from the colocated opengraph-image.tsx, which
      // renders the product photo at a true 1200×630 with its name and price
      // on it — but the route is named here rather than left to resolve,
      // because `export const alt` in that file is one string for the whole
      // [slug] segment. All three products advertised "SakharSansar product:
      // pure Himalayan jaggery" over three different pictures, one of which is
      // a bag of nuts.
      //
      // These pages need og:type=product, which Next cannot express: its
      // OpenGraph type is a closed union without a 'product' member, and the
      // resolver throws "Invalid OpenGraph type" on anything outside it.
      // `other` is no help either — it emits <meta name="og:type">, and Open
      // Graph parsers only read property=. So the product tags are rendered as
      // elements in the page body and React hoists them into <head>.
      //
      // `omitType` suppresses the helper's "website" default. Without it the
      // page ships two competing og:type tags.
      images: [card],
    }, { omitType: true }),
    twitter: twitter({
      title: product.name,
      description: product.description,
      images: [{ ...card, url: `/products/${product.slug}/twitter-image` }],
    }),
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = data.products.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = data.products.filter((p) => p.slug !== slug).slice(0, 3);

  // Articles worth reading from this product specifically.
  const reading = readingFor(slug);

  // Full Product + Offer markup, including the shipping and return terms
  // Google needs to show a merchant listing rather than a bare snippet.
  const jsonLd = productLd(product);

  // Home → Shop → Blocks → Sakhar Block. The category level was missing, from
  // both the trail and the markup, because it had no URL to point at when this
  // was written — it does now, and skipping it hid the one piece of structure
  // the shop actually has.
  const category = CATEGORIES.find((c) => c.name === product.category);
  const trail = [
    { name: "Shop", path: "/shop" },
    ...(category ? [{ name: category.name, path: `/shop/${category.slug}` }] : []),
    { name: product.name, path: `/products/${product.slug}` },
  ];

  // FAQ — the product's own questions come first (its format, its ingredients,
  // its storage behaviour); the last two are the genuinely sitewide ones.
  // These were once templated off the product name, which meant every page
  // carried the same five answers with one noun swapped — a large part of why
  // Google read the catalogue as one page repeated and left most of it out of
  // the index.
  const faqs = [
    ...product.faqs,
    {
      q: "How is jaggery different from refined white sugar?",
      a: "Unlike refined sugar, our unrefined jaggery retains the iron, magnesium and potassium naturally present in sugarcane, and carries a deep caramel flavour refined sugar can't match.",
    },
    {
      q: "Do you deliver across Nepal?",
      a: "Yes. We ship pan-Nepal, packed in compostable kraft paper, direct from Sankhuwasabha.",
    },
  ];

  const faqJsonLd = faqLd(faqs);

  // Expandable detail sections.
  //
  // Every one of these used to be hardcoded prose shared by every product —
  // the same tasting notes, the same four serving suggestions, the same "cane
  // is harvested at first light" sourcing paragraph. That was inaccurate as
  // well as duplicative: the dry fruit mix is coated, not pressed and moulded.
  // They now read from the product's own record.
  //
  // `harvest` is the Bikram Sambat cane season and `packed` is when this pouch
  // was filled. Both resolve to null until somebody records them, and the copy
  // below simply omits the sentence rather than asserting a date we do not have.
  const season = harvestSeason(product.harvest);
  const bestBeforeDate = bestBefore(product.packed, product.shelfLife);

  const sections = [
    {
      title: "Tasting Notes",
      body: <p>{product.tastingNotes}</p>,
    },
    {
      title: "How to Use",
      body: (
        <ul className="list-disc pl-5 space-y-2">
          {product.howToUse.map((use) => (
            <li key={use}>{use}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Sourcing & Process",
      body: (
        <p>
          {product.sourcing}
          <br /><br />
          <strong className="font-serif text-jaggery not-italic">Ingredients:</strong>{" "}
          {product.ingredients}.
        </p>
      ),
    },
    {
      title: "Storage & Shelf Life",
      body: (
        <p>
          {product.shelfLife}. Keep away from direct sunlight and humidity. A small
          amount of natural crystallisation over time is a sign of purity, not spoilage.
          {/* The harvest badge and this shelf life sat on the same page with
              nothing joining them, so a careful reader could subtract one from
              the other and conclude the pouch had expired. They are two
              different dates: the cane is cut once a year in Mangsir, and the
              pouch is packed when it is packed. Saying so is cheaper than
              losing the sale to arithmetic we invited. */}
          {season && (
            <>
              {" "}The cane for this sakhar was cut in {product.harvest} ({season.gregorian}).
              Shelf life is counted from the day the pouch was packed, not from the harvest.
            </>
          )}
          {bestBeforeDate && (
            <>
              {" "}<strong className="font-serif text-jaggery not-italic">
                Best before {bestBeforeDate}.
              </strong>
            </>
          )}
        </p>
      ),
    },
  ];

  // Open Graph product tags. React 19 hoists <meta> rendered anywhere in the
  // tree up into <head>, which is the only route to `property="og:type"` with
  // a value Next's metadata union does not carry. See generateMetadata above.
  // parsePrice, not a fresh regex: "Rs. 400" through `[^0-9.]` leaves the dot
  // from "Rs." and yields ".400". The Offer schema already learned this.
  const ogPrice = parsePrice(product.price);

  return (
    <>
      <meta property="og:type" content="product" />
      <meta property="product:price:amount" content={ogPrice} />
      <meta property="product:price:currency" content="NPR" />
      <meta property="product:availability" content="in stock" />
      <meta property="product:condition" content="new" />
      <meta property="product:retailer_item_id" content={product.slug} />

      <JsonLd data={jsonLd} />
      <JsonLd data={faqJsonLd} />

      <OrderDrawer />

      <main className="overflow-x-hidden bg-cream">
        {/* Breadcrumb.
            This was a single "Back to Collection" pill: one hop, to one place,
            saying nothing about where the page sits. The trail supersedes it —
            it still links back to the shop, and now also to the category, and
            it is the thing Google shows in place of the raw URL in a result. */}
        <div className="pt-28 sm:pt-36 px-6 sm:px-10 lg:px-16">
          <div className="max-w-[1440px] mx-auto">
            <Breadcrumbs trail={trail} className="" />
          </div>
        </div>

        {/* Product Detail */}
        <section
          aria-label="Product Detail"
          className="py-10 sm:py-16 px-6 sm:px-10 lg:px-16"
        >
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Image — 60% on desktop, sticky */}
            <div className="lg:col-span-7 lg:sticky lg:top-28">
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-ivory ring-1 ring-jaggery/8 shadow-xl shadow-jaggery/10">
                <Image
                  src={product.image}
                  alt={`${product.name}, ${product.weight} of pure Himalayan jaggery`}
                  fill
                  priority
                  // `priority` preloads it, but Lighthouse still reported the
                  // LCP element as not priority-hinted: the hint lands on the
                  // preload link, not on the <img> the browser actually paints.
                  fetchPriority="high"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                {/* Harvest badge */}
                <div className="absolute top-5 left-5 sm:top-6 sm:left-6 rounded-2xl bg-cream/95 backdrop-blur-sm px-4 py-3 shadow-lg shadow-jaggery/10">
                  <span className="label-caps text-jaggery/70 block mb-0.5">Harvested</span>
                  <span className="font-serif text-meta text-jaggery nums-price">{product.harvest}</span>
                </div>
              </div>
            </div>

            {/* Info — 40% */}
            <div className="lg:col-span-5 flex flex-col">
              <span className="inline-flex self-start items-center rounded-full bg-caramel/12 border border-caramel/20 px-3.5 py-1.5 label-caps text-caramel-deep mb-5">
                {product.category}
              </span>

              <h1 className="font-serif text-h1 text-jaggery tracking-display mb-5 text-balance">
                {product.name}
              </h1>

              <p className="font-serif italic text-jaggery/75 text-lede mb-9 max-w-md">
                {product.description}
              </p>

              <div className="flex items-baseline gap-4 mb-9">
                <span className="font-serif text-h3 text-jaggery nums-price">
                  {product.price}
                </span>
                <span className="label-caps text-jaggery/70 rounded-full border border-jaggery/20 px-3.5 py-1.5 nums-price">
                  {product.weight}
                </span>
              </div>

              <ProductActions productName={product.name} slug={product.slug} />

              {/* Trust strip — pills */}
              <div className="flex flex-wrap gap-2.5 mt-7 mb-11">
                {[
                  { Icon: Leaf, label: "100% Natural" },
                  { Icon: ShieldCheck, label: "Chemical Free" },
                  { Icon: Truck, label: "Ships Pan-Nepal" },
                ].map(({ Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full bg-forest/8 border border-forest/12 px-3.5 py-2 label-caps text-forest"
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                    {label}
                  </span>
                ))}
              </div>

              {/* Expandable sections */}
              <ProductDetailSections sections={sections} />
            </div>
          </div>
        </section>

        {/* FAQ — visible content backing the FAQPage schema above */}
        <section
          aria-label="Frequently asked questions"
          className="relative py-20 sm:py-28 px-6 sm:px-10 lg:px-16 bg-ivory border-t border-jaggery/8 overflow-hidden"
        >
          <Daisy aria-hidden className="absolute top-16 right-[7%] w-16 h-16 text-honey/25 -rotate-12 hidden md:block" />
          <div className="max-w-3xl mx-auto">
            <span className="label-caps text-caramel-deep mb-5 block">Good to know</span>
            <h2 className="font-serif text-h2 text-jaggery tracking-display mb-10 text-balance">
              Questions, <span className="italic font-light">answered.</span>
            </h2>
            <dl className="space-y-3.5">
              {faqs.map((f) => (
                <div key={f.q} className="rounded-2xl bg-cream border border-jaggery/8 px-6 sm:px-7 py-6">
                  <dt className="font-serif text-h4 text-jaggery mb-2.5 text-balance">{f.q}</dt>
                  <dd className="text-jaggery/75 text-body max-w-2xl">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Pairs Well With */}
        {related.length > 0 && (
          <section
            aria-label="Pairs well with"
            className="py-24 sm:py-32 px-6 sm:px-10 lg:px-16 bg-cream border-t border-jaggery/8"
          >
            <div className="max-w-[1440px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-14 sm:mb-20 items-end">
                <div className="md:col-span-8">
                  <span className="label-caps text-caramel-deep mb-4 block">Pairs Well With</span>
                  <h2 className="font-serif text-h2 text-jaggery tracking-display">
                    Other expressions <span className="italic font-light">from the same harvest.</span>
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-10">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/products/${r.slug}`}
                    className="group flex flex-col h-full"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-ivory ring-1 ring-jaggery/8 mb-5">
                      <Image
                        src={r.image}
                        alt={`${r.name}, ${r.weight}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-[1.4s] ease-out"
                      />
                    </div>
                    <div className="flex flex-col grow">
                      <div className="flex items-baseline justify-between gap-3 mb-2">
                        <h3 className="font-serif text-h4 text-jaggery group-hover:text-caramel-deep transition-colors">
                          {r.name}
                        </h3>
                        <span className="font-serif text-base text-jaggery whitespace-nowrap nums-price">
                          {r.price}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="label-caps text-jaggery/70 nums-price">{r.weight}</span>
                        <span className="label-caps text-jaggery/70">{r.category}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Stories from Sankhuwasabha — grove CTA band */}
        <section
          aria-label="Stories from Sankhuwasabha"
          className="relative bg-grove text-cream px-6 sm:px-10 lg:px-16 pt-24 sm:pt-32 pb-20 sm:pb-24 overflow-hidden"
        >
          <AnimatedWave aria-hidden flip className="absolute top-0 left-0 w-full h-[48px] sm:h-[68px] text-cream" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="label-caps text-honey-ink mb-5 block">
              {BLOG_ENABLED ? "From the Journal" : "From Sankhuwasabha"}
            </span>
            <h2 className="font-serif text-h2 text-cream tracking-display mb-7 text-balance">
              The hands behind <span className="italic font-light">{product.name}</span>.
            </h2>
            <p className="text-cream/80 text-lede mb-9 max-w-xl mx-auto">
              Read the recipe, the harvest notes, and the families in Sankhuwasabha
              who grow the cane every batch is poured from.
            </p>

            {/* This was one button pointing at /blog — the weakest link on the
                page, spent at the moment the reader is most interested, and
                landing them on an index they then have to search. These name
                the three articles that actually answer what someone reading
                *this* product is likely to be wondering. `reading` is checked
                against the journal, so it empties out rather than 404s. */}
            {reading.length > 0 ? (
              <ul className="text-left max-w-xl mx-auto divide-y divide-cream/15 border-y border-cream/15">
                {reading.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-start gap-4 py-5 hover:text-honey transition-colors"
                    >
                      <span className="flex-1">
                        <span className="block font-medium text-cream group-hover:text-honey transition-colors text-balance">
                          {item.anchor}
                        </span>
                        <span className="block text-cream/75 text-[14px] leading-relaxed mt-1">
                          {item.note}
                        </span>
                      </span>
                      <ArrowRight
                        className="w-4 h-4 mt-1 shrink-0 text-cream/50 group-hover:text-honey group-hover:translate-x-1 transition-all"
                        strokeWidth={2}
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              /* With the journal empty this band would send every product page
                 into a 404, so it points at Our Story — which tells the same
                 farmers-and-craft story the copy above promises. */
              <Link
                href={BLOG_ENABLED ? "/blog" : "/our-story"}
                className="group inline-flex items-center gap-3 rounded-full bg-cream text-jaggery label-caps px-9 py-4 hover:bg-honey transition-colors"
              >
                Read stories from Sankhuwasabha
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              </Link>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
