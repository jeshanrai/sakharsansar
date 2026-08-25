import type { MetadataRoute } from "next";
import content from "@/data/content.json";
import { BLOG_ENABLED, pageCount, posts as blog, postPath } from "@/lib/blog";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import { AUTHOR } from "@/lib/author";
import { CATEGORIES } from "@/lib/categories";
import { languageAlternateUrls } from "@/lib/hreflang";
import { SITE_URL, absoluteUrl } from "@/lib/site";

/**
 * Dynamic sitemap — auto-includes every public route plus product and blog
 * detail pages, so new posts/products appear in search without manual edits.
 * The admin portal (/portfolio) and the personalised /favourites page are
 * intentionally excluded: both are noindex, and listing a noindex URL in a
 * sitemap is a Search Console warning.
 *
 * Product and post entries carry `images` so the same crawl feeds Google
 * Images, which is a meaningful traffic source for food products.
 *
 * `lastModified` is set only where a real date exists — the posts, which carry
 * one. It used to be `new Date()` on every entry, which told Google that the
 * privacy policy changed on every deploy. Google's guidance is explicit that
 * lastmod values it finds unreliable get ignored *sitewide*, so a fabricated
 * date on nine static pages was actively costing the posts the one accurate
 * signal they had. No value is better than a wrong one.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: "weekly", priority: 0.9 },
    // Listing an empty /blog would submit a page that redirects — a Search
    // Console error. It returns as soon as there is a post to show.
    ...(BLOG_ENABLED
      ? ([{ url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 }] as MetadataRoute.Sitemap)
      : []),
    // Commercial intent, and the only page targeting the B2B queries, so it
    // sits with /shop rather than with the informational pages.
    { url: `${SITE_URL}/wholesale`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/our-story`, changeFrequency: "monthly", priority: 0.7 },
    // The author page. Every post's byline and Person schema resolve to it,
    // so it needs to be crawlable in its own right.
    ...(BLOG_ENABLED
      ? ([{ url: `${SITE_URL}${AUTHOR.path}`, changeFrequency: "monthly", priority: 0.5 }] as MetadataRoute.Sitemap)
      : []),
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/shipping-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/refund-policy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // One entry per shop category. Derived from the same list that generates
  // the routes, so a new category cannot appear on the site and be missing
  // from the sitemap.
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/shop/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = content.products.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
    images: [absoluteUrl(p.image)],
  }));

  // Journal topic hubs. Derived from the same list that generates the routes.
  const blogCategoryRoutes: MetadataRoute.Sitemap = BLOG_CATEGORIES.map((c) => ({
    url: `${SITE_URL}/blog/category/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  // Pages 2..N of the journal. Empty while the archive fits on one page,
  // which is the state today — derived from the same helper the route uses, so
  // a page cannot exist and be missing from here.
  const blogPageRoutes: MetadataRoute.Sitemap = Array.from(
    { length: Math.max(0, pageCount() - 1) },
    (_, i) => ({
      url: `${SITE_URL}/blog/page/${i + 2}`,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    }),
  );

  const blogRoutes: MetadataRoute.Sitemap = blog.map((post) => {
    // The Nepali and English halves of a translation pair each declare the
    // other. Annotating them here as well as in the page's <link rel=alternate>
    // is belt and braces: Google accepts either, and a crawler that reaches the
    // sitemap before the page still learns the two are not duplicates.
    const pair = post.translationOf
      ? blog.find((p) => p.slug === post.translationOf)
      : undefined;

    return {
      url: `${SITE_URL}${postPath(post)}`,
      // `updated` is the date of the last substantive edit and is what the
      // post's own `dateModified` reports. Using `date` here meant the sitemap
      // and the structured data disagreed about the same page.
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: "monthly",
      priority: 0.6,
      images: [absoluteUrl(post.image)],
      // Built by the same helper that writes the <link rel="alternate"> tags
      // on the page, so the two can never describe different pairs. It used to
      // key off `post.lang`, which is a bare "ne" against the site default
      // "en-NP" — two different forms of annotation inside one pair, which is
      // the shape Google is most likely to discard.
      ...(pair
        ? {
            alternates: {
              languages: languageAlternateUrls(
                post.lang === "ne"
                  ? { ne: `${SITE_URL}${postPath(post)}`, en: `${SITE_URL}${postPath(pair)}` }
                  : { en: `${SITE_URL}${postPath(post)}`, ne: `${SITE_URL}${postPath(pair)}` },
              ),
            },
          }
        : {}),
    };
  });

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...blogCategoryRoutes,
    ...blogPageRoutes,
    ...blogRoutes,
  ];
}
