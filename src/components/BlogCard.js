import "@/app/blog.css";
import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Clock,
  Droplets,
  Dumbbell,
  FileText,
  FlaskConical,
  Pill,
  Wind,
  Zap,
} from "lucide-react";

// A post's cover is its photo when it has one, otherwise an icon chosen by its
// field. A field with no icon here gets the document icon.
const fieldIcons = {
  crps: Activity,
  pain: Pill,
  neuromodulation: Zap,
  rehabilitation: Dumbbell,
  kidney: Droplets,
  liver: FlaskConical,
  lungs: Wind,
};

// The name that ties a card's cover photo to the same post's cover on its
// article page, so the photo travels from one to the other when the card is
// opened. Used here and in app/blog/[slug]/page.js.
export const coverName = (slug) => `post-cover-${slug}`;

export function FieldBadge({ label, hue }) {
  return (
    <span className="badge" style={{ "--h": hue }}>
      {label}
    </span>
  );
}

// Date, time and reading time, each with its icon. Used at the top of an article.
export function PostMeta({ post }) {
  return (
    <>
      <span>
        <CalendarDays aria-hidden="true" />
        {post.date}
      </span>
      <span>
        <Clock aria-hidden="true" />
        {post.time}
      </span>
      <span>{post.minutes} min read</span>
    </>
  );
}

// One post, as a card that links to its article.
//   featured   the large version at the top of the blog list: the photo fills
//              the card and the text sits over it
//   order      staggers the entrance of cards in a grid
// Styles are in app/blog.css.
export default function BlogCard({ post, featured = false, order = 0 }) {
  const Icon = fieldIcons[post.field] ?? FileText;
  const field = <span className="chip field">{post.fieldLabel}</span>;
  const sample = post.sample ? <span className="sample">Sample</span> : null;

  return (
    // Prefetched in full, so the article is ready the moment the card is
    // clicked and the cover photo can travel across.
    <Link
      className={`post${featured ? " featured" : ""}`}
      href={`/blog/${post.slug}`}
      prefetch
      style={{ "--h": post.hue, "--n": order }}
    >
      <div className={`post-cover${post.image ? " has-photo" : ""}`}>
        {post.image ? (
          <ViewTransition name={coverName(post.slug)} share="cover-morph" default="none">
            <Image
              src={post.image.src}
              alt={post.image.alt}
              fill
              sizes={featured ? "(max-width: 1240px) 100vw, 1240px" : "(max-width: 760px) 100vw, (max-width: 1080px) 50vw, 600px"}
            />
          </ViewTransition>
        ) : (
          <Icon aria-hidden="true" />
        )}
        {/* On a normal card the labels sit on the photo. */}
        {featured ? null : (
          <>
            <div className="post-chips">
              {field}
              {sample}
            </div>
            <span className="chip post-read">
              <Clock aria-hidden="true" />
              {post.minutes} min read
            </span>
          </>
        )}
      </div>
      <div className="post-body">
        {featured ? (
          <div className="post-kicker">
            <span className="chip latest">Latest</span>
            {field}
            {sample}
          </div>
        ) : null}
        <h3>
          <span>{post.title}</span>
        </h3>
        <p>{post.excerpt}</p>
        <div className="post-foot">
          {featured ? (
            <span className="post-cta">
              Read article
              <b aria-hidden="true">
                <ArrowRight />
              </b>
            </span>
          ) : null}
          <div className="post-meta">
            <span>{post.date}</span>
            <i aria-hidden="true" />
            <span>{post.time}</span>
            {featured ? (
              <>
                <i aria-hidden="true" />
                <span>{post.minutes} min read</span>
              </>
            ) : null}
          </div>
          {featured ? null : (
            <span className="post-go" aria-hidden="true">
              <ArrowRight />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
