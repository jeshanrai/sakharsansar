import blogData from "@/data/blog.json";

const SITE_URL = "https://sakharsansar.com";

export async function GET() {
  const items = blogData
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${post.author}</author>
      ${post.tags.map((tag) => `<category>${tag}</category>`).join("\n      ")}
    </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SakharSansar Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Articles on pure Himalayan jaggery, health benefits, recipes, and farmer stories from Sankhuwasabha.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
