import { ViewTransition } from "react";

/**
 * Templates remount on every navigation, so this boundary gets a real
 * exit (old page) and enter (new page) inside Next's navigation transition.
 * `default="none"` keeps it out of every other transition (the course
 * filter, Suspense reveals). Browsers without the View Transitions API —
 * and reduced-motion users (see motion.css) — navigate instantly.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
