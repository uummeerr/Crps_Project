import { pages, site } from "@/content/site";
import { getPosts } from "@/lib/blog";

export default function sitemap() {
  const fixed = ["/", ...pages.map((item) => item.href)].map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    changeFrequency: path === "/blog" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
  const articles = getPosts().map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: "yearly",
    priority: 0.6,
  }));
  return [...fixed, ...articles];
}
