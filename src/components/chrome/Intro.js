"use client";

import { useEffect } from "react";
import { site } from "@/content/site";

// The opening shown once per browser session: the doctor's name sets in, a
// line draws under it, then the cover lifts to reveal the page.
//
// It is all CSS (see "Intro" in motion.css). A tiny script in layout.js marks
// <html data-intro="play"> on the first page of a session, before anything is
// painted; the cover is only visible while that mark is there, and the hero's
// own entrance waits for it. This component's one job is to remove the mark
// afterwards, so later pages in the same visit open normally.
//
// Never shown without JavaScript or with reduced motion.

// The cover takes about 1.9s; the hero's entrance has finished by about 4s.
const CLEAR_AFTER_MS = 4200;

export default function Intro() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro !== "play") return undefined;
    const timer = window.setTimeout(() => {
      delete root.dataset.intro;
    }, CLEAR_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-inner">
        <span className="intro-role">{site.role}</span>
        <span className="intro-name">{site.name}</span>
        <span className="intro-line" />
      </div>
    </div>
  );
}
