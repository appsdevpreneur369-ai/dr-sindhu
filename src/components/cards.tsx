import Image from 'next/image';
import Link from 'next/link';
import { getDoctorById, getImage } from '@/lib/content';
import type { Category, Doctor } from '@/lib/content/schemas';
import { cn } from '@/lib/cn';
import { BookButton } from './booking/BookButton';
import { Icon } from './ui/Icon';
import { Avatar, DraftBadge } from './ui/primitives';

const TILE_STYLES = ['bg-surface', 'bg-mint', 'bg-sand', 'bg-coralSoft'];

/** Bento tile for a treatment category. The first "lg" tile is the dark hero tile. */
export function TreatmentTile({ c, index, headingLevel: H = 'h3' }: { c: Category; index: number; headingLevel?: 'h2' | 'h3' }) {
  const dark = c.size === 'lg';
  const docs = c.doctors.map((id) => getDoctorById(id)?.displayName).filter(Boolean);
  return (
    <Link
      href={`/treatments/${c.slug}`}
      className={cn(
        'reveal group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-brand border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift',
        dark ? 'on-dark border-transparent bg-primaryDeep text-onDark sm:col-span-2 sm:row-span-2 lg:min-h-[380px]' : cn('border-border', TILE_STYLES[index % TILE_STYLES.length]),
        c.size === 'md' && 'sm:col-span-2 lg:col-span-1',
      )}
    >
      {dark && <span aria-hidden="true" className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-primary/60" />}
      <span className={cn('relative flex h-12 w-12 items-center justify-center rounded-2xl', dark ? 'bg-onDark/10 text-coralOnDark' : 'bg-surface text-primary ring-1 ring-border')}>
        <Icon name={c.icon} className="h-6 w-6" />
      </span>
      <div className="relative mt-6">
        <H className={cn('font-heading', dark ? 'text-3xl text-onDark' : 'text-xl')}>
          {c.title} <DraftBadge status={c.status} onDark={dark} />
        </H>
        <p className={cn('mt-2', dark ? 'max-w-sm text-lg text-onDarkMuted' : 'text-[0.95rem] text-textSecondary')}>{c.short}</p>
        <p className={cn('mt-4 flex items-center justify-between gap-2 text-sm font-semibold', dark ? 'text-onDark' : 'text-primaryDeep')}>
          <span>{c.confirmSpecialist ? 'First consultation with Dr. Sindhu' : docs.join(' · ')}</span>
          <Icon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </p>
      </div>
    </Link>
  );
}

export function DoctorCard({ d, headingLevel: H = 'h3', className }: { d: Doctor; headingLevel?: 'h2' | 'h3'; className?: string }) {
  const photo = d.photo ? getImage(d.photo) : null;
  return (
    <article className={cn('reveal card flex h-full flex-col p-6', className)}>
      <div className="flex items-start gap-4">
        {photo ? <Image src={photo.src} alt={photo.alt} width={112} height={112} className="h-16 w-16 rounded-[38%] object-cover" /> : <Avatar initials={d.initials} />}
        <div>
          {d.isHead && <p className="mb-1 inline-flex rounded-full bg-coralSoft px-2.5 py-0.5 text-xs font-semibold text-ctaHover">{d.role}</p>}
          <H className="text-xl">
            <Link href={`/doctors/${d.slug}`} className="inline-flex min-h-[44px] items-center hover:text-primary hover:underline">
              {d.displayName}
            </Link>{' '}
            <DraftBadge status={d.status} />
          </H>
          <p className="text-sm font-medium text-primary">
            {d.qualification} · {d.specialty}
          </p>
        </div>
      </div>
      <p className="mt-4 flex-1 text-textSecondary">{d.summary}</p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <BookButton className="btn-primary !min-h-[44px] !px-4 text-sm" prefill={{ doctor: d.slug }} ariaLabel={`Book with ${d.displayName}`}>
          Book with {d.firstName}
        </BookButton>
        <Link href={`/doctors/${d.slug}`} className="inline-flex min-h-[44px] items-center gap-1 px-2 text-sm font-semibold text-primary hover:underline" aria-label={`Profile of ${d.displayName}`}>
          Profile <Icon name="arrow-right" className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

export function ArticleCard({ a, big }: { a: { slug: string; title: string; description: string; image: string; category: string; readingMinutes: number }; big?: boolean }) {
  const img = getImage(a.image);
  return (
    <article className={cn('reveal group card overflow-hidden', big && 'lg:row-span-2')}>
      <Link href={`/patient-education/${a.slug}`} className="flex h-full flex-col">
        <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes={big ? '(min-width:1024px) 50vw, 100vw' : '(min-width:1024px) 25vw, 100vw'} className="aspect-[16/10] w-full object-cover" />
        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {a.category} · {a.readingMinutes} min read
          </p>
          <h3 className={cn('mt-2 group-hover:text-primary', big ? 'text-2xl' : 'text-lg')}>{a.title}</h3>
          {big && <p className="mt-2 text-textSecondary">{a.description}</p>}
        </div>
      </Link>
    </article>
  );
}
