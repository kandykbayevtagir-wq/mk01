import { MapPin } from "lucide-react";
import { locations, site } from "@/data/site";
import { plural } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import { Parallax } from "@/components/ui/parallax";
import { Visual } from "@/components/ui/visual";
import { MotionRegion } from "@/components/ui/motion-region";
import { ArchLines } from "@/components/ui/podo-art";

function delay(ms: number) {
  return { "--enter-delay": `${ms}ms` } as React.CSSProperties;
}

/**
 * Hero: identity and a one-line introduction — no buttons. The two ways in
 * (learn / visit the centre) are the very next section, so nothing is
 * offered twice.
 *
 * Motion: short CSS-only entrance; the headline only moves, it never fades
 * (LCP-safe). The single ambient layer is the live pressure map (canvas,
 * paused offscreen, off with reduced motion and on low-capability devices).
 */
export function Hero() {
  return (
    <MotionRegion as="section" aria-labelledby="hero-title" className="motion-hero relative isolate overflow-hidden">
      {/* Backdrop: soft-gray panel (mobile: behind the visual; desktop: right third) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hero-mist absolute inset-x-0 bottom-0 top-[52%] bg-mist sm:top-[46%] lg:inset-y-0 lg:left-auto lg:w-[38%]">
          <div className="hero-mist-light" />
          <div className="pattern-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)] lg:[mask-image:linear-gradient(to_left,black,transparent)]" />
        </div>
        <ArchLines draw accent className="draw-now absolute -bottom-1 -left-24 h-28 w-[300px] max-lg:hidden" count={8} />
      </div>

      <Container className="relative pb-10 pt-7 sm:pt-10 lg:pb-24 lg:pt-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-6">
          {/* Copy */}
          <div className="flex flex-col lg:col-span-7 lg:pr-8">
            <div className="enter-soft" style={delay(0)}>
              <Eyebrow>{site.name} · Актобе</Eyebrow>
            </div>
            <h1
              id="hero-title"
              className="kinetic-title mt-4 text-display font-semibold lg:mt-7 lg:text-[length:clamp(3rem,5vw,4.875rem)]"
              style={delay(40)}
            >
              <span className="kinetic-line" style={delay(40)}>Профессиональное</span>{" "}
              <span className="kinetic-line" style={delay(125)}>
                обучение{" "}
                <span className="relative inline-block">
                  подологии
                  <svg aria-hidden viewBox="0 0 200 24" preserveAspectRatio="none" className="hero-underline">
                    <path d="M3 20 C 60 2, 140 2, 197 20" pathLength={1} />
                  </svg>
                </span>
                <span className="text-accent">.</span>
              </span>
            </h1>
            <p className="enter mt-4 max-w-[34ch] text-lead text-muted lg:mt-7 lg:max-w-xl" style={delay(110)}>
              Курсы подологии для специалистов и центр подологии в Актобе.
            </p>
          </div>

          {/* Visual */}
          <div className="relative lg:col-span-5">
            <div aria-hidden className="glow-red absolute -inset-x-10 -top-10 bottom-0 lg:-inset-16" />
            <div aria-hidden className="glow-neutral absolute -bottom-16 -left-16 size-72" />

            <div className="relative">
              <Parallax
                className="hero-reveal grain aspect-[4/3.2] rounded-panel bg-graphite shadow-float sm:aspect-[16/11] lg:aspect-[4/5]"
                distance={24}
              >
                {/* the live pressure map stays the hero; Marina's portrait leads her own section */}
                <Visual
                  image={null}
                  tone="dark"
                  art="feet"
                  live
                  seed={7}
                  priority
                  className="h-full w-full"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                >
                  {/* static light: the living pressure map is this viewport's one ambient motion */}
                  <div aria-hidden className="course-plate__glow absolute inset-0" />
                </Visual>
              </Parallax>

              {/* Factual, non-interactive context — motion never moves a control */}
              <div className="enter pointer-events-none absolute left-4 top-4 z-10 lg:left-auto lg:right-4" style={delay(420)}>
                <p className="hero-chip inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/15 backdrop-blur-md">
                  <MapPin aria-hidden className="size-3.5" strokeWidth={2} />
                  Актобе · {locations.length} {plural(locations.length, ["филиал", "филиала", "филиалов"])}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </MotionRegion>
  );
}
