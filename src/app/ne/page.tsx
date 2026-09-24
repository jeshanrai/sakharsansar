import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/layout/Footer";
import OrderDrawer from "@/components/layout/OrderDrawer";
import ArticleBody from "@/components/blog/ArticleBody";
import JsonLd from "@/components/seo/JsonLd";
import { NeHero, NeProductGrid, neMetadata } from "@/components/ne/NePage";
import content from "@/data/content.json";
import { faqEntries, parseArticle } from "@/lib/article";
import { LOCALES } from "@/lib/hreflang";
import { NE, fill, neProduct } from "@/lib/ne-content";
import { faqLd, itemListLd, webPageLd } from "@/lib/seo";

/**
 * /ne — the Nepali home page.
 *
 * Step 2 of docs/i18n-plan.md's rollout: the commercial core in Nepali, to
 * find out whether Nepali searchers convert before translating more. Written
 * for a native reviewer to read before it ships (src/data/ne/commerce.json).
 */

const PATH = "/ne";
const home = NE.home;

export const metadata: Metadata = neMetadata({
  title: home.title,
  description: home.description,
  path: PATH,
  enPath: "/",
  card: "/opengraph-image",
  cardAlt: "सङ्खुवासभाको सख्खर, सखर संसार",
});

export default function NepaliHome() {
  const blocks = parseArticle(fill(home.content));
  const faqs = faqEntries(blocks);

  return (
    <>
      <JsonLd
        data={webPageLd({
          name: home.h1,
          path: PATH,
          description: home.description,
          inLanguage: LOCALES.ne.htmlLang,
        })}
      />
      <JsonLd
        data={itemListLd(
          "सखर संसारका सामान",
          content.products.map((p) => ({
            name: neProduct(p.slug)?.name ?? p.name,
            path: `/ne/products/${p.slug}`,
          })),
        )}
      />
      {faqs.length > 0 && <JsonLd data={faqLd(faqs)} />}

      <OrderDrawer />

      <main lang="ne" className="bg-cream overflow-x-hidden">
        <NeHero eyebrow={home.eyebrow} title={home.h1} lede={home.lede}>
          <div className="mt-8">
            <Link
              href="/ne/shop"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-jaggery text-cream label-caps px-7 py-3.5 hover:bg-grove transition-colors"
            >
              सख्खर किन्नुहोस्
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} aria-hidden />
            </Link>
          </div>
        </NeHero>

        <div className="px-6 sm:px-10 lg:px-16 mt-10 sm:mt-12">
          <div className="max-w-[1000px] mx-auto">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-ivory ring-1 ring-jaggery/8 shadow-xl shadow-jaggery/10">
              <Image
                src="/products/sakhar-block-2.jpg"
                alt="हातमा समातिएको सङ्खुवासभाको कालो सख्खर ढिक्का"
                fill
                priority
                sizes="(max-width: 1000px) 100vw, 1000px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <section aria-label="सामानहरू" className="px-6 sm:px-10 lg:px-16 pt-14 sm:pt-20">
          <div className="max-w-[1000px] mx-auto">
            <NeProductGrid />
          </div>
        </section>

        <article className="px-6 sm:px-10 lg:px-16 pt-14 sm:pt-20 pb-16">
          <div className="max-w-[720px] mx-auto">
            <ArticleBody blocks={blocks} locale="ne" />
          </div>
        </article>
      </main>

      <Footer locale="ne" />
    </>
  );
}
