# Pending tasks — Dr. Sindhu Dental Clinic (DRSDC)

Last updated: 2026-09-30 (local build complete). Data to collect from the clinic is tracked separately in **`DRSDC_PendingItems.md`**.

## A. Decisions for the account owner

- [x] Official clinic name: **"Dr. Sindhu Dental Clinic"** (30 Sep 2026). Title-logo artwork with "& Implant Centre" not published; corrected artwork requested (DRSDC_PendingItems #6).
- [x] Fonts use `display: 'optional'` (30 Sep 2026) — removes the font-swap layout shift.
- [ ] Palette: the site uses the specified sage/coral palette; the new logo is blue + leaf green. Keep, or tint the palette toward the logo?
- [ ] Approve deploying a staging site (Cloud Run service, URL, build args) — not done, LOCAL ONLY so far.
- [ ] Approve onboarding `tenant/dr-sindhu.json` to staging/production and adding the site origin to the API's CORS list.

## B. After the clinic supplies data (see DRSDC_PendingItems.md)

- [ ] Fill clinic.json (email, PIN, landmark, Maps), set statuses to approved
- [ ] Real logo/photos → `npm run brand`, gallery, doctor photos
- [ ] Doctor surnames + registration numbers → doctors.json → `npm run tenant`
- [ ] Legal and article reviews → set `draft: false` / `reviewStatus: reviewed`
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain; re-run Lighthouse + `scripts/qa/seo-audit.mjs`; Rich Results Test on the live URL

## C. When going live with booking

- [ ] Onboard tenant (STARTER), then super-admin sets clinic **ACTIVE** (importer does not), set doctor durations (15 min) + weekly schedules (Mon–Sat 10:00–21:00, break 14:00–17:00)
- [ ] `booking.json` → `apiBaseUrl`, `clinicSlug` (or `NEXT_PUBLIC_CLINICFLOW_*` build args)
- [ ] API `APP_CORS_ALLOWEDORIGINS` += site origin (owner approval)
- [ ] Real doctor login emails (invite flow; no passwords in files)

## D. Core (ClinicFlow) observations from local testing — for the ClinicFlow team, not this repo

- [ ] `GALLERY_NOT_ENTITLED` message says "upgrade to Starter or above" but the gate is Pro+ since 21 Aug 2026 (`ErrorCode.java` text is stale).
- [ ] `onboard_tenant.py` doesn't set clinic status ACTIVE; `D:\ClinicFlow\CLAUDE.md` lists seeded super-admin (seeded login), but migration V9 seeds (seeded login, not repeated here).
- [ ] Guest booking with an email that already has a patient login fails with `AUTH_EMAIL_ALREADY_EXISTS` — consider attaching the booking to the existing patient instead.

## E. Later

- [ ] Enterprise upgrade offer (~1 month after launch) — `docs/UPGRADE_TO_ENTERPRISE.md`
- [ ] Telugu version (SMSDC has one; not in scope for DRSDC v1)
- [ ] Before/after gallery and counters only with real, consented data
