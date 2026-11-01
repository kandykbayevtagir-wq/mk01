# Школа подологии — сайт

Production-ready website for a podology educator: course catalogue and sales pages, founder profile, partner (organiser) programme, podology centre, products, testimonials and contacts.

**Stack:** Next.js 16 (App Router, React Server Components), React 19, TypeScript, Tailwind CSS v4, Zod, Lucide icons. No animation library: motion is CSS, IntersectionObserver and the native View Transitions API.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in values (see "Forms")
npm run dev                  # http://localhost:3000
```

| Script                 | What it does                                               |
| ---------------------- | ---------------------------------------------------------- |
| `npm run dev`          | Development server                                         |
| `npm run build`        | Production build (all pages prerendered)                   |
| `npm start`            | Serve the production build                                 |
| `npm run check`        | Type-check, lint and build in one go (use before deploys)  |
| `npm run content:todo` | Lists every placeholder that still needs real business data |

---

## Editing content (no code knowledge required)

All business content lives in **`src/data/`**. Components only render what is there, and they never invent values.

| File                      | Content                                                          |
| ------------------------- | ---------------------------------------------------------------- |
| `site.ts`                 | Brand name, contacts (phone, WhatsApp, Telegram, Instagram…), legal entity |
| `founder.ts`              | Founder name, portrait, intro, philosophy, specialisations, qualifications |
| `courses.ts`              | Courses: description, audiences, curriculum, **price (KZT)**, **sessions/dates**, certificate, FAQ |
| `center.ts`               | Podology centre: intro, services, specialists, photos, licences  |
| `products.ts`             | Product categories and products                                  |
| `testimonials.ts`         | Reviews (published only with `consent: true`) and training photos |
| `content.ts`              | "Why us" advantages (each with a `show` switch), partner-programme copy |
| `src/i18n/ru.ts`          | Interface strings: navigation, buttons, form labels, errors      |

### Contacts, locations and payment methods

All of these live in **`src/data/site.ts`**, and every link on the site is generated from there:

- `channels`: phone, WhatsApp, Telegram and Instagram. Each entry has a display value, a label and a URL.
- `whatsappLink(message)`: builds a WhatsApp link with an encoded, pre-filled message.
- `locations`: the two Aktobe branches with their official 2GIS links. **Street addresses, opening hours and branch phones are `null` until verified.** When `null`, the cards show «Филиал 1/2» and send visitors to 2GIS. Once a street address is filled in, `/center` automatically emits `LocalBusiness` structured data for that branch.
- `paymentMethods`: payment methods accepted at the venue. This is informational only; the site has no online checkout.

**Brand marks.** WhatsApp, Telegram, Instagram, Apple Pay and Google Pay use the unmodified official SVG paths from [Simple Icons](https://simpleicons.org) (CC0; trademarks belong to their owners). Kaspi and Halyk have no verified open-source mark, so they are shown as plain text wordmarks. To use the official logos, add them with permission from the banks' brand teams.

### Placeholder rules

- Every value still awaiting real data is marked **`ЗАПОЛНИТЬ`**. Run `npm run content:todo` to list them.
- `null` or an empty list means "not provided". The UI then softens or hides that element. For example, `price: null` renders «Стоимость уточняется», and empty `qualifications` hides the block.
- **The six courses in `courses.ts` are structural drafts** (typical podology topics). Replace them with the author's real programmes before launch.
- Never fill prices, dates, student counts, awards, certificates or licences with estimates.

### Adding a course date

```ts
sessions: [{ start: "2027-03-10", end: "2027-03-14", city: "Алматы" }],
```

Past sessions disappear automatically: pages revalidate hourly. The nearest one appears on cards, in the hero, in the sticky enrolment panel and in the form's date selector.

### Adding images

Put files in `public/images/<section>/` and reference them:

```ts
portrait: { src: "/images/founder/portrait.jpg", alt: "…", width: 1600, height: 2000 },
```

Recommended ratios: founder portrait **4:5**, course cover **4:3**, centre photos **4:3 or 4:5**, products **1:1**. Images are served as AVIF/WebP at responsive sizes through `next/image`. Until a photo is supplied, a branded contour placeholder fills the same box, so adding real photos causes no layout shift.

---

## Forms and lead delivery

The site has five forms (course enrolment, organiser application, centre appointment, product enquiry, general contact). They post to **`POST /api/leads`**, which validates the payload with the shared Zod schema (`src/lib/leads/schema.ts`) and forwards it to every configured channel (`src/lib/leads/deliver.ts`).

Configure **at least one** channel through environment variables:

| Channel            | Variables                                                     |
| ------------------ | ------------------------------------------------------------- |
| Telegram bot       | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`                      |
| JSON webhook (Make, Zapier, n8n, Apps Script, CRM) | `LEADS_WEBHOOK_URL`, optional `LEADS_WEBHOOK_SECRET` (sent as a Bearer token) |
| E-mail via Resend  | `RESEND_API_KEY`, `LEADS_EMAIL_TO`, optional `LEADS_EMAIL_FROM` |

