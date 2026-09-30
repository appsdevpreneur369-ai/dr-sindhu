import { BookButton } from '@/components/booking/BookButton';
import { PageHeader } from '@/components/layout/PageHeader';
import { JsonLd } from '@/components/seo/JsonLd';
import { Icon } from '@/components/ui/Icon';
import { Accordion, DraftBadge } from '@/components/ui/primitives';
import { siteFaqs, sitePages } from '@/lib/content';
import { faqJsonLd } from '@/lib/jsonld';
import { channels } from '@/lib/links';
import { pageMetadata } from '@/lib/seo';
import { fill } from '@/lib/vars';

const p = sitePages.faqs;
export const metadata = pageMetadata({ path: '/faqs', title: p.title, description: p.description });

export default function FaqsPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(siteFaqs.items)} />
      <PageHeader title={p.h1!} intro={p.intro} crumbs={[{ name: 'FAQs', path: '/faqs' }]} badge={<DraftBadge status={siteFaqs.status} />} />
      <section className="section">
        <div className="container-site max-w-3xl">
          <h2 className="sr-only">Questions and answers</h2>
          <Accordion items={siteFaqs.items.map((f) => ({ q: fill(f.q), a: fill(f.a) }))} />
          <div className="mt-10 flex flex-wrap gap-3">
            <BookButton className="btn-cta">
              <Icon name="calendar-check" /> Book an appointment
            </BookButton>
            {channels.call && (
              <a href={channels.call.href} className="btn-ghost">
                <Icon name="phone" className="h-4 w-4" /> {channels.call.display}
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
