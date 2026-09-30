import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { ImageRef, Status } from '@/lib/content/schemas';
import { SHOW_BADGES } from '@/lib/site';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

/** "Draft" badge on placeholder content — only when NEXT_PUBLIC_SHOW_PLACEHOLDER_BADGES=true. */
export function DraftBadge({ status, className, onDark }: { status: Status | undefined; className?: string; onDark?: boolean }) {
  if (!SHOW_BADGES || status !== 'placeholder') return null;
  return (
    <span
      className={cn(
        'inline-flex h-6 shrink-0 items-center rounded-full border px-2 align-middle text-xs font-semibold uppercase tracking-wide',
        onDark ? 'border-greenOnDark/60 text-greenOnDark' : 'border-warning/40 bg-warningSoft text-warningText',
        className,
      )}
      title="Placeholder content — awaiting the clinic's confirmation"
    >
      Draft
    </span>
  );
}

export function SectionHead({ eyebrow, title, lead, as: H = 'h2', center, id, onDark }: { eyebrow?: string; title: string; lead?: string; as?: 'h1' | 'h2'; center?: boolean; id?: string; onDark?: boolean }) {
  return (
    <div className={cn('mb-10 max-w-2xl sm:mb-12', center && 'mx-auto text-center')}>
      {eyebrow && <p className={cn('eyebrow mb-3', center && 'justify-center', onDark && '!text-greenOnDark')}>{eyebrow}</p>}
      <H id={id} className={cn('text-balance', onDark && '!text-onDark')}>
        {title}
      </H>
      {lead && <p className={cn('lead mt-4', onDark && '!text-onDarkMuted')}>{lead}</p>}
    </div>
  );
}

/** Initials avatar until real doctor photos exist (never stock photos of people as our doctors). */
export function Avatar({ initials, size = 'md', className }: { initials: string; size?: 'md' | 'lg'; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primaryDeep font-heading font-black text-onDark shadow-lift',
        size === 'lg' ? 'h-32 w-32 text-5xl' : 'h-16 w-16 text-xl',
        className,
      )}
    >
      <span className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-leaf/40" />
      <span className="relative">{initials}</span>
    </span>
  );
}

export function ContentImage({ img, className, priority, sizes, rounded = true }: { img: ImageRef; className?: string; priority?: boolean; sizes?: string; rounded?: boolean }) {
  return (
    <Image
      src={img.src}
      alt={img.alt}
      width={img.width}
      height={img.height}
      priority={priority}
      sizes={sizes ?? '(min-width: 1024px) 50vw, 100vw'}
      className={cn('h-auto w-full object-cover', rounded && 'rounded-brand', className)}
    />
  );
}

/** Accessible accordion on native <details>: keyboard and screen-reader friendly without JavaScript. */
export function Accordion({ items, name }: { items: { q: string; a: ReactNode }[]; name?: string }) {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-brand border border-border bg-surface">
      {items.map((it, i) => (
        <details key={i} name={name} className="group">
          <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-heading text-[1.02rem] font-bold text-text marker:hidden hover:bg-surfaceAlt group-open:text-primary [&::-webkit-details-marker]:hidden">
            <span>{it.q}</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky text-primary transition-transform group-open:rotate-180 group-open:bg-primary group-open:text-onDark">
              <Icon name="chevron-down" className="h-4 w-4" />
            </span>
          </summary>
          <div className="px-5 pb-5 text-textSecondary">{it.a}</div>
        </details>
      ))}
    </div>
  );
}

export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn('inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-primary hover:text-primaryDeep hover:underline', className)}>
      {children}
      <Icon name="arrow-right" className="h-4 w-4" />
    </Link>
  );
}
