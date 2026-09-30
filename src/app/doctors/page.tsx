import { DoctorCard } from '@/components/cards';
import { PageHeader } from '@/components/layout/PageHeader';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteDoctors, sitePages } from '@/lib/content';
import { physicianJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/seo';

const p = sitePages.doctors;
export const metadata = pageMetadata({ path: '/doctors', title: p.title, description: p.description });

export default function DoctorsPage() {
  return (
    <>
      <PageHeader title={p.h1!} intro={p.intro} crumbs={[{ name: 'Doctors', path: '/doctors' }]} />
      <JsonLd data={siteDoctors.map(physicianJsonLd)} />
      <section className="section">
        <div className="container-site grid gap-5 md:grid-cols-3">
          {siteDoctors.map((d) => (
            <DoctorCard key={d.id} d={d} headingLevel="h2" />
          ))}
        </div>
      </section>
    </>
  );
}
