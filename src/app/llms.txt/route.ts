import content from "@/data/content.json";
import blog from "@/data/blog.json";

const BASE_URL = "https://sakharsansar.com";

// Prerender at build time and serve as a static, CDN-cacheable asset.
export const dynamic = "force-static";

/**
 * /llms.txt — a curated, machine-readable map of the site for LLMs and answer
 * engines (the emerging llmstxt.org standard). Generated from the same data
 * the site renders, so it stays in sync. Served as markdown.
 */
export async function GET() {
  const products = content.products
    .map(
      (p) =>
        `- [${p.name}](${BASE_URL}/products/${p.slug}): ${p.description}`,
    )
    .join("\n");

  const guides = blog
    .map(
      (post) =>
        `- [${post.title}](${BASE_URL}/blog/${post.slug}): ${post.description}`,
    )
    .join("\n");

  const body = `# SakharSansar

> ${content.brand.tagline}. SakharSansar makes 100% organic, chemical-free Himalayan jaggery (sakhar/gur), wood-fired by a cooperative of 42 farming families across six villages in Sankhuwasabha, Koshi Province, Nepal — sold direct from farmers, with no middleman.

## Key facts
- Product: pure, unrefined jaggery (sakhar) — no bleach, no sulphur, no anti-caking agents, no artificial colour.
- Origin: Sankhuwasabha, Koshi Province, Nepal (Himalayan foothills near the Arun river and Makalu peaks).
- Method: sugarcane juice slow-reduced over open wood fire in an iron kadhai, set in wooden moulds.
- Made by: a cooperative of 42 farming families, paid above market for chemical-free cane.
- Forms sold: blocks, powder, cubes, liquid jaggery and related products.

## Pages
- [Home](${BASE_URL}/): brand overview and bestsellers.
- [Shop](${BASE_URL}/shop): full product range.
- [Our Story](${BASE_URL}/our-story): origin, farmers, craft and chemical-free promise.
- [Blog](${BASE_URL}/blog): guides on jaggery, health and sourcing.

## Products
${products}

## Guides
${guides}

## Policies
- [Shipping Policy](${BASE_URL}/shipping-policy)
- [Refund Policy](${BASE_URL}/refund-policy)
- [Privacy Policy](${BASE_URL}/privacy-policy)
- [Terms](${BASE_URL}/terms)

## Contact
- Email: hello@sakharsansar.com
- Location: Sankhuwasabha, Koshi Province, Nepal
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
