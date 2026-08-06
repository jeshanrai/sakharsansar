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
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
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
