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
import data from "@/data/content.json";
import { ArrowLeft, ArrowRight, Leaf, ShieldCheck, Truck } from "lucide-react";

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

  // FAQ — answered from real product data so the schema matches what renders.
  const faqs = [
    {
      q: `Is ${product.name} chemical-free?`,
      a: `Yes. ${product.name} is made only from slow-cooked sugarcane juice — no bleach, no sulphur, no anti-caking agents and no artificial colour. Ingredients: ${product.ingredients}.`,
    },
    {
      q: `Where is ${product.name} made?`,
      a: `It is wood-fired by our farming cooperative in ${product.origin}, using methods unchanged for seven generations.`,
    },
    {
      q: "How should I store it and how long does it keep?",
      a: `${product.shelfLife}. Keep it away from direct sunlight and humidity — a little natural crystallisation over time is a sign of purity, not spoilage.`,
    },
    {
      q: "How is jaggery different from refined white sugar?",
      a: "Unlike refined sugar, our unrefined jaggery retains the iron, magnesium and potassium naturally present in sugarcane, and carries a deep caramel flavour refined sugar can't match.",
    },
    {
      q: "Do you deliver across Nepal?",
      a: "Yes — we ship pan-Nepal, packed in compostable kraft paper, direct from our Sankhuwasabha cooperative.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <OrderDrawer />

      <main className="overflow-x-hidden bg-cream">
        {/* Breadcrumb */}
        <div className="pt-28 sm:pt-36 px-6 sm:px-10 lg:px-16">
          <div className="max-w-[1440px] mx-auto">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2.5 rounded-full bg-ivory border border-jaggery/10 px-4 py-2 label-caps text-jaggery/65 hover:text-jaggery hover:border-jaggery/25 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
              Back to Collection
            </Link>
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
                  alt={`${product.name} — ${product.weight} of pure Himalayan jaggery`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                {/* Harvest badge */}
                <div className="absolute top-5 left-5 sm:top-6 sm:left-6 rounded-2xl bg-cream/95 backdrop-blur-sm px-4 py-3 shadow-lg shadow-jaggery/10">
                  <span className="label-caps text-jaggery/55 block mb-0.5">Harvested</span>
                  <span className="font-serif text-meta text-jaggery nums-price">November 2025</span>
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
                <span className="label-caps text-jaggery/55 rounded-full border border-jaggery/20 px-3.5 py-1.5 nums-price">
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
            <span className="label-caps text-caramel mb-5 block">Good to know</span>
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
                  <span className="label-caps text-caramel mb-4 block">Pairs Well With</span>
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
                        alt={`${r.name} — ${r.weight}`}
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

        {/* Stories from Sankhuwasabha — grove CTA band */}
        <section
          aria-label="Stories from Sankhuwasabha"
          className="relative bg-grove text-cream px-6 sm:px-10 lg:px-16 pt-24 sm:pt-32 pb-20 sm:pb-24 overflow-hidden"
        >
          <AnimatedWave aria-hidden flip className="absolute top-0 left-0 w-full h-[48px] sm:h-[68px] text-cream" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="label-caps text-honey mb-5 block">From the Journal</span>
            <h2 className="font-serif text-h2 text-cream tracking-display mb-7 text-balance">
              The hands behind <span className="italic font-light">{product.name}</span>.
            </h2>
            <p className="text-cream/80 text-lede mb-9 max-w-xl mx-auto">
              Read the recipe, the harvest notes, and the people who pour every batch
              by hand in our Sankhuwasabha cooperative.
            </p>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-3 rounded-full bg-cream text-jaggery label-caps px-9 py-4 hover:bg-honey transition-colors"
            >
              Read stories from Sankhuwasabha
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
