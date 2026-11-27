"use client";

import { useEffect, useSyncExternalStore } from "react";

// A single round dial in the corner that turns the site between light and dark.
// The half-filled disc spins half a turn, and the new theme spreads out of the
// dial as a growing circle (View Transitions, where the browser has them).
// The choice is saved in localStorage; themeScript in layout.js applies it
// before the first paint so there is no flash on load.

const KEY = "theme";
const BG = { light: "#f5faf8", dark: "#041317" };

function read() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function apply(theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {}
}

export default function ThemeDial() {
  const theme = useSyncExternalStore(subscribe, read, () => "light");
  const next = theme === "dark" ? "light" : "dark";

  // Keep the browser's toolbar colour in step with the theme.
  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", BG[theme]);
  }, [theme]);

  function toggle(event) {
    const root = document.documentElement;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || still) {
      apply(next);
      return;
    }
    // Grow the new theme out of the dial's centre to the farthest corner.
    const box = event.currentTarget.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.style.setProperty("--dial-x", `${x}px`);
    root.style.setProperty("--dial-y", `${y}px`);
    root.style.setProperty("--dial-r", `${r}px`);
    // Mark the switch, so the circle reveal in globals.css applies to it and
    // not to page-to-page transitions (which use view transitions too).
    root.dataset.vt = "theme";
    document.startViewTransition(() => apply(next)).finished.finally(() => {
      delete root.dataset.vt;
    });
  }

  return (
    <button
      type="button"
      className="theme-dial"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      <span className="theme-dial-disc" aria-hidden="true" />
    </button>
  );
}
