"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SearchX, X } from "lucide-react";
import BlogCard from "./BlogCard";

// The blog index: a toolbar with a filter button for each field and a search
// box, then the posts. Filtering happens in the browser, so it is instant.
// Styles are in app/blog.css.
export default function BlogList({ posts, fields }) {
  const [field, setField] = useState("all");
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  // Pressing "/" anywhere on the page jumps to the search box.
  useEffect(() => {
    function onKey(event) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      const input = inputRef.current;
      // A page left behind by navigation can still be in the document, hidden.
      if (!input || !input.getClientRects().length) return;
      event.preventDefault();
      input.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const term = query.trim();
  const shown = useMemo(() => {
    const words = term.toLowerCase().split(/\s+/).filter(Boolean);
    return posts.filter((post) => {
      if (field !== "all" && post.field !== field) return false;
      const text = `${post.title} ${post.excerpt} ${post.fieldLabel}`.toLowerCase();
      return words.every((word) => text.includes(word));
    });
  }, [posts, field, term]);

  // The newest post is shown large only on the unfiltered list.
  const filtered = field !== "all" || Boolean(term);
  const lead = filtered ? null : shown[0];
  const rest = lead ? shown.slice(1) : shown;
  const activeLabel = fields.find((item) => item.key === field)?.label;
  // Changes whenever the filter does, which restarts the entrance animation.
  const view = `${field}|${term}`;

  function reset() {
    setField("all");
    setQuery("");
  }

  return (
    <>
      <div className="blog-bar">
        <div className="filters" role="group" aria-label="Filter articles by field">
          <button type="button" className="filter" aria-pressed={field === "all"} onClick={() => setField("all")}>
            All
            <b>{posts.length}</b>
          </button>
          {fields.map((item) => (
            <button
              key={item.key}
              type="button"
              className="filter"
              style={{ "--h": item.hue }}
              aria-pressed={field === item.key}
              onClick={() => setField(item.key)}
            >
              {item.label}
              <b>{item.count}</b>
            </button>
          ))}
        </div>
        <div className="search">
          <Search aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              // Escape clears the box first, then leaves it.
              if (event.key !== "Escape") return;
              if (query) setQuery("");
              else event.currentTarget.blur();
            }}
            placeholder="Search articles"
            aria-label="Search articles"
            aria-keyshortcuts="/"
          />
          {query ? (
            <button
              type="button"
              className="search-clear"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
            >
              <X aria-hidden="true" />
            </button>
          ) : (
            <kbd aria-hidden="true">/</kbd>
          )}
        </div>
      </div>

      <div className="blog-status">
        <p aria-live="polite">
          <strong>{shown.length}</strong> {shown.length === 1 ? "article" : "articles"}
          {activeLabel ? ` in ${activeLabel}` : ""}
          {term ? ` matching “${term}”` : ""}
        </p>
        {filtered ? (
          <button type="button" className="blog-reset" onClick={reset}>
            <X aria-hidden="true" />
            Clear filters
          </button>
        ) : null}
      </div>

      {shown.length ? (
        <>
          {lead ? (
            <div className="blog-lead fresh" key={`lead|${view}`}>
              <BlogCard post={lead} featured />
            </div>
          ) : null}
          {rest.length ? (
            <div className="blog-grid fresh" key={view}>
              {rest.map((post, index) => (
                <BlogCard key={post.slug} post={post} order={Math.min(index + (lead ? 1 : 0), 8)} />
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <div className="empty">
          <span className="empty-icon" aria-hidden="true">
            <SearchX />
          </span>
          <strong>No articles found</strong>
          Try a different field or a shorter search.
          <button type="button" className="btn btn-light" onClick={reset}>
            Show all articles
          </button>
        </div>
      )}
    </>
  );
}
