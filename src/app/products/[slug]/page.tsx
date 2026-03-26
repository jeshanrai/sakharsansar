import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrderDrawer from "@/components/layout/OrderDrawer";
import ProductActions from "./ProductActions";
import data from "@/data/content.json";
import { ArrowLeft, Leaf, ShieldCheck, Truck } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return data.products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = data.products.find((p) => p.slug === slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | SakharSansar`,
    description: product.longDescription.slice(0, 160),
    alternates: {
      canonical: `https://sakharsansar.com/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} — ${product.price}`,
      description: product.description,
      url: `https://sakharsansar.com/products/${product.slug}`,
      siteName: "SakharSansar",
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
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

  if (!product) {
    notFound();
  }

  const relatedProducts = data.products.filter((p) => p.slug !== slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.longDescription,
    "image": `https://sakharsansar.com${product.image}`,
    "brand": {
      "@type": "Brand",
      "name": "SakharSansar"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price.replace(/[^0-9]/g, ''),
      "priceCurrency": "NPR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "SakharSansar"
      }
    },
    "weight": {
      "@type": "QuantitativeValue",
      "value": product.weight.replace(/[^0-9.]/g, ''),
      "unitText": product.weight.replace(/[0-9.]/g, '')
    },
    "category": product.category,
    "countryOfOrigin": {
      "@type": "Country",
      "name": "Nepal"
    }
  };

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

      <main className="overflow-x-hidden">
        {/* Breadcrumb */}
        <div className="pt-28 sm:pt-32 px-6">
          <div className="max-w-[1440px] mx-auto">
            <Link
              href="/#products"
              className="inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-black/50 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              Back to Collection
            </Link>
          </div>
        </div>

        {/* Product Detail */}
        <section aria-label="Product Detail" className="py-12 sm:py-20 px-6">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Product Image */}
            <div className="relative aspect-square w-full overflow-hidden bg-[#F4F1ED] sticky top-28">
              <Image
                src={product.image}
                alt={`${product.name} — ${product.weight} of pure natural jaggery from Sankhuwasabha`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col py-4">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-black/40 uppercase mb-4">
                {product.category}
              </span>

              <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl font-medium uppercase tracking-[0.1em] text-black leading-tight mb-6">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-8">
                <span className="font-poppins text-2xl font-medium tracking-widest text-black">
                  {product.price}
                </span>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-black/50 border border-black/10 px-3 py-1 uppercase">
                  {product.weight}
                </span>
              </div>

              <div className="w-full h-px bg-black/10 mb-8" />

              <p className="text-black/70 text-sm sm:text-base font-light leading-[2] mb-10">
                {product.longDescription}
              </p>

              {/* Order Button */}
              <ProductActions productName={product.name} />

              <div className="w-full h-px bg-black/10 my-10" />

              {/* Product Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-black/40 uppercase">Ingredients</span>
                  <span className="text-sm text-black/70 font-light">{product.ingredients}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-black/40 uppercase">Shelf Life</span>
                  <span className="text-sm text-black/70 font-light">{product.shelfLife}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-black/40 uppercase">Origin</span>
                  <span className="text-sm text-black/70 font-light">{product.origin}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-black/40 uppercase">Net Weight</span>
                  <span className="text-sm text-black/70 font-light">{product.weight}</span>
                </div>
              </div>

              <div className="w-full h-px bg-black/10 my-10" />

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-3">
                  <Leaf className="w-5 h-5 text-black/40" strokeWidth={1.5} />
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-black/60">100% Natural</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-black/40" strokeWidth={1.5} />
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-black/60">Chemical Free</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-black/40" strokeWidth={1.5} />
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-black/60">Pan-Nepal Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section aria-label="Related Products" className="py-24 sm:py-32 px-6 bg-[#F4F1ED] border-t border-black/10">
            <div className="max-w-[1440px] mx-auto">
              <div className="mb-16 sm:mb-20 flex flex-col items-center text-center">
                <h2 className="font-poppins text-3xl sm:text-4xl font-medium uppercase tracking-[0.1em] text-black mb-4">
                  You May Also Like
                </h2>
                <div className="w-12 h-px bg-black/30" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
                {relatedProducts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/products/${related.slug}`}
                    className="group flex flex-col h-full"
                  >
                    <article className="flex flex-col h-full">
                      <div className="relative aspect-[3/4] w-full overflow-hidden mb-6 bg-white">
                        <Image
                          src={related.image}
                          alt={`${related.name} — ${related.weight}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-[1s]"
                        />
                      </div>
                      <div className="flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-poppins text-lg font-medium uppercase tracking-[0.1em] text-black group-hover:text-black/60 transition-colors">
                            {related.name}
                          </h3>
                          <span className="text-[10px] font-semibold tracking-[0.2em] text-black/50 border border-black/10 px-2 py-1">
                            {related.weight}
                          </span>
                        </div>
                        <p className="text-black/60 text-xs tracking-wide font-light flex-grow leading-relaxed mb-6">
                          {related.description}
                        </p>
                        <div className="flex items-center justify-between border-t border-black/10 pt-5">
                          <span className="font-poppins text-sm font-medium tracking-widest uppercase text-black">
                            {related.price}
                          </span>
                          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-black group-hover:text-black/60 transition-colors">
                            View Details
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
