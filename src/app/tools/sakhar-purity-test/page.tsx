import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import OrderDrawer from "@/components/layout/OrderDrawer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import PurityTestRunner from "@/components/tools/PurityTestRunner";
import { purityTests, verdictFor, SOURCE_SLUG } from "@/lib/purity-test";
import { howToLd, webPageLd } from "@/lib/seo";
import { alternates, openGraph, twitter, DEFAULT_OG_IMAGE } from "@/lib/metadata";

/**
 * The purity test, as a tool rather than an article.
 *
 * The seven tests have been published as prose for a while and rank on their
 * own. What the prose cannot do is hold your answers while you are at the
 * counter with a wet glass, or weigh all seven together at the end — and that
 * is the whole reason somebody links to a page like this rather than to
 * another article about jaggery.
 *
 * Every test is rendered server-side, in full, before any JavaScript runs. The
 * interactive layer records answers on top. A crawler, a reader with JS off
 * and an answer engine all get the complete content; nobody gets an empty div
 * that says "loading the tool".
 *
 * The content is read out of the article at build time (lib/purity-test.ts),
 * so the tool cannot start giving advice the journal has since corrected.
 */

const PATH = "/tools/sakhar-purity-test";

export const metadata: Metadata = {
  title: { absolute: "Sakhar Purity Test: Check Your Jaggery at Home" },
  description:
    "Run the seven home tests for adulterated sakhar, record what your block did, and get a straight reading. Water, iodine, colour, hardness, smell.",
  alternates: alternates({ canonical: PATH }),
  openGraph: openGraph({
    title: "Sakhar Purity Test: Check Your Jaggery at Home",
    description:
      "Seven kitchen tests for adulterated jaggery, in a tool that keeps track of your answers.",
    url: PATH,
    images: [DEFAULT_OG_IMAGE],
  }),
  twitter: twitter({
    title: "Sakhar Purity Test: Check Your Jaggery at Home",
    description:
      "Seven kitchen tests for adulterated jaggery, in a tool that keeps track of your answers.",
    images: [DEFAULT_OG_IMAGE],
  }),
};

export default function PurityTestPage() {
  const tests = purityTests();

  // The tests are derived from the article. If that shape ever breaks, this
  // 404s rather than publishing a tool with three questions in it — and the
  // audit's reachability check turns the missing page into a build failure.
  if (tests.length < 7) notFound();

  // Every verdict the runner can need, rendered on the server so the copy is
  // in the HTML rather than assembled in the browser.
  const verdicts = Object.fromEntries(
    tests.map((_, i) => [i, verdictFor(i, tests.length)]),
  );

  return (
    <>
      <JsonLd
        data={webPageLd({
          name: "Sakhar Purity Test",
          path: PATH,
          description:
            "An interactive version of the seven home tests for adulterated sakhar: water, colour, taste, iodine, hardness, rub and smell.",
        })}
      />
      <JsonLd
        data={howToLd({
          name: "How to test sakhar for adulteration at home",
          description:
            "Seven kitchen tests that show whether a block of sakhar has had sugar, chalk, starch or colour added to it.",
          path: PATH,
          totalTime: "PT10M",
          supplies: ["Warm water", "Tincture of iodine", "A piece of sakhar (jaggery)"],
          tools: ["A clear glass", "A spoon", "Daylight"],
          steps: tests.map((t) => ({
            name: t.name,
            text: t.instruction,
            anchor: `test-${t.number}`,
          })),
        })}
      />

      <OrderDrawer />

      <main className="overflow-x-hidden">
        <section className="bg-peach px-6 sm:px-10 lg:px-16 pt-28 sm:pt-36 pb-14 sm:pb-16">
          <div className="max-w-[820px] mx-auto">
            <Breadcrumbs
              trail={[{ name: "Sakhar Purity Test", path: PATH }]}
            />
            <h1 className="font-marker uppercase text-jaggery leading-[0.95] tracking-tight text-[clamp(2.25rem,6vw,4rem)] text-balance">
              Is your sakhar real?
            </h1>
            <p className="mt-5 text-jaggery/75 text-lede max-w-2xl">
              Seven tests you can run in a kitchen, with water, iodine and your
              own hands. Record what your block does and this works out what the
              results mean together.
            </p>
            <p className="mt-4 text-jaggery/70 text-body max-w-2xl">
              We sell sakhar (सख्खर), so treat that with the scepticism it
              deserves. Run these on ours as well. The tests are the same ones
              we set out in{" "}
              <Link
                href={`/blog/${SOURCE_SLUG}`}
                className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors"
              >
                the full guide to spotting adulterated sakhar
              </Link>
              , and this page reads them straight out of it.
            </p>
          </div>
        </section>

        <section
          aria-label="The seven tests"
          className="px-6 sm:px-10 lg:px-16 py-14 sm:py-16 bg-cream"
        >
          <div className="max-w-[820px] mx-auto">
            <h2 className="font-serif text-h3 text-jaggery">
              Before you start
            </h2>
            <p className="mt-3 text-jaggery/75 text-body">
              You need a clear glass, warm water, a spoon, daylight and, for one
              of the seven, a bottle of tincture of iodine from any pharmacy.
              Break off a piece about the size of your thumbnail. None of this
              is a laboratory and none of it needs to be.
            </p>

            <PurityTestRunner tests={tests} verdicts={verdicts} />

            <div className="mt-14 border-t border-jaggery/12 pt-9">
              <h2 className="font-serif text-h3 text-jaggery">
                What this does not tell you
              </h2>
              <p className="mt-3 text-jaggery/75 text-body">
                These tests catch the common adulterations: sugar boiled in to
                bulk a block out, chalk or stone powder for weight, starch or
                flour, a clarifier or dye to lift the colour. They do not detect
                pesticide residue, they are not a mineral analysis, and a block
                can pass all seven and still have been made carelessly.
              </p>
              <p className="mt-4 text-jaggery/75 text-body">
                A block that fails one test is usually just a block. Colour and
                hardness vary honestly between batches with the cane and the
                fire, which is why ours are never quite the same twice. It is
                several results pointing the same way that means something.
              </p>
              <p className="mt-4 text-jaggery/75 text-body">
                If you want to see what the method is meant to produce, the
                whole process is on{" "}
                <Link
                  href="/our-story"
                  className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors"
                >
                  our story
                </Link>
                , and the block these tests were written against is the{" "}
                <Link
                  href="/products/organic-jaggery-block"
                  className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors"
                >
                  1kg sakhar block
                </Link>
                . Run the tests on it before you trust us.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
