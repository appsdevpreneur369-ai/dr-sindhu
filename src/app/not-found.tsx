import type { Metadata } from 'next';
import Link from 'next/link';
import { BookButton } from '@/components/booking/BookButton';
import { Icon } from '@/components/ui/Icon';
import { sitePages } from '@/lib/content';

export const metadata: Metadata = { title: { absolute: `${sitePages.notFound.title} | Dr. Sindhu Dental Clinic` }, robots: { index: false } };

const LINKS = [
  { href: '/treatments', label: 'Treatments', icon: 'leaf' },
  { href: '/doctors', label: 'Our doctors', icon: 'stethoscope' },
  { href: '/contact', label: 'Contact & timings', icon: 'map-pin' },
  { href: '/emergency', label: 'Dental emergency', icon: 'siren' },
];

export default function NotFound() {
  const n = sitePages.notFound;
  return (
    <section className="section relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-sky blur-2xl" />
      <div className="container-site relative max-w-2xl text-center">
        <p className="font-heading text-7xl font-semibold text-primary sm:text-8xl">404</p>
        <h1 className="mt-4 text-3xl sm:text-4xl">{n.h1}</h1>
        <p className="lead mt-3">{n.intro}</p>
        <ul className="mt-8 grid gap-3 text-left sm:grid-cols-2">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="card flex min-h-[56px] items-center gap-3 px-5 py-3 font-semibold hover:border-primary">
                <Icon name={l.icon} className="h-5 w-5 text-primary" /> {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-ghost">
            Back to home
          </Link>
          <BookButton className="btn-cta">Book an appointment</BookButton>
        </div>
      </div>
    </section>
  );
}
