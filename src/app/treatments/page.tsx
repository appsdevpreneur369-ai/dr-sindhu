import { TreatmentTile } from '@/components/cards';
import { PageHeader } from '@/components/layout/PageHeader';
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
          <div className="grid gap-4 sm:grid-cols-2 lg:auto-rows-[minmax(190px,auto)] lg:grid-cols-4">
            {categories.map((c, i) => (
              <TreatmentTile key={c.slug} c={c} index={i} headingLevel="h2" />
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-textSecondary">{siteServices.priceNote}</p>
        </div>
      </section>
    </>
  );
}
