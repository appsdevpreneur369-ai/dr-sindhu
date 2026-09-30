# CLAUDE.md — Dr. Sindhu Dental Clinic public website (DRSDC)

Public website for **Dr. Sindhu Dental Clinic**, Ashramam Road, Tadepalli (project code DRSDC), a ClinicFlow247 **STARTER** tenant with one extra: this free custom website.

Status: **planning — waiting for the owner's "go"** (2026-09-30). Update this line as work progresses.

## Hard rules

- **LOCAL ONLY.** No deploy, no `git push`, no remote. Never modify anything under `D:\ClinicFlow` or `D:\SMSDC` (read-only references). Never run the onboarding file against staging or production.
- **Starter plan only.** The site must not promise more than Starter (source: `D:\ClinicFlow\clinicflow-frontend\src\components\landing\pricingData.ts`): up to 5 doctors, unlimited appointments, online booking, live queue, digital prescriptions, email confirmations/reminders, WhatsApp 1,000/mo, SMS 1,000/mo. Not advertised/built: analytics, portal gallery, white-label portal, custom subdomain, custom fields, dedicated onboarding, review requests, no-show alerts, win-back, waitlist.
- **Plan gate:** `content/plan.json` `{ "plan": "starter" }` gates anything beyond Starter. Upgrading to Enterprise must be a config change (see `docs/UPGRADE_TO_ENTERPRISE.md`).
- **Everything config-driven** from `/content`, zod-validated; every record has `status: approved | placeholder`. No hard-coded copy, colours, images, phones or hours in components. `NEXT_PUBLIC_SHOW_PLACEHOLDER_BADGES=true` shows "Draft" badges.
- **Placeholders never become dead links.** While phone/WhatsApp/email are placeholders: hide Call/WhatsApp/email buttons (show "Book online"), omit them from JSON-LD, disable the WhatsApp booking fallback.
- **Never invent** a phone, email, reviews, ratings, years of experience, awards, patient counts or stats. Initials avatars until real doctor photos. No prices. Cautious medical wording ("linked with", "may help").
- **Distinct from SMSDC (Suhasini).** Architecture/logic may be reused; visual design and all copy must be new — no sentence copied from SMSDC (duplicate-content risk in the same town). No "Suhasini" text, file or logo anywhere in the repo output (grep the build).
- ClinicFlow login/booking/portal pages keep standard ClinicFlow branding (branding is Enterprise-only) — link to them, don't brand them.

## Stack

Next.js 14 App Router, TypeScript strict, Tailwind, next/font (Fraunces headings + DM Sans body), zod, vitest, lucide-react. English only (SMSDC's Telugu layer is not ported). Mirrors `D:\SMSDC\site` patterns: content layer, `BookingService` (clinicflow → enquiry → whatsapp fallback), popup rules, portal links + redirects, SEO/JSON-LD, contrast script.

## Brand (content/brand.json)

| Token | Hex | Use | Contrast |
| --- | --- | --- | --- |
| primary (sage) | #2F6F5E | links, headings accents, primary buttons | 5.53:1 on bg, white on it 5.91:1 |
| primaryHover | #245848 | hover | white on it 8.19:1 |
| primarySoft (mint) | #E3F0EA | tints, chips | primary on it 5.04:1 |
| background (warm off-white) | #FAF7F2 | page | — |
| text (forest charcoal) | #1F2D28 | body | 13.42:1 |
| textSecondary | #4E5D57 | muted text | 6.49:1 |
| accent CTA (coral, deep) | #B84A33 | CTA buttons (white text) | 5.17:1 |
| accentSoft (coral light) | #F4A08A | CTA fill with dark text / decoration | text on it 6.99:1 |
| dark (forest) | #173B32 | footer | #F3EFE7 on it 10.72:1 |
| decorative only | #F08A6C, #8FC1AE | blobs, dividers — fail AA as text | 2.30 / 1.89 |

## Important tasks (checklist)

1. [ ] git init, scaffold Next.js 14 + Tailwind + vitest + eslint
2. [ ] `/content`: clinic, brand, plan, images, doctors, services (9 categories re-routed), home, faqs, education, legal, booking, routing, navigation, portal, social — all zod-validated
3. [ ] Logo: tooth mark traced/recoloured from the SMSDC icon → `public/brand/drsdc-mark.*` + Fraunces wordmark; paths only in `content/images.json`; status placeholder
4. [ ] Layout: glass nav condensing on scroll, footer with social icons (inert while empty), sticky mobile action bar
5. [ ] Pages: Home, About, Doctors (+3), Treatments (+9), Gallery, Patient Education (+ "Healthy Gums, Healthy Heart" + 2–3 aftercare), FAQs, Book, Contact (open/closed now, Asia/Kolkata), Emergency, Privacy (DPDP Act 2023), Terms, Disclaimer, Cookies, 404
6. [ ] Booking popup + wizard (problem → doctor → date → slot → OTP → confirm); BookingService modes + fallback; placeholder-phone rule; never fake success
7. [ ] Portal links + redirects (`/clinic/:slug/*`, `/login`, `/register`)
8. [ ] SEO: metadata, canonical, OG/Twitter, sitemap (with images), robots, JSON-LD (Dentist, Physician ×3, BreadcrumbList, MedicalWebPage/Article, FAQPage, ImageObject), env noindex
9. [ ] `tenant/dr-sindhu.json` (suhasini.json schema, STARTER, whiteLabel false, invite flow, no passwords)
10. [ ] Tests: lint, tsc, vitest (schema, routing, booking fallback, popup, validation, redirects, plan gating), build, contrast
11. [ ] Lighthouse mobile+desktop × 6 pages → `docs/seo-reports/`; JSON-LD validation
12. [ ] Optional local ClinicFlow e2e booking (localhost only; else enquiry fallback)
13. [ ] Manual QA 360/768/1280, keyboard, reduced motion, DRSDC vs SMSDC screenshot, "Suhasini" grep
14. [ ] Docs: EDITING, SEO, BOOKING, UPGRADE_TO_ENTERPRISE, DRSDC_PendingItems; final report

Open/pending items: `pending_tasks_dr-sindhu.md` (work) and `DRSDC_PendingItems.md` (data to collect from the clinic).

## Checks before calling anything done

`npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run contrast` all pass; pages checked at 360/768/1280 px; `grep -ri suhasini .next public content src` returns nothing.
