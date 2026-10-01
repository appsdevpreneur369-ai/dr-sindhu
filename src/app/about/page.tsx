import Image from 'next/image';
import Link from 'next/link';
import { BookButton } from '@/components/booking/BookButton';
import { DoctorCard } from '@/components/cards';
import { PageHeader } from '@/components/layout/PageHeader';
import { Icon } from '@/components/ui/Icon';
import { Avatar, ContentImage, DraftBadge, SectionHead } from '@/components/ui/primitives';
import { getImage, headDoctor, siteAbout, siteDoctors, sitePages, sitePlan } from '@/lib/content';
import { patientBenefits } from '@/lib/plan';
import { pageMetadata } from '@/lib/seo';

const p = sitePages.about;
export const metadata = pageMetadata({ path: '/about', title: p.title, description: p.description });

export default function AboutPage() {
  const a = siteAbout;
  const headPhoto = headDoctor.photo ? getImage(headDoctor.photo) : null;
  return (
    <>
      <PageHeader title={p.h1!} intro={p.intro} image={getImage('clinic-front-office')} imageLayout="wide" crumbs={[{ name: 'About', path: '/about' }]} badge={<DraftBadge status={a.status} onDark />} />
      <section className="section">
        <div className="container-site grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="prose-site">
            <h2 className="!mt-0">{a.story.title}</h2>
            {a.story.paragraphs.map((t) => (
              <p key={t.slice(0, 20)}>{t}</p>
            ))}
          </div>
          <ContentImage img={getImage(a.story.image)} className="shadow-lift" sizes="(min-width:1024px) 45vw, 100vw" />
        </div>
      </section>
      {/* ---------- Clinic head: large portrait (face kept in frame via objectPosition) ---------- */}
      <section className="section bg-surfaceAlt" aria-labelledby="clinic-head">
        <div className="container-site grid items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
          {headPhoto ? (
            <div className="relative mx-auto w-full max-w-[420px] lg:mx-0 lg:w-[440px] lg:max-w-none">
              <div aria-hidden="true" className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl bg-gradient-to-br from-primary to-green" />
              <div className="relative overflow-hidden rounded-3xl shadow-lift">
                <Image src={headPhoto.src} alt={headPhoto.alt} width={headPhoto.width} height={headPhoto.height} sizes="(min-width:1024px) 440px, min(420px, 100vw)" className="aspect-[4/5] w-full object-cover" style={{ objectPosition: headPhoto.objectPosition }} />
              </div>
            </div>
          ) : (
            <Avatar initials={headDoctor.initials} size="lg" />
          )}
          <div>
            <p className="eyebrow">{a.clinicHead.eyebrow}</p>
            <h2 id="clinic-head" className="mt-3">
              {a.clinicHead.title}
            </h2>
            <p className="mt-2 font-heading text-lg font-bold text-primaryDeep">
              {headDoctor.displayName}, {headDoctor.qualification} · {headDoctor.specialty}
            </p>
            {headDoctor.experienceYears && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-greenSoft px-3 py-1 text-sm font-semibold text-green">
                <Icon name="award" className="h-4 w-4" /> {headDoctor.experienceYears}+ years of experience
              </p>
            )}
            <p className="lead mt-4">{a.clinicHead.lead}</p>
            {headDoctor.bio.slice(0, 2).map((b) => (
              <p key={b.slice(0, 24)} className="mt-4 text-textSecondary">
                {b}
              </p>
            ))}
            <div className="mt-7 flex flex-wrap gap-3">
              <BookButton className="btn-cta" prefill={{ doctor: headDoctor.slug }}>
                <Icon name="calendar-check" /> {a.clinicHead.bookLabel}
              </BookButton>
              <Link href={`/doctors/${headDoctor.slug}`} className="btn-ghost">
                {a.clinicHead.profileLabel} <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-site">
          <SectionHead title={a.values.title} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {a.values.items.map((v) => (
              <li key={v.title} className="reveal card p-6">
                <span className="icon-tile">
                  <Icon name={v.icon} />
                </span>
                <h3 className="mt-4 text-lg">{v.title}</h3>
                <p className="mt-1.5 text-[0.95rem] text-textSecondary">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section bg-surfaceAlt/60">
        <div className="container-site">
          <SectionHead title={a.team.title} lead={a.team.lead} />
          <div className="grid gap-5 md:grid-cols-3">
            {siteDoctors.map((d, i) => (
              <DoctorCard key={d.id} d={d} index={i} />
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-surface">
        <div className="container-site grid gap-8 lg:grid-cols-2 lg:items-center">
          <SectionHead title={a.starterFeatures.title} lead={a.starterFeatures.lead} />
          <div>
            <ul className="space-y-3">
              {patientBenefits(sitePlan).map((b) => (
                <li key={b} className="flex gap-3">
                  <Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-primary" strokeWidth={2.5} /> {b}
                </li>
              ))}
            </ul>
            <BookButton className="btn-cta mt-8">
              <Icon name="calendar-check" /> Book an appointment
            </BookButton>
          </div>
        </div>
      </section>
    </>
  );
}
