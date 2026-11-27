"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// A slight lean on the main buttons toward the pointer while it is over them.
// The button moves by a few pixels at most and only while already hovered, so
// the thing being clicked never slides out from under the pointer.
//
// Does not run on touch screens or with reduced motion. Styles: "Button lean"
// in motion.css.

// The menu's button is left out: it lives inside a pill that clips its edges.
const MAGNETIC = ".btn-primary, .btn-mint";
const LEAN_X = 6; // most a button moves sideways, in px
const LEAN_Y = 4;

export default function ButtonLean() {
  const pathname = usePathname();

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return undefined;

    let leaning = null;

    function straighten() {
      if (!leaning) return;
      leaning.style.removeProperty("--lean-x");
      leaning.style.removeProperty("--lean-y");
      leaning = null;
    }

    function onMove(event) {
      const target = event.target instanceof Element ? event.target : null;
      const button = target?.closest(MAGNETIC) ?? null;
      if (button !== leaning) straighten();
      if (button) {
        leaning = button;
        const box = button.getBoundingClientRect();
        const across = (event.clientX - box.left) / box.width - 0.5;
        const down = (event.clientY - box.top) / box.height - 0.5;
        button.style.setProperty("--lean-x", `${(across * 2 * LEAN_X).toFixed(1)}px`);
        button.style.setProperty("--lean-y", `${(down * 2 * LEAN_Y).toFixed(1)}px`);
      }
    }

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", straighten);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", straighten);
      straighten();
    };
    // Re-run on navigation so a button that was leaning is always released.
  }, [pathname]);

  return null;
}
