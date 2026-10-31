/**
 * Brand motif: hairline iso-contours inspired by a plantar pressure map.
 * Deterministic (seeded) and rendered on the server as inline SVG, so it
 * costs no JavaScript and no image requests. Used as an elegant stand-in
 * wherever a photograph has not been supplied yet.
 */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function contourPath(
  cx: number,
  cy: number,
  r: number,
  sx: number,
  sy: number,
  phases: number[],
  amp: number,
) {
  const steps = 72;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const k =
      1 +
      amp * Math.sin(2 * t + phases[0]) +
      amp * 0.6 * Math.sin(3 * t + phases[1]) +
      amp * 0.35 * Math.sin(5 * t + phases[2]);
    const x = cx + Math.cos(t) * r * sx * k;
    const y = cy + Math.sin(t) * r * sy * k;
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join("") + "Z";
}

export function ContourArt({
  seed = 1,
  tone = "light",
  className,
  marker = true,
}: {
  seed?: number;
  tone?: "light" | "dark";
  className?: string;
  marker?: boolean;
}) {
  const rand = mulberry32(seed * 9973);
  const W = 400;
  const H = 500;
  // Two pressure centres — heel and forefoot — with slight seeded drift.
  const centres = [
    { cx: 200 + (rand() - 0.5) * 60, cy: 360 + (rand() - 0.5) * 40, rings: 9, sx: 1, sy: 1.15 },
    { cx: 205 + (rand() - 0.5) * 70, cy: 150 + (rand() - 0.5) * 40, rings: 11, sx: 1.25, sy: 0.9 },
  ];
  const stroke = tone === "dark" ? "rgba(255,255,255,0.16)" : "rgba(23,23,23,0.11)";
  const strokeStrong = tone === "dark" ? "rgba(255,255,255,0.32)" : "rgba(23,23,23,0.22)";

  const paths: { d: string; strong: boolean }[] = [];
  for (const c of centres) {
    const phases = [rand() * 6.28, rand() * 6.28, rand() * 6.28];
    for (let i = 1; i <= c.rings; i++) {
      const r = i * 17 + rand() * 4;
      paths.push({
        d: contourPath(c.cx, c.cy, r, c.sx, c.sy, phases, 0.06 + i * 0.006),
        strong: i % 4 === 0,
      });
    }
  }
  const markerCentre = centres[seed % 2];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
      focusable="false"
    >
      <g fill="none" strokeWidth="1" vectorEffect="non-scaling-stroke">
        {paths.map((p, i) => (
          <path key={i} d={p.d} stroke={p.strong ? strokeStrong : stroke} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      {marker && (
        <>
          <circle cx={markerCentre.cx} cy={markerCentre.cy} r="14" fill="none" stroke="#B3262D" strokeOpacity="0.35" />
          <circle cx={markerCentre.cx} cy={markerCentre.cy} r="4" fill="#B3262D" />
        </>
      )}
    </svg>
  );
}
