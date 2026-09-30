# Upgrade to Enterprise (₹4,999/month)

The clinic starts on **STARTER (₹1,199/month)** plus this free custom website. The website was built so that the Enterprise upgrade (planned ~1 month after launch) is a **configuration change, not a rebuild**.

## What switches on with Enterprise

| Feature | Starter today | With Enterprise |
| --- | --- | --- |
| Clinic-branded ClinicFlow pages (login, registration, booking, patient portal) | Standard ClinicFlow247 branding | Clinic logo, colours and fonts (already prepared: `_enterpriseThemeTokens` in `tenant/dr-sindhu.json`) |
| Custom subdomain | `clinicflow247.com/clinic/dr-sindhu-dental-clinic/...` | e.g. `drsindhu.clinicflow247.com` — the website's Sign in / Register links and `/login`, `/register`, `/clinic/*` redirects switch automatically |
| Post-visit thank-you & Google review requests | — | Automated after each visit |
| Analytics dashboard | — | Appointment and patient analytics |
| Treatments & clinic gallery inside ClinicFlow | — (core: Pro and above) | Import the 9 treatments (`_upgradeTreatments`) |
| No-show prevention & reception alerts, win-back campaigns, waitlist | — | On; the website's "After you book" list gains "Join a waitlist" automatically |
| Custom appointment fields, dedicated onboarding & support | — | On |
| WhatsApp / SMS reminders | 1,000 / month each | 5,000 / month each |

(Source of truth for plan features: `D:\ClinicFlow\clinicflow-frontend\src\components\landing\pricingData.ts`, mirrored in `src/lib/plan-matrix.mjs`.)

## Exactly what to change

**Website repo (this one)**

1. `content/plan.json` → `{ "plan": "enterprise" }`
2. `content/portal.json` → `enterprise.subdomain` = the agreed subdomain (e.g. `"drsindhu"`). Only used when the plan is Enterprise (unit-tested).
3. Optional: `content/social.json` → the Google review link once review requests are live.
4. `npm run tenant` (regenerates `tenant/dr-sindhu.json` with plan ENTERPRISE and the treatments list), `npm test`, `npm run build`, redeploy.

**ClinicFlow (with the owner's approval, on the target environment)**

1. `PATCH /clinics/{id}/plan {"plan":"ENTERPRISE"}` (white-label is derived from the plan).
2. Upload the logo/favicon (`public/brand/logo-mark.png`; a logo-with-name only once a corrected artwork reading "Dr. Sindhu Dental Clinic" exists) and apply `_enterpriseThemeTokens` as `themeTokens`.
3. Import the treatments (`_upgradeTreatments`) — re-running the importer with the regenerated file is idempotent.
4. Set up the subdomain (tenant app + load-balancer host rule, per `D:\ClinicFlow\CLAUDE.md`).
5. Configure the Google review link for review requests.

Nothing in the website's components needs editing.
