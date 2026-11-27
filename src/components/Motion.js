"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { isShown, routeChanged, setLenis } from "@/lib/scroll";

// Site-wide motion, set up once per page:
//   - smooth scrolling (Lenis)
//   - reveal on scroll: adds .is-in to [data-reveal], [data-stagger] and
//     .words when they enter the viewport (the animations live in globals.css)
//   - [data-count="25"]: counts up to the number when it comes into view
//   - [data-parallax="0.08"]: drifts an image inside its frame while scrolling
//   - .spot and [data-tilt]: pointer-following highlight and 3D tilt on cards
//   - the menu shrinks to a small pill (logo + "Book a consultation") as soon
//     as the page is scrolled, and opens out again on hover or when back at
//     the top. On small screens the bar is instead hidden while scrolling
//     down past the page's opening header, and returns when scrolling up.
//   - shares the smooth scroller with the scroll scenes, and tells them when
//     a new page has been shown (lib/scroll.js)
// The page you navigated away from stays in the document, hidden, so anything
// found with querySelector is filtered with isShown() first.
// With "reduce motion" turned on, only the reveal classes are applied, and the
// stylesheet shows everything without animating.
export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let lenis;
    let lenisFrame = 0;
    let scrollFrame = 0;
    let lastY = window.scrollY;
    let tilted = null;

    function countUp(element) {
      const target = Number(element.dataset.count);
      if (!Number.isFinite(target)) return;
      if (reduce) {
        element.textContent = target.toLocaleString("en-US");
        return;
      }
      const started = performance.now();
      const duration = 1600;
      function step(now) {
        const progress = Math.min(1, (now - started) / duration);
        const eased = 1 - Math.pow(1 - progress, 4);
        element.textContent = Math.round(target * eased).toLocaleString("en-US");
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          if (entry.target.dataset.count) countUp(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    document
      .querySelectorAll("[data-reveal], [data-stagger], .words:not([data-load]), [data-count]")
      .forEach((element) => observer.observe(element));

    const drifting = reduce
      ? []
      : [...document.querySelectorAll("[data-parallax]")].filter(isShown).map((element) => ({
          element,
          frame: element.parentElement,
          speed: Number(element.dataset.parallax) || 0.08,
        }));

    // The opening header of the route: the home hero, a page header, or the
    // header at the top of a blog article.
    const opening = [...document.querySelectorAll("main :is(.hero, .page-head, .article-head, .notfound)")].find(isShown);

    function onScrollFrame() {
      scrollFrame = 0;
      const y = window.scrollY;
      const viewport = window.innerHeight;

      const scrolled = y > 24;
      root.toggleAttribute("data-scrolled", scrolled);
      // Compact as soon as the page has been scrolled at all, even while the
      // opening header is still in view.
      if (scrolled) root.dataset.nav = "compact";
      else delete root.dataset.nav;
      // Small screens only: once the bottom of the opening header has passed
      // under the menu bar (about 90px from the top), hide while scrolling
      // down and show on the way up.
      const pastHero = opening ? opening.getBoundingClientRect().bottom < 90 : y > 520;
      if (pastHero && y > lastY + 6) root.dataset.navAway = "";
      else if (!pastHero || y < lastY - 6) delete root.dataset.navAway;
      lastY = y;

      drifting.forEach(({ element, frame, speed }) => {
        const rect = frame.getBoundingClientRect();
        if (rect.bottom < -80 || rect.top > viewport + 80) return;
        // The image is scaled up a little in CSS; stay inside that margin.
        const limit = rect.height * 0.055;
        const offset = (rect.top + rect.height / 2 - viewport / 2) * speed;
        element.style.translate = `0 ${Math.max(-limit, Math.min(limit, offset)).toFixed(1)}px`;
      });
    }
    function onScroll() {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(onScrollFrame);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScrollFrame();

    function resetTilt() {
      if (!tilted) return;
      tilted.style.removeProperty("--rx");
      tilted.style.removeProperty("--ry");
      tilted = null;
    }
    function onPointerMove(event) {
      const target = event.target instanceof Element ? event.target : null;
      const spot = target?.closest(".spot");
      if (spot) {
        const rect = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        spot.style.setProperty("--my", `${event.clientY - rect.top}px`);
      }
      const tilt = target?.closest("[data-tilt]") ?? null;
      if (tilt !== tilted) resetTilt();
      if (tilt) {
        tilted = tilt;
        const rect = tilt.getBoundingClientRect();
        const across = (event.clientX - rect.left) / rect.width - 0.5;
        const down = (event.clientY - rect.top) / rect.height - 0.5;
        tilt.style.setProperty("--ry", `${(across * 5).toFixed(2)}deg`);
        tilt.style.setProperty("--rx", `${(-down * 5).toFixed(2)}deg`);
      }
    }
    if (finePointer && !reduce) {
      document.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    if (!reduce) {
      lenis = new Lenis({
        autoRaf: false,
        lerp: 0.09,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
        stopInertiaOnNavigate: true,
      });
      setLenis(lenis);
      const tick = (time) => {
        lenis.raf(time);
        lenisFrame = requestAnimationFrame(tick);
      };
      lenisFrame = requestAnimationFrame(tick);
    }

    // Let the scroll scenes measure the page that has just been shown.
    routeChanged();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(scrollFrame);
      cancelAnimationFrame(lenisFrame);
      if (lenis) setLenis(null);
      lenis?.destroy();
      resetTilt();
      delete root.dataset.nav;
      delete root.dataset.navAway;
    };
  }, [pathname]);

  return null;
}
