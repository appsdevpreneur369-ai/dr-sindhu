# CLAUDE.md — Dr. Sindhu Dental Clinic public website (DRSDC)

Public website for **Dr. Sindhu Dental Clinic**, Ashramam Road, Tadepalli (project code DRSDC), a ClinicFlow247 **STARTER** tenant with one extra: this free custom website.

Status: **on staging since 2026-10-01** (owner approved the GitHub push and staging deploy) — not in production. Open items: `pending_tasks_dr-sindhu.md`; data to collect: `DRSDC_PendingItems.md`.

## Hard rules

- **Deploy only when asked.** Staging deploys and pushes to GitHub happen when the owner asks; never production without explicit approval. Never modify anything under `D:\ClinicFlow` or `D:\SMSDC` (read-only references). Never run the onboarding file against staging or production, and never change the ClinicFlow staging API, without the owner's explicit yes.
- **Starter plan only.** The site must not promise more than Starter (source: `D:\ClinicFlow\clinicflow-frontend\src\components\landing\pricingData.ts`): up to 5 doctors, unlimited appointments, online booking, live queue, digital prescriptions, email confirmations/reminders, WhatsApp 1,000/mo, SMS 1,000/mo. Not advertised/built: analytics, portal gallery, white-label portal, custom subdomain, custom fields, dedicated onboarding, review requests, no-show alerts, win-back, waitlist.
- **Plan gate:** `content/plan.json` `{ "plan": "starter" }` gates anything beyond Starter. Upgrading to Enterprise must be a config change (see `docs/UPGRADE_TO_ENTERPRISE.md`).
- **Everything config-driven** from `/content`, zod-validated; every record has `status: approved | placeholder`. No hard-coded copy, colours, images, phones or hours in components. `NEXT_PUBLIC_SHOW_PLACEHOLDER_BADGES=true` shows "Draft" badges.
- **Placeholders never become dead links.** While phone/WhatsApp/email are placeholders: hide Call/WhatsApp/email buttons (show "Book online"), omit them from JSON-LD, disable the WhatsApp booking fallback (`src/lib/contact.ts`, `selectMode.ts`). Phone + WhatsApp +91 94416 95953 are approved (30 Sep 2026); email is still a placeholder.
- **Never invent** a phone, email, reviews, ratings, years of experience, awards, patient counts or stats. (Dr. Sindhu's 15+ years was provided by the account owner on 30 Sep 2026.) Initials avatars until real doctor photos. No prices. Cautious medical wording ("linked with", "may help").
- **Copy stays original.** The owner asked (30 Sep 2026) for a look like the SMSDC site; layout patterns may match, but no sentence is copied from SMSDC (duplicate-content risk in the same town) and the brand colours/logo are DRSDC's own. No "Suhasini" text, file or logo anywhere in the repo output (grep the build).
- ClinicFlow login/booking/portal pages keep standard ClinicFlow branding (branding is Enterprise-only) — link to them, don't brand them.

## Stack

Next.js 14 App Router, TypeScript strict, Tailwind, next/font (Roboto headings + Montserrat body, `display: 'swap'`), zod, vitest, lucide-react. English only (SMSDC's Telugu layer is not ported). Mirrors `D:\SMSDC\site` patterns: content layer, `BookingService` (clinicflow → enquiry → whatsapp fallback), popup rules, portal links + redirects, SEO/JSON-LD, contrast script.

## Brand (content/brand.json) — redesign 30 Sep 2026

Owner feedback: professional look in the style of the SMSDC reference site, vivid (not dull) colours, **no red anywhere**, Roboto headings + Montserrat body, nav highlighted with an underline (no pills), real artistic images. Colours come from the clinic's own logo (blue + green) — so the layout is similar to SMSDC but the brand is not.

| Token | Hex | Use | Contrast |
| --- | --- | --- | --- |
| primary (blue) | #1463C4 | buttons, links, stats | white on it 5.81:1; on white 5.81:1 |
| primaryHover / primaryDeep | #0F52A6 / #0B3A78 | hover, banners | white 7.56 / 11.11 |
| navy | #0A2748 | top bar, footer, steps band | white 15.04, onDarkMuted 9.86 |
| green | #1D7F36 | eyebrows, green buttons, checks | on white 5.07; white on it 5.07 |
| sky / greenSoft / surfaceAlt | #EAF3FE / #E9F7EA / #F5F9FF | tints, alternate sections | text ≥ 12:1 |
| text / textSecondary | #0F1F35 / #4A5B72 | body | 16.57 / 6.93 |
| warning (amber, replaces red) | #A14A07 | closed-now, errors | ≥ 4.5 on white and sky |
| leaf | #7CC242 | decoration only (2.18:1) | never text |

Fonts: Roboto (headings, 500/700/900) + Montserrat (body, 400/500/600) via next/font, `display: 'swap'` (CLS measured 0).
Images: representative stock photos (Unsplash License, `content/photo-credits.json`) until the clinic's own photos arrive — never presented as the clinic's doctors (initials avatars). All images are pre-sized WebP (`npm run images`, runs before every build) served by a custom `next/image` loader — the runtime optimiser hung on some photos.

## Important tasks (checklist)

1. [x] git init, Next.js 14 + Tailwind + vitest + eslint
2. [x] `/content` (zod-validated, cross-references checked): clinic, brand, plan, portal, social, doctors, services (9 categories), routing, booking, home, about, faqs, emergency, gallery, images, navigation, pages, education/*.md, legal/*.md
3. [x] Logo from the owner's files in `images/` → `npm run brand` (mark in header + Roboto wordmark; icons, OG image). Clinic name is **"Dr. Sindhu Dental Clinic"** (no "& Implant Centre", decided 30 Sep 2026); the supplied title-logo artwork shows the longer name and is deliberately NOT published until a corrected one arrives.
4. [x] Layout: glass header condensing on scroll, footer with inert social icons, sticky mobile action bar
5. [x] All pages incl. 3 doctors, 9 treatment categories, 4 articles, 4 legal drafts, 404
6. [x] Booking popup + wizard; BookingService clinicflow → enquiry → whatsapp; placeholder-phone rule
7. [x] Portal links + redirects (`/login`, `/register`, `/staff-login`, `/clinic/*`, `/services*`, renamed doctors)
8. [x] SEO: metadata, canonical, OG/Twitter, image sitemap, robots, JSON-LD, env noindex
9. [x] `tenant/dr-sindhu.json` generated by `npm run tenant`
10. [x] lint, tsc, 47 unit tests, build, contrast (all AA)
11. [x] Lighthouse mobile+desktop × 6 pages (`docs/seo-reports/2026-09-30/`); JSON-LD 0 errors
12. [x] Local ClinicFlow e2e (isolated API copy + throwaway Postgres on :55432)
13. [x] QA 360/768/1280, keyboard, reduced motion, DRSDC vs SMSDC screenshot, no "Suhasini" in build output
14. [x] Docs: EDITING, SEO, BOOKING, UPGRADE_TO_ENTERPRISE, DRSDC_PendingItems

## Commands

| Command | What |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build && npm start` | Production build (set env in `.env.production.local`) |
| `npm run check` | lint + typecheck + tests + contrast + build |
| `npm run brand` | Re-generate logo sizes, icons and the OG image from `images/` + `brand.json` |
| `npm run images` | Pre-generate WebP variants of all photos (also runs automatically before `npm run build`) |
| `node scripts/fetch-photos.mjs` | Re-download the selected stock photos (only when changing the selection) |
| `npm run tenant` | Re-generate `tenant/dr-sindhu.json` from `/content` |
| `node scripts/qa/screens.mjs <base> qa/screens` | Screenshots at 360/768/1280 + overflow/tap-target report |
| `node scripts/qa/lighthouse.mjs <base> docs/seo-reports/<date>` | Lighthouse mobile + desktop |
| `node scripts/qa/seo-audit.mjs <base> <schemaorg.jsonld> out.json` | SEO + local JSON-LD validation |
| `node scripts/qa/e2e-booking.mjs <base> qa/e2e` | Booking e2e against a LOCAL ClinicFlow API only |

In Git Bash prefix scripts that take `/paths` with `MSYS_NO_PATHCONV=1`.

## Structure

- `src/lib/content/*` — zod schemas + loader (server-only; client components get props). `src/lib/days.ts` is zod-free for client code.
- `src/lib/plan-matrix.mjs`, `site-redirects.mjs` — plain JS shared with `next.config.mjs` (plan gating, portal URLs, redirects).
- `src/lib/booking/*` — booking logic (ported from SMSDC; no patient-account layer).
- `src/components/*`, `src/app/*` — UI. Colours only via Tailwind tokens from `brand.json` (no hex in components).

## Checks before calling anything done

`npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run contrast` all pass; pages checked at 360/768/1280 px; `grep -ri suhasini .next public content src` returns nothing.

## Deployments

Manual, same approach as the SMSDC site and ClinicFlow247 (no CI/CD): build the image locally, push to Artifact Registry, `gcloud run deploy`. Never touch other services, `clinicflow-lb`, certs, DNS or the ClinicFlow API.

| Item | Value |
| --- | --- |
| Repo | https://github.com/appsdevpreneur369-ai/dr-sindhu (`main`, pushed over HTTPS) |
| GCP | project `sincere-stock-499113-f1`, region `asia-south1` |
| Image | `asia-south1-docker.pkg.dev/sincere-stock-499113-f1/clinicflow/drsdc-frontend:<git short SHA>` |
| Staging service | `drsdc-frontend-staging` — 256Mi, 1 CPU, min-instances 0, unauthenticated, port 3000 |
| Staging URL | https://drsdc-frontend-staging-1071497363324.asia-south1.run.app |
| Staging build args | `NEXT_PUBLIC_SITE_ENV=staging` (noindex header + robots Disallow + meta noindex), `NEXT_PUBLIC_SHOW_PLACEHOLDER_BADGES=true`, `NEXT_PUBLIC_NOINDEX=true`, `NEXT_PUBLIC_SITE_URL=<staging URL>`. No ClinicFlow API args: the clinic is **not** onboarded on the staging API, so booking runs in **WhatsApp mode** (messages go to the clinic's real number +91 94416 95953). |

History (staging):

| Date | Commit / image tag | Revision | Notes |
| --- | --- | --- | --- |
| 2026-10-01 | `9f5d400` | `drsdc-frontend-staging-00001-5rv` | First deploy (redesign: blue/green, Roboto + Montserrat, stock photos). Live-verified: 20 URLs 200/307/404 as expected, noindex, 129 images 0 broken, popup in WhatsApp mode, no ERROR logs. |
| 2026-10-01 | `d9f2984` | `drsdc-frontend-staging-00002-zj5` | Clinic's own photos: 15-photo gallery, Dr. Sindhu's photo on her card/profile, real photos on About/Contact/home. Live-verified: pages 200, noindex, 162 images 0 broken, no ERROR logs. **Current.** |

Redeploy staging (all NEXT_PUBLIC_* values are baked in at build time):

```bash
SHA=$(git rev-parse --short HEAD)
IMG=asia-south1-docker.pkg.dev/sincere-stock-499113-f1/clinicflow/drsdc-frontend:$SHA
docker build   --build-arg NEXT_PUBLIC_SITE_ENV=staging   --build-arg NEXT_PUBLIC_SHOW_PLACEHOLDER_BADGES=true   --build-arg NEXT_PUBLIC_NOINDEX=true   --build-arg NEXT_PUBLIC_SITE_URL=https://drsdc-frontend-staging-1071497363324.asia-south1.run.app   -t $IMG .
docker push $IMG
gcloud run deploy drsdc-frontend-staging --project sincere-stock-499113-f1 --region asia-south1 --image $IMG
```

Then: curl the main pages, `/login` (307 to the portal), `/robots.txt` (Disallow), check the `x-robots-tag` header and zero ERROR logs for the new revision. To enable live booking later: onboard `tenant/dr-sindhu.json` on staging, set the clinic ACTIVE + doctor schedules, add this origin to the staging API's `APP_CORS_ALLOWEDORIGINS`, then rebuild with `NEXT_PUBLIC_CLINICFLOW_API_URL`, `NEXT_PUBLIC_CLINICFLOW_CLINIC_SLUG=dr-sindhu-dental-clinic` and `NEXT_PUBLIC_BOOKING_OTP_HINT=123456` (all need the owner's yes).
