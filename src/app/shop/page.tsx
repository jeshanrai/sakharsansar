import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import ShopContent from "@/components/shop/ShopContent";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import data from "@/data/content.json";
import { WEBSITE_ID, faqLd, itemListLd, productNodeId } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { alternates, openGraph, twitter } from "@/lib/metadata";

const Footer = dynamic(() => import("@/components/layout/Footer"));
const OrderDrawer = dynamic(() => import("@/components/layout/OrderDrawer"));

export const metadata: Metadata = {
  // No brand suffix here — the root layout's `title.template` appends
  // "| SakharSansar" to every child segment's title.
  title: "Shop Pure Sakhar: Organic Himalayan Jaggery",
  description:
    "Shop wood-fired organic sakhar from Sankhuwasabha: blocks, powder and sakhar-coated dry fruits. Chemical-free, direct from farmers, shipped pan-Nepal.",
  alternates: alternates({
    canonical: "/shop",
  }),
  openGraph: openGraph({
    title: "Shop Pure Sakhar: Organic Himalayan Jaggery",
    description:
      "100% organic sakhar from Sankhuwasabha: blocks, powder and dry fruits, direct from farmers, shipped pan-Nepal.",
    url: "/shop",
    type: "website",
  }),
  twitter: twitter({
    title: "Shop Pure Sakhar: Organic Himalayan Jaggery",
    description:
      "100% organic sakhar from Sankhuwasabha. Wood-fired, chemical-free, premium quality.",
  }),
};

/**
 * The questions the shop is actually asked, and the FAQPage schema behind it.
 *
 * /shop carried about 30 words of unique copy — a heading and one sentence —
 * over a grid of three products whose text lives on their own pages. That is
 * thin for the highest commercial-intent page on the site, and it left the
 * queries people search before buying ("what is the price of sakhar in Nepal",
 * "block or powder") answered nowhere on it.
 *
 * The schema below is generated from this array, so it can only ever describe
 * questions the page renders.
 */
const FAQS = [
  {
    q: "What is the price of sakhar in Nepal?",
    a: "Ours is Rs. 400 for a 1kg block and Rs. 149 for a 250g pouch of powder, which works out at about Rs. 596 per kilo. Hill sakhar generally costs more than Terai gur because terraces yield less, batches are small and nothing is clarified chemically to shorten the boil. Per cup of chiya it comes to roughly two to three rupees.",
  },
  {
    q: "Which is better, the block or the powder?",
    a: "They are the same sakhar; the powder is the block crushed and sieved. Buy the block if you cook with it or get through a kilo — it is a third cheaper by weight and you can grate it yourself. Buy the powder if you mostly sweeten chiya, since it measures like sugar and dissolves cold without leaving grit in the cup.",
  },
  {
    q: "Do you deliver outside Kathmandu?",
    a: "Yes, we ship pan-Nepal. Charges depend on your location and the weight of the order, and delivery is free above the threshold set on our shipping page. Hill and remote deliveries take longer, particularly during monsoon.",
  },
  {
    q: "How long does sakhar keep?",
    a: "Kept dry and sealed, a block holds for months and the flavour deepens rather than fades. The enemy is humidity, not time: loose sakhar pulls moisture out of the air within hours and cakes, which is why the powder comes in a resealable pouch. Store both away from steam and direct sun.",
  },
  {
    q: "Is your sakhar certified organic?",
    a: "We grow without chemical fertiliser or pesticide and make without additives — no sulphur, no clarifier, no bleaching agent, no added colour — which is what we mean by chemical-free. That is a description of the method rather than a certification. If your own labelling or compliance needs certified documentation, ask us before ordering and we will tell you precisely what we can provide.",
  },
];

