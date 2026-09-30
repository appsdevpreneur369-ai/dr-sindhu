import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookButton } from '@/components/booking/BookButton';
import { PageHeader } from '@/components/layout/PageHeader';
import { JsonLd } from '@/components/seo/JsonLd';
import { Icon } from '@/components/ui/Icon';
import { Avatar, DraftBadge } from '@/components/ui/primitives';
import { categories, getDoctor, getImage, siteDoctors } from '@/lib/content';
import { DAY_SHORT, formatSession } from '@/lib/hours';
import { physicianJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/seo';

export const dynamicParams = false;
export const generateStaticParams = () => siteDoctors.map((d) => ({ slug: d.slug }));

export function generateMetadata({ params }: { params: { slug: string } }) {
  const d = getDoctor(params.slug);
  if (!d) return {};
  return pageMetadata({
    path: `/doctors/${d.slug}`,
    title: `${d.displayName}, ${d.qualification} — ${d.specialty.replace(/ \(.+\)/, '')}`,
    description: `${d.displayName} (${d.qualification}) is the ${d.specialty.toLowerCase()} at Dr. Sindhu Dental Clinic, Ashramam Road, Tadepalli. ${d.summary}`,
  });
}

export default function DoctorPage({ params }: { params: { slug: string } }) {
  const d = getDoctor(params.slug);
  if (!d) notFound();
  const treats = categories.filter((c) => c.doctors.includes(d.id) || c.subTreatments.some((s) => s.doctors?.includes(d.id)));
  const photo = d.photo ? getImage(d.photo) : null;
  return (
    <>
      <JsonLd data={physicianJsonLd(d)} />
      <PageHeader title={d.displayName} crumbs={[{ name: 'Doctors', path: '/doctors' }, { name: d.displayName, path: `/doctors/${d.slug}` }]} badge={<DraftBadge status={d.status} />}>
        <div className="mt-5 flex flex-wrap items-center gap-5">
          {photo ? <Image src={photo.src} alt={photo.alt} width={224} height={224} className="h-28 w-28 rounded-[38%] object-cover" priority /> : <Avatar initials={d.initials} size="lg" />}
          <div>
            <p className="text-lg font-semibold text-primaryDeep">
              {d.qualification} · {d.specialty}
            </p>
            {d.isHead && <p className="mt-1 inline-flex rounded-full bg-coralSoft px-3 py-0.5 text-sm font-semibold text-ctaHover">{d.role}</p>}
            <div className="mt-4">
              <BookButton className="btn-cta" prefill={{ doctor: d.slug }}>
                <Icon name="calendar-check" /> Book with {d.displayName}
              </BookButton>
            </div>
          </div>
        </div>
      </PageHeader>
      <section className="section">
        <div className="container-site grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="prose-site">
            <h2 className="!mt-0">About {d.displayName}</h2>
            {d.bio.map((b) => (
              <p key={b.slice(0, 24)}>{b}</p>
            ))}
            <h2>Areas of focus</h2>
            <ul>
              {d.focus.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <aside className="space-y-5">
            <div className="card p-6">
              <h2 className="text-xl">Consultation times</h2>
              <ul className="mt-3 space-y-1.5 text-textSecondary">
                {d.consultation.map((c, i) => (
                  <li key={i}>
                    <span className="font-semibold text-text">
                      {DAY_SHORT[c.days[0]]}
                      {c.days.length > 1 && `–${DAY_SHORT[c.days[c.days.length - 1]]}`}
                    </span>{' '}
                    {formatSession(c)}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-textSecondary">
                Times are being confirmed with the clinic. <DraftBadge status={d.consultationStatus} />
              </p>
            </div>
            {treats.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl">Treatments</h2>
                <ul className="mt-2">
                  {treats.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/treatments/${c.slug}`} className="flex min-h-[44px] items-center justify-between gap-2 font-medium text-primary hover:underline">
                        {c.title} <Icon name="chevron-right" className="h-4 w-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
