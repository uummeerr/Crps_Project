"use client";

import { useCallback, useRef, useState } from "react";
import { useProgress, WIDE_AND_MOTION_OK } from "@/lib/gsap";
import { sceneState } from "./sceneState";

// "Follow the signal": the full-screen story chapter on the home page.
//
// On a wide screen the chapter is tall and its stage sticks to the viewport
// (CSS `position: sticky`, see ".chapter" in motion.css). As the visitor
// scrolls through it, the four steps take turns beside the heading. On smaller
// screens or with reduced motion, the chapter is a normal dark section with
// all four steps listed.
//
// It also reports the scroll position to sceneState. Only HomeScene (the 3D
// sculpture, which the home page no longer renders) reads that, to darken the
// page and change shape for each step.
//
// steps: [{ label, title, text }]

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const ramp = (from, to, value) => {
  const x = clamp01((value - from) / (to - from));
  return x * x * (3 - 2 * x);
};

export default function StoryChapter({ steps }) {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);
  const count = steps.length;

  const onProgress = useCallback(
    (progress) => {
      const section = sectionRef.current;
      if (progress === null || !section) {
        // Scene switched off: hand the sculpture back to the hero.
        sceneState.shape = 0;
        sceneState.chapter = 0;
        section?.style.removeProperty("--dark");
        section?.style.removeProperty("--pin");
        return;
      }
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      // arriving: 0 when the chapter's top edge enters from below, 1 when it
      //           reaches the top and the stage sticks
      // pinned:   0 to 1 across the time the stage is stuck
      // leaving:  0 when the chapter's bottom edge reaches the bottom of the
      //           screen, 1 when it has scrolled away
      const arriving = clamp01((viewport - rect.top) / viewport);
      const pinned = clamp01(-rect.top / Math.max(1, rect.height - viewport));
      const leaving = clamp01((viewport - rect.bottom) / viewport);

      const dark = Math.min(ramp(0.3, 0.95, arriving), 1 - ramp(0.05, 0.7, leaving));
      // Shapes: 0 aura, then one per step (1 to 4), then 5, the calm wave.
      let shape = ramp(0.45, 1, arriving);
      if (arriving >= 1) shape = 1 + pinned * (count - 1);
      if (leaving > 0) shape = count + ramp(0, 0.8, leaving);

      sceneState.chapter = dark;
      sceneState.shape = shape;
      section.style.setProperty("--dark", dark.toFixed(3));
      section.style.setProperty("--pin", pinned.toFixed(4));
      setActive(Math.min(count - 1, Math.round(pinned * (count - 1))));
    },
    [count],
  );
  // Wide screens only: below that the chapter is not pinned, and it must not
  // darken the page or move the sculpture.
  useProgress(sectionRef, { start: "top bottom", end: "bottom top", media: WIDE_AND_MOTION_OK, onProgress });

  return (
    <section className="chapter" ref={sectionRef} aria-labelledby="chapter-title">
      <div className="chapter-stage">
        <div className="wrap chapter-grid">
          <div>
            <span className="eyebrow">Follow the signal</span>
            <h2 id="chapter-title">
              From a single trigger to a <span className="serif">treatment plan.</span>
            </h2>
          </div>
          <div>
            <ol className="chapter-steps">
              {steps.map((step, index) => (
                <li key={step.label} className={index === active ? "on" : index < active ? "done" : undefined}>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  <div>
                    <strong>{step.label}</strong>
                    <div className="chapter-detail">
                      <div>
                        <h3>{step.title}</h3>
                        <p>{step.text}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="chapter-bar" aria-hidden="true">
              <i />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
