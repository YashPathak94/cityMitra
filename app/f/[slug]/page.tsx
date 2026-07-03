import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, User } from "lucide-react";
import { blogPosts, getBlogPost } from "@/data/blog-posts";
import PageShell from "@/app/components/PageShell";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citymitra.vercel.app";

// GoDaddy's blog permalinks are /f/<slug> (e.g. ctmitra.com/f/how-to-support-local-businesses-in-your-community).
// Posts live here at the same path so existing/shared/indexed GoDaddy links keep working after migration.
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
    alternates: { canonical: `/f/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/f/${post.slug}`,
      type: "article",
      images: [post.coverImage]
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
    mainEntityOfPage: `${siteUrl}/f/${post.slug}`
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

        <div className="blogTags">
          {post.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <section className="blogBody">
          {post.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>

        <section className="blogPostCta">
          <h2>Plan your next trip with CityMitra</h2>
          <p>Build a saving plan, compare transport and hotels, and chat with the AI guide for your destination.</p>
          <Link className="primaryButton" href="/travel-plan">
            Open Travel Plan <ArrowRight size={17} />
          </Link>
        </section>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </PageShell>
  );
}
