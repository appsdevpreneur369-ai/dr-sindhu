import { BookButton } from '@/components/booking/BookButton';
import { DoctorCard } from '@/components/cards';
import { PageHeader } from '@/components/layout/PageHeader';
import { Icon } from '@/components/ui/Icon';
import { ContentImage, DraftBadge, SectionHead } from '@/components/ui/primitives';
import { getImage, siteAbout, siteDoctors, sitePages, sitePlan } from '@/lib/content';
import { patientBenefits } from '@/lib/plan';
import { pageMetadata } from '@/lib/seo';

const p = sitePages.about;
export const metadata = pageMetadata({ path: '/about', title: p.title, description: p.description });

export default function AboutPage() {
  const a = siteAbout;
  return (
    <>
      <PageHeader title={p.h1!} intro={p.intro} image={getImage('clinic-front-office')} crumbs={[{ name: 'About', path: '/about' }]} badge={<DraftBadge status={a.status} />} />
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
      <section className="section bg-surfaceAlt/60">
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
      <section className="section">
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
