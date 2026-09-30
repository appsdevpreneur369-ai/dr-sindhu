import { ArticleCard } from '@/components/cards';
import { PageHeader } from '@/components/layout/PageHeader';
import { articles, sitePages } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

const p = sitePages.education;
export const metadata = pageMetadata({ path: '/patient-education', title: p.title, description: p.description });

export default function EducationPage() {
  return (
    <>
      <PageHeader title={p.h1!} intro={p.intro} crumbs={[{ name: 'Patient education', path: '/patient-education' }]} />
      <section className="section">
        <div className="container-site">
          <h2 className="sr-only">Guides</h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a, i) => (
              <ArticleCard key={a.meta.slug} a={a.meta} big={i === 0} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
