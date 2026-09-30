# Booking

Every **Book** button (header, hero, symptom chips, doctor cards, treatment pages, sticky mobile bar) opens the same popup. `/book` shows the same wizard inline and accepts deep links: `/book?problem=toothache`, `/book?treatment=gum-care`, `/book?doctor=dr-preethi`.

**Flow:** problem → doctor → date → time → your details → SMS code (OTP) → confirmation.

## Auto popup

`content/booking.json → popup`: opens once per browsing session after `delaySeconds` (8), never on page load, never on `excludedPaths` (`/book`, legal pages, `/emergency`), never again after the visitor closed it or booked. Rules: `src/lib/booking/popupRules.ts` (unit-tested). On phones it is a full-height sheet. Esc/✕/backdrop close it; focus is trapped inside and returned to the opener.

## Modes and automatic fallback

`booking.json → mode` is the preferred mode. On opening, the site checks health and falls back in this order, **never showing a success the API did not return**:

| Mode | What happens | Needs |
| --- | --- | --- |
| `clinicflow` | Live slots from ClinicFlow247, SMS OTP, real appointment via `POST /appointments/guest-book`. Shows the status the API returned (e.g. CONFIRMED). | `apiBaseUrl` + `clinicSlug`, clinic ACTIVE on ClinicFlow, at least one doctor matched, this site's origin in the API's CORS list |
| `enquiry` | Sends a real lead (`POST /clinics/public/{slug}/leads`). Wording: "Request sent … not a confirmed appointment yet". | API reachable |
| `whatsapp` | Opens a pre-filled `wa.me` message. Wording: "the appointment is confirmed only when the clinic replies". | **Approved** WhatsApp number in `clinic.json` |
| *(unavailable)* | "Online booking is not available right now … Nothing has been sent", plus a Call button if the phone is approved. | — |

**Placeholder-phone rule:** while `clinic.json → whatsapp.status` is `placeholder` (or the number isn't a real +91 mobile), WhatsApp is removed from the chain, so `enquiry` is the final fallback. Unit-tested in `tests/booking.test.ts`.

**Today:** `apiBaseUrl` and `clinicSlug` are empty (the clinic is not onboarded yet) and the WhatsApp number is approved, so the live site uses **WhatsApp mode**. Once the clinic is onboarded, set in `booking.json` (or at build time):

```
NEXT_PUBLIC_CLINICFLOW_API_URL=https://<api>/api/v1
NEXT_PUBLIC_CLINICFLOW_CLINIC_SLUG=dr-sindhu-dental-clinic
NEXT_PUBLIC_CLINICFLOW_CLINIC_ID=            # optional, looked up from the slug
NEXT_PUBLIC_BOOKING_OTP_HINT=123456          # staging only, while SMS is in dry-run
```

…and add the site's origin to the API's `APP_CORS_ALLOWEDORIGINS` (needs the owner's approval on staging/production).

## Architecture (ported from the SMSDC site)

- `src/lib/booking/services.ts` — `BookingService` + `ClinicFlowBookingService` / `EnquiryBookingService` / `WhatsAppBookingService`, `resolveBookingService` (health check + fallback). No mock service in `src/`.
- `src/lib/booking/api.ts` — zod response schemas and error mapping (rate limit, slot taken, bad OTP, **email already registered**, generic conflict).
- `src/app/api/clinicflow/[...path]` — same-origin, allow-listed, read-only GET proxy (clinic, branches, doctors, slots). POSTs (OTP, guest-book, leads) go **straight from the visitor's browser**, because ClinicFlow rate-limits guest booking per IP (5 per 15 min).
- Doctors are matched to ClinicFlow by `clinicflowDoctorId` if set, else by first name (+ last name when the website has one). Don't pin staging IDs in `doctors.json` — the file also feeds production.
- Before booking, the chosen slot is re-checked uncached; if taken, the visitor is sent back to the time step with a fresh list.
- Starter-plan benefits listed around the form come from `src/lib/plan.ts` (email confirmation/reminders, WhatsApp and SMS reminders, live queue, digital prescriptions). Nothing beyond the plan is promised.

## Tests

- `npm test` — fallback order incl. the placeholder-phone rule, health check with stubbed `fetch` (not configured / CORS blocked / doctors missing / healthy), enquiry never fakes success, error-code mapping, popup rules, phone/email/name validation, routing map.
- End-to-end against a **local** ClinicFlow API only: `scripts/qa/e2e-booking.mjs` (see the final report for the run of 30 Sep 2026). Scenarios: auto-popup → full booking with OTP 123456; doctors API down → enquiry lead; API unreachable → WhatsApp; no second auto-open; duplicate email → "email already has a patient account".

## Known core behaviours (ClinicFlow, not this repo)

- New clinics start **PENDING**; a super-admin must set them ACTIVE before the public booking endpoints answer (the importer doesn't).
- Guest booking creates a patient login for the email; a second guest booking with the same email is refused (`AUTH_EMAIL_ALREADY_EXISTS`). The site now tells the visitor to sign in on the portal or use another email.
- Core requires a doctor surname; single-name doctors are stored as "<Name> MDS". The site shows its own display name.
