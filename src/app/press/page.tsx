import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download, Mail, Phone } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import content from "@/data/content.json";
import { AUTHOR } from "@/lib/author";
import { webPageLd } from "@/lib/seo";
import { SITE, STORY, formatRs } from "@/lib/site";
import { alternates, openGraph, twitter, DEFAULT_OG_IMAGE } from "@/lib/metadata";

/**
 * The press page.
 *
 * Its job is to make it trivial for a journalist to describe the business
 * correctly without having to ring anyone. Every fact here is the one the rest
 * of the site already states, read from the same config, so a story written
 * off this page cannot contradict the shop or the origin story.
 *
 * The section on what we do not claim is the point of the page rather than a
 * disclaimer at the bottom of it. A food brand that publishes what it cannot
 * substantiate is a better story than one that publishes adjectives, and it is
 * the thing a reporter can actually check.
 *
 * Photography is listed with real pixel dimensions rather than described as
 * "high-resolution", because the largest file here is 2048px and calling that
 * print-ready would be the same invention the rest of the site refuses.
 */

const PATH = "/press";

/** Only files that exist, with the dimensions they actually are. */
const PHOTOGRAPHY = [
  {
    src: "/team/rashmita.jpg",
    alt: AUTHOR.imageAlt,
    caption: "Rashmita Bhandari, founder",
    dimensions: "2048 × 1536",
  },
  {
    src: "/products/sakhar-block.jpg",
    alt: "A 1kg block of wood-fired sakhar from Sankhuwasabha",
    caption: "Sakhar block, 1kg",
    dimensions: "1200 × 1200",
  },
  {
    src: "/products/sakhar-powder.jpg",
    alt: "Sakhar powder in a resealable kraft pouch",
    caption: "Sakhar powder, 250g",
    dimensions: "1200 × 1200",
  },
  {
    src: "/products/dry-fruits-mixed.jpg",
    alt: "Whole nuts coated in molten wood-fired sakhar",
    caption: "Sakhar-coated dry fruits, 100g",
    dimensions: "1200 × 1200",
  },
];

export const metadata: Metadata = {
  title: { absolute: "Press: SakharSansar Facts, Photos & Contact" },
  description:
    "Everything a journalist needs about SakharSansar: boilerplate, founder biography, photography, and a plain list of what we do and do not claim.",
  alternates: alternates({ canonical: PATH }),
  openGraph: openGraph({
    title: "Press: SakharSansar Facts, Photos & Contact",
    description:
      "Boilerplate, founder biography, photography and a plain list of what we do and do not claim.",
    url: PATH,
    images: [DEFAULT_OG_IMAGE],
  }),
  twitter: twitter({
    title: "Press: SakharSansar Facts, Photos & Contact",
    description:
      "Boilerplate, founder biography, photography and a plain list of what we do and do not claim.",
    images: [DEFAULT_OG_IMAGE],
  }),
};

