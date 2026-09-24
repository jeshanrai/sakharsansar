import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { NeHero, neMetadata } from "@/components/ne/NePage";
import { formatPostDate, postPath, sortedPosts } from "@/lib/blog";
import { t } from "@/lib/i18n";
import { NE } from "@/lib/ne-content";
import { itemListLd } from "@/lib/seo";

/**
 * /ne/blog — the Nepali journal index. Pairs with /blog.
 *
 * The Nepali articles had no index of their own; the nav's जर्नल link went to
 * the English journal, which does not list them.
 */

const PATH = "/ne/blog";
const page = NE.blog;

export const metadata: Metadata = neMetadata({
  title: page.title,
  description: page.description,
  path: PATH,
  enPath: "/blog",
  card: "/blog/opengraph-image",
  cardAlt: "सखर संसार जर्नल",
});

export default function NepaliJournal() {
  const posts = sortedPosts("ne");

  return (
    <>
      <JsonLd
        data={itemListLd(
          page.h1,
          posts.map((p) => ({ name: p.title, path: postPath(p) })),
        )}
      />

      <main lang="ne" className="bg-cream overflow-x-hidden">
        <NeHero
          trail={[{ name: t("ne").crumbJournal, path: PATH }]}
          eyebrow={t("ne").navJournal}
          title={page.h1}
          lede={page.lede}
        />

        <section className="px-6 sm:px-10 lg:px-16 pt-14 sm:pt-20 pb-16">
          <ul className="max-w-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={postPath(post)}
                  className="group block rounded-3xl bg-ivory ring-1 ring-jaggery/8 overflow-hidden hover:shadow-xl hover:shadow-jaggery/10 transition-shadow"
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={post.image}
                      alt={post.imageAlt ?? post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <time dateTime={post.date} className="label-caps text-jaggery/60">
                      {formatPostDate(post.date, "ne")}
                    </time>
                    <h2 className="mt-2 font-serif text-lg text-jaggery group-hover:text-grove transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-jaggery/70 line-clamp-3">{post.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer locale="ne" />
    </>
  );
}
