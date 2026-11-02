import type { Metadata } from "next";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/home/hero";
import { AudiencePaths } from "@/components/sections/home/audience-paths";
import { ProgramsSection } from "@/components/sections/home/programs";
import { FounderSection } from "@/components/sections/home/founder";
import { CenterTeaser } from "@/components/sections/home/center-teaser";
import { HomeContacts } from "@/components/sections/home/home-contacts";
import { Seam } from "@/components/ui/seam";

export const metadata: Metadata = pageMetadata({
  description: site.description,
  path: "/",
});

/**
 * Six sections, each with one job:
 * identity → the two ways in → selected courses → Marina → the centre → contacts.
 * Products, partners and reviews have their own pages and are not repeated here.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <AudiencePaths />
      <ProgramsSection />
      <Seam side="left" />
      <FounderSection />
      <CenterTeaser />
      <Seam side="right" />
      <HomeContacts />
    </>
  );
}
