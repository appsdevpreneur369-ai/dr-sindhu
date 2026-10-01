import { BookButton } from '@/components/booking/BookButton';
import { MapFacade } from '@/components/contact/MapFacade';
import { PageHeader } from '@/components/layout/PageHeader';
import { Icon, WhatsAppIcon } from '@/components/ui/Icon';
import { OpenStatus } from '@/components/ui/OpenStatus';
import { DraftBadge } from '@/components/ui/primitives';
import { getImage, siteClinic, sitePages } from '@/lib/content';
import { DAY_LABEL, formatSession } from '@/lib/hours';
import { channels, directionsHref, generalWhatsappHref, mapEmbedSrc, mapsApproximate } from '@/lib/links';
import { pageMetadata } from '@/lib/seo';
import { fullAddress } from '@/lib/vars';

const p = sitePages.contact;
export const metadata = pageMetadata({ path: '/contact', title: p.title, description: p.description });

export default function ContactPage() {
  const c = siteClinic;
  return (
    <>
      <PageHeader title={p.h1!} intro={p.intro} image={getImage('clinic-front')} crumbs={[{ name: 'Contact', path: '/contact' }]} />
      <section className="section">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-2xl">Get in touch</h2>
              <address className="mt-4 space-y-4 not-italic">
                <p className="flex gap-3">
                  <Icon name="map-pin" className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <span>
                    <span className="font-semibold">{c.name.value}</span>
                    <br />
                    {fullAddress} <DraftBadge status={c.address.status} />
                  </span>
                </p>
                {channels.call && (
                  <p className="flex items-center gap-3">
                    <Icon name="phone" className="h-5 w-5 shrink-0 text-primary" />
                    <a href={channels.call.href} className="inline-flex min-h-[44px] items-center font-semibold text-primary underline">
                      {channels.call.display}
                    </a>
                  </p>
                )}
                <p className="flex items-center gap-3">
                  <Icon name="mail" className="h-5 w-5 shrink-0 text-primary" />
                  {channels.email ? (
                    <a href={channels.email.href} className="font-semibold text-primary underline">
                      {channels.email.display}
                    </a>
                  ) : (
                    <span className="text-textSecondary">
                      Email address coming soon <DraftBadge status={c.email.status} />
                    </span>
                  )}
                </p>
              </address>
              <div className="mt-6 flex flex-wrap gap-3">
                <BookButton className="btn-cta">
                  <Icon name="calendar-check" /> Book online
                </BookButton>
                {channels.call && (
                  <a href={channels.call.href} className="btn-primary">
                    <Icon name="phone" className="h-4 w-4" /> Call
                  </a>
                )}
                {generalWhatsappHref && (
                  <a href={generalWhatsappHref} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                    <WhatsAppIcon /> WhatsApp
                  </a>
                )}
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-sky/60 px-6 py-4">
                <h2 className="text-2xl">Timings</h2>
                <OpenStatus hours={c.hours.days} timeZone={c.timezone} />
              </div>
              <table className="w-full text-left">
                <caption className="sr-only">Clinic opening hours, India Standard Time</caption>
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Day</th>
                    <th scope="col">Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {c.hours.days.map((d) => (
                    <tr key={d.day}>
                      <th scope="row" className="px-6 py-3 font-semibold">
                        {DAY_LABEL[d.day]}
                      </th>
                      <td className="px-6 py-3 text-textSecondary">{d.sessions.length ? d.sessions.map(formatSession).join(' · ') : 'Closed'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-border px-6 py-3 text-sm text-textSecondary">
                Session times confirmed; working days to be confirmed by the clinic. <DraftBadge status={c.hours.daysStatus} />
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <MapFacade src={mapEmbedSrc} title={`Map: ${c.maps.query}`} label="Show map" />
            {mapsApproximate && (
              <p className="flex gap-2 text-sm text-textSecondary">
                <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0" /> The map shows Ashramam Road; the clinic&apos;s exact pin will be added soon. <DraftBadge status={c.maps.status} />
              </p>
            )}
            <a href={directionsHref} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <Icon name="navigation" className="h-4 w-4" /> Open in Google Maps
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