**Honest states:** a submission is reported as successful only if at least one channel accepted it. With no channel configured, the API returns `503 not_configured`. The form then says online enrolment isn't connected yet and offers WhatsApp or phone, when those contacts are filled in.

Other safeguards: client- and server-side validation with the same schema, accessible error messages with focus management, a honeypot field against bots, and a best-effort per-instance rate limit (5 requests/minute per IP).

---

## Project structure

```
src/
  app/                    Routes (one folder per page) + sitemap, robots, manifest, icon, /api/leads
  components/
    layout/               Header, mobile menu, footer, logo
    sections/             Page sections (home/*, page hero, FAQ, form section, testimonials…)
    course/               Course card, filterable catalogue, mobile sticky enrol bar
    forms/                LeadForm (client) + field presets per form type
    ui/                   Primitives: Button, Container, typography, Reveal, Parallax, Visual, ContourArt
  data/                   ← all editable business content
  i18n/                   Locale config + interface dictionary
  lib/                    Utilities, SEO helpers, lead schema & delivery
  styles/tokens.css       Design tokens (colours, type scale, radii, easing, shadows)
```

### Design system

Tokens are defined once in `src/styles/tokens.css`:

- **Colour:** monochrome palette exposed as utilities. White `bg-paper`/`bg-card`, soft gray `bg-mist` (#F6F6F6), graphite `bg-graphite`, `text-ink`, `text-muted`, `border-line`. The red `text-accent`/`bg-accent` (#B3262D) is used only for primary CTAs, the selected filter, active navigation and small markers.
- **Decorative art:** `--art-*` custom properties, a gray ramp with red reserved for pressure peaks. The SVG kit reads them through `style`, so no component hardcodes a colour.
- **Motion scale:** `--dur-press` 150 ms, `--dur-nav` 260 ms, `--dur-card` 350 ms, `--dur-reveal` 550 ms. Easing is `ease-out-soft`.
- **Type scale:** `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-lead` and `text-eyebrow`, all using `clamp()` and tuned for a 375 px canvas.

### Motion & effects

All motion is CSS-first, with no animation library:

| Effect | Implementation |
| --- | --- |
| Hero entrance | CSS keyframes with ≤300 ms of stagger. The headline only moves and never fades, so it counts for LCP from the first frame. |
| Section reveals | `<Reveal>`: one IntersectionObserver per element plus a CSS transition. Content stays visible without JS. |
| Course filter re-flow | View Transitions API. The selected chip slides between positions. |
| Parallax | CSS scroll-driven animation (`view-timeline`). No JS and no scroll listener. |
| Contour drawing | Arch curves draw in on load (hero) or as a section scrolls into view (`animation-timeline: view()`). |
| Header glass | IntersectionObserver sentinel toggles a 12 px backdrop blur. Falls back to opaque where `backdrop-filter` is unsupported. |
| Film grain | Static SVG noise tile on a `::before` (`.grain`), used only on graphite panels, the final CTA and the footer. |
| Ambient glow | `.glow-neutral` / `.glow-red` radial gradients. |
| Accordions | `::details-content` + `interpolate-size` where supported, otherwise an instant toggle. |
| Touch feedback | `active:` scale/colour states. Hover effects apply only on hover-capable devices (Tailwind v4 default). |

Everything above is disabled or made static under `prefers-reduced-motion`. Browsers without scroll-driven animations show the finished, static state.

---

## SEO

- Unique title, description, canonical URL, Open Graph and Twitter tags on every page (`src/lib/seo.ts`).
- `sitemap.xml`, `robots.txt` (blocks indexing on Vercel preview deployments) and a web manifest.
- JSON-LD: `EducationalOrganization`, `Course` (+ `Offer`/`CourseInstance` only when price/dates exist), `BreadcrumbList`, `FAQPage`, `Person` (when the founder's name is set) and the centre's `LocalBusiness` (when the address is set).
- Set **`NEXT_PUBLIC_SITE_URL`** in production so canonical and sitemap URLs are absolute and correct.
- Add Open Graph images by setting `image` on a course or the founder's portrait, or by placing `opengraph-image.jpg` in any route folder.

## Localisation (Kazakh)

The site ships in Russian, and the architecture is ready for Kazakh. Steps are documented in `src/i18n/config.ts`: add the `kk` locale and dictionary, move routes under `app/[lang]/`, and hreflang alternates are generated from the locale list.

---

## Deployment

### GitHub Pages (configured)

Every push to `main` runs `.github/workflows/deploy-pages.yml`. The workflow type-checks, lints, builds a fully static site (`npm run build:pages`) and publishes it to the `gh-pages` branch. The site is served at `https://<owner>.github.io/<repo>/`.

One-time setup in the repository settings:

1. **Settings → Pages → Build and deployment:** Source «Deploy from a branch», branch `gh-pages`, folder `/ (root)`.
2. Private repositories need a paid GitHub plan for Pages. On the free plan, make the repository public (Settings → General → Danger Zone → Change visibility).
3. **Forms on static hosting:** GitHub Pages has no server, so `/api/leads` isn't available and forms post directly to a form service. Add repository variables under Settings → Secrets and variables → Actions → **Variables**:
   - Formspree: `LEADS_ENDPOINT` = `https://formspree.io/f/<form-id>`
   - Web3Forms: `LEADS_ENDPOINT` = `https://api.web3forms.com/submit`, `LEADS_ACCESS_KEY` = your access key

   Without these, forms honestly show «онлайн-приём заявок ещё не подключён» and offer direct contacts.

Static mode differences: no ISR (past course dates drop off on the next deploy), images are served unoptimised (export them as WebP), and the security headers aren't applied.

Local preview of the static build: `NEXT_PUBLIC_BASE_PATH=/mk01 npm run build:pages`. Output goes to `./out`.

### Vercel

Import the repository, set the environment variables from `.env.example` and deploy. No extra configuration is needed. This target keeps the full server feature set: `/api/leads` with Telegram/e-mail delivery, ISR and image optimisation.

**Any Node host:**

```bash
npm ci && npm run build && npm start   # PORT=3000 by default
```

Pages are static and revalidate hourly (ISR). Only `/api/leads` runs on demand.

---

## Quality checks performed

- `npm run check`: type-check, ESLint and production build pass. All 22 routes are prerendered.
- Responsive review at 320, 375, 390, 768, 1024 and 1440 px, with no horizontal overflow.
- Forms: validation errors with focus on the first invalid field, `not_configured` state, and real delivery to a webhook ending in the success state.
- Mobile menu: focus trap, Escape to close, focus returns to the toggle, scroll lock released on navigation.
- Lighthouse (mobile, local production build, applied slow-4G and 4× CPU throttling): Accessibility, Best Practices and SEO score 100 on home, catalogue, course and partner pages. The homepage measures LCP ≈ 1.8 s, TBT ≈ 190–270 ms and CLS 0. Re-measure on the real hosting and domain, and use field data (CrUX / Vercel Speed Insights) for INP.
