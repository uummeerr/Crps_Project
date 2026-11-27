"use client";

import { useRef } from "react";
import { useProgress } from "@/lib/gsap";

// A wrapper that knows how far it has scrolled through the viewport. It keeps
// a CSS variable, --p (0 to 1), on its own element; rules in motion.css turn
// that number into movement for whatever is inside.
//
//   <Progress className="grow" start="top 92%" end="center 55%">…</Progress>
//
// `as` picks the element (div by default); `start`, `end` and `media` are
// passed to useProgress in lib/gsap.js. With reduced motion on, --p is never
// set, and each rule's fallback value leaves the content in its finished state.
export default function Progress({ as: Tag = "div", start, end, media, children, ...rest }) {
  const ref = useRef(null);
  useProgress(ref, { start, end, media });

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
