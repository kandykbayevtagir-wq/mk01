/** Headless frame cadence and main-thread work; not a hardware battery benchmark. */
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { writeFile } from "node:fs/promises";
const require = createRequire(resolve(process.env.MOTION_TOOLS_DIR || ".", "package.json"));
const { chromium } = require("playwright");
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "/usr/bin/chromium", args: ["--no-sandbox"] });
const results = [];
for (const [name, url] of Object.entries({ baseline: process.env.BASELINE_URL || "http://localhost:4173", motion: process.env.MOTION_URL || "http://localhost:4174" })) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Performance.enable");
  await page.goto(url, { waitUntil: "networkidle" });
  for (const [scene, selector] of Object.entries({ hero: "#hero-title", featured: "#programs-title", offscreen: "#founder-title" })) {
    await page.locator(selector).evaluate((el) => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 85, behavior: "instant" }));
    await page.waitForTimeout(1800);
    const before = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
    const frames = await page.evaluate(() => new Promise((done) => {
      const times = []; let previous = performance.now(); const start = previous;
      function sample(now) { times.push(now - previous); previous = now; if (now - start < 5000) requestAnimationFrame(sample); else done(times); }
      requestAnimationFrame(sample);
    }));
    const after = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
    const sorted = frames.slice(1).sort((a, b) => a - b);
    results.push({ name, scene, viewport: "390x844 DPR2", samples: sorted.length, p95FrameMs: +sorted[Math.floor(sorted.length * 0.95)].toFixed(2), framesOver33ms: sorted.filter((t) => t > 33.4).length, taskMs: +((after.TaskDuration - before.TaskDuration) * 1000).toFixed(2), layouts: after.LayoutCount - before.LayoutCount, activeAmbientRegions: await page.locator('[data-motion-active="true"]').count() });
  }
  await page.close();
}
await browser.close();
await writeFile(process.env.PROFILE_OUTPUT || "docs/motion/profile.json", JSON.stringify(results, null, 2) + "\n");
console.log(JSON.stringify(results, null, 2));
