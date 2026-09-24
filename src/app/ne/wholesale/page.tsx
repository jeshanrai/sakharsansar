import type { Metadata } from "next";
import Image from "next/image";
import { MessageCircle, Phone, Mail } from "lucide-react";
import Footer from "@/components/layout/Footer";
import OrderDrawer from "@/components/layout/OrderDrawer";
import ArticleBody from "@/components/blog/ArticleBody";
import JsonLd from "@/components/seo/JsonLd";
import { NeHero, neMetadata } from "@/components/ne/NePage";
import wholesale from "@/data/wholesale.json";
import { faqEntries, parseArticle } from "@/lib/article";
import { LOCALES } from "@/lib/hreflang";
import { t } from "@/lib/i18n";
import { NE, fill } from "@/lib/ne-content";
import { SITE } from "@/lib/site";
import { faqLd, webPageLd } from "@/lib/seo";

/**
 * /ne/wholesale — bulk supply, in Nepali. Pairs with /wholesale.
 *
 * No quote form: the English form is a long client component with its own
 * copy, and WhatsApp is how nearly every bulk enquiry arrives anyway. The
 * section on what "chemical-free" does and does not mean keeps the English
 * page's meaning exactly (see reviewNotes in commerce.json).
 */

const PATH = "/ne/wholesale";
const page = NE.wholesale;

export const metadata: Metadata = neMetadata({
  title: page.title,
  description: page.description,
  path: PATH,
  enPath: "/wholesale",
  card: "/wholesale/opengraph-image",
  cardAlt: "थोकमा सङ्खुवासभाको सख्खर",
});

export default function NepaliWholesale() {
  const blocks = parseArticle(fill(page.content));
  const faqs = faqEntries(blocks);
  const waHref = `https://wa.me/${SITE.phoneDigits}?text=${encodeURIComponent(
    "नमस्ते सखर संसार! मलाई थोक मूल्य चाहियो।",
  )}`;

  const contact = (
    <div className="mt-8 flex flex-col gap-4">
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start inline-flex items-center justify-center gap-2.5 rounded-full bg-jaggery text-cream label-caps px-7 py-3.5 hover:bg-grove transition-colors"
      >
        <MessageCircle className="w-4 h-4" strokeWidth={1.75} aria-hidden />
        WhatsApp मा थोक मूल्य सोध्नुहोस्
      </a>
      <p className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-jaggery/70">
        <a href={`tel:+${SITE.phoneDigits}`} className="inline-flex items-center gap-2 hover:text-grove transition-colors">
          <Phone className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden />
          {SITE.phone}
        </a>
        <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 hover:text-grove transition-colors">
          <Mail className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden />
          {SITE.email}
        </a>
      </p>
    </div>
  );

  return (
    <>
      <JsonLd
        data={webPageLd({
          name: page.h1,
          path: PATH,
          description: page.description,
          inLanguage: LOCALES.ne.htmlLang,
        })}
      />
      {faqs.length > 0 && <JsonLd data={faqLd(faqs)} />}

      <OrderDrawer />

      <main lang="ne" className="bg-cream overflow-x-hidden">
        <NeHero
          trail={[{ name: t("ne").navWholesale, path: PATH }]}
          eyebrow={page.eyebrow}
          title={page.h1}
          lede={page.description}
        >
          {contact}
        </NeHero>

        <div className="px-6 sm:px-10 lg:px-16 mt-10 sm:mt-12">
          <div className="max-w-[1000px] mx-auto">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-ivory ring-1 ring-jaggery/8 shadow-xl shadow-jaggery/10">
              <Image
                src={wholesale.image}
                alt="पठाउन तयार पारिएका सङ्खुवासभाको सख्खरका ढिक्का"
                fill
                priority
                sizes="(max-width: 1000px) 100vw, 1000px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <article className="px-6 sm:px-10 lg:px-16 pt-14 sm:pt-20 pb-16">
          <div className="max-w-[720px] mx-auto">
            <ArticleBody blocks={blocks} locale="ne" />
            {contact}
          </div>
        </article>
      </main>

      <Footer locale="ne" />
    </>
  );
}
