import type { NextConfig } from "next";
import blogPosts from "./src/data/blog.json";

/**
 * The three original journal posts, retired as outdated.
 *
 * Their URLs may have picked up links or rankings, so they 301 to the closest
 * live page rather than 404 — a permanent redirect passes that value on, which
 * matters most right after the move to www.sakharsansar.com.np.
 *
 * These are permanent by design. If a future post ever reuses one of these
 * exact slugs, delete its entry here or the redirect will shadow the new post.
 */
const RETIRED_POSTS = [
  { slug: "health-benefits-of-pure-himalayan-jaggery", to: "/our-story" },
  { slug: "why-sankhuwasabha-produces-the-best-jaggery", to: "/our-story" },
  { slug: "how-to-use-jaggery-in-daily-cooking", to: "/shop" },
];

/**
 * The six fictional products retired when the catalogue was cut to the three
 * we actually sell.
 *
 * Same reasoning as RETIRED_POSTS, and it applies harder here: these were in
 * the sitemap, carried Product + Offer structured data, and were linked from
 * the home page, the shop and several articles. Letting them 404 throws away
 * whatever ranking and links they had picked up, and leaves Search Console
 * reporting six errors against URLs we submitted ourselves.
 *
 * Each goes to the nearest thing we still sell. Where nothing is close, /shop
 * is the honest destination rather than a product the visitor did not ask for.
 */
const RETIRED_PRODUCTS = [
  // Hand-cut from the block, sold as a portioned everyday sweetener. The
  // powder is what fills that role now.
  { slug: "jaggery-cubes", to: "/products/jaggery-powder" },
  // Jaggery powder blended with turmeric, ginger and pepper. Same base.
  { slug: "spiced-jaggery-mix", to: "/products/jaggery-powder" },
  // A set block, seasonal. The nearest live product is the block.
  { slug: "date-palm-jaggery", to: "/products/organic-jaggery-block" },
  // A small sweet snack in a pouch, which is what the dry fruit mix is.
  { slug: "jaggery-candy", to: "/products/mixed-dry-fruits" },
  // Nothing pourable or spreadable is left in the range, so these two go to
  // the shop rather than to a solid block the visitor was not looking for.
  { slug: "liquid-jaggery", to: "/shop" },
  { slug: "jaggery-spread", to: "/shop" },
];

/**
 * Pages that moved out of the journal into a route of their own.
 *
 * The wholesale guide was written as a post, but a shop owner searching
 * "jaggery wholesale supplier Nepal" is making a commercial decision, and a
 * blog archive is the wrong shelf for it. The writing moved verbatim to
 * /wholesale; this passes on whatever the post had already earned, and stops
 * two URLs carrying the same 2,000 words from competing with each other.
 */
const PROMOTED_POSTS = [
  { slug: "wholesale-jaggery-nepal", to: "/wholesale" },
];

/**
 * Every route that renders a social card via `opengraph-image` / `twitter-image`.
 *
 * Next advertises these as absolute URLs in `og:image` / `twitter:image`, and
 * Googlebot follows them like any other link — so all ten of them turned up in
 * Search Console under "Crawled - currently not indexed". They are 1200x630
 * PNGs, not pages: there is nothing there to index, and the status will never
 * resolve on its own. `noindex` moves them into "Excluded by noindex tag",
 * which keeps the coverage report about actual pages.
 *
 * Safe for sharing: Facebook, WhatsApp, X and friends fetch the image directly
 * and ignore X-Robots-Tag. Product rich results are unaffected too — those pull
 * the photo named in the Product JSON-LD (`/products/*.jpg`), not this card.
 *
 * `:path+` is one-or-more segments, which covers both `/blog/opengraph-image`
 * and `/products/organic-jaggery-block/opengraph-image`; the bare root card
 * needs its own entry.
 */
const SOCIAL_CARD_ROUTES = [
  "/opengraph-image",
  "/twitter-image",
  "/:path+/opengraph-image",
  "/:path+/twitter-image",
];

const nextConfig: NextConfig = {
  // Surface potential problems in dev; harmless in prod.
  reactStrictMode: true,

  // Strip console.* from production bundles (keep error/warn for observability).
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // Serve modern image formats — Next auto-negotiates with the browser.
  // AVIF gives ~50% smaller files than JPEG for the same visual quality;
  // WebP is the fallback for browsers without AVIF.
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // A year. These are content-addressed by the optimiser's own cache key, so
    // a re-uploaded photo produces a different URL rather than a stale hit.
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },

  // Send fewer headers, shave bytes per request
  poweredByHeader: false,

  // Tree-shake the parts of these libs we never touch
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  async redirects() {
    return [
      ...RETIRED_POSTS.map(({ slug, to }) => ({
        source: `/blog/${slug}`,
        destination: to,
        permanent: true, // 308 — the content is gone for good
      })),
      ...RETIRED_PRODUCTS.map(({ slug, to }) => ({
        source: `/products/${slug}`,
        destination: to,
        permanent: true, // 308 — these products are not coming back
      })),
      ...PROMOTED_POSTS.map(({ slug, to }) => ({
        source: `/blog/${slug}`,
        destination: to,
        permanent: true, // 308 — the content lives at the new URL now
      })),
      // /blog itself is only *temporarily* empty: new posts are planned, so
      // this is a 307. A permanent redirect here would hand /blog's identity
      // to /shop in the index and be cached by browsers, which is painful to
      // undo. Delete this entry when the journal is republished — the rest of
      // the blog wiring re-enables itself from src/data/blog.json.
      ...(blogPosts.length === 0
        ? [{ source: "/blog", destination: "/shop", permanent: false }]
        : []),
    ];
  },

  async headers() {
    return [
      // Social cards are images, not pages — keep them out of the index.
      ...SOCIAL_CARD_ROUTES.map((source) => ({
        source,
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      })),
      // Static asset caching — long max-age, immutable
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Base security headers for every route
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
