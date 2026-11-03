#!/usr/bin/env node
/**
 * Share-preview cards (1200×630 JPEG) for WhatsApp, Telegram, Instagram and
 * search results. Rendered from the *built* site so titles, font (Manrope)
 * and pressure-map art are the real ones.
 *
 *   npm run build:pages                     # produces ./out
 *   npx serve-like-static ./out at /mk01    # any static server, e.g. the one below
 *   node scripts/generate-og.mjs --dir out --site http://localhost:3200/mk01
 *
 * Requires Playwright on the dev machine (not a dependency of the site or CI):
 *   NODE_PATH=$(npm root -g) node scripts/generate-og.mjs …
 * Output: public/og/*.jpg — commit the files after regenerating.
 */
import { readFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

// Playwright is a dev-machine tool, not a project dependency: resolve it from
// NODE_PATH or a global install (NODE_PATH=$(npm root -g) node scripts/generate-og.mjs …).
const { chromium } = createRequire(import.meta.url)("playwright");

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const dir = arg("dir", "out");
const site = arg("site", "http://localhost:3200/mk01").replace(/\/$/, "");
const outDir = arg("out", "public/og");
mkdirSync(outDir, { recursive: true });

const read = (p) => readFileSync(join(dir, p, "index.html"), "utf8");
const meta = (html, prop) => (html.match(new RegExp(`<meta property="${prop}" content="([^"]*)"`)) || [])[1] ?? "";
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const home = read("");
const htmlClass = (home.match(/<html[^>]*class="([^"]*)"/) || [])[1] ?? "";
const css = [...home.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);
const origin = new URL(site).origin;

/** name, built path, eyebrow, art view (pressure-<view>-dark.svg), optional photo (path in the built site) */
const pages = [
  ["home", "", "Актобе · 2 филиала", "pair-v"],
  ["courses", "courses", "Обучение для специалистов", "foot-h"],
  ["about", "about", "Подолог · преподаватель", "foot-v", "/images/founder/marina-kandykbayeva.webp"],
  ["center", "center", "Приём в Актобе · 2 филиала", "pair-v"],
  ["partners", "partners", "Партнёрство", "foot-hl"],
  ["contacts", "contacts", "Актобе · WhatsApp · Telegram", "toes-v"],
  ["products", "products", "Стельки · материалы · уход", "foot-h"],
  ["reviews", "reviews", "Выпускники", "foot-hl"],
];
for (const slug of readFileSync(join(dir, "sitemap.xml"), "utf8").matchAll(/\/courses\/([a-z0-9-]+)\/?</g)) {
  const html = read(`courses/${slug[1]}`);
  const view = (html.match(/art\/pressure-([a-z-]+)-dark\.svg/) || [])[1] ?? "foot-h";
  const category = (html.match(/course-plate__readout[\s\S]*?rounded-full[^>]*>([^<]+)</) || [])[1] ?? "Курс";
  pages.push([`course-${slug[1]}`, `courses/${slug[1]}`, `Курс · ${decode(category)}`, view]);
}

// Largest size (≤ 68 px) at which the longest word still fits the 660 px column.
const fit = (title) => Math.min(title.length > 38 ? 58 : 68, Math.floor(660 / (Math.max(...title.split(/\s+/).map((w) => w.length)) * 0.6)));

const card = ({ title, eyebrow, view, photo }) => `<!doctype html><html lang="ru" class="${htmlClass}"><head><meta charset="utf-8">
${css.map((h) => `<link rel="stylesheet" href="${origin}${h}">`).join("")}
<style>
  html,body{margin:0;background:#1d1d1d}
  #c{position:relative;width:1200px;height:630px;overflow:hidden;color:#fff;background:#202020;font-family:inherit}
  #c .dots{position:absolute;inset:0;background-image:radial-gradient(rgb(255 255 255/.07) 1.3px,transparent 1.7px);background-size:22px 22px}
  #c .glow{position:absolute;inset:0;background:radial-gradient(60% 80% at 90% 0%,rgb(255 255 255/.09),transparent 60%),radial-gradient(55% 75% at 0% 100%,rgb(179 38 45/.34),transparent 70%)}
  #c .art{position:absolute;right:48px;top:80px;width:420px;height:470px;object-fit:contain}
  #c .photo{position:absolute;right:56px;top:56px;width:400px;height:518px;border-radius:36px;object-fit:cover;object-position:50% 30%;box-shadow:0 30px 60px -20px rgb(0 0 0/.6)}
  #c .copy{position:absolute;left:72px;top:64px;bottom:64px;width:660px;display:flex;flex-direction:column}
  #c .brand{display:flex;align-items:center;gap:16px;font-size:30px;font-weight:600;letter-spacing:-.01em}
  #c .eyebrow{margin-top:auto;display:flex;align-items:center;gap:12px;font-size:22px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgb(255 255 255/.62)}
  #c .eyebrow i{width:10px;height:10px;border-radius:9px;background:#d2343b;display:block}
  #c h1{margin:22px 0 0;font-size:${fit(title)}px;line-height:1.06;font-weight:600;letter-spacing:-.025em;text-wrap:balance;overflow-wrap:normal;word-break:normal;hyphens:manual}
</style></head><body><div id="c">
  <div class="dots"></div><div class="glow"></div>
  ${photo ? `<img class="photo" src="${site}${photo}" alt="">` : `<img class="art" src="${site}/art/pressure-${view}-dark.svg" alt="">`}
  <div class="copy">
    <div class="brand">
      <svg viewBox="0 0 32 32" width="52" height="52"><rect width="32" height="32" rx="9" fill="#fff"/><g fill="none" stroke="#171717" stroke-width="1.4" opacity=".9"><ellipse cx="16" cy="12.5" rx="6.5" ry="4.6"/><ellipse cx="16" cy="12.5" rx="3.6" ry="2.4" opacity=".6"/><ellipse cx="16" cy="22.5" rx="4.4" ry="3.6"/></g><circle cx="16" cy="22.5" r="1.7" fill="#b3262d"/></svg>
      Podology MK
    </div>
    <div class="eyebrow"><i></i>${eyebrow}</div>
    <h1>${title}</h1>
  </div>
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const [name, path, eyebrow, view, photo] of pages) {
  if (!existsSync(join(dir, path, "index.html"))) continue;
  const html = read(path);
  let title = decode(meta(html, "og:title")).replace(/\s+—\s+Podology MK$/, "");
  if (name === "home") title = "Профессиональное обучение подологии";
  if (name === "about") title = decode((html.match(/<h1[^>]*>([^<]+)<\/h1>/) || [])[1] ?? title); // her name
  await page.setContent(card({ title, eyebrow, view, photo }), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.locator("#c").screenshot({ path: join(outDir, `${name}.jpg`), type: "jpeg", quality: 86 });
  console.log(`og/${name}.jpg  «${title}»`);
}
await browser.close();
