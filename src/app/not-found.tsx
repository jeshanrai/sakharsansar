import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { BLOG_ENABLED } from "@/lib/blog";
import { ArrowRight } from "lucide-react";

/**
 * Custom 404.
 *
 * Next's built-in not-found page is an unstyled, link-less dead end. Every
 * mistyped URL, stale backlink and retired product slug landed there, which
 * wastes the crawl (nothing to follow onward) and loses the visitor. This one
 * routes both back into the catalogue.
 *
 * The route returns a real HTTP 404, so `noindex` isn't strictly required —
 * but a soft-404 rendered through some other path would still be caught by it.
 */
export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "That page has moved or never existed. Browse the full range of pure, wood-fired Himalayan jaggery instead.",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/shop", label: "Shop all sakhar", hint: "Eight pure forms, blocks to liquid" },
  { href: "/our-story", label: "Our story", hint: "Seven generations in Sankhuwasabha" },
  ...(BLOG_ENABLED
    ? [{ href: "/blog", label: "The journal", hint: "Recipes, benefits and farm notes" }]
    : []),
  { href: "/contact", label: "Contact us", hint: "Wholesale and retail orders" },
];

export default function NotFound() {
  return (
    <>
      <main className="overflow-x-hidden pt-36 pb-24 px-5 sm:px-8 lg:px-12 min-h-[70vh]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] font-bold tracking-caps uppercase text-jaggery/55 mb-3">
            Error 404
          </p>
          <h1 className="font-marker uppercase text-jaggery leading-[0.9] tracking-tight text-[clamp(2.25rem,6vw,4rem)]">
            This page has melted away
          </h1>
          <p className="mt-5 max-w-xl text-base sm:text-lg text-jaggery/70 leading-relaxed">
            The link you followed is broken or the page has moved. Everything
            else is still exactly where it should be — start here.
          </p>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex items-start justify-between gap-4 rounded-2xl bg-white/70 border border-jaggery/10 p-5 hover:border-jaggery/30 transition-colors"
                >
                  <span>
                    <span className="block font-display font-bold text-jaggery tracking-tight">
                      {link.label}
                    </span>
                    <span className="mt-1 block text-sm text-jaggery/60">
                      {link.hint}
                    </span>
                  </span>
                  <ArrowRight className="w-4 h-4 mt-1 shrink-0 text-jaggery/40 group-hover:text-jaggery group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
