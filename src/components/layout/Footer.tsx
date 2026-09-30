import Link from 'next/link';
import { siteClinic, siteNav } from '@/lib/content';
import { hoursSummary } from '@/lib/hours';
import { channels, directionsHref, resolveHref } from '@/lib/links';
import { fullAddress } from '@/lib/vars';
import { BookButton } from '../booking/BookButton';
import { DraftBadge } from '../ui/primitives';
import { Icon } from '../ui/Icon';
import { Logo } from './Logo';
import { SocialLinks } from './SocialLinks';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative overflow-hidden bg-navy pb-28 text-onDarkMuted md:pb-10">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
      <div className="container-site relative">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-onDark/10 py-10 md:flex-row md:items-center">
          <div>
            <p className="font-heading text-2xl font-bold text-onDark">Your smile deserves specialist care.</p>
            <p className="mt-1">Book online in about a minute — reminders reach you automatically.</p>
          </div>
          <BookButton className="btn-green">
            <Icon name="calendar-check" className="h-4 w-4" /> Book Appointment
          </BookButton>
        </div>
        <div className="grid gap-12 pt-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo onDark />
            <p className="mt-5 max-w-sm">{siteClinic.description.value}</p>
            <address className="mt-6 space-y-3 not-italic">
              <p className="flex gap-3">
                <Icon name="map-pin" className="mt-1 h-5 w-5 shrink-0 text-greenOnDark" />
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
                  <Icon name="phone" className="h-5 w-5 shrink-0 text-greenOnDark" />
                  <a href={channels.call.href} className="inline-flex min-h-[44px] items-center font-semibold text-onDark hover:underline">
                    {channels.call.display}
                  </a>
                </p>
              )}
              {channels.email && (
                <p className="flex items-center gap-3">
                  <Icon name="mail" className="h-5 w-5 shrink-0 text-greenOnDark" />
                  <a href={channels.email.href} className="font-semibold text-onDark hover:underline">
                    {channels.email.display}
                  </a>
                </p>
              )}
              <p className="flex gap-3">
                <Icon name="clock" className="mt-1 h-5 w-5 shrink-0 text-greenOnDark" />
                <span>
                  {hoursSummary(siteClinic.hours.days)} <DraftBadge status={siteClinic.hours.daysStatus} onDark />
                </span>
              </p>
            </address>
          </div>
          <div className="grid gap-10 sm:grid-cols-3">
            {siteNav.footer.map((g) => (
              <nav key={g.title} aria-label={g.title}>
                <h2 className="font-heading text-sm font-bold uppercase tracking-[0.16em] !text-onDark">{g.title}</h2>
                <ul className="mt-3">
                  {g.links.map((l) => {
                    const r = resolveHref(l.href);
                    if (!r) return null;
                    const cls = 'inline-flex min-h-[44px] min-w-[44px] items-center hover:text-onDark hover:underline';
                    return (
                      <li key={l.label}>
                        {r.external ? (
                          <a href={r.href} className={cls}>
                            {l.label}
                          </a>
                        ) : (
                          <Link href={r.href} className={cls}>
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
        <div className="mt-12 flex flex-col gap-6 border-t border-onDark/10 pt-8 md:flex-row md:items-center md:justify-between">
          <SocialLinks />
          <p className="text-sm">
            © {year} {siteClinic.name.value}. Appointments powered by ClinicFlow247.
          </p>
        </div>
      </div>
    </footer>
  );
}
