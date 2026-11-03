# Content, CTA and conversion cleanup — audit and result

Principle: less interface, less repetition, more substance. Every number below
was measured on production builds at 375 px (see "How it was measured").
Rollback point: `d5f7706` (main before this work). Each step is its own commit.

## 1. What the audit found (before)

| Area | Finding |
|---|---|
| Sticky overlay | `MobileEnrollBar`: fixed price + «Записаться» bar on every course page |
| Header | one accent button that changed per route (6 variants) and always duplicated the page's own primary action |
| Mobile menu | red «Выбрать курс» button |
| Course page | «Записаться на обучение» ×4 (header, hero, sticky desktop panel, form), WhatsApp ×2, price/date repeated in 5 places, 11 «Уточняется / По запросу» strings |
| Homepage | 9 blocks, 11 398 px; «Выбрать курс» ×3, `/courses` linked 5×; advantages, products, partner teaser and a final CTA all repeating other pages |
| Primary-style link buttons | `/` 6, course page 4, `/about` 3, `/reviews` 3, `/center` 2, `/products` 2, `/partners` 2 |
| Repeated copy | 34 text blocks repeated across pages: founder intro + 3 philosophy lines (`/` = `/about`), centre intro + disclaimer, product descriptions, partner steps (`/` = `/partners`), FinalCta headline ×3, three generic process FAQs on every course page |
| Filler | 23 «Уточняется / По запросу / Даты уточняются» strings across the site |
| Unverified claims | see section 5 |
| Empty pages | `/reviews` (no testimonials), `/products` (no records) |
| Contacts | 4-link «Быстрые ссылки» list into other enrolment flows |
| Footer | 1 169 px: marketing paragraph, payment strip, two link lists, contacts, addresses |

## 2. Before / after hierarchy (page height at 375 px)

| Page | Before | After |
|---|---|---|
| `/` | 11 398 px, 9 blocks: hero · choice · popular courses · founder · advantages · centre · products · partners · final CTA | **5 044 px, 6 sections**: hero · choice · courses (3) · Marina · centre · contacts |
| `/courses` | 6 337 px: hero · catalogue · «Поможем выбрать» form + FAQ (rendered twice) · links | 5 212 px: hero · catalogue · enrolment form · FAQ (once) |
| `/courses/[slug]` | 8 229 px: hero (CTA, fact grid) · body · schedule · instructor · FAQ · sticky panel · form · related · links · **sticky bar** | 6 012 px: hero (verified facts only) · about · audience · outcomes · curriculum · instructor · **one** form · related (2) |
| `/about` | 5 668 px: hero (2 buttons) · philosophy · course list · links · FinalCta | 2 489 px: hero · philosophy (credentials appear when supplied) |
| `/center` | 5 966 px | 3 836 px: hero · services list · addresses · booking form |
| `/products` | 5 911 px: hero · sticky nav · 3 full sections · form · links | 3 006 px: hero · 3 category cards · request form |
| `/partners` | 7 168 px | 4 758 px: hero · roles · steps · form |
| `/reviews` | 2 553 px: hero · empty card · FinalCta | 1 094 px: hero with one honest sentence |
| `/contacts` | 4 696 px | 3 788 px: channels · addresses · payment · form |
| footer | 1 169 px | 707 px |

Result in numbers: primary-style link buttons **0** on every page; fixed overlays
**0** on every route; repeated text blocks **34 → 9** (the rest are the same
course card shown on two pages and the consent line beside each form);
«Уточняется / По запросу» **23 → 0**.

## 3. Removed or consolidated components

Removed
- `MobileEnrollBar` (course/mobile-enroll-bar.tsx)
- header CTA (`header-cta.ts`, the header button, the mobile-menu button)
- `FinalCta`, `ContextLinks`
- `AdvantagesSection` and the `advantages` data (four unverified claims)
- `PartnersTeaser`, `ProductCategoryGrid`, `PaymentStrip` (footer)
- hero spotlight card, hero caption, hero buttons; course-page sticky panel, hero CTA, repeated price/date list
- products sticky category bar and three full-height category sections; reviews empty-state card; partners «who», aside and unverified course list; contacts quick links
- `LiquidLight`, `LightTrail` and their CSS (their only users were removed); `partnerContent.who`; unused i18n keys

Consolidated
- `DirectContacts` (three chips) → `WhatsAppAlt` (one quiet link) beside every form
- founder text split into `summary` (home) and `intro` (`/about`); philosophy only on `/about`
- centre intro and disclaimer only on `/center`; partner steps only on `/partners`
- the three process FAQs only on `/courses`; payment methods only on `/contacts`
- hidden when empty instead of rendered as placeholders: schedule, FAQ, price, next intake, reviews link

