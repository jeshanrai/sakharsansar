import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Leaf, ShieldCheck, Truck } from "lucide-react";
import Footer from "@/components/layout/Footer";
import ArticleBody from "@/components/blog/ArticleBody";
import ProductActions from "@/components/product/ProductActions";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { neMetadata } from "@/components/ne/NePage";
import content from "@/data/content.json";
import { faqEntries, parseArticle } from "@/lib/article";
import { LOCALES } from "@/lib/hreflang";
import { formatPrice, t } from "@/lib/i18n";
import { NE_PRODUCT_SLUGS } from "@/lib/locale-paths";
import { fill, neProduct } from "@/lib/ne-content";
import { faqLd, parsePrice, productLd } from "@/lib/seo";

/**
 * /ne/products/[slug] — the three products in Nepali. Pairs with
 * /products/[slug]. The order drawer still submits the English product name,
 * which is what the backend and the Google Form key on; only the labels are
 * Nepali.
 */

interface Props {
  params: Promise<{ slug: string }>;
}

function load(slug: string) {
  const product = content.products.find((p) => p.slug === slug);
  const ne = neProduct(slug);
  return product && ne ? { product, ne } : undefined;
}

export function generateStaticParams() {
  // Every slug here must exist in both content.json and the Nepali copy;
  // a mismatch fails the build rather than shipping a 404 the nav links to.
  for (const slug of NE_PRODUCT_SLUGS) {
    if (!load(slug)) throw new Error(`/ne/products: no content for "${slug}"`);
  }
  return NE_PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hit = load(slug);
  if (!hit) return { title: "सामान भेटिएन", robots: { index: false } };
  return neMetadata({
    title: hit.ne.title,
    description: hit.ne.description,
    path: `/ne/products/${slug}`,
    enPath: `/products/${slug}`,
    card: `/products/${slug}/opengraph-image`,
    cardAlt: `${hit.ne.name}, ${hit.ne.weight}`,
  });
}

export default async function NepaliProductPage({ params }: Props) {
  const { slug } = await params;
  const hit = load(slug);
  if (!hit) notFound();
  const { product, ne } = hit;
  const m = t("ne");
  const path = `/ne/products/${slug}`;

  const blocks = parseArticle(fill(ne.content));
  const faqs = faqEntries(blocks);
  const price = formatPrice(Number(parsePrice(product.price)), "ne");

  return (
    <>
      <JsonLd
        data={productLd(
          { ...product, name: ne.name, description: ne.short, longDescription: ne.short },
          { path, inLanguage: LOCALES.ne.htmlLang },
        )}
      />
      {faqs.length > 0 && <JsonLd data={faqLd(faqs)} />}


      <main lang="ne" className="overflow-x-hidden bg-cream">
        <div className="pt-28 sm:pt-36 px-6 sm:px-10 lg:px-16">
          <div className="max-w-[1440px] mx-auto">
            <Breadcrumbs
              trail={[
                { name: m.navShop, path: "/ne/shop" },
                { name: ne.name, path },
              ]}
              className=""
              locale="ne"
            />
          </div>
        </div>

        <section aria-label={ne.name} className="py-10 sm:py-16 px-6 sm:px-10 lg:px-16">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-7 lg:sticky lg:top-28">
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-ivory ring-1 ring-jaggery/8 shadow-xl shadow-jaggery/10">
                <Image
                  src={product.image}
                  alt={`${ne.name}, ${ne.weight}`}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col">
              <h1 className="font-serif text-h1 text-jaggery tracking-display mb-5 text-balance">{ne.name}</h1>

              <p className="font-serif italic text-jaggery/75 text-lede mb-9 max-w-md">{ne.short}</p>

              <div className="flex items-baseline gap-4 mb-9">
                <span className="font-serif text-h3 text-jaggery nums-price">{price}</span>
                <span className="label-caps text-jaggery/70 rounded-full border border-jaggery/20 px-3.5 py-1.5 nums-price">
                  {ne.weight}
                </span>
              </div>

              <ProductActions productName={product.name} slug={product.slug} locale="ne" />

              <div className="flex flex-wrap gap-2.5 mt-7">
                {[
                  { Icon: Leaf, label: "१००% प्राकृतिक" },
                  { Icon: ShieldCheck, label: "रसायनमुक्त" },
                  { Icon: Truck, label: "नेपालभरि डेलिभरी" },
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
            </div>
          </div>
        </section>

        <article className="px-6 sm:px-10 lg:px-16 pb-16">
          <div className="max-w-[720px] mx-auto">
            <ArticleBody blocks={blocks} locale="ne" />
          </div>
        </article>
      </main>

      <Footer locale="ne" />
    </>
  );
}
