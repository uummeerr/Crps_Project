"use client";

import { useRef } from "react";
import { useProgress, WIDE_AND_MOTION_OK } from "@/lib/gsap";

// A row of panels that travels sideways while the visitor scrolls down.
//
// On a wide screen the section is tall and its inner stage sticks to the
// viewport (CSS `position: sticky`, see ".rail" in motion.css). Scroll
// progress through the section is written to --p, and the stylesheet slides
// the row by that amount. The section's height is set in CSS from `count`,
// so there is nothing to measure.
//
// Below 1081px, and with reduced motion, nothing is pinned: the row is an
// ordinary swipeable strip with scroll-snap.
//
//   head     heading block shown above the row
//   count    number of panels (drives the section's height)
//   children the panels; give each the class "rail-panel"
export default function HorizontalRail({ head, count, label, children }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  useProgress(sectionRef, { start: "top top", end: "bottom bottom", media: WIDE_AND_MOTION_OK });

  // Keyboard users can tab to a link in a panel that is still off screen.
  // When that happens, scroll the page to the point where that panel is in
  // view, so focus is never somewhere invisible.
  function onFocus(event) {
    if (!window.matchMedia(WIDE_AND_MOTION_OK).matches) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    const panel = event.target.closest(".rail-panel");
    if (!section || !track || !panel) return;

    const travel = track.scrollWidth - window.innerWidth;
    if (travel <= 0) return;
    const wanted = panel.offsetLeft - (window.innerWidth - panel.offsetWidth) / 2;
    const progress = Math.max(0, Math.min(1, wanted / travel));
    const top = section.getBoundingClientRect().top + window.scrollY;
    const distance = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + progress * distance, behavior: "instant" });
  }

  return (
    <section className="rail" ref={sectionRef} style={{ "--n": count }} aria-label={label}>
      <div className="rail-stage">
        <div className="wrap rail-head">{head}</div>
        <div className="rail-view">
          <div className="rail-track" ref={trackRef} onFocus={onFocus}>
            {children}
          </div>
        </div>
        <div className="wrap rail-foot" aria-hidden="true">
          <div className="rail-bar">
            <i />
          </div>
          <span>Keep scrolling</span>
        </div>
      </div>
    </section>
  );
}
