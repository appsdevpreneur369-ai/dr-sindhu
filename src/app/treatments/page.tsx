import { TreatmentCard } from '@/components/cards';
import { PageHeader } from '@/components/layout/PageHeader';
import { Icon } from '@/components/ui/Icon';
import { categories, sitePages, siteServices } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

const p = sitePages.treatments;
export const metadata = pageMetadata({ path: '/treatments', title: p.title, description: p.description });

export default function TreatmentsPage() {
  return (
    <>
      <PageHeader title={p.h1!} intro={p.intro} crumbs={[{ name: 'Treatments', path: '/treatments' }]} />
      <section className="section">
        <div className="container-site">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <li key={c.slug}>
                <TreatmentCard c={c} headingLevel="h2" priority={i < 3} />
              </li>
            ))}
          </ul>
          <p className="mt-10 flex max-w-2xl gap-3 rounded-2xl bg-sky px-5 py-4 text-text"><Icon name="indian-rupee" className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> {siteServices.priceNote}</p>
        </div>
      </section>
    </>
  );
}
