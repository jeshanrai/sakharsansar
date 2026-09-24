import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import {
  BLOG_ENABLED,
  formatPostDate,
  pageCount,
  postPath,
  postsOnPage,
} from "@/lib/blog";
import { itemListLd, postNodeId } from "@/lib/seo";
import { alternates, openGraph, twitter, DEFAULT_OG_IMAGE } from "@/lib/metadata";

/**
 * Page 2 and beyond of the journal.
 *
 * The index used to render the entire archive on one URL. That is fine at ten
 * articles and a problem at fifty — the page grows without bound, and one
 * document about everything ranks for less than several about something.
 *
 * Real URLs rather than a "load more" button, deliberately: a crawler does not
 * click, so anything behind client-side paging is invisible to it, and a
 * reader cannot link to or bookmark what has no address. `/blog` stays page
 * one and keeps its own canonical; each page here points at itself.
 *
 * Below thirteen posts `generateStaticParams` returns nothing and this route
 * does not exist — which is the state today. It builds itself the day the
 * archive outgrows one page.
 */
type Props = { params: Promise<{ n: string }> };

/** Pages 2..N. Page one is /blog, which must not also answer at /blog/page/1 —
 *  two URLs for one page of results is a duplicate we would have to canonical
 *  our way out of. */
export function generateStaticParams() {
  const count = pageCount();
  return Array.from({ length: Math.max(0, count - 1) }, (_, i) => ({
    n: String(i + 2),
  }));
}

/** Anything outside the generated range 404s rather than rendering an empty
 *  page of results. */
export const dynamicParams = false;

function parsePage(raw: string): number | null {
  if (!/^[0-9]+$/.test(raw)) return null;
  const n = Number(raw);
  if (n < 2 || n > pageCount()) return null;
  return n;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n: raw } = await params;
  const n = parsePage(raw);
  if (!n) return { title: "Not Found", robots: { index: false } };

  const title = `SakharSansar Journal: Page ${n}`;
  const description = `Page ${n} of the SakharSansar journal — jaggery recipes, health benefits, buying guides and farm stories from Sankhuwasabha.`;

  return {
    title: { absolute: title },
    description,
    // Self-referencing. A paginated page that canonicalises to /blog tells
    // Google the articles listed here belong on a page that does not list
    // them, and they drop out of the index.
    alternates: alternates({ canonical: `/blog/page/${n}` }),
    openGraph: openGraph({
      title,
      description,
      url: `/blog/page/${n}`,
      images: [DEFAULT_OG_IMAGE],
    }),
    twitter: twitter({ title, description, images: [DEFAULT_OG_IMAGE] }),
  };
}

export default async function BlogPage({ params }: Props) {
  if (!BLOG_ENABLED) notFound();
  const { n: raw } = await params;
  const n = parsePage(raw);
  if (!n) notFound();

  const posts = postsOnPage(n);
  if (posts.length === 0) notFound();

  const total = pageCount();
  const previous = n === 2 ? "/blog" : `/blog/page/${n - 1}`;
  const next = n < total ? `/blog/page/${n + 1}` : null;

  return (
    <>
      <JsonLd
        data={itemListLd(
          `SakharSansar Journal, page ${n}`,
          posts.map((p) => ({
            name: p.title,
            path: postPath(p),
            id: postNodeId(postPath(p)),
          })),
        )}
      />


      <main className="overflow-x-hidden">
        <section className="bg-peach px-6 sm:px-10 lg:px-16 pt-28 sm:pt-36 pb-16 sm:pb-20">
          <div className="max-w-[1280px] mx-auto">
            <Breadcrumbs
              trail={[
                { name: "Blog", path: "/blog" },
                { name: `Page ${n}`, path: `/blog/page/${n}` },
              ]}
            />
            <h1 className="font-marker uppercase text-jaggery leading-[0.9] tracking-tight text-[clamp(2.5rem,7vw,5rem)]">
              Journal · Page {n}
            </h1>
            <p className="mt-4 text-jaggery/70 font-medium text-[clamp(0.95rem,1.6vw,1.15rem)] leading-snug max-w-2xl">
              Older writing from Sankhuwasabha — recipes, buying guides and farm
              notes.
            </p>
          </div>
        </section>

        <section
          aria-label={`Journal articles, page ${n}`}
          className="px-6 sm:px-10 lg:px-16 py-16 sm:py-20"
        >
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {posts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={postPath(post)} className="block">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-jaggery/10">
                    <Image
                      src={post.image}
                      alt={post.imageAlt ?? post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <h2 className="mt-5 font-serif text-h4 text-jaggery text-balance group-hover:text-grove transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <p className="mt-2.5 text-jaggery/75 text-body line-clamp-3">
                  {post.description}
                </p>
                <p className="mt-3 label-caps text-jaggery/60">
                  {formatPostDate(post.date)}
                </p>
              </article>
            ))}
          </div>

          {/* Crawlable in both directions — the rel that matters here is simply
              that these are real links in the server HTML. */}
          <nav
            aria-label="Journal pagination"
            className="max-w-[1280px] mx-auto mt-16 flex items-center justify-between gap-4"
          >
            <Link
              href={previous}
              className="inline-flex items-center gap-2 rounded-full bg-jaggery text-cream label-caps px-7 py-3.5 hover:bg-grove transition-colors"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              {n === 2 ? "Latest articles" : `Page ${n - 1}`}
            </Link>
            <span className="label-caps text-jaggery/60">
              Page {n} of {total}
            </span>
            {next ? (
              <Link
                href={next}
                className="inline-flex items-center gap-2 rounded-full bg-jaggery text-cream label-caps px-7 py-3.5 hover:bg-grove transition-colors"
              >
                Page {n + 1}
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </section>
      </main>

      <Footer />
    </>
  );
}
