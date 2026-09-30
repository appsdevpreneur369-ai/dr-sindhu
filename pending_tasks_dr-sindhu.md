# Pending tasks — Dr. Sindhu Dental Clinic (DRSDC)

Last updated: 2026-09-30. Tick items off as they close; add new ones at the bottom of the right section.

## A. Waiting on the owner (blocks the build)

- [ ] "go" on the plan (palette, fonts, structure)
- [ ] Decision: logo source — the only icon file (`suhasini-logo-512.png`) has "Suhasini" in its filename. Proposal: redraw the tooth mark as a new SVG in DRSDC colours (no file copied, no "Suhasini" anywhere).
- [ ] Decision: doctor names — Dr. Sindhu / Dr. Preethi / Dr. Naveen Kumar are *also* listed as SMSDC consultants (same specialities) in `suhasini.json`. Confirm this is intended (shared consultants) or supply different placeholder names.

## B. Data to collect from Dr. Sindhu (mirrors DRSDC_PendingItems.md)

- [ ] Clinic phone / WhatsApp number
- [ ] Clinic email
- [ ] PIN code, door number, landmark on Ashramam Road
- [ ] Google Maps pin / share link
- [ ] Working days (assumed Mon–Sat, Sunday closed)
- [ ] Final logo (current one is a placeholder)
- [ ] Doctor photos (initials avatars until then)
- [ ] Doctors' real full names and State Dental Council registration numbers
- [ ] Who handles implants (prosthetic), dentures and orthodontics — currently routed to Dr. Sindhu for consultation
- [ ] Clinic photos for the Gallery
- [ ] Social media URLs (Instagram, YouTube, X, LinkedIn, Facebook)
- [ ] Domain name
- [ ] Review of legal page drafts (Privacy/DPDP, Terms, Disclaimer, Cookies)
- [ ] Google Business Profile items (see `GBP-Checklist.txt`)

## C. Later (outside this local build)

- [ ] Staging plan: Cloud Run service, staging URL, CORS origin on the ClinicFlow API — needs explicit approval
- [ ] Onboard `tenant/dr-sindhu.json` to staging/production — needs explicit approval
- [ ] Fill `content/booking.json` clinicSlug / clinicId / apiBaseUrl after onboarding
- [ ] Enterprise upgrade offer (~1 month after launch) — see `docs/UPGRADE_TO_ENTERPRISE.md`
