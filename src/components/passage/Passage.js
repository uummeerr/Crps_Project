"use client";

import { useCallback, useEffect, useRef } from "react";
import "@/app/passage.css";
import { MOTION_OK, useProgress } from "@/lib/gsap";
import { createFilm } from "./film";

// The lower half of the home page, from "Follow the signal" to "Book a
// consultation", with a film behind it that the scroll plays forward and
// back: into the scanner, up the stimulator leads, along the nerve fibres.
//
// The film is a run of still frames painted on a canvas (film.js). The canvas
// sticks to the screen for as long as this wrapper is on it, and the sections
// inside turn see-through and dark so the film shows between them (see
// passage.css). All of that hangs on <html data-passage="on">, which is set
// only once the film's first frame has arrived.
//
// So the page looks exactly as it does without the film when the visitor has
// asked for reduced motion or to save data, on a device short of memory, and
// if the frames fail to load.
//
// The frames are made by scripts/build-passage-film.sh; the credits for the
// footage are in content/stock.js.

// One film for landscape screens and one cut to portrait for phones.
// `count` is the number of frames in the folder (the build script prints it).
const FILMS = {
  wide: { base: "/passage/d", count: 294 },
  tall: { base: "/passage/m", count: 177 },
};
const TALL = "(max-width: 760px) and (orientation: portrait)";
// How far through the film the first act runs: the scanner, up to the point
// where its tunnel fills the screen (12.2 s of 29.4 s). The first act plays
// while "Follow the signal" is on screen, the rest over the sections after it.
const FIRST_ACT = 0.414;

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const ramp = (from, to, value) => {
  const x = clamp01((value - from) / (to - from));
  return x * x * (3 - 2 * x);
};

export default function Passage({ children }) {
  const zoneRef = useRef(null);
  const layerRef = useRef(null);
  const canvasRef = useRef(null);
  // The film being shown and its frame count, once it is running.
  const filmRef = useRef(null);

  // Works out, from where the wrapper is on screen, which frame to show and
  // how much of the film to let through. Called on every scroll update.
  const update = useCallback(() => {
    const zone = zoneRef.current;
    const layer = layerRef.current;
    const running = filmRef.current;
    if (!zone || !layer || !running) return;

    const view = window.innerHeight;
    const rect = zone.getBoundingClientRect();
    const chapter = zone.querySelector(".chapter");
    // All in pixels scrolled since the wrapper's top edge came up from the
    // bottom of the screen:
    const travelled = view - rect.top;
    const end = rect.height; // its bottom edge reaches the bottom of the screen
    const chapterHeight = chapter ? chapter.offsetHeight : view * 2;
    const actStart = Math.min(view, chapterHeight * 0.4); // the chapter has arrived
    const actEnd = Math.max(chapterHeight, actStart + 1); // the chapter starts to leave

    const through =
      travelled <= actEnd
        ? FIRST_ACT * clamp01((travelled - actStart) / (actEnd - actStart))
        : FIRST_ACT + (1 - FIRST_ACT) * clamp01((travelled - actEnd) / Math.max(1, end - actEnd));
    running.film.show(through * (running.count - 1));

    // The film is left clear in the chapter and behind the closing band, and
    // dimmed where there is a lot to read in between.
    const inChapter = ramp(actStart * 0.5, actStart, travelled) * (1 - ramp(actEnd - view * 0.5, actEnd + view * 0.2, travelled));
    const atEnd = ramp(end - view * 0.95, end - view * 0.35, travelled);
    layer.style.setProperty("--open", Math.max(inChapter, atEnd).toFixed(3));
    // The "Illustrative footage" label shows only with the scanner.
    layer.style.setProperty("--note", inChapter.toFixed(3));
  }, []);
  useProgress(zoneRef, { start: "top bottom", end: "bottom bottom", media: MOTION_OK, onProgress: update, variable: "--zone" });

  useEffect(() => {
    const zone = zoneRef.current;
    const canvas = canvasRef.current;
    if (!zone || !canvas) return undefined;
    const root = document.documentElement;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const savingData = navigator.connection?.saveData === true;
    const shortOfMemory = typeof navigator.deviceMemory === "number" && navigator.deviceMemory < 4;
    if (reduced || savingData || shortOfMemory) return undefined;

    const tall = window.matchMedia(TALL);
    let film = null;
    let near = false;

    function load() {
      film?.destroy();
      filmRef.current = null;
      const spec = tall.matches ? FILMS.tall : FILMS.wide;
      const created = createFilm(canvas, {
        ...spec,
        onFirstFrame() {
          filmRef.current = { film: created, count: spec.count };
          root.dataset.passage = "on";
          // The canvas has only now been given its size by the stylesheet.
          created.resize();
          update();
        },
        onError() {
          filmRef.current = null;
          delete root.dataset.passage;
        },
      });
      film = created;
      if (near) film.start();
    }
    load();

    // Fetch nothing until the wrapper is within two screens of the viewport.
    const approach = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        near = true;
        film.start();
        approach.disconnect();
      },
      { rootMargin: "200% 0px" },
    );
    approach.observe(zone);

    const sizes = new ResizeObserver(() => {
      film.resize();
      update();
    });
    sizes.observe(canvas);
    // Turning a phone on its side swaps to the other film.
    tall.addEventListener("change", load);

    return () => {
      approach.disconnect();
      sizes.disconnect();
      tall.removeEventListener("change", load);
      film?.destroy();
      filmRef.current = null;
      delete root.dataset.passage;
    };
  }, [update]);

  return (
    <div className="passage" ref={zoneRef}>
      {/* The outer box covers the whole wrapper; the screen inside it sticks
          to the viewport and can never leave the wrapper. */}
      <div className="passage-film" ref={layerRef} aria-hidden="true">
        <div className="passage-screen">
          <canvas ref={canvasRef} />
          <span className="passage-note">Illustrative footage</span>
        </div>
      </div>
      {children}
    </div>
  );
}
