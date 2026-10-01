import Image from 'next/image';
import Link from 'next/link';
import { BookButton } from '@/components/booking/BookButton';
import { ArticleCard, DoctorCard, TreatmentCard } from '@/components/cards';
import { HeroHoursChip } from '@/components/sections/HeroHoursChip';
import { Icon, WhatsAppIcon } from '@/components/ui/Icon';
import { OpenStatus } from '@/components/ui/OpenStatus';
import { Accordion, DraftBadge, SectionHead } from '@/components/ui/primitives';
import { articles, categories, getImage, siteClinic, siteDoctors, siteFaqs, siteGallery, siteHome, sitePages, sitePlan, siteRouting } from '@/lib/content';
import { dayRangeShort, formatSessions, groupDays } from '@/lib/hours';
import { channels, directionsHref, generalWhatsappHref } from '@/lib/links';
import { patientBenefits } from '@/lib/plan';
import { pageMetadata } from '@/lib/seo';
import { fill, fullAddress } from '@/lib/vars';

export const metadata = pageMetadata({ path: '/', title: sitePages.home.title, description: sitePages.home.description, absoluteTitle: true });

export default function HomePage() {
  const h = siteHome;
  const hero = getImage(h.hero.image);
  const about = getImage(h.about.image);
  const homeFaqs = siteFaqs.items.filter((f) => f.home);
  const [hoursChip, expChip, bookChip] = h.hero.chips;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky via-surface to-greenSoft">
        <div aria-hidden="true" className="bg-dots pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-60" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-skyStrong/60 blur-3xl" />
        <div className="container-site relative grid items-center gap-12 pb-24 pt-10 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:pb-32 lg:pt-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-surface px-4 py-2 text-sm font-semibold text-primaryDeep shadow-soft">
              <span className="h-2 w-2 rounded-full bg-leaf" aria-hidden="true" /> {h.hero.badge} <DraftBadge status={h.status} />
            </p>
            <h1 className="mt-6">
              <span className="block">{h.hero.titleLine1}</span>
              <span className="block bg-gradient-to-r from-primary to-green bg-clip-text text-transparent">{h.hero.titleLine2}</span>
            </h1>
            <p className="lead mt-6 max-w-xl">{h.hero.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BookButton className="btn-cta">
                <Icon name="calendar-check" /> {h.hero.primaryCta}
              </BookButton>
              <Link href={h.hero.secondaryCta.href} className="btn-ghost">
                {h.hero.secondaryCta.label} <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] font-medium text-text">
              {h.hero.checks.map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green text-onDark">
                    <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div aria-hidden="true" className="absolute -right-4 -top-4 h-full w-full rounded-[2rem] bg-gradient-to-br from-primary to-green opacity-90" />
            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
              <Image src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} priority sizes="(min-width: 1024px) 42vw, 90vw" className="aspect-[6/7] w-full object-cover" />
            </div>
            <div className="absolute -left-3 top-8 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-lift sm:-left-10">
              <span className="icon-tile !h-10 !w-10">
                <Icon name={hoursChip.icon} className="h-5 w-5" />
              </span>
              <span className="text-[0.74rem] font-semibold leading-snug text-text xs:text-[0.8rem] sm:text-sm">
                <HeroHoursChip hours={siteClinic.hours.days} timeZone={siteClinic.timezone} fallback={fill(hoursChip.text)} />
              </span>
            </div>
            <div className="absolute -right-3 top-1/2 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-lift sm:-right-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-greenSoft text-green">
                <Icon name={expChip.icon} className="h-5 w-5" />
              </span>
              <span className="leading-tight">
                <span className="block font-heading text-sm font-bold text-text">{expChip.text}</span>
                <span className="text-xs text-textSecondary">{expChip.sub}</span>
              </span>
            </div>
            <div className="absolute -bottom-5 left-8 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-lift">
              <span className="icon-tile !h-10 !w-10">
                <Icon name={bookChip.icon} className="h-5 w-5" />
              </span>
              <span className="leading-tight">
                <span className="block font-heading text-sm font-bold text-text">{bookChip.text}</span>
                <span className="text-xs text-textSecondary">{bookChip.sub}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Stats strip ---------- */}
      <section aria-label="Clinic at a glance" className="container-site relative z-10 -mt-12 lg:-mt-16">
        <ul className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-surface shadow-lift lg:grid-cols-4">
          {h.stats.items.map((s, i) => (
            <li key={s.label} className={`flex items-center gap-4 border-border p-5 sm:p-6 ${i % 2 ? '' : 'border-r'} ${i < 2 ? 'border-b lg:border-b-0' : ''} ${i === 1 ? 'lg:border-r' : ''}`}>
              <span className="icon-tile hidden sm:flex">
                <Icon name={s.icon} className="h-6 w-6" />
              </span>
              <span>
                <span className="block font-heading text-3xl font-black text-primary">{fill(s.value)}</span>
                <span className="block font-heading text-[0.95rem] font-bold text-text">{s.label}</span>
                <span className="block text-xs text-textSecondary">{s.sub}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- About (second section) ---------- */}
      <section className="section" aria-labelledby="about">
        <div className="container-site grid items-center gap-14 lg:grid-cols-2">
          <div className="relative">
            <div aria-hidden="true" className="bg-dots absolute -bottom-6 -left-6 h-40 w-40" />
            <div className="relative overflow-hidden rounded-3xl shadow-lift">
              <Image src={about.src} alt={about.alt} width={about.width} height={about.height} sizes="(min-width:1024px) 45vw, 100vw" className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 right-6 rounded-2xl bg-gradient-to-br from-primary to-primaryDeep px-6 py-5 text-onDark shadow-lift">
              <span className="block font-heading text-4xl font-black">{h.about.badgeValue}</span>
              <span className="block font-heading text-sm font-medium text-onDarkMuted">{h.about.badgeLabel}</span>
            </div>
          </div>
          <div>
            <p className="eyebrow">{h.about.eyebrow}</p>
            <h2 id="about" className="mt-3 text-balance">
              {h.about.title}
            </h2>
            {h.about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="mt-4 text-textSecondary">
                {p}
              </p>
            ))}
            <ul className="mt-6 space-y-3">
              {h.about.points.map((p) => (
                <li key={p} className="flex items-center gap-3 font-medium">
                  <Icon name="badge-check" className="h-5 w-5 shrink-0 text-green" /> {p}
                </li>
              ))}
            </ul>
            <Link href={h.about.cta.href} className="btn-primary mt-8">
              {h.about.cta.label} <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Treatments ---------- */}
      <section className="section bg-surfaceAlt" aria-labelledby="treatments">
        <div className="container-site">
          <SectionHead eyebrow={h.treatments.eyebrow} title={h.treatments.title} lead={fill(h.treatments.lead ?? '')} id="treatments" center />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <li key={c.slug}>
                <TreatmentCard c={c} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- What's troubling you? ---------- */}
      <section className="section" aria-labelledby="symptoms">
        <div className="container-site">
          <SectionHead eyebrow={h.symptoms.eyebrow} title={h.symptoms.title} lead={h.symptoms.lead} id="symptoms" center />
          <ul className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {siteRouting.problems.map((p) => (
              <li key={p.id}>
                <BookButton prefill={{ problem: p.id }} className="group flex min-h-[64px] w-full items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-3 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lift">
                  <span className="icon-tile !h-11 !w-11 group-hover:bg-primary group-hover:text-onDark">
                    <Icon name={p.icon} className="h-5 w-5" />
                  </span>
                  <span className="flex-1 font-heading font-bold text-text">{p.label}</span>
                  <Icon name="arrow-right" className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
                </BookButton>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Doctors ---------- */}
      <section className="section bg-surfaceAlt" aria-labelledby="doctors">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead eyebrow={h.doctors.eyebrow} title={h.doctors.title} lead={fill(h.doctors.lead ?? '')} id="doctors" />
            <Link href="/doctors" className="btn-ghost mb-10 sm:mb-12">
              Meet all doctors
            </Link>
          </div>
          <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0" aria-label="Doctors">
            {siteDoctors.map((d, i) => (
              <li key={d.id} className="w-[85%] shrink-0 snap-center xs:w-[70%] md:w-auto">
                <DoctorCard d={d} index={i} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Why choose us ---------- */}
      <section className="section" aria-labelledby="why">
        <div className="container-site">
          <SectionHead eyebrow={h.why.eyebrow} title={h.why.title} id="why" center />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {h.why.points.map((p) => (
              <li key={p.title} className="reveal group rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primaryDeep text-onDark shadow-soft">
                  <Icon name={p.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5">{p.title}</h3>
                <p className="mt-2 text-[0.95rem] text-textSecondary">{fill(p.text)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="on-dark section relative overflow-hidden bg-navy" aria-labelledby="steps">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-primary/30 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-green/25 blur-3xl" />
        <div className="container-site relative">
          <SectionHead eyebrow={h.steps.eyebrow} title={h.steps.title} id="steps" center onDark />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {h.steps.items.map((s, i) => (
              <li key={s.title} className="relative rounded-2xl border border-onDark/10 bg-onDark/5 p-6 backdrop-blur">
                <span className="absolute right-5 top-6 font-heading text-xs font-bold uppercase tracking-[0.16em] text-greenOnDark">Step {i + 1}</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green text-onDark">
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 !text-onDark">{s.title}</h3>
                <p className="mt-2 text-[0.95rem] text-onDarkMuted">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-col items-center gap-6 rounded-2xl border border-onDark/10 bg-onDark/5 p-6 lg:flex-row lg:justify-between">
            <ul className="grid flex-1 gap-x-8 gap-y-2 sm:grid-cols-2">
              {patientBenefits(sitePlan).slice(0, 4).map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-[0.95rem] text-onDarkMuted">
                  <Icon name="check" className="h-4 w-4 shrink-0 text-greenOnDark" strokeWidth={3} /> {b}
                </li>
              ))}
            </ul>
            <div className="flex shrink-0 flex-wrap justify-center gap-3 lg:flex-nowrap">
              <BookButton className="btn-green whitespace-nowrap">
                <Icon name="calendar-check" /> Book Appointment
              </BookButton>
              {generalWhatsappHref && (
                <a href={generalWhatsappHref} target="_blank" rel="noopener noreferrer" className="btn whitespace-nowrap border-2 border-onDark/25 text-onDark hover:bg-onDark/10">
                  <WhatsAppIcon /> WhatsApp us
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Gallery strip ---------- */}
      <section className="section" aria-labelledby="gallery">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead eyebrow={h.gallery.eyebrow} title={h.gallery.title} lead={h.gallery.lead} id="gallery" />
            <Link href="/gallery" className="btn-ghost mb-10 sm:mb-12">
              View gallery
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {siteGallery.items.slice(0, 4).map((g) => {
              const img = getImage(g.image);
              return (
                <li key={g.image} className="reveal group overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
                  <div className="overflow-hidden">
                    <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(min-width:1024px) 25vw, 50vw" className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <p className="px-4 py-3 font-heading text-sm font-bold">{g.caption}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------- Education ---------- */}
      <section className="section bg-surfaceAlt" aria-labelledby="education">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead eyebrow={h.education.eyebrow} title={h.education.title} lead={h.education.lead} id="education" />
            <Link href="/patient-education" className="btn-ghost mb-10 sm:mb-12">
              All guides
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {articles.slice(0, 3).map((a) => (
              <ArticleCard key={a.meta.slug} a={a.meta} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ + Visit ---------- */}
      <section className="section" aria-labelledby="faq">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow={h.faq.eyebrow} title={h.faq.title} id="faq" />
            <Accordion items={homeFaqs.map((f) => ({ q: fill(f.q), a: fill(f.a) }))} name="home-faq" />
            <Link href="/faqs" className="mt-5 inline-flex min-h-[44px] items-center gap-1 font-heading font-bold text-primary hover:underline">
              More questions <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>
          <div>
            <SectionHead eyebrow={h.visit.eyebrow} title={h.visit.title} lead={h.visit.lead} />
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-primary to-primaryHover px-6 py-4 text-onDark">
                <span className="font-heading font-bold">Clinic timings</span>
                <span className="rounded-full bg-surface px-3 py-1 text-sm">
                  <OpenStatus hours={siteClinic.hours.days} timeZone={siteClinic.timezone} />
                </span>
              </div>
              <dl className="divide-y divide-border px-6">
                {groupDays(siteClinic.hours.days).map((g) => (
                  <div key={g.days[0]} className="flex flex-wrap justify-between gap-2 py-3.5">
                    <dt className="font-heading font-bold">{dayRangeShort(g.days)}</dt>
                    <dd className="text-textSecondary sm:text-right">{g.sessions.length ? formatSessions(g.sessions) : 'Closed'}</dd>
                  </div>
                ))}
              </dl>
              <div className="border-t border-border bg-surfaceAlt px-6 py-5">
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
      <section className="container-site pb-20">
        <div className="on-dark relative overflow-hidden rounded-3xl bg-gradient-to-r from-primaryDeep via-primary to-primaryHover px-6 py-14 text-center sm:px-12">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(rgb(255_255_255/0.4)_1px,transparent_1px)] [background-size:20px_20px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-leaf/30 blur-2xl" />
          <h2 className="relative !text-onDark">{h.cta.title}</h2>
          <p className="relative mx-auto mt-3 max-w-lg text-lg text-onDark">{h.cta.lead}</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <BookButton className="btn-light">
              <Icon name="calendar-check" /> {h.cta.button}
            </BookButton>
            {channels.call && (
              <a href={channels.call.href} className="btn border-2 border-onDark/40 text-onDark hover:bg-onDark/10">
                <Icon name="phone" className="h-4 w-4" /> {channels.call.display}
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