export default function ShopPage() {
  // CollectionPage + ItemList is what marks this as a category page and names
  // the product pages under it — without restating each product's Offer, which
  // belongs on the product page itself.
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/shop#webpage"),
    url: absoluteUrl("/shop"),
    name: "Shop Pure Sakhar: Organic Himalayan Jaggery",
    description:
      "The full SakharSansar range — sakhar blocks, sakhar powder and sakhar-coated dry fruits, wood-fired in Sankhuwasabha.",
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: SITE.lang,
  };

  const listJsonLd = itemListLd(
    "SakharSansar product range",
    data.products.map((p) => ({
      name: p.name,
      path: `/products/${p.slug}`,
      id: productNodeId(p.slug),
    })),
  );

  return (
    <>
      {/* The product cards' backdrop is a CSS background, which the browser
          cannot discover until it has parsed the stylesheet — and on this page
          a card is the LCP element. Preloading makes it visible in the first
          byte. The raw path is correct here: CSS backgrounds do not pass
          through next/image, so this is the URL that is actually fetched. */}
      <link rel="preload" as="image" href="/cane-texture.jpg" fetchPriority="high" />
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={listJsonLd} />
      <JsonLd data={faqLd(FAQS)} />

      <OrderDrawer />
      {/* The navbar is fixed and 108px tall, so pt-10 left the eyebrow and
          the top of the H1 behind it. */}
      <main className="overflow-x-hidden pt-32 sm:pt-36">
        {/* The shop had no <h1> at all — its first element was the sticky
            filter bar — so the site's main commercial page offered search
            engines no heading and screen readers no entry point. Rendered on
            the server, so the copy is in the first byte of HTML for the
            crawlers that never run JS. */}
        <header className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pb-7 sm:pb-9">
          <Breadcrumbs trail={[{ name: "Shop", path: "/shop" }]} />
          <p className="text-[11px] font-bold tracking-caps uppercase text-jaggery/70 mb-3">
            The Full Range
          </p>
          <h1 className="font-marker uppercase text-jaggery leading-[0.9] tracking-tight text-[clamp(2rem,5vw,3.25rem)]">
            Shop Pure Sakhar
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] sm:text-base text-jaggery/70 leading-relaxed">
            Three forms of 100% organic Himalayan jaggery — blocks, powder
            and sakhar-coated dry fruits — wood-fired without chemicals in
            Sankhuwasabha from cane grown by forty-two farming families, and
            shipped across Nepal.
          </p>
        </header>
        <ShopContent />

        {/* ─── What sakhar is, and which form to buy ──────────────── */}
        <section
          aria-labelledby="about-sakhar"
          className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-16 sm:pt-24"
        >
          <div className="max-w-[720px]">
            <h2
              id="about-sakhar"
              className="font-marker uppercase text-jaggery leading-[0.95] text-[clamp(1.6rem,3.4vw,2.4rem)]"
            >
              What you are buying
            </h2>
            <div className="mt-5 space-y-4 text-[15px] sm:text-base text-jaggery/70 leading-relaxed">
              <p>
                Sakhar (सख्खर) is unrefined cane sugar — jaggery, gur, the same
                thing under different names. Cane is pressed on the terraces in{" "}
                {SITE.origin.locality}, the juice is reduced over an open wood
                fire in an iron kadhai, skimmed by hand as it thickens, and
                poured into moulds to set. Nothing is spun out in a centrifuge
                and nothing is added on the way: no sulphur, no chemical
                clarifier, no bleaching agent, no colour.
              </p>
              <p>
                That is the whole difference, and it shows up in the block. Ours
                are dark, dense and slightly uneven, and the colour shifts
                between batches with the cane and the fire. A bright, glossy,
                uniformly golden block has usually been helped along — which is
                worth knowing before you judge any price, including ours.
              </p>
              <p>
                We sell it in three forms. The{" "}
                <Link href="/shop/blocks" className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors">
                  block
                </Link>{" "}
                is the original and the cheapest by weight — buy it if you cook
                with sakhar, get through a kilo, or are making chaku. The{" "}
                <Link href="/shop/powder" className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors">
                  powder
                </Link>{" "}
                is the same batch crushed and sieved, for anyone who mostly wants
                to spoon it into chiya without chipping at a block first. The{" "}
                <Link href="/shop/dry-fruits" className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors">
                  sakhar-coated dry fruits
                </Link>{" "}
                are a snack rather than an ingredient.
              </p>
              <p>
                Everything ships pan-Nepal, packed in kraft paper, direct from
                the farm. Prices are on the cards above and they are the prices
                we charge — not a range, and not before delivery is added at
                checkout.
              </p>
              {/* The shop had no route onward to either of these. A visitor
                  buying for a business was left to work out on their own that
                  wholesale exists, and a visitor wondering whether any of this
                  is a fair price had nothing here to answer it — while the
                  article that does answer it sat unlinked from the page where
                  the question actually gets asked. */}
              <p>
                If you are buying for a shop, a hotel, or to make chaku for
                Maghe Sankranti, these are the wrong numbers to plan from —{" "}
                <Link href="/wholesale" className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors">
                  buying in bulk works differently
                </Link>
                , and it needs more notice than a retail order does.
              </p>
              <p>
                And if you want to judge our price against the market before
                you commit, we wrote up{" "}
                <Link href="/blog/sakhar-price-in-nepal" className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors">
                  what sakhar actually costs per kilo in Nepal
                </Link>{" "}
                — including where cheaper Terai gur is the sensible buy, and
                what a block priced well below the rest usually means.
              </p>
            </div>
          </div>
        </section>

        {/* ─── FAQ ────────────────────────────────────────────────── */}
        <section
          aria-labelledby="shop-faq"
          className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-14 sm:pt-20 pb-20 sm:pb-28"
        >
          <div className="max-w-[720px]">
            <h2
              id="shop-faq"
              className="font-marker uppercase text-jaggery leading-[0.95] text-[clamp(1.6rem,3.4vw,2.4rem)] mb-7"
            >
              Common questions
            </h2>
            <dl className="divide-y divide-jaggery/10 border-y border-jaggery/10">
              {FAQS.map((faq) => (
                <div key={faq.q} className="py-6">
                  <dt className="font-display font-bold text-jaggery text-[17px] sm:text-[18px] leading-snug text-balance">
                    {faq.q}
                  </dt>
                  <dd className="mt-2.5 text-[15px] sm:text-base text-jaggery/70 leading-relaxed">
                    {faq.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
