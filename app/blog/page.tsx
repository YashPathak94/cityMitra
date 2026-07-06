import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Rss } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";
import PageShell from "@/app/components/PageShell";

export const metadata: Metadata = {
  title: "Blog",
  description: "Travel funding tips, city guides, and market know-how from the CityMitra team.",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/rss.xml" }
  }
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogIndexPage() {
  return (
    <PageShell>
      <section className="blogIndexHero">
        <span className="sectionKicker">Blog</span>
        <h1>Travel funding tips, city guides, and market know-how</h1>
        <p>Practical, no-fluff writing on planning trips, funding them smarter, and getting the most out of Indian cities.</p>
        <a className="blogRssLink" href="/blog/rss.xml">
          <Rss size={13} /> RSS feed
        </a>
      </section>

      <section className="blogGrid" aria-label="All blog posts">
        {blogPosts.map((post) => (
          <Link className="blogCard" href={`/blog/${post.slug}`} key={post.slug}>
            <div className="blogCardImage" style={{ backgroundImage: `url("${post.coverImage}")` }} />
            <div className="blogCardBody">
              <span className="blogCardDate">
                <CalendarDays size={13} /> {formatDate(post.date)}
              </span>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <strong>
                Read the post <ArrowRight size={15} />
              </strong>
            </div>
          </Link>
        ))}
      </section>
    </PageShell>
  );
}
