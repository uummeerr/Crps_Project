// The only place pages read blog posts from. Today the posts live in
// src/content/blog.js; if they later move to a CMS, only this file changes.

import { fields, posts } from "@/content/blog";

// Dates are always shown in India time, whatever the visitor's timezone.
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});
const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Kolkata",
});

const WORDS_PER_MINUTE = 200;

function readMinutes(post) {
  const words = post.sections
    .flatMap((section) => [section.heading ?? "", ...section.paragraphs])
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function prepare(post) {
  const published = new Date(post.publishedAt);
  const field = fields[post.field] ?? { label: post.field, hue: 176 };
  return {
    ...post,
    fieldLabel: field.label,
    hue: field.hue,
    date: dateFormat.format(published),
    time: `${timeFormat.format(published)} IST`,
    minutes: readMinutes(post),
  };
}

// All posts, newest first.
export function getPosts() {
  return posts
    .map(prepare)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export function getPost(slug) {
  return getPosts().find((post) => post.slug === slug) ?? null;
}

// Fields that have at least one post, with how many, in the order they are
// declared in content/blog.js.
export function getFields() {
  const all = getPosts();
  return Object.entries(fields)
    .map(([key, field]) => ({
      key,
      label: field.label,
      hue: field.hue,
      count: all.filter((post) => post.field === key).length,
    }))
    .filter((field) => field.count > 0);
}

// Up to `limit` other posts: the same field first, then the most recent.
export function getRelated(post, limit = 3) {
  const others = getPosts().filter((other) => other.slug !== post.slug);
  const sameField = others.filter((other) => other.field === post.field);
  const rest = others.filter((other) => other.field !== post.field);
  return [...sameField, ...rest].slice(0, limit);
}

// The fields a card needs, without the article body. Used when posts are
// handed to the browser for filtering.
export function toCard(post) {
  const { slug, title, excerpt, field, fieldLabel, hue, date, time, minutes, sample, image } = post;
  return { slug, title, excerpt, field, fieldLabel, hue, date, time, minutes, sample: Boolean(sample), image: image ?? null };
}
