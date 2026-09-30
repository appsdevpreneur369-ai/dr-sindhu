# Editing the Dr. Sindhu Dental Clinic website

Everything the site says lives in `/content`. Components never contain clinic text, colours, phone numbers, hours or image paths. A mistake in a content file (a typo in a time, an unknown doctor id, a bad URL) **fails the build with the file and field named**, so a broken edit can't go live.

After any edit: `npm test && npm run build`. After a colour change also run `npm run contrast`.

## Status: approved vs placeholder

Every record carries `"status": "approved" | "placeholder"`. Build with `NEXT_PUBLIC_SHOW_PLACEHOLDER_BADGES=true` (staging) and every placeholder shows a small **Draft** badge, so the clinic can see at a glance what still needs confirming. When the clinic confirms something, change its status to `approved`.

## Which file do I edit?

| I want to change… | File | Notes |
| --- | --- | --- |
| Phone / WhatsApp number | `content/clinic.json` → `phone`, `whatsapp` | `e164` must be `+91` + 10 digits. While `status` is `placeholder`, all Call/WhatsApp buttons disappear automatically, the number is left out of Google's structured data and WhatsApp booking is switched off. |
| Email | `clinic.json` → `email` | Set `value` and `status: "approved"` — the email link appears on Contact/footer and in JSON-LD. |
| Address, PIN, landmark | `clinic.json` → `address` | `postalCode` must be 6 digits or empty. |
| Google Maps pin | `clinic.json` → `maps.shareUrl` (share link) and `maps.embedUrl` (Share → Embed a map → the `src` URL) | Until then the Contact page shows a map *search* for Ashramam Road, labelled approximate. |
| Opening hours / working days | `clinic.json` → `hours.days` | Several sessions per day allowed. Set `daysStatus: "approved"` when the clinic confirms Mon–Sat. |
| Colours / fonts | `content/brand.json` | Then `npm run contrast` (must pass) and `npm run brand` (icons + share image). Fonts must be registered in `src/lib/theme.ts` (Roboto + Montserrat today). No red colours (owner's rule). |
| Logo | Replace `images/dr-sindhu-logo.png` (mark), then `npm run brand` | Builds `public/brand/logo-mark.png`, favicon, app icons and the social-share image. Paths live only in `content/images.json`. A logo-with-name is published only if `logo.full` is set — the supplied one says "& Implant Centre" and is intentionally unused; the name is "Dr. Sindhu Dental Clinic". |
| Any photo | `content/images.json` | Put the file in `public/images/photos/`, update `src`, `width`, `height`, `alt`, set `status: "approved"` and remove `credit`. `npm run build` pre-generates the WebP sizes automatically. Current photos are representative stock images (credits in `content/photo-credits.json`). |
| Clinic gallery | `content/gallery.json` (+ `images.json`) | Replace the placeholder illustrations with real photos. |
| Doctors | `content/doctors.json` | See "Renaming a doctor" below. `photo`: an image id, or `null` for an initials avatar. |
| Treatments & sub-treatments | `content/services.json` (each category has an `image` id) | Visit counts always say "usually". **Never add prices.** `confirmSpecialist: true` shows the "first consultation with Dr. Sindhu" note. |
| "What's troubling you?" chips | `content/routing.json` | Each chip lists doctor ids and a treatment category. |
| Home page wording | `content/home.json` | Every `stats` item must name its `source`. `beforeAfter` stays empty until real, consented photos exist. |
| About page | `content/about.json` | |
| FAQs | `content/faqs.json` (general) and each category's `faqs` in `services.json` | `"home": true` also shows it on the home page. `{{hoursSummary}}` is filled in from the hours. |
| Patient education articles | `content/education/<slug>.md` | Front-matter is validated; the file name must equal the `slug`. `image` is an id in `images.json`, `reviewedBy` a doctor id. |
| Legal pages | `content/legal/*.md` | Marked **Draft** until `draft: false`. |
| Page titles & meta descriptions | `content/pages.json` | Titles ≤ 60 characters incl. the automatic " \| Dr. Sindhu Dental, Tadepalli"; descriptions 120–160. |
| Menus | `content/navigation.json` | `href` may be a site path, `@portal:login` / `@portal:register` / `@portal:staffLogin`, `@call`, `@whatsapp` or an `https://` URL. Placeholder targets are hidden. |
| Social media | `content/social.json` | Empty `url` = greyed-out, non-clickable icon. |
| Booking popup timing, consent text, messages | `content/booking.json` | See `docs/BOOKING.md`. |
| ClinicFlow portal links | `content/portal.json` | Sign in / Register / Staff login. |
| Plan (Starter → Enterprise) | `content/plan.json` | See `docs/UPGRADE_TO_ENTERPRISE.md`. |

## Renaming a doctor (minimal effort)

Doctors are referenced everywhere by a permanent `id` (`periodontist`, `oral-surgeon`, `endodontist`), never by name. To rename one:

1. In `content/doctors.json` change `firstName`, `lastName`, `displayName`, `initials`.
2. Set a new `slug` (e.g. `dr-sindhu-reddy`) and move the old one into `previousSlugs` — the old URL then redirects (308) automatically.
3. `npm run tenant` to refresh `tenant/dr-sindhu.json`, then `npm test && npm run build`.

Nothing else needs touching: treatment pages, booking, JSON-LD and the sitemap all follow.

## Copy rules

- All wording is original. Don't paste text from other clinic websites (duplicate content hurts both in Google).
- Cautious medical language: "linked with", "may help", "usually". No promises of results.
- Never invent reviews, ratings, patient counts, awards, years of experience or prices.
- No stock photos of people presented as our doctors or patients.
