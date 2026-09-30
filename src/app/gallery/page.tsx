import { PageHeader } from '@/components/layout/PageHeader';
import { JsonLd } from '@/components/seo/JsonLd';
import { DraftBadge } from '@/components/ui/primitives';
import { getImage, siteGallery, sitePages } from '@/lib/content';
import { galleryJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/seo';
import { GalleryGrid } from './GalleryGrid';

const p = sitePages.gallery;
export const metadata = pageMetadata({ path: '/gallery', title: p.title, description: p.description });

export default function GalleryPage() {
  const items = siteGallery.items.map((g) => ({ ...getImage(g.image), caption: g.caption, category: g.category }));
  return (
    <>
      <JsonLd data={galleryJsonLd('/gallery', items)} />
      <PageHeader title={p.h1!} intro={siteGallery.intro} crumbs={[{ name: 'Our clinic', path: '/gallery' }]} badge={<DraftBadge status={siteGallery.status} />} />
      <section className="section">
        <div className="container-site">
          <GalleryGrid items={items} categories={siteGallery.categories} />
        </div>
      </section>
    </>
  );
}
