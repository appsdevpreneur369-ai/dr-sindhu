import Link from 'next/link';
import { siteClinic, siteNav } from '@/lib/content';
import { hoursSummary } from '@/lib/hours';
import { channels, directionsHref, resolveHref } from '@/lib/links';
import { fullAddress } from '@/lib/vars';
import { DraftBadge } from '../ui/primitives';
import { Icon } from '../ui/Icon';
import { Logo } from './Logo';
import { SocialLinks } from './SocialLinks';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative overflow-hidden bg-dark pb-28 text-onDarkMuted md:pb-10">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
      <div className="container-site relative grid gap-12 pt-16 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <Logo onDark />
          <p className="mt-5 max-w-sm">{siteClinic.description.value}</p>
          <address className="mt-6 space-y-3 not-italic">
            <p className="flex gap-3">
              <Icon name="map-pin" className="mt-1 h-5 w-5 shrink-0 text-coralOnDark" />
              <span>
                {fullAddress} <DraftBadge status={siteClinic.address.status} onDark />
                <br />
                <a href={directionsHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center font-semibold text-onDark underline">
                  Get directions
                </a>
              </span>
            </p>
            {channels.call && (
              <p className="flex items-center gap-3">
                <Icon name="phone" className="h-5 w-5 shrink-0 text-coralOnDark" />
                <a href={channels.call.href} className="inline-flex min-h-[44px] items-center font-semibold text-onDark hover:underline">
                  {channels.call.display}
                </a>
              </p>
            )}
            {channels.email && (
              <p className="flex items-center gap-3">
                <Icon name="mail" className="h-5 w-5 shrink-0 text-coralOnDark" />
                <a href={channels.email.href} className="font-semibold text-onDark hover:underline">
                  {channels.email.display}
                </a>
              </p>
            )}
            <p className="flex gap-3">
              <Icon name="clock" className="mt-1 h-5 w-5 shrink-0 text-coralOnDark" />
              <span>
                {hoursSummary(siteClinic.hours.days)} <DraftBadge status={siteClinic.hours.daysStatus} onDark />
              </span>
            </p>
          </address>
        </div>
        <div className="grid gap-10 sm:grid-cols-3">
          {siteNav.footer.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <h2 className="font-body text-sm font-semibold uppercase tracking-[0.16em] text-onDark">{g.title}</h2>
              <ul className="mt-3">
                {g.links.map((l) => {
                  const r = resolveHref(l.href);
                  if (!r) return null;
                  return (
                    <li key={l.label}>
                      {r.external ? (
                        <a href={r.href} className="inline-flex min-h-[44px] min-w-[44px] items-center hover:text-onDark hover:underline">
                          {l.label}
                        </a>
                      ) : (
                        <Link href={r.href} className="inline-flex min-h-[44px] min-w-[44px] items-center hover:text-onDark hover:underline">
                          {l.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="container-site relative mt-12 flex flex-col gap-6 border-t border-onDark/15 pt-8 md:flex-row md:items-center md:justify-between">
        <SocialLinks />
        <p className="text-sm">
          © {year} {siteClinic.name.value}. Appointments powered by ClinicFlow247.
        </p>
      </div>
    </footer>
  );
}
