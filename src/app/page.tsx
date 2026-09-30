import Image from 'next/image';
import Link from 'next/link';
import { BookButton } from '@/components/booking/BookButton';
import { ArticleCard, DoctorCard, TreatmentTile } from '@/components/cards';
import { HeroHoursChip } from '@/components/sections/HeroHoursChip';
import { Icon, WhatsAppIcon } from '@/components/ui/Icon';
import { OpenStatus } from '@/components/ui/OpenStatus';
import { Accordion, DraftBadge, SectionHead, TextLink } from '@/components/ui/primitives';
import { articles, categories, getImage, siteClinic, siteDoctors, siteFaqs, siteHome, sitePages, sitePlan, siteRouting } from '@/lib/content';
import { formatSession, groupDays, DAY_SHORT } from '@/lib/hours';
import { channels, directionsHref, generalWhatsappHref } from '@/lib/links';
import { patientBenefits } from '@/lib/plan';
import { pageMetadata } from '@/lib/seo';
import { fill, fullAddress } from '@/lib/vars';

export const metadata = pageMetadata({ path: '/', title: sitePages.home.title, description: sitePages.home.description, absoluteTitle: true });

export default function HomePage() {
  const h = siteHome;
  const hero = getImage(h.hero.image);
  const featured = articles.slice(0, 3);
  const homeFaqs = siteFaqs.items.filter((f) => f.home);
  const benefits = patientBenefits(sitePlan);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-mint blur-3xl" />
        <div className="container-site relative grid items-center gap-10 pb-16 pt-8 sm:pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:pb-24 lg:pt-16">
          <div>
            <p className="eyebrow">
              {h.hero.eyebrow} <DraftBadge status={h.status} />
            </p>
            <h1 className="mt-4 max-w-[15ch] text-balance">{h.hero.title}</h1>
            <p className="lead mt-5 max-w-xl">{h.hero.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BookButton className="btn-cta">
                <Icon name="calendar-check" /> {h.hero.primaryCta}
              </BookButton>
              <Link href={h.hero.secondaryCta.href} className="btn-ghost">
                {h.hero.secondaryCta.label}
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] text-textSecondary">
              {siteDoctors.map((d) => (
                <li key={d.id} className="flex items-center gap-2">
                  <Icon name="check" className="h-4 w-4 text-primary" strokeWidth={2.5} /> {d.specialty.replace(/ \(.+\)/, '')}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="overflow-hidden rounded-[42%_58%_46%_54%/48%_40%_60%_52%] shadow-lift ring-8 ring-surface">
              <Image src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} priority sizes="(min-width: 1024px) 40vw, 90vw" className="aspect-[8/9] w-full object-cover" />
            </div>
            <div className="absolute -left-2 top-8 flex items-center gap-2.5 rounded-2xl bg-surface px-4 py-3 text-sm font-semibold text-text shadow-lift motion-safe:animate-float sm:-left-8">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint text-primary">
                <Icon name={h.hero.chips[0].icon} className="h-5 w-5" />
              </span>
              <HeroHoursChip template={h.hero.chips[0].text} hours={siteClinic.hours.days} timeZone={siteClinic.timezone} fallback={fill(h.hero.chips[0].text)} />
            </div>
            <div className="absolute -right-2 bottom-10 flex items-center gap-2.5 rounded-2xl bg-surface px-4 py-3 text-sm font-semibold text-text shadow-lift motion-safe:animate-float [animation-delay:1.5s] sm:-right-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coralSoft text-cta">
                <Icon name={h.hero.chips[1].icon} className="h-5 w-5" />
              </span>
              {h.hero.chips[1].text}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- What's troubling you? ---------- */}
      <section aria-labelledby="symptoms" className="border-y border-border bg-surface">
        <div className="container-site py-12 sm:py-14">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_2fr] lg:items-center">
            <div>
              <p className="eyebrow">{h.symptoms.eyebrow}</p>
              <h2 id="symptoms" className="mt-2 text-3xl">
                {h.symptoms.title}
              </h2>
              <p className="mt-2 text-textSecondary">{h.symptoms.lead}</p>
            </div>
            <ul className="flex flex-wrap gap-2.5">
              {siteRouting.problems.map((p) => (
                <li key={p.id}>
                  <BookButton className="chip" prefill={{ problem: p.id }}>
                    <Icon name={p.icon} className="h-4 w-4 text-primary" /> {p.label}
                  </BookButton>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Treatments bento ---------- */}
      <section className="section" aria-labelledby="treatments">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead eyebrow={h.treatments.eyebrow} title={h.treatments.title} lead={fill(h.treatments.lead ?? '')} id="treatments" />
            <TextLink href="/treatments" className="mb-10">
              All treatments
            </TextLink>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:auto-rows-[minmax(190px,auto)] lg:grid-cols-4">
            {categories.map((c, i) => (
              <TreatmentTile key={c.slug} c={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Approach ---------- */}
      <section className="section bg-sand/60" aria-labelledby="approach">
        <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionHead eyebrow={h.approach.eyebrow} title={h.approach.title} lead={h.approach.lead} id="approach" />
            <TextLink href="/about">About the clinic</TextLink>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {h.approach.points.map((p, i) => (
              <li key={p.title} className={`reveal card p-6 ${i % 2 ? 'sm:translate-y-6' : ''}`}>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint text-primary">
                  <Icon name={p.icon} />
                </span>
                <h3 className="mt-4 text-lg">{p.title}</h3>
                <p className="mt-1.5 text-[0.95rem] text-textSecondary">{fill(p.text)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Doctors ---------- */}
      <section className="section" aria-labelledby="doctors">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead eyebrow={h.doctors.eyebrow} title={h.doctors.title} lead={fill(h.doctors.lead ?? '')} id="doctors" />
            <TextLink href="/doctors" className="mb-10">
              All doctors
            </TextLink>
          </div>
          <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0" aria-label="Doctors">
            {siteDoctors.map((d) => (
              <li key={d.id} className="w-[85%] shrink-0 snap-center xs:w-[70%] md:w-auto">
                <DoctorCard d={d} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Booking ---------- */}
      <section className="section on-dark relative overflow-hidden bg-primaryDeep text-onDark" aria-labelledby="booking">
        <div aria-hidden="true" className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-primary/40 blur-2xl" />
        <div className="container-site relative grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow !text-coralOnDark">{h.booking.eyebrow}</p>
            <h2 id="booking" className="mt-3 !text-onDark">
              {h.booking.title}
            </h2>
            <p className="mt-4 text-lg text-onDarkMuted">{h.booking.lead}</p>
            <ul className="mt-6 space-y-2.5">
              {benefits.map((b) => (
                <li key={b} className="flex gap-3">
                  <Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-coralOnDark" strokeWidth={2.5} /> {b}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <BookButton className="btn-cta">
                <Icon name="calendar-check" /> {h.cta.button}
              </BookButton>
              {generalWhatsappHref && (
                <a href={generalWhatsappHref} target="_blank" rel="noopener noreferrer" className="btn border border-onDark/30 text-onDark hover:bg-onDark/10">
                  <WhatsAppIcon /> Ask on WhatsApp
                </a>
              )}
            </div>
          </div>
          <div className="rounded-brand bg-onDark/5 p-6 ring-1 ring-onDark/15 sm:p-8">
            <h3 className="!text-onDark">{h.booking.stepsTitle}</h3>
            <ol className="mt-6 space-y-6">
              {h.booking.steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coralOnDark font-heading text-lg font-semibold text-dark">{i + 1}</span>
                  <span>
                    <span className="block font-semibold text-onDark">{s.title}</span>
                    <span className="text-onDarkMuted">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------- Education ---------- */}
      <section className="section" aria-labelledby="education">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead eyebrow={h.education.eyebrow} title={h.education.title} lead={h.education.lead} id="education" />
            <TextLink href="/patient-education" className="mb-10">
              All guides
            </TextLink>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
            {featured.map((a, i) => (
              <ArticleCard key={a.meta.slug} a={a.meta} big={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ + Visit ---------- */}
      <section className="section bg-surface" aria-labelledby="faq">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow={h.faq.eyebrow} title={h.faq.title} id="faq" />
            <Accordion items={homeFaqs.map((f) => ({ q: fill(f.q), a: fill(f.a) }))} name="home-faq" />
            <TextLink href="/faqs" className="mt-4">
              More questions
            </TextLink>
          </div>
          <div>
            <SectionHead eyebrow={h.visit.eyebrow} title={h.visit.title} lead={h.visit.lead} />
            <div className="card overflow-hidden">
              <div className="border-b border-border bg-mint/60 px-6 py-4">
                <OpenStatus hours={siteClinic.hours.days} timeZone={siteClinic.timezone} />
              </div>
              <dl className="divide-y divide-border px-6">
                {groupDays(siteClinic.hours.days).map((g) => (
                  <div key={g.days[0]} className="flex flex-wrap justify-between gap-2 py-3">
                    <dt className="font-semibold">{g.days.length > 1 ? `${DAY_SHORT[g.days[0]]} – ${DAY_SHORT[g.days[g.days.length - 1]]}` : DAY_SHORT[g.days[0]]}</dt>
                    <dd className="text-textSecondary">{g.sessions.length ? g.sessions.map(formatSession).join(', ') : 'Closed'}</dd>
                  </div>
                ))}
              </dl>
              <div className="border-t border-border px-6 py-5">
                <p className="flex gap-3">
                  <Icon name="map-pin" className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <span>
                    {fullAddress} <DraftBadge status={siteClinic.address.status} />
                  </span>
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href={directionsHref} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                    <Icon name="navigation" className="h-4 w-4" /> Directions
                  </a>
                  {channels.call && (
                    <a href={channels.call.href} className="btn-primary">
                      <Icon name="phone" className="h-4 w-4" /> {channels.call.display}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="container-site py-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-coralSoft px-6 py-12 text-center sm:px-12">
          <span aria-hidden="true" className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-mintStrong" />
          <span aria-hidden="true" className="absolute -bottom-12 -right-6 h-44 w-44 rounded-full bg-decorativeCoral/40" />
          <h2 className="relative">{h.cta.title}</h2>
          <p className="relative mx-auto mt-3 max-w-lg text-lg text-text">{h.cta.lead}</p>
          <BookButton className="btn-cta relative mt-7">
            <Icon name="calendar-check" /> {h.cta.button}
          </BookButton>
        </div>
      </section>
    </>
  );
}
