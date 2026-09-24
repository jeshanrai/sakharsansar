import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import ArticleBody from "@/components/blog/ArticleBody";
import JsonLd from "@/components/seo/JsonLd";
import { NeHero, NeProductGrid, neMetadata } from "@/components/ne/NePage";
import content from "@/data/content.json";
import { faqEntries, parseArticle } from "@/lib/article";
import { LOCALES } from "@/lib/hreflang";
import { t } from "@/lib/i18n";
import { NE, fill, neProduct } from "@/lib/ne-content";
import { absoluteUrl } from "@/lib/site";
import { faqLd, itemListLd } from "@/lib/seo";

/** /ne/shop — the Nepali shop. Pairs with /shop. */

const PATH = "/ne/shop";
const shop = NE.shop;

export const metadata: Metadata = neMetadata({
  title: shop.title,
  description: shop.description,
  path: PATH,
  enPath: "/shop",
  card: "/shop/opengraph-image",
  cardAlt: "सङ्खुवासभाको सख्खर: ढिक्का, धुलो र सुकामेवा",
});

export default function NepaliShop() {
  const blocks = parseArticle(fill(shop.content));
  const faqs = faqEntries(blocks);
  const url = absoluteUrl(PATH);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${url}#webpage`,
          url,
          name: shop.h1,
          description: shop.description,
          inLanguage: LOCALES.ne.htmlLang,
        }}
      />
      <JsonLd
        data={itemListLd(
          shop.h1,
          content.products.map((p) => ({
            name: neProduct(p.slug)?.name ?? p.name,
            path: `/ne/products/${p.slug}`,
          })),
        )}
      />
      {faqs.length > 0 && <JsonLd data={faqLd(faqs)} />}


      <main lang="ne" className="bg-cream overflow-x-hidden">
        <NeHero
          trail={[{ name: t("ne").navShop, path: PATH }]}
          eyebrow={shop.eyebrow}
          title={shop.h1}
          lede={shop.lede}
        />

        <section aria-label="सामानहरू" className="px-6 sm:px-10 lg:px-16 pt-14 sm:pt-16">
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
