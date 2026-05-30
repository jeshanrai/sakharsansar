import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

  // Static asset caching — long max-age, immutable
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
