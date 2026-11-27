"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useProgress } from "@/lib/gsap";

// "A physician, a teacher and a researcher": the three roles in the home
// page's About section.
//
// On a wide screen the heading stays in place on the left while the three
// cards on the right stack up like a deck: each new card slides over the one
// before it, which shrinks back a little and dims. The role being shown is
// the one picked out in the heading. The stacking itself is CSS
// (`position: sticky`, see ".about-card" in home-about.css); this component
// only measures how far each card is covered and which one is in front.
//
// On smaller or very short screens, and with reduced motion, it is a plain
// list: heading first, then the three cards one after another.
//
// pillars: [{ tag, title, text, href, cta }]   quote: shown on the last card
// more: { href, label } for the button under the heading

// Must match the media query for the stacked version in home-about.css.
const STACK_OK = "(min-width: 1081px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)";
// Space between cards before they stack, and how much of a covered card
// stays visible above the next one (both in px; passed to the CSS as well).
const GAP = 28;
const STEP = 16;

// Photo for each card, in the order of `pillars`. The last card shows the
// quote instead.
const PHOTOS = [
  { src: "/images/c-arm.jpg", alt: "C-arm X-ray machine used to guide pain procedures", position: "50% 38%" },
  { src: "/images/training-lab-stations.jpg", alt: "Training lab with numbered procedure stations", position: "50% 62%" },
];

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const two = (number) => String(number).padStart(2, "0");

export default function AboutRoles({ pillars, quote, more }) {
  const stackRef = useRef(null);
  // The card in front, or -1 while the cards are not stacking (then every
  // role in the heading is picked out).
  const [front, setFront] = useState(-1);
  const stacking = front >= 0;

  const onProgress = useCallback((progress) => {
    const stack = stackRef.current;
    if (!stack) return;
    const cards = [...stack.children];
    if (progress === null) {
      cards.forEach((card) => card.style.removeProperty("--cover"));
      setFront(-1);
      return;
    }
    const tops = cards.map((card) => card.getBoundingClientRect().top);
    const frontLine = window.innerHeight * 0.58;
    let current = 0;
    cards.forEach((card, index) => {
      if (tops[index] < frontLine) current = index;
      if (index === cards.length - 1) return;
      // The next card starts one card height (plus the gap) below this one,
      // and ends STEP below it. cover: 0 at the start, 1 at the end.
      const apart = card.offsetHeight + GAP;
      const cover = clamp01((apart - (tops[index + 1] - tops[index])) / (apart - STEP));
      card.style.setProperty("--cover", cover.toFixed(3));
    });
    setFront(current);
  }, []);
  useProgress(stackRef, { start: "top bottom", end: "bottom top", media: STACK_OK, onProgress });

  const role = (index) => (
    <span className={`role${!stacking || front === index ? " on" : ""}`}>{pillars[index].tag.toLowerCase()}</span>
  );

  return (
    <div className="about-roles" data-stacking={stacking ? "" : undefined}>
      <div className="about-side">
        <p className="about-meter" aria-hidden="true">
          <b>{two(Math.max(0, front) + 1)}</b>
          <span>/ {two(pillars.length)}</span>
          <span className="about-ticks">
            {pillars.map((pillar, index) => (
              <i key={pillar.tag} className={index <= front ? "on" : undefined} />
            ))}
          </span>
        </p>
        <h2 id="about-title" className="about-title" data-reveal>
          A {role(0)}, a {role(1)} and a {role(2)}.
        </h2>
        <p data-reveal style={{ "--d": "120ms" }}>
          <Link className="btn btn-primary" href={more.href}>
            {more.label}
            <span className="btn-dot" aria-hidden="true">
              <ArrowUpRight />
            </span>
          </Link>
        </p>
      </div>

      <ol className="about-stack" ref={stackRef} style={{ "--gap": `${GAP}px`, "--step": `${STEP}px` }}>
        {pillars.map((pillar, index) => {
          const photo = PHOTOS[index];
          return (
            <li className={`about-card${photo ? "" : " night"}`} key={pillar.tag} style={{ "--i": index }} data-reveal>
              <div className="about-media">
                {photo ? (
                  <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 1080px) 100vw, 700px" style={{ objectPosition: photo.position }} />
                ) : (
                  <blockquote>
                    <small>In his words</small>
                    “{quote}”
                  </blockquote>
                )}
                <span className="about-num" aria-hidden="true">
                  {two(index + 1)}
                </span>
              </div>
              <div className="about-body">
                <div>
                  <span className="tag">{pillar.tag}</span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </div>
                <Link className="link" href={pillar.href}>
                  {pillar.cta}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
