import blogData from "@/data/blog.json";
import { SITE, SITE_URL, absoluteUrl } from "@/lib/site";

// Prerender at build time and serve as a static, CDN-cacheable asset.
export const dynamic = "force-static";

/**
 * RSS 2.0 feed for the journal.
 *
 * Note the `dc:creator` element rather than RSS's own `<author>`: the spec
 * requires `<author>` to contain an email address, and feed validators (plus
 * some aggregators) reject a bare name there.
 */
export async function GET() {
  const posts = [...blogData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <dc:creator><![CDATA[${post.author}]]></dc:creator>
      <enclosure url="${absoluteUrl(post.image)}" type="image/jpeg" />
      ${post.tags.map((tag) => `<category><![CDATA[${tag}]]></category>`).join("\n      ")}
    </item>`,
    )
    .join("");

  const lastBuildDate = new Date(
    posts[0]?.date ?? Date.now(),
  ).toUTCString();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>SakharSansar Journal</title>
    <link>${SITE_URL}/blog</link>
    <description>Articles on pure Himalayan jaggery, health benefits, recipes, and farmer stories from Sankhuwasabha.</description>
    <language>${SITE.lang}</language>
    <copyright>© ${new Date().getFullYear()} ${SITE.name}</copyright>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <image>
      <url>${absoluteUrl("/logo-mark.webp")}</url>
      <title>SakharSansar Journal</title>
      <link>${SITE_URL}/blog</link>
    </image>
    <atom:link href="${SITE_URL}/feed" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
