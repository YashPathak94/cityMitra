import { NextResponse } from "next/server";
import { blogPosts } from "@/data/blog-posts";

export const revalidate = 3600; // regenerate at most once an hour

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ctmitra.com";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Real automation entry point: point Buffer, Zapier's "RSS by Zapier"
// trigger, IFTTT, or Meta Business Suite's scheduler at this feed and each
// new post can auto-post to Instagram/Facebook/X/LinkedIn without any
// platform API integration living in this codebase.
export async function GET() {
  const sorted = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const items = sorted
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CityMitra Blog</title>
    <link>${siteUrl}/blog</link>
    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Travel funding tips, city guides, and market know-how from the CityMitra team.</description>
    <language>en-in</language>${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" }
  });
}
