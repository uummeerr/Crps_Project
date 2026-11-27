// Scroll progress for the scenes, measured by GSAP's ScrollTrigger.
//
// GSAP is used here only to MEASURE: it works out how far an element has
// travelled through the viewport and writes that as a number from 0 to 1 into
// a CSS variable, --p, on the element. The stylesheet does all the moving.
// GSAP never animates an element directly, because it would take over the
// `translate`, `scale` and `rotate` properties that the hover and reveal
// effects in globals.css rely on.

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onLenis, onRoute } from "./scroll";

// Scenes run only when the visitor has not asked for reduced motion.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
// Pinned scenes also need a wide screen; below this they fall back to a
// normal stacked layout (the stylesheet uses the same breakpoint).
export const WIDE_AND_MOTION_OK = "(min-width: 1081px) and (prefers-reduced-motion: no-preference)";

let ready = false;

function setup() {
  if (ready) return;
  ready = true;
  gsap.registerPlugin(ScrollTrigger);
  // Lenis moves the page a little every frame; tell ScrollTrigger each time.
  onLenis((lenis) => lenis?.on("scroll", ScrollTrigger.update));
  // Positions are cached, so measure again when the page or the fonts change.
  onRoute(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

// Tracks `ref`'s element through the viewport and keeps --p on it up to date.
//   start, end   ScrollTrigger positions, e.g. "top bottom" = when the top of
//                the element reaches the bottom of the viewport
//   media        only runs while this media query matches
//   onProgress   optional; called with the same number (and with null when
//                the scene is switched off). Pass a stable function.
//   variable     the CSS variable to write. A wrapper around other scenes
//                should use its own name: --p is inherited, so a scene inside
//                that had not set it yet would read the wrapper's.
export function useProgress(
  ref,
  { start = "top bottom", end = "bottom top", media = MOTION_OK, onProgress, variable = "--p" } = {},
) {
  // A layout effect, so the scene is torn down before the page is hidden on
  // navigation and rebuilt as soon as it is shown again.
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    setup();

    const queries = gsap.matchMedia();
    queries.add(media, () => {
      const write = (self) => {
        element.style.setProperty(variable, self.progress.toFixed(4));
        onProgress?.(self.progress);
      };
      const trigger = ScrollTrigger.create({ trigger: element, start, end, onUpdate: write, onRefresh: write });
      write(trigger);
      return () => {
        trigger.kill();
        element.style.removeProperty(variable);
        onProgress?.(null);
      };
    });
    return () => queries.revert();
  }, [ref, start, end, media, onProgress, variable]);
}