export default function PressPage() {
  return (
    <>
      <JsonLd
        data={webPageLd({
          name: "Press and media information",
          path: PATH,
          description:
            "Boilerplate, founder biography, photography and contact details for SakharSansar, a wood-fired jaggery producer in Sankhuwasabha, Nepal.",
        })}
      />


      <main className="overflow-x-hidden">
        <section className="bg-peach px-6 sm:px-10 lg:px-16 pt-28 sm:pt-36 pb-14 sm:pb-16">
          <div className="max-w-[820px] mx-auto">
            <Breadcrumbs trail={[{ name: "Press", path: PATH }]} />
            <h1 className="font-marker uppercase text-jaggery leading-[0.95] tracking-tight text-[clamp(2.25rem,6vw,4rem)]">
              Press
            </h1>
            <p className="mt-5 text-jaggery/75 text-lede max-w-2xl">
              Everything needed to write about us accurately, without having to
              ring first. If something here is not enough, the number below is
              answered by the person who makes the sakhar.
            </p>
          </div>
        </section>

        <section className="px-6 sm:px-10 lg:px-16 py-14 sm:py-16 bg-cream">
          <div className="max-w-[820px] mx-auto space-y-14">
            {/* ── Boilerplate ─────────────────────────────── */}
            <div>
              <h2 className="font-serif text-h3 text-jaggery">Boilerplate</h2>
              <p className="mt-2.5 text-[13px] text-jaggery/60">
                Copy either of these as they are.
              </p>

              <div className="mt-5 rounded-2xl border border-jaggery/12 bg-ivory px-5 sm:px-7 py-6">
                <p className="label-caps text-jaggery/60 mb-2.5">One line</p>
                <p className="text-jaggery/85 text-body">
                  SakharSansar makes wood-fired, chemical-free sakhar
                  (Himalayan jaggery) in {SITE.origin.locality},{" "}
                  {SITE.origin.region}, and ships it across Nepal.
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-jaggery/12 bg-ivory px-5 sm:px-7 py-6">
                <p className="label-caps text-jaggery/60 mb-2.5">Short paragraph</p>
                <p className="text-jaggery/85 text-body">
                  SakharSansar was founded in {STORY.founded} by{" "}
                  {AUTHOR.name}. Cane is grown by {STORY.households} farming
                  families across {STORY.villages} villages in{" "}
                  {SITE.origin.locality}, in the hills of {SITE.origin.region},
                  and the juice is reduced over an open wood fire in an iron
                  kadhai, skimmed by hand and poured into moulds to set. Nothing
                  is added: no sulphur, no clarifier, no bleaching agent, no
                  colour. The business is based in {SITE.address.street},{" "}
                  {SITE.address.locality}, and ships pan-Nepal.
                </p>
              </div>
            </div>

            {/* ── Fast facts ──────────────────────────────── */}
            <div>
              <h2 className="font-serif text-h3 text-jaggery">Fast facts</h2>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <tbody className="text-body">
                    {[
                      ["Founded", STORY.founded],
                      ["Founder", `${AUTHOR.name}, ${AUTHOR.role}`],
                      ["Made in", `${SITE.origin.locality}, ${SITE.origin.region}, Nepal`],
                      ["Based in", `${SITE.address.street}, ${SITE.address.locality}, ${SITE.address.region}`],
                      ["Growers", `${STORY.households} families across ${STORY.villages} villages`],
                      ["Method", "Open wood fire, iron kadhai, hand-skimmed, poured to set"],
                      ["Products", content.products.map((p) => `${p.name} (${p.weight}, ${p.price})`).join("; ")],
                      ["Ships", `Pan-Nepal; free above ${formatRs(1500)}`],
                      ["Website", SITE.url.replace("https://", "")],
                    ].map(([label, value]) => (
                      <tr key={label} className="border-b border-jaggery/10 align-top">
                        <th scope="row" className="py-3.5 pr-6 label-caps text-jaggery/60 font-normal whitespace-nowrap">
                          {label}
                        </th>
                        <td className="py-3.5 text-jaggery/85">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Founder ─────────────────────────────────── */}
            <div>
              <h2 className="font-serif text-h3 text-jaggery">The founder</h2>
              <p className="mt-3 text-jaggery/75 text-body">
                {AUTHOR.summary} Her full biography, and every article she has
                written here, is on{" "}
                <Link
                  href={AUTHOR.path}
                  className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors"
                >
                  her page
                </Link>
                . The story of how the business started is on{" "}
                <Link
                  href="/our-story"
                  className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors"
                >
                  our story
                </Link>
                .
              </p>
            </div>

            {/* ── What we do not claim ────────────────────── */}
            <div>
              <h2 className="font-serif text-h3 text-jaggery">
                What we do not claim
              </h2>
              <p className="mt-3 text-jaggery/75 text-body">
                This section exists because it is the part worth checking, and
                because most of our competitors will not put it in writing.
              </p>
              <ul className="mt-5 space-y-3.5 text-jaggery/85 text-body list-disc pl-5">
                <li>
                  <strong>We hold no organic certification.</strong> We grow
                  without chemical fertiliser or pesticide and make without
                  additives, which is what we mean by chemical-free. That is a
                  description of a method rather than a certification, and the
                  two are not the same thing. Terms for business buyers are on{" "}
                  <Link
                    href="/wholesale"
                    className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors"
                  >
                    our wholesale page
                  </Link>
                  , which says the same.
                </li>
                <li>
                  <strong>Nothing here has been lab tested.</strong> We publish
                  no mineral analysis, no calorie count and no glycaemic index
                  for our own sakhar, because we have not had it measured.
                  Figures we quote about jaggery in general are sourced and
                  linked to the WHO, the USDA or peer-reviewed work.
                </li>
                <li>
                  <strong>Sakhar is not a medicine.</strong> It does not detox
                  the liver, purify blood or aid weight loss. It is unrefined
                  sugar and it counts as sugar. We have written the honest
                  comparison in{" "}
                  <Link
                    href="/blog/jaggery-vs-sugar"
                    className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors"
                  >
                    sakhar and sugar
                  </Link>{" "}
                  and the diabetes question in{" "}
                  <Link
                    href="/blog/is-jaggery-safe-for-diabetics"
                    className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors"
                  >
                    a separate article
                  </Link>
                  .
                </li>
                <li>
                  <strong>We are not a cooperative.</strong> The business is
                  Rashmita&rsquo;s. The {STORY.households} families grow and
                  supply the cane; they do not own the company.
                </li>
                <li>
                  <strong>We do not sell chaku or khudo.</strong> Sakhar blocks
                  are the ingredient chaku is made from, which is a different
                  claim.
                </li>
              </ul>
            </div>

            {/* ── Photography ─────────────────────────────── */}
            <div>
              <h2 className="font-serif text-h3 text-jaggery">Photography</h2>
              <p className="mt-3 text-jaggery/75 text-body">
                Free to use in coverage of SakharSansar, with credit to
                SakharSansar. Dimensions are given so you know what you are
                getting. These are the web files; if you need something larger
                for print, ask and we will send the original.
              </p>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {PHOTOGRAPHY.map((photo) => (
                  <figure key={photo.src}>
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl ring-1 ring-jaggery/10 bg-ivory">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="mt-2.5 text-[13px] text-jaggery/70">
                      {photo.caption}
                      <span className="block text-jaggery/50">
                        {photo.dimensions}
                      </span>
                      <a
                        href={photo.src}
                        download
                        className="mt-1.5 inline-flex items-center gap-1.5 text-grove hover:text-jaggery transition-colors"
                      >
                        <Download className="w-3 h-3" strokeWidth={2} aria-hidden />
                        Download
                      </a>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            {/* ── Contact ─────────────────────────────────── */}
            <div>
              <h2 className="font-serif text-h3 text-jaggery">Contact</h2>
              <p className="mt-3 text-jaggery/75 text-body">
                Both reach Rashmita directly. WhatsApp is fastest.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <a
                  href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`}
                  className="inline-flex items-center gap-2.5 rounded-full bg-jaggery text-cream px-6 py-3.5 label-caps hover:bg-grove transition-colors"
                >
                  <Phone className="w-4 h-4" strokeWidth={1.9} aria-hidden />
                  {SITE.phone}
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex items-center gap-2.5 rounded-full border border-jaggery/20 text-jaggery px-6 py-3.5 label-caps hover:border-jaggery/45 transition-colors"
                >
                  <Mail className="w-4 h-4" strokeWidth={1.9} aria-hidden />
                  {SITE.email}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
