import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, User } from "lucide-react";
import { blogPosts, getBlogPost } from "@/data/blog-posts";
import PageShell from "@/app/components/PageShell";
import ShareRow from "@/app/components/ShareRow";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ctmitra.com";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${post.slug}`,
      type: "article"
      // og:image comes from the opengraph-image.tsx file convention beside this page
    }
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "CityMitra", url: siteUrl },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`
  };

  return (
    <PageShell>
      <article className="blogPage">
        <header className="blogHero" style={{ backgroundImage: `linear-gradient(110deg, rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.45)), url("${post.coverImage}")` }}>
          <nav className="guideCrumbs" aria-label="Breadcrumb">
            <Link href="/blog">Blog</Link>
            <span>/</span>
            <b>{post.title}</b>
          </nav>
          <h1>{post.title}</h1>
          <div className="blogMeta">
            <span>
              <CalendarDays size={14} /> {formatDate(post.date)}
            </span>
            <span>
              <User size={14} /> {post.author}
            </span>
          </div>
        </header>

        <div className="blogTopRow">
          <div className="blogTags">
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <ShareRow title={post.title} />
        </div>

        <section className="blogBody">
          {post.blocks.map((block, index) => {
            if (block.type === "h2") return <h2 key={index}>{block.text}</h2>;
            if (block.type === "list")
              return (
                <ul key={index}>
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              );
            return <p key={index}>{block.text}</p>;
          })}
        </section>

        <section className="blogPostCta">
          <h2>Put this into practice on CityMitra</h2>
          <p>Every guide on this blog maps to a live feature — try it on your own city, free, no sign-up.</p>
          <Link className="primaryButton" href={post.ctaHref}>
            {post.ctaLabel} <ArrowRight size={17} />
          </Link>
        </section>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </PageShell>
  );
}
