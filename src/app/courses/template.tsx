import { ViewTransition } from "react";
import { BloomOrigin } from "@/components/ui/bloom-origin";

/**
 * The root template only remounts when the first URL segment changes, so
 * /courses ↔ /courses/[slug] (and course → course) had no page transition —
 * only the card's plate/title morph. This segment template remounts on those
 * navigations, giving them the same arrival (and pressure bloom) as the rest
 * of the site, with the shared morph playing on top.
 */
export default function CoursesTemplate({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>
        <BloomOrigin />
        {children}
      </div>
    </ViewTransition>
  );
}
