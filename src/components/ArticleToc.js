"use client";

import { useEffect, useRef, useState } from "react";

// How far down the window a section's top must reach to count as "being read".
const READING_LINE = 170;

// "In this article": a link to each headed section, with the one being read
// marked. Shown beside the article on wide screens.
//   items   [{ id: "what-early-treatment-looks-like", label: "What early treatment looks like" }, ...]
// Styles are in app/blog.css under ".toc".
export default function ArticleToc({ items }) {
  const ref = useRef(null);
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    // Look only inside this article: a page left behind by navigation can
    // still be in the document, hidden, with the same section names.
    const scope = ref.current?.closest(".article-grid");
    const parts = scope ? items.map((item) => scope.querySelector(`#${CSS.escape(item.id)}`)).filter(Boolean) : [];
    if (!parts.length) return;

    let frame = 0;
    function update() {
      frame = 0;
      let current = parts[0].id;
      for (const part of parts) {
        if (part.getBoundingClientRect().top <= READING_LINE) current = part.id;
      }
      setActive(current);
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav className="toc" aria-label="In this article" ref={ref}>
      <small>In this article</small>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} aria-current={active === item.id ? "true" : undefined}>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