## 4. Editorial changes

- Hero lead: «Авторские курсы, практические знания и профессиональное развитие специалистов» → «Курсы подологии для специалистов и центр подологии в Актобе.»
- «Популярные курсы» → «Курсы» (there is no data behind "popular")
- «Поможем выбрать программу» → «Записаться на курс»
- Centre: «команда специалистов», «те же стандарты…» removed; service descriptions with clinical wording reduced to titles
- Contacts: «Быстрее всего ответим», «в рабочее время» removed (hours are unknown)
- Founder caption «Основатель школы» (×4) → «Марина», the name the site already uses («О Марине»)
- Metadata of `/about` no longer promises «профессиональный путь … квалификация»
- Partners: unverified «Программы, доступные для выездного обучения» removed

## 5. SEO changes (own commit — revert it to undo)

- `/reviews` and `/products`: `noindex, follow` and omitted from `sitemap.xml` while they hold no records. They stay reachable (products from the footer) and flip to indexed automatically when the first testimonial / product exists (`src/lib/indexing.ts`).
- `/reviews` is also removed from the footer and menu until it has content.
- Unchanged and indexed: `/`, `/courses`, course pages, `/about`, `/center`, `/partners`, `/contacts`. `/about` is the borderline page (no name or portrait yet); it keeps real text and flips nothing automatically — consider `noindex` if it is still thin at launch.

## 6. Unresolved business content (nothing was invented)

**Launch blocker — privacy policy.** The operator is only «Podology MK».
Missing: legal entity (ИП/ТОО), БИН/ИИН, a contact address for data requests,
storage/retention/transfer wording. Needs legal review under the Law of the
Republic of Kazakhstan «О персональных данных и их защите» before launch
(`src/data/site.ts → legal`, `src/app/privacy/page.tsx`).

Also required
- **Lead delivery**: no provider is configured (Telegram / webhook / Resend, or `NEXT_PUBLIC_LEADS_ENDPOINT` for GitHub Pages). Forms honestly show the "not configured" fallback. Delivery was only tested against a local mock webhook; real delivery is **untested**.
- **Marina**: ~~full name, portrait~~ (added: «Марина Кандыкбаева», confirmed by the centre signage and Telegram; portrait and a work photo in `public/images/founder/`). Still needed: years of experience, qualifications, teaching experience; confirm the `summary`, `intro` and the three philosophy lines are her own words and approved (they are drafts marked «проверить»).
- **Training photos**: group photos with graduates and certificates exist, but show other people — publish (`trainingPhotos` in `src/data/testimonials.ts`) only with the participants' consent.
- **Courses**: all six are structural drafts — real titles, summaries, audiences, outcomes, curricula; confirmed format, duration, price, intakes, certificate; images. Cards/pages show a value only when it exists.
- **Centre**: confirmed service list, prices, licences/legal status of services, working hours, branch phones, photographs, specialists.
- **Branches**: which of the two 2GIS records belongs to which address is still unverified (both stay as neutral links on `/contacts`); the Акация branch has no map link.
- **Products**: real product records (name, price, stock, image) — or drop the page.
- **Reviews**: published testimonials with written consent; training photos.
- **Partners**: confirm the cooperation model (organiser / school responsibilities, steps).
- **Contact email** and working hours are not provided.

## 7. Verification (production builds)

- TypeScript, ESLint (0 warnings), `next build` and `build:pages` (GitHub Pages, `/mk01`) pass.
- `scripts` used (not committed): a 120-assertion rules suite on every route at 375 px — no fixed overlays, no primary-style CTA, exactly one form where a form belongs, ≤1 «Записаться на обучение» per page, no filler strings, no header CTA, `noindex` + sitemap, homepage = 6 sections / 3 courses, verified contacts / addresses / 2GIS / payment methods intact, footer content — passes on the server **and** the static build.
- Existing suites: forms (validation, not-configured fallback, mock-webhook success on the course and partner forms), menu focus trap and scroll lock, catalogue filter (6 → 2 → 6), keyboard access to all contact links, 22 navigation checks, 31 content/SEO checks, page transitions (15), pressure-field behaviour (12), microinteractions (15), card behaviour (11), layout width on 11 routes × 8 widths — all pass.
- Lighthouse mobile (3 runs, medians, same gzip static server): `/` 95 → 97, `/courses` 94 → 95, course page 94 → 95, `/center` 96 → 96; transfer on `/` 427 → 383 KB.

### How it was measured
Static exports of `d5f7706` (before) and of this branch (after), basePath `/mk01`,
served by the same gzip server; Playwright (Chromium, 375×812 @2x) for structure
and screenshots; Lighthouse 12 mobile preset for scores. Headless software
rendering: compare builds against each other, not against real phones.
