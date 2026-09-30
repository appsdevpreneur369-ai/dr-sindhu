# DRSDC — items to collect from Dr. Sindhu

Last updated 30 Sep 2026. Everything below is live on the site as a **placeholder** (shown with a "Draft" badge on staging). Where each value goes: `docs/EDITING.md`.

| # | Item | Why it matters | Current placeholder | Where it goes |
| --- | --- | --- | --- | --- |
| 1 | **Clinic email** | Contact page, footer, Google structured data | "email to be confirmed" (hidden) | `content/clinic.json → email` |
| 2 | **PIN code, door number, landmark** on Ashramam Road | Address everywhere, Google | "Ashramam Road, Tadepalli" | `clinic.json → address` |
| 3 | **Google Maps pin** (share link + embed) | Directions button, map, `hasMap` | Map search for "Ashramam Road, Tadepalli" | `clinic.json → maps` |
| 4 | **Working days** | Timings, open/closed now, booking days, doctor schedules | Mon–Sat, Sunday closed (sessions 10–2 & 5–9 are confirmed) | `clinic.json → hours`, doctors' `consultation` |
| 5 | Each **doctor's consultation days/times** | Booking slots | All three: Mon–Sat 10–2 & 5–9 | `doctors.json → consultation` |
| 6 | **Corrected logo-with-name** | Name decided: **"Dr. Sindhu Dental Clinic"** (no "& Implant Centre"). The supplied title artwork shows the longer name, so it is not used; ask the designer for a version with the correct name. Signboard and Google Business Profile must use the same name. | Tooth mark + text wordmark | `images/*.png` → `images.json logo.full` → `npm run brand` |
| 7 | **Doctor photos** | Trust; initials avatars until then | Initials | `images.json` + `doctors.json → photo` |
| 8 | **Doctors' full names** (surnames) and **State Dental Council registration numbers** | Required on e-prescriptions; shown on doctor pages | "Dr. Sindhu", "Dr. Preethi", "Dr. Naveen Kumar"; `PENDING-VERIFICATION-<NAME>` | `doctors.json` (rename guide in EDITING.md) |
| 9 | **Implants (prosthetic part), dentures, braces/aligners** — is there a visiting specialist, or does Dr. Sindhu handle them? | Routing and treatment pages | Routed to Dr. Sindhu for a first consultation, with a note | `services.json`, `routing.json` |
| 10 | **Clinic photos** (exterior with signboard, reception, treatment room, sterilisation, X-ray) | Gallery, About, Google | Illustrations marked "Photo coming soon" | `gallery.json`, `images.json` |
| 11 | **Doctors' bios** — check and approve the short factual bios | Accuracy | Written from speciality only; no years/awards | `doctors.json → bio` |
| 12 | **Social media profiles** (Instagram, YouTube, X, LinkedIn, Facebook) | Footer, `sameAs` | Greyed-out icons | `social.json` |
| 13 | **Domain name** | Canonical URLs, sitemap, email | none | `NEXT_PUBLIC_SITE_URL` |
| 14 | **Legal page review** (Privacy — DPDP Act 2023, Terms, Medical Disclaimer, Cookies) + a named **grievance officer** | Legal compliance | Drafts | `content/legal/*.md` |
| 15 | **Patient education review** — each article names the reviewing doctor | Medical accuracy | "Review pending" | `content/education/*.md → reviewStatus` |
| 16 | **Login emails** for the owner and each doctor (ClinicFlow accounts) | Onboarding | Placeholder aliases of our own test inbox | `scripts/build-tenant.mjs` |
| 17 | Confirm the **consent wording** on the booking form | DPDP consent | Draft sentence | `booking.json → consent` |
| 18 | Google Business Profile items | Local search | see `GBP-Checklist.txt` | — |

Already confirmed: clinic name (as text), Ashramam Road / Tadepalli, session times, phone + WhatsApp **+91 94416 95953** (30 Sep 2026), the three consultants work at the clinic.
