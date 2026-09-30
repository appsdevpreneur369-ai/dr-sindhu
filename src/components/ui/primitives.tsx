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
        onDark ? 'border-coralOnDark/60 text-coralOnDark' : 'border-cta/40 bg-coralSoft text-ctaHover',
        className,
      )}
      title="Placeholder content — awaiting the clinic's confirmation"
    >
      Draft
    </span>
  );
}

export function SectionHead({ eyebrow, title, lead, as: H = 'h2', center, id }: { eyebrow?: string; title: string; lead?: string; as?: 'h1' | 'h2'; center?: boolean; id?: string }) {
  return (
    <div className={cn('mb-10 max-w-2xl', center && 'mx-auto text-center')}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <H id={id}>{title}</H>
      {lead && <p className="lead mt-4">{lead}</p>}
    </div>
  );
}

export function Avatar({ initials, size = 'md', className }: { initials: string; size?: 'md' | 'lg'; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[38%] bg-mint font-heading font-semibold text-primaryDeep ring-1 ring-mintStrong',
        size === 'lg' ? 'h-28 w-28 text-4xl' : 'h-16 w-16 text-xl',
        className,
      )}
    >
      <span className="absolute -right-3 -top-3 h-10 w-10 rounded-full bg-coralSoft" />
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
          <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-text marker:hidden hover:bg-mint/60 [&::-webkit-details-marker]:hidden">
            <span>{it.q}</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mint text-primaryDeep transition-transform group-open:rotate-180">
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
