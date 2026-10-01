import Image from 'next/image';
import Link from 'next/link';
import { getDoctorById, getImage } from '@/lib/content';
import type { Category, Doctor } from '@/lib/content/schemas';
import { cn } from '@/lib/cn';
import { BookButton } from './booking/BookButton';
import { Icon } from './ui/Icon';
import { DraftBadge } from './ui/primitives';

/** Treatment card: photo with icon badge, title, short text, doctor and sub-treatment count. */
export function TreatmentCard({ c, headingLevel: H = 'h3', priority }: { c: Category; headingLevel?: 'h2' | 'h3'; priority?: boolean }) {
  const img = getImage(c.image);
  const docs = c.doctors.map((id) => getDoctorById(id)?.displayName).filter(Boolean);
  return (
    <Link href={`/treatments/${c.slug}`} className="reveal group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={img.src} alt={img.alt} width={img.width} height={img.height} priority={priority} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy/45 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-4 flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-primary shadow-lift">
          <Icon name={c.icon} className="h-5 w-5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <H className="text-[1.2rem] group-hover:text-primary">
          {c.title} <DraftBadge status={c.status} />
        </H>
        <p className="mt-2 flex-1 text-[0.95rem] text-textSecondary">{c.short}</p>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4 text-sm">
          <span className="font-medium text-textSecondary">{c.confirmSpecialist ? 'Consultation with Dr. Sindhu' : docs.join(' · ')}</span>
          <span className="inline-flex shrink-0 items-center gap-1 font-heading font-bold text-primary">
            {c.subTreatments.length} treatments <Icon name="arrow-up-right" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

const DOCTOR_GRADIENTS = ['from-primary to-primaryDeep', 'from-green to-primaryDeep', 'from-primaryDeep to-navy'];

export function DoctorCard({ d, index = 0, headingLevel: H = 'h3', className }: { d: Doctor; index?: number; headingLevel?: 'h2' | 'h3'; className?: string }) {
  const photo = d.photo ? getImage(d.photo) : null;
  return (
    <article className={cn('reveal group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift', className)}>
      <div className={cn('relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br', DOCTOR_GRADIENTS[index % DOCTOR_GRADIENTS.length])}>
        <span aria-hidden="true" className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-onDark/10" />
        <span aria-hidden="true" className="absolute -bottom-10 -right-6 h-36 w-36 rounded-full bg-leaf/25" />
        {photo ? (
          <Image src={photo.src} alt={photo.alt} fill sizes="(min-width:768px) 33vw, 85vw" className="object-cover object-[50%_30%]" />
        ) : (
          <span aria-hidden="true" className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-onDark/30 bg-onDark/15 font-heading text-4xl font-black text-onDark backdrop-blur">
            {d.initials}
          </span>
        )}
        {d.isHead && <span className="absolute left-4 top-4 rounded-full bg-onDark px-3 py-1 font-heading text-xs font-bold text-primaryDeep">{d.role}</span>}
        {!photo && <span className="absolute bottom-3 right-3 rounded-full bg-navy/60 px-2.5 py-0.5 text-[0.7rem] font-medium text-onDark">Photo coming soon</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <H className="text-xl">
          <Link href={`/doctors/${d.slug}`} className="inline-flex min-h-[44px] items-center hover:text-primary">
            {d.displayName}
          </Link>{' '}
          <DraftBadge status={d.status} />
        </H>
        <p className="font-heading text-sm font-bold text-green">{d.qualification}</p>
        <p className="mt-0.5 text-[0.95rem] font-medium text-text">{d.specialty}</p>
        {d.experienceYears && (
          <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-greenSoft px-3 py-1 text-sm font-semibold text-green">
            <Icon name="award" className="h-4 w-4" /> {d.experienceYears}+ years of experience
          </p>
        )}
        <p className="mt-3 flex-1 text-[0.93rem] text-textSecondary">{d.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <BookButton className="btn-primary !min-h-[44px] !px-4 !text-sm" prefill={{ doctor: d.slug }} ariaLabel={`Book with ${d.displayName}`}>
            Book with {d.firstName}
          </BookButton>
          <Link href={`/doctors/${d.slug}`} className="inline-flex min-h-[44px] items-center gap-1 px-2 font-heading text-sm font-bold text-primary hover:underline" aria-label={`Profile of ${d.displayName}`}>
            View profile <Icon name="arrow-up-right" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ArticleCard({ a, big }: { a: { slug: string; title: string; description: string; image: string; category: string; readingMinutes: number }; big?: boolean }) {
  const img = getImage(a.image);
  return (
    <article className="reveal group h-full overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link href={`/patient-education/${a.slug}`} className="flex h-full flex-col">
        <div className="overflow-hidden">
          <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes={big ? '(min-width:1024px) 40vw, 100vw' : '(min-width:1024px) 30vw, 100vw'} className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.14em] text-green">
            {a.category} · {a.readingMinutes} min read
          </p>
          <h3 className={cn('mt-2 group-hover:text-primary', big ? 'text-2xl' : 'text-lg')}>{a.title}</h3>
          <p className="mt-2 line-clamp-3 flex-1 text-[0.93rem] text-textSecondary">{a.description}</p>
          <span className="mt-4 inline-flex items-center gap-1 font-heading text-sm font-bold text-primary">
            Read guide <Icon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </article>
  );
}
