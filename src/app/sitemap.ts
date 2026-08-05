import type { MetadataRoute } from "next";
import content from "@/data/content.json";
import blog from "@/data/blog.json";
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
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/our-story`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/shipping-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/refund-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productRoutes: MetadataRoute.Sitemap = content.products.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
    images: [absoluteUrl(p.image)],
  }));

  const blogRoutes: MetadataRoute.Sitemap = blog.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
    images: [absoluteUrl(post.image)],
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
