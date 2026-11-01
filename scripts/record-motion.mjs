/** Capture the actual mobile UI in Chromium, with native smooth scrolling. */
import { createRequire } from "node:module";
import { resolve } from "node:path";
const require = createRequire(resolve(process.env.MOTION_TOOLS_DIR || ".", "package.json"));
const { chromium } = require("playwright");
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "/usr/bin/chromium", args: ["--no-sandbox"] });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, recordVideo: { dir: "/tmp/podology-motion-video", size: { width: 390, height: 844 } } });
const page = await context.newPage();
await page.goto(process.env.MOTION_URL || "http://localhost:4174", { waitUntil: "networkidle" });
await page.waitForTimeout(5200);
await page.locator("#programs-title").evaluate((el) => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 80, behavior: "smooth" }));
await page.waitForTimeout(4500);
await page.locator(".course-card--featured h3 a").tap();
await page.waitForTimeout(1600);
await context.close();
await page.video().saveAs(process.env.MOTION_VIDEO || "docs/motion/previews/mobile-motion.webm");
await browser.close();
