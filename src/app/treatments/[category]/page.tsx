import { notFound } from 'next/navigation';
import { BookButton } from '@/components/booking/BookButton';
import { DoctorCard } from '@/components/cards';
import { PageHeader } from '@/components/layout/PageHeader';
import { JsonLd } from '@/components/seo/JsonLd';
import { Icon } from '@/components/ui/Icon';
import { Accordion, DraftBadge, TextLink } from '@/components/ui/primitives';
import { categories, getCategory, getDoctorById, siteServices } from '@/lib/content';
import { faqJsonLd, treatmentJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/seo';

export const dynamicParams = false;
export const generateStaticParams = () => categories.map((c) => ({ category: c.slug }));

export function generateMetadata({ params }: { params: { category: string } }) {
  const c = getCategory(params.category);
  if (!c) return {};
  return pageMetadata({ path: `/treatments/${c.slug}`, title: c.seo.title, description: c.seo.description });
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const c = getCategory(params.category);
  if (!c) notFound();
  const path = `/treatments/${c.slug}`;
  const doctors = c.doctors.map(getDoctorById).filter((d): d is NonNullable<typeof d> => !!d);
  const others = categories.filter((x) => x.slug !== c.slug).slice(0, 4);
  return (
    <>
      <JsonLd data={[treatmentJsonLd(c, path), ...(c.faqs.length ? [faqJsonLd(c.faqs)] : [])]} />
      <PageHeader title={c.title} intro={c.short} crumbs={[{ name: 'Treatments', path: '/treatments' }, { name: c.shortTitle, path }]} badge={<DraftBadge status={c.status} />}>
        <BookButton className="btn-cta mt-6" prefill={{ treatment: c.slug }}>
          <Icon name="calendar-check" /> Book for {c.shortTitle.toLowerCase()}
        </BookButton>
      </PageHeader>

      <section className="section">
        <div className="container-site grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="prose-site">
              {c.intro.map((t) => (
                <p key={t.slice(0, 24)} className="text-lg">
                  {t}
                </p>
              ))}
            </div>
            {c.confirmSpecialist && (
              <p className="mt-2 flex max-w-prose gap-3 rounded-2xl border border-cta/30 bg-coralSoft px-4 py-3 text-[0.95rem]">
                <Icon name="info" className="mt-0.5 h-5 w-5 shrink-0 text-cta" />
                <span>Start with a consultation with Dr. Sindhu, who will examine you and plan the next steps. <DraftBadge status="placeholder" /></span>
              </p>
            )}

            <h2 className="mt-12">What&apos;s included</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {c.subTreatments.map((s) => (
                <li key={s.slug} className="reveal card flex flex-col p-5">
                  <h3 className="text-lg">{s.title}</h3>
                  <p className="mt-1 flex-1 text-[0.95rem] text-textSecondary">{s.summary}</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primaryDeep">
                    <Icon name="clock" className="h-4 w-4" /> {s.visits}
                  </p>
                </li>
              ))}
            </ul>

            <h2 className="mt-12">How it usually goes</h2>
            <ol className="mt-6 space-y-5">
              {c.steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint font-heading text-lg font-semibold text-primaryDeep">{i + 1}</span>
                  <span>
                    <span className="block font-semibold">{s.title}</span>
                    <span className="text-textSecondary">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>

            {c.faqs.length > 0 && (
              <>
                <h2 className="mb-6 mt-12">Questions about {c.shortTitle.toLowerCase()}</h2>
                <Accordion items={c.faqs.map((f) => ({ q: f.q, a: f.a }))} />
              </>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-brand bg-primaryDeep p-6 text-onDark on-dark">
              <h2 className="text-xl !text-onDark">About cost</h2>
              <p className="mt-2 text-onDarkMuted">{siteServices.priceNote}</p>
              <BookButton className="btn-cta mt-5 w-full" prefill={{ treatment: c.slug }}>
                Book a consultation
              </BookButton>
            </div>
            <h2 className="text-xl">Who treats you</h2>
            {doctors.map((d) => (
              <DoctorCard key={d.id} d={d} />
            ))}
          </aside>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-12">
        <div className="container-site">
          <h2 className="text-2xl">Other treatments</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {others.map((o) => (
              <li key={o.slug}>
                <TextLink href={`/treatments/${o.slug}`} className="chip !gap-2">
                  {o.title}
                </TextLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
