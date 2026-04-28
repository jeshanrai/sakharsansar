import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrderDrawer from "@/components/layout/OrderDrawer";
import ProductActions from "@/components/product/ProductActions";
import ProductDetailSections from "@/components/product/ProductDetailSections";
import data from "@/data/content.json";
import { ArrowLeft, Leaf, ShieldCheck, Truck } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return data.products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = data.products.find((p) => p.slug === slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | SakharSansar`,
    description: product.longDescription.slice(0, 160),
    alternates: { canonical: `https://sakharsansar.com/products/${product.slug}` },
    openGraph: {
      title: `${product.name} — ${product.price}`,
      description: product.description,
      url: `https://sakharsansar.com/products/${product.slug}`,
      siteName: "SakharSansar",
      images: [{ url: product.image, width: 800, height: 800, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = data.products.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = data.products.filter((p) => p.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.longDescription,
    "image": `https://sakharsansar.com${product.image}`,
    "brand": { "@type": "Brand", "name": "SakharSansar" },
    "offers": {
      "@type": "Offer",
      "price": product.price.replace(/[^0-9]/g, ''),
      "priceCurrency": "NPR",
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "SakharSansar" }
    },
    "weight": {
      "@type": "QuantitativeValue",
      "value": product.weight.replace(/[^0-9.]/g, ''),
      "unitText": product.weight.replace(/[0-9.]/g, '')
    },
    "category": product.category,
    "countryOfOrigin": { "@type": "Country", "name": "Nepal" }
  };

  // Expandable detail sections
  const sections = [
    {
      title: "Tasting Notes",
      body: (
        <p>
          A long, slow-burn caramel that opens with toasted molasses and finishes with a
          gentle smoke from the wood-fire — never sharp, never one-note. Mineral-rich,
          with the faintest earth-and-jaggery scent of Sankhuwasabha&rsquo;s autumn cane.
        </p>
      ),
    },
    {
      title: "How to Use",
      body: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Stir into morning chiya in place of refined sugar.</li>
          <li>Fold into sel roti, kheer, or halwa for traditional depth.</li>
          <li>Drizzle over yogurt, oats, or warm milk before bed.</li>
          <li>Eat a small piece after meals — Ayurveda&rsquo;s digestive ritual.</li>
        </ul>
      ),
    },
    {
      title: "Sourcing & Process",
      body: (
        <p>
          Sourced from {product.origin}. Cane is harvested at first light, pressed
          within hours, and reduced over open wood-fire in iron kadhais — the same
          method used in our village for seven generations. Hand-poured into wooden
          moulds, rested overnight, then sealed in compostable kraft paper.
          <br /><br />
          <strong className="font-serif italic text-jaggery not-italic">Ingredients:</strong>{" "}
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
        </p>
      ),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header>
        <Navbar />
      </header>
      <OrderDrawer />

      <main className="overflow-x-hidden bg-cream">
        {/* Breadcrumb */}
        <div className="pt-28 sm:pt-36 px-6 sm:px-10 lg:px-16">
          <div className="max-w-[1440px] mx-auto">
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 label-caps text-jaggery/60 hover:text-jaggery transition-colors"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              Back to Collection
            </Link>
          </div>
        </div>

        {/* Product Detail */}
        <section
          aria-label="Product Detail"
          className="py-12 sm:py-20 px-6 sm:px-10 lg:px-16"
        >
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            {/* Image — 60% on desktop, sticky */}
            <div className="lg:col-span-7 lg:sticky lg:top-28">
              <div className="relative aspect-square w-full overflow-hidden bg-ivory">
                <Image
                  src={product.image}
                  alt={`${product.name} — ${product.weight} of pure Himalayan jaggery`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                {/* Harvest badge */}
                <div className="absolute top-5 left-5 sm:top-7 sm:left-7 bg-cream/95 backdrop-blur-sm px-4 py-3">
                  <span className="label-caps text-jaggery/60 block mb-0.5">Harvested</span>
                  <span className="font-serif text-meta text-jaggery nums-price">November 2025</span>
                </div>
              </div>
            </div>

            {/* Info — 40% */}
            <div className="lg:col-span-5 flex flex-col">
              <span className="label-caps text-caramel mb-5">{product.category}</span>

              <h1 className="font-serif text-h1 text-jaggery tracking-[-0.018em] mb-6 text-balance">
                {product.name}
              </h1>

              <p className="font-serif italic text-jaggery/75 text-lede mb-10 max-w-md">
                {product.description}
              </p>

              <div className="flex items-baseline gap-5 mb-10">
                <span className="font-serif text-h3 text-jaggery nums-price">
                  {product.price}
                </span>
                <span className="label-caps text-jaggery/55 border border-jaggery/20 px-3 py-1.5 nums-price">
                  {product.weight}
                </span>
              </div>

              <ProductActions productName={product.name} />

              {/* Trust strip */}
              <div className="flex flex-wrap gap-x-7 gap-y-4 mt-8 mb-12">
                <div className="flex items-center gap-2 label-caps text-jaggery/65">
                  <Leaf className="w-4 h-4 text-forest" strokeWidth={1.5} />
                  100% Natural
                </div>
                <div className="flex items-center gap-2 label-caps text-jaggery/65">
                  <ShieldCheck className="w-4 h-4 text-forest" strokeWidth={1.5} />
                  Chemical Free
                </div>
                <div className="flex items-center gap-2 label-caps text-jaggery/65">
                  <Truck className="w-4 h-4 text-forest" strokeWidth={1.5} />
                  Ships Pan-Nepal
                </div>
              </div>

              {/* Expandable sections */}
              <ProductDetailSections sections={sections} />
            </div>
          </div>
        </section>

        {/* Pairs Well With */}
        {related.length > 0 && (
          <section
            aria-label="Pairs well with"
            className="py-24 sm:py-32 px-6 sm:px-10 lg:px-16 bg-ivory border-t border-jaggery/10"
          >
            <div className="max-w-[1440px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-14 sm:mb-20 items-end">
                <div className="md:col-span-7">
                  <span className="label-caps text-caramel mb-4 block">Pairs Well With</span>
                  <h2 className="font-serif text-h2 text-jaggery tracking-[-0.018em]">
                    Other expressions <span className="italic font-light">from the same harvest.</span>
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/products/${r.slug}`}
                    className="group flex flex-col h-full"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden mb-6 bg-cream">
                      <Image
                        src={r.image}
                        alt={`${r.name} — ${r.weight}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-[1.4s] ease-out"
                      />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <div className="flex items-baseline justify-between gap-3 mb-2">
                        <h3 className="font-serif text-h4 text-jaggery group-hover:text-caramel-deep transition-colors">
                          {r.name}
                        </h3>
                        <span className="font-serif text-base text-jaggery whitespace-nowrap nums-price">
                          {r.price}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="label-caps text-jaggery/55 nums-price">{r.weight}</span>
                        <span className="label-caps text-jaggery/45">{r.category}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Stories from Sankhuwasabha */}
        <section
          aria-label="Stories from Sankhuwasabha"
          className="py-24 sm:py-32 px-6 sm:px-10 lg:px-16 bg-cream"
        >
          <div className="max-w-3xl mx-auto text-center">
            <span className="label-caps text-caramel mb-5 block">From the Journal</span>
            <h2 className="font-serif text-h2 text-jaggery tracking-[-0.018em] mb-8 text-balance">
              The hands behind <span className="italic font-light">{product.name}</span>.
            </h2>
            <p className="text-jaggery/75 text-lede mb-10">
              Read the recipe, the harvest notes, and the people who pour every batch
              by hand in our Sankhuwasabha cooperative.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 label-caps text-jaggery border-b border-jaggery/30 hover:border-jaggery pb-1.5 transition-colors"
            >
              Read stories from Sankhuwasabha →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
