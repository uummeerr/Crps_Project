import { ViewTransition } from "react";

// Wraps one page's content so moving between pages animates: the old page
// fades and lifts away, the new one fades and rises in. The keyframes are in
// motion.css under "Page transitions".
//
// This has to wrap each page, not the layout: the layout stays in place during
// a navigation, so an enter or exit would never fire there.
// (node_modules/next/dist/docs/01-app/02-guides/view-transitions.md)
//
// The single <div> matters: React gives every top-level child of the boundary
// its own transition, and a page has many sections.
export default function PageTransition({ children }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div className="page">{children}</div>
    </ViewTransition>
  );
}
