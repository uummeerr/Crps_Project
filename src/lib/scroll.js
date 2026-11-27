// A tiny meeting point between the site-wide motion script and the scroll
// scenes. Motion.js creates the smooth scroller (Lenis) and announces route
// changes here; scenes subscribe. This keeps the animation library out of the
// layout: only pages that have scenes load it.

let lenis = null;
const lenisListeners = new Set();
const routeListeners = new Set();

// Called by Motion.js with the new scroller, or with null when it is removed.
export function setLenis(next) {
  lenis = next;
  lenisListeners.forEach((listener) => listener(lenis));
}

export function getLenis() {
  return lenis;
}

// Runs `listener` now if a scroller exists, and again each time it changes.
export function onLenis(listener) {
  lenisListeners.add(listener);
  if (lenis) listener(lenis);
  return () => lenisListeners.delete(listener);
}

// Called by Motion.js after each navigation, once the new page is in place.
export function routeChanged() {
  routeListeners.forEach((listener) => listener());
}

export function onRoute(listener) {
  routeListeners.add(listener);
  return () => routeListeners.delete(listener);
}

// True when an element is actually on the page. With Cache Components, the
// page you navigated away from stays in the document, hidden, so a plain
// querySelector can return an element nobody can see.
export function isShown(element) {
  return element.getClientRects().length > 0;
}
