"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2, Mail, MessageCircle } from "lucide-react";

// The share row at the foot of an article. WhatsApp and Email are ordinary
// links, so they work without JavaScript; "Copy link" needs it.
//   title   the article's title
//   url     the article's full address
export default function ShareLinks({ title, url }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // The browser refused clipboard access; the address bar still has the link.
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  }

  const message = encodeURIComponent(`${title} ${url}`);

  return (
    <div className="share">
      <span className="share-label">Share</span>
      <button type="button" className={`pill-link${copied ? " done" : ""}`} onClick={copy}>
        {copied ? <Check aria-hidden="true" /> : <Link2 aria-hidden="true" />}
        <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
      </button>
      <a className="pill-link" href={`https://wa.me/?text=${message}`} target="_blank" rel="noopener noreferrer">
        <MessageCircle aria-hidden="true" />
        WhatsApp
      </a>
      <a className="pill-link" href={`mailto:?subject=${encodeURIComponent(title)}&body=${message}`}>
        <Mail aria-hidden="true" />
        Email
      </a>
    </div>
  );
}
