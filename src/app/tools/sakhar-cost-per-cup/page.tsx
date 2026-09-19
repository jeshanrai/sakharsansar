import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import OrderDrawer from "@/components/layout/OrderDrawer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import CostPerCupCalculator from "@/components/tools/CostPerCupCalculator";
import {
  catalogueReferences,
  costPerCup,
  GRAMS_PER_CUP_DEFAULT,
  WHO_DAILY_FREE_SUGAR_G,
} from "@/lib/cost-per-cup";
import { webPageLd } from "@/lib/seo";
import { formatRs } from "@/lib/site";
import { alternates, openGraph, twitter, DEFAULT_OG_IMAGE } from "@/lib/metadata";

/**
 * Cost per cup.
 *
 * Price per kilo is the wrong unit for a sweetener and the price article says
 * so, then does the division once, for our block, at one strength. This does
 * it for any price and any strength, which is the part a table cannot do.
 *
 * The third figure is the one that makes it worth linking to rather than
 * bookmarking: how many cups reach the WHO's suggested daily limit on free
 * sugars. A calculator that only ever tells you a sweetener is cheap is an
 * advert. This one tells you what it costs and what it adds up to.
 *
 * The worked example is rendered server-side with real numbers, so the page
 * answers the question before any JavaScript runs.
 */

const PATH = "/tools/sakhar-cost-per-cup";

export const metadata: Metadata = {
  title: { absolute: "Sakhar Cost Per Cup: What Jaggery Really Costs" },
  description:
    "Price per kilo is the wrong unit for a sweetener. Enter what you pay and how much you use, and see the cost per cup of chiya and cups per kilo.",
  alternates: alternates({ canonical: PATH }),
  openGraph: openGraph({
    title: "Sakhar Cost Per Cup: What Jaggery Really Costs",
    description:
      "Enter a price per kilo and how much sakhar you use, and see what a cup of chiya actually costs.",
    url: PATH,
    images: [DEFAULT_OG_IMAGE],
  }),
  twitter: twitter({
    title: "Sakhar Cost Per Cup: What Jaggery Really Costs",
    description:
      "Enter a price per kilo and how much sakhar you use, and see what a cup of chiya actually costs.",
    images: [DEFAULT_OG_IMAGE],
  }),
};

export default function CostPerCupPage() {
  const references = catalogueReferences();
  const block = references[0];
  const worked = costPerCup(block.pricePerKg, GRAMS_PER_CUP_DEFAULT);

  return (
    <>
      <JsonLd
        data={webPageLd({
          name: "Sakhar Cost Per Cup Calculator",
          path: PATH,
          description:
            "Works out what a cup of chiya costs from a price per kilo and how much sakhar goes in, and how many cups reach the WHO daily free-sugar figure.",
        })}
      />

      <OrderDrawer />

      <main className="overflow-x-hidden">
        <section className="bg-peach px-6 sm:px-10 lg:px-16 pt-28 sm:pt-36 pb-14 sm:pb-16">
          <div className="max-w-[820px] mx-auto">
            <Breadcrumbs trail={[{ name: "Cost Per Cup", path: PATH }]} />
            <h1 className="font-marker uppercase text-jaggery leading-[0.95] tracking-tight text-[clamp(2.25rem,6vw,4rem)] text-balance">
              What a cup actually costs
            </h1>
            <p className="mt-5 text-jaggery/75 text-lede max-w-2xl">
              Price per kilo is the wrong unit for a sweetener. Nobody drinks a
              kilo. Put in what you pay and how much you use, and this gives you
              the number the decision is actually made on.
            </p>
          </div>
        </section>

        <section
          aria-label="Cost per cup calculator"
          className="px-6 sm:px-10 lg:px-16 py-14 sm:py-16 bg-cream"
        >
          <div className="max-w-[820px] mx-auto">
            {/* Rendered on the server with real figures, so the page answers
                its own question before any JavaScript runs. */}
            <h2 className="font-serif text-h3 text-jaggery">
              The short version
            </h2>
            <p className="mt-3 text-jaggery/75 text-body">
              Our {block.soldAs} {block.name.toLowerCase()} works out at{" "}
              {formatRs(block.pricePerKg)} a kilo. At{" "}
              {GRAMS_PER_CUP_DEFAULT} grams a cup, which is one level teaspoon
              of grated sakhar, that is about{" "}
              <strong>Rs. {worked.perCup.toFixed(2)} a cup</strong> and roughly{" "}
              {Math.round(worked.cupsPerKg)} cups from the block. Change either
              number below and it recalculates.
            </p>

            <CostPerCupCalculator references={references} />

            <div className="mt-14 border-t border-jaggery/12 pt-9">
              <h2 className="font-serif text-h3 text-jaggery">
                Where these numbers come from
              </h2>
              <p className="mt-3 text-jaggery/75 text-body">
                The gram weights are the ones we publish in{" "}
                <Link
                  href="/blog/jaggery-tea-without-curdling"
                  className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors"
                >
                  our own sakhar chiya method
                </Link>
                : a level teaspoon of grated sakhar is about 4 to 5 grams, and a
                cup takes one to one and a half. The prices are the ones on our{" "}
                <Link
                  href="/shop"
                  className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors"
                >
                  shop
                </Link>
                . The rest is division, and{" "}
                <Link
                  href="/sakhar-price"
                  className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors"
                >
                  the full working is in the price article
                </Link>
                . Nothing has been rounded in our favour.
              </p>
              <p className="mt-4 text-jaggery/75 text-body">
                The third figure is the World Health Organization&rsquo;s
                suggestion that adults keep free sugars{" "}
                <a
                  href="https://www.who.int/news/item/04-03-2015-who-calls-on-countries-to-reduce-sugars-intake-among-adults-and-children"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors"
                >
                  below about {WHO_DAILY_FREE_SUGAR_G} grams a day
                </a>
                . Sakhar is unrefined, and it is still sugar, so it counts
                towards that in full. We have set out what the difference
                actually is in{" "}
                <Link
                  href="/blog/jaggery-vs-sugar"
                  className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors"
                >
                  sakhar and sugar, honestly
                </Link>
                , and if diabetes is in the room please read{" "}
                <Link
                  href="/blog/is-jaggery-safe-for-diabetics"
                  className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors"
                >
                  whether sakhar is safe for diabetics
                </Link>{" "}
                and ask a doctor rather than a jaggery seller.
              </p>
            </div>

            <div className="mt-12 rounded-2xl bg-peach px-6 sm:px-8 py-7">
              <h2 className="font-serif text-h4 text-jaggery">
                The sentence our accountant dislikes
              </h2>
              <p className="mt-3 text-jaggery/75 text-body">
                The cheapest thing you can do here is not to switch jaggery. It
                is to use less of whatever you already have. Drop from seven
                grams a cup to four and you have cut the cost by a third without
                buying anything, ours included. That will save you more than any
                price on this page.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
