/** Alternate cold-cache Lighthouse runs against two production static exports. */
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
const require = createRequire(resolve(process.env.MOTION_TOOLS_DIR || ".", "package.json"));
const cli = require.resolve("lighthouse/cli/index.js");
const rawDir = process.env.MOTION_RAW_REPORTS || resolve(tmpdir(), "podology-motion-audits");
await mkdir(rawDir, { recursive: true });
const runs = [];
for (let run = 1; run <= 3; run++) {
  for (const [name, url] of Object.entries({ baseline: process.env.BASELINE_URL || "http://localhost:4173", motion: process.env.MOTION_URL || "http://localhost:4174" })) {
    const path = `${rawDir}/${name}-${run}.json`;
    execFileSync(process.execPath, [cli, url, "--output=json", `--output-path=${path}`, "--only-categories=performance,accessibility", "--chrome-flags=--headless --no-sandbox", "--quiet"], { stdio: "inherit", env: { ...process.env, CHROME_PATH: process.env.CHROME_PATH || "/usr/bin/chromium" } });
    const report = JSON.parse(await readFile(path, "utf8"));
    const entry = { name, run, version: report.lighthouseVersion, fetchTime: report.fetchTime, settings: report.configSettings, scores: Object.fromEntries(Object.entries(report.categories).map(([key, value]) => [key, value.score])), metrics: Object.fromEntries(["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift", "speed-index"].map((key) => [key, report.audits[key].numericValue])) };
    runs.push(entry);
    console.log(JSON.stringify({ name, run, scores: entry.scores, metrics: entry.metrics }));
  }
}
await writeFile(process.env.MOTION_AUDIT_OUTPUT || "docs/motion/lighthouse.json", JSON.stringify(runs, null, 2) + "\n");
