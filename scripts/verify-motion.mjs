/**
 * Run against a production static export, never next dev.
 * Tools are kept outside the app: see docs/motion/README.md for setup.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const require = createRequire(resolve(process.env.MOTION_TOOLS_DIR || ".", "package.json"));
const { chromium, webkit } = require("playwright");
const { default: AxeBuilder } = require("@axe-core/playwright");
const origin = (process.env.MOTION_URL || "http://localhost:4174").replace(/\/$/, "");
const output = resolve(process.env.MOTION_OUTPUT || "docs/motion/previews");
await mkdir(output, { recursive: true });
const results = [];
const engines = Object.fromEntries(Object.entries({ chromium, webkit }).filter(([name]) =>
  (process.env.MOTION_ENGINES || "chromium").split(",").includes(name),
));

async function scrollTo(page, selector) {
  await page.locator(selector).first().evaluate((el) => {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "instant" });
  });
  await page.waitForTimeout(800);
}

for (const [engine, browserType] of Object.entries(engines)) {
  const browser = await browserType.launch(engine === "chromium" ? {
    executablePath: process.env.CHROME_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  } : {});
  for (const width of [375, 390, 430]) {
    const context = await browser.newContext({
      viewport: { width, height: 844 }, deviceScaleFactor: 2,
      isMobile: true, hasTouch: true,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`${origin}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    assert.equal(await page.locator("h1").count(), 1);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "no horizontal overflow");
    assert.equal(await page.locator(".motion-hero").getAttribute("data-motion-active"), "true");
    await page.screenshot({ path: `${output}/${engine}-hero-${width}.png` });

    // Ambient layers actually move, then freeze outside the viewport.
    const layer = page.locator(".motion-hero .liquid-light__form").first();
    const before = await layer.evaluate((e) => getComputedStyle(e).transform);
    await page.waitForTimeout(200);
    assert.notEqual(await layer.evaluate((e) => getComputedStyle(e).transform), before);
    await scrollTo(page, "#programs-title");
    await page.screenshot({ path: `${output}/${engine}-courses-${width}.png` });
    assert.equal(await page.locator(".motion-hero").getAttribute("data-motion-active"), "false");
    const paused = await layer.evaluate((e) => getComputedStyle(e).transform);
    await page.waitForTimeout(200);
    assert.equal(await layer.evaluate((e) => getComputedStyle(e).transform), paused);
    assert.equal(await page.locator(".course-card--featured").getAttribute("data-motion-active"), "true");
    assert.equal(await page.locator(".course-card--featured").count(), 1);

    if (engine === "chromium") {
      const cdp = await context.newCDPSession(page);
      const target = await page.locator(".course-card--featured h3 a").boundingBox();
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: target.x + 12, y: target.y + 12 }] });
      await page.waitForTimeout(140);
      assert.equal(await page.locator(".course-card--featured h3 a").getAttribute("data-pressed"), "true");
      assert.notEqual(await page.locator(".course-card--featured").evaluate((e) => getComputedStyle(e).transform), "none");
      await cdp.send("Input.dispatchTouchEvent", { type: "touchCancel", touchPoints: [] });
      assert.equal(await page.locator(".course-card--featured h3 a").getAttribute("data-pressed"), null);
    }

    // Focus and touch settle the card; the stretched link keeps its native behavior.
    const course = page.locator(".course-card--featured h3 a");
    await course.focus();
    assert.equal(await page.locator(".course-card--featured .course-card__visual > :first-child").evaluate((e) => getComputedStyle(e).animationPlayState), "paused");
    const href = await course.getAttribute("href");
    const bounds = await course.boundingBox();
    await page.touchscreen.tap(bounds.x + 12, bounds.y + 12);
    await page.waitForURL((url) => url.pathname === new URL(href, origin).pathname);
    await page.waitForTimeout(650);
    assert.ok(await page.locator("#course-hero h1").isVisible());
    await page.locator('#course-hero a[href="#zapis"]').tap();
    await page.waitForTimeout(850);
    assert.ok(await page.locator("#zapis form").isVisible());
    assert.ok(await page.locator('#zapis input[name="name"]').isVisible());
    // Exercise validation only: never send a business enquiry.
    await page.locator('#zapis button[type="submit"]').click();
    assert.ok(await page.locator('#zapis [aria-invalid="true"]').count() > 0);

    await page.goto(`${origin}/`, { waitUntil: "networkidle" });
    const menu = page.locator('header button[aria-expanded]');
    await menu.tap();
    assert.equal(await menu.getAttribute("aria-expanded"), "true");
    await page.keyboard.press("Escape");
    assert.equal(await menu.getAttribute("aria-expanded"), "false");
    await scrollTo(page, ".final-cta-motion");
    await page.screenshot({ path: `${output}/${engine}-cta-${width}.png` });
    assert.equal(await page.locator(".final-cta-motion").getAttribute("data-motion-active"), "true");

    // Check the live preference change, as well as initial-load reduced motion below.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(() => document.querySelector(".final-cta-motion")?.getAttribute("data-motion-active") === "false");
    assert.equal(await page.locator(".final-cta-motion").getAttribute("data-motion-active"), "false");
    assert.equal(await page.locator(".light-trail > span").first().evaluate((e) => getComputedStyle(e).animationName), "none");
    assert.deepEqual(errors, [], "no uncaught browser errors");
    results.push({ engine, width, checks: "layout, ambient movement/pause, focus, touch navigation, enrollment validation, menu, live reduced motion" });
    await context.close();
  }

  const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await reduced.newPage();
  await page.goto(`${origin}/`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".kinetic-line").first().evaluate((e) => getComputedStyle(e).animationName), "none");
  const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  assert.deepEqual(axe.violations.map((v) => ({ id: v.id, impact: v.impact })), []);
  results.push({ engine, reducedMotion: "static on initial load", axeViolations: axe.violations.length });
  await reduced.close();

  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const staticPage = await noJS.newPage();
  await staticPage.goto(`${origin}/`);
  assert.ok(await staticPage.locator("#hero-title").isVisible());
  assert.ok(await staticPage.locator("#programmy h3 a").first().isVisible());
  assert.equal(await staticPage.locator(".motion-hero .liquid-light__form").first().evaluate((e) => getComputedStyle(e).animationPlayState), "paused");
  await noJS.close();
  await browser.close();
}
await writeFile(`${output}/verification-${Object.keys(engines).join("-")}.json`, JSON.stringify(results, null, 2) + "\n");
console.log(JSON.stringify(results, null, 2));
