import type { MetadataRoute } from "next";

const BASE_URL = "https://sakharsansar.com";

// Search + AI/answer-engine crawlers we explicitly welcome (GEO / AI SEO).
// They're already covered by the "*" rule, but listing them documents intent
// and guards against future blanket AI-bot blocks.
const AI_AND_SEARCH_BOTS = [
  "*",
  "Googlebot",
  "Bingbot",
  "Google-Extended", // Gemini / AI Overviews training + grounding
  "GPTBot", // OpenAI / ChatGPT
  "OAI-SearchBot", // ChatGPT search
  "ChatGPT-User",
  "ClaudeBot", // Anthropic
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Applebot",
  "Applebot-Extended",
  "CCBot", // Common Crawl (feeds many LLMs)
];

/**
 * robots.txt — welcome search engines and AI/answer-engine crawlers, keep the
 * admin portal out of all of them, and point crawlers at the dynamic sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: AI_AND_SEARCH_BOTS.map((userAgent) => ({
      userAgent,
      allow: "/",
      disallow: ["/portfolio", "/portfolio/"],
    })),
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
