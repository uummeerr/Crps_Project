import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronRight, Info } from "lucide-react";
import Headline from "@/components/Headline";
import Section from "@/components/Section";
import ContactCta from "@/components/ContactCta";
import ArticleToc from "@/components/ArticleToc";
import ShareLinks from "@/components/ShareLinks";
import BlogCard, { coverName, FieldBadge, PostMeta } from "@/components/BlogCard";
import { doctor } from "@/content/doctor";
import { site } from "@/content/site";
import { getAvatar } from "@/lib/avatar";
import { getPost, getPosts, getRelated, toCard } from "@/lib/blog";
import PageTransition from "@/components/chrome/PageTransition";

// Every post is built as its own static page.
export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.publishedAt },
  };
}

// Gives every headed section a name for links, made from its heading:
// "What early treatment looks like" becomes "what-early-treatment-looks-like".
function nameSections(sections) {
  const used = new Set();
  return sections.map((section, index) => {
    if (!section.heading) return section;
    const base = section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
    const id = used.has(base) ? `${base}-${index + 1}` : base;
    used.add(id);
    return { ...section, id };
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelated(post).map(toCard);
  const avatar = getAvatar();

  // Most posts open with a section that has no heading; its first paragraph
  // is set larger, as the lede.
  const opening = post.sections[0].heading ? null : post.sections[0];
  const parts = nameSections(opening ? post.sections.slice(1) : post.sections);
  const contents = parts.filter((part) => part.id).map((part) => ({ id: part.id, label: part.heading }));

  return (
    <PageTransition>
      <div className="progress" aria-hidden="true" />

      <header className={`article-head${post.image ? " has-cover" : ""}`} style={{ "--h": post.hue }}>
        <div className="aurora" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="dots" aria-hidden="true" />
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb" data-load>
            <Link href="/">Home</Link>
            <ChevronRight aria-hidden="true" />
            <Link href="/blog">Blog</Link>
            <ChevronRight aria-hidden="true" />
            <span aria-current="page">{post.fieldLabel}</span>
          </nav>
          <div className="article-kicker" data-load style={{ "--d": "80ms" }}>
            <FieldBadge label={post.fieldLabel} hue={post.hue} />
            {post.sample ? <span className="sample">Sample</span> : null}
          </div>
          <h1 className="words" data-load style={{ "--d": "120ms" }}>
            <Headline text={post.title} />
          </h1>
          <p className="article-deck" data-load style={{ "--d": "340ms" }}>
            {post.excerpt}
          </p>
          <div className="byline" data-load style={{ "--d": "460ms" }}>
            <span className="who">
              <Image src={avatar.src} alt="" width={44} height={44} style={{ objectPosition: avatar.position }} />
              <span>
                <strong>{doctor.name}</strong>
                <small>{site.role}</small>
              </span>
            </span>
            <PostMeta post={post} />
          </div>
        </div>
      </header>

      {post.image ? (
        <div className="article-cover-band">
          <div className="wrap">
            {/* No scroll reveal here: this is where the card's photo lands. */}
            <figure className="article-cover">
              <ViewTransition name={coverName(post.slug)} share="cover-morph" default="none">
                <Image src={post.image.src} alt={post.image.alt} fill preload sizes="(max-width: 1240px) 100vw, 1200px" />
              </ViewTransition>
            </figure>
          </div>
        </div>
      ) : null}

      <section className="section white tight">
        <div className="wrap article-grid">
          <article className="article">
            {post.sample ? (
              <p className="sample-note">
                <Info aria-hidden="true" />
                <span>
                  This is a sample article for testing the design. It was not written or reviewed
                  by Dr Tramboo and will be replaced before launch.
                </span>
              </p>
            ) : null}

            {opening?.paragraphs.map((paragraph, index) => (
              <p className={index === 0 ? "lede" : undefined} key={paragraph}>
                {paragraph}
              </p>
            ))}

            {parts.map((part) => (
              <section className="article-part" id={part.id} key={part.heading ?? part.paragraphs[0]}>
                {part.heading ? <h2>{part.heading}</h2> : null}
                {part.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}

            <p className="note">
              <Info aria-hidden="true" />
              <span>
                This article is general information and does not replace a consultation. Decisions
                about your own treatment should be made with your doctor.
              </span>
            </p>
            <div className="article-end">
              <ShareLinks title={post.title} url={`${site.url}/blog/${post.slug}`} />
              <Link className="link" href="/blog">
                <ArrowLeft aria-hidden="true" />
                All articles
              </Link>
            </div>
          </article>

          <aside className="aside-stack">
            {contents.length > 1 ? <ArticleToc items={contents} /> : null}
            <div className="card night author-card">
              <div className="author-who">
                <Image
                  src={avatar.src}
                  alt={doctor.name}
                  width={56}
                  height={56}
                  style={{ objectPosition: avatar.position }}
                />
                <span>
                  <strong>{doctor.name}</strong>
                  <small>
                    {site.role}, {site.city}
                  </small>
                </span>
              </div>
              <p>Have a question about your own pain? Send your history and reports on WhatsApp or email.</p>
              <Link className="btn btn-mint" href="/contact">
                Book a consultation
                <span className="btn-dot" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </Link>
              <Link className="author-more" href="/about">
                About {site.shortName}
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {related.length ? (
        <Section eyebrow="Keep reading" title="More from the blog." accent="blog">
          <div className="blog-grid" data-stagger>
            {related.map((item) => (
              <BlogCard key={item.slug} post={item} />
            ))}
          </div>
        </Section>
      ) : null}

      <ContactCta />
    </PageTransition>
  );
}
