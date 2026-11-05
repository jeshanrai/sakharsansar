import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { postPath, posts } from "@/lib/blog";

/**
 * "From the journal" on the home page.
 *
 * Until November 2026 the home page linked to no post at all, so the journal
 * was reachable from it only through the nav and the footer, both of which go
 * to the /blog index, where most posts sit on page 2 or 3. These are real
 * links, rendered on the server, straight from the page with the most link
 * equity on the site to the articles that need it most: the pillar first, then
 * the posts for the next two festivals (Yomari Punhi, Maghe Sankranti).
 *
 * Curated, not "latest": the newest posts are not the ones a first-time
 * visitor should read. Each slug is checked against the journal, so a retired
 * post drops out of the list rather than becoming a 404.
 */
const PICKS: { slug: string; note: string }[] = [
  {
    slug: "himalayan-jaggery-sankhuwasabha",
    note: "What Sankhuwasabha sakhar is, how it is made, and how it differs from Terai gur.",
  },
  {
    slug: "how-to-identify-pure-jaggery-sakhar",
    note: "Seven home tests for pure sakhar. Run them on ours too.",
  },
  {
    slug: "yomari-chaku-recipe",
    note: "Yomari for Yomari Punhi, with a chaku and sesame filling.",
  },
  {
    slug: "chaku-recipe-maghe-sankranti",
    note: "How to make chaku from a sakhar block, and the thread stage that decides it.",
  },
  {
    slug: "maghe-sankranti-food",
    note: "What Nepal eats at Maghe Sankranti, dish by dish.",
  },
  {
    slug: "how-to-eat-sakhar",
    note: "After a meal, in chiya, with dahi and roti: how Nepal uses it every day.",
  },
];

export default function JournalSection() {
  const picks = PICKS.flatMap(({ slug, note }) => {
    const post = posts.find((p) => p.slug === slug && p.lang !== "ne");
    return post ? [{ post, note }] : [];
  });
  if (picks.length === 0) return null;

  return (
    <section
      aria-label="From the journal"
      className="relative py-20 sm:py-24 px-5 sm:px-8 lg:px-12 bg-cream border-t border-jaggery/10"
    >
      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10 sm:mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-6 h-px bg-caramel" />
              <span className="label-caps text-caramel-deep text-[10px]">From the journal</span>
            </div>
            <h2 className="font-serif font-soft text-jaggery tracking-[-0.02em] text-balance leading-[1.05] text-[clamp(2rem,4vw,3.25rem)]">
              Read before you cook.
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[15px] text-jaggery/70 hover:text-grove transition-colors"
          >
            All articles <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
          </Link>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {picks.map(({ post, note }) => (
            <li key={post.slug}>
              <Link href={postPath(post)} className="group flex flex-col h-full">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.25rem] bg-jaggery/5 mb-5">
                  <Image
                    src={post.image}
                    alt={post.imageAlt ?? post.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-jaggery text-xl leading-snug mb-2 group-hover:text-grove transition-colors">
                  {post.title}
                </h3>
                <p className="text-jaggery/70 text-[15px] leading-relaxed">{note}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
