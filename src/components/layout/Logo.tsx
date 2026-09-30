import Image from 'next/image';
import Link from 'next/link';
import { siteBrand, siteImages } from '@/lib/content';
import { cn } from '@/lib/cn';

/** Logo mark (content/images.json → logo.mark) + text wordmark in the heading font. */
export function Logo({ onDark, className, priority }: { onDark?: boolean; className?: string; priority?: boolean }) {
  const m = siteImages.logo.mark;
  return (
    <Link href="/" className={cn('group inline-flex min-h-[44px] items-center gap-2.5', className)} aria-label={`${siteBrand.wordmark.primary} ${siteBrand.wordmark.secondary} — home`}>
      <Image src={m.src} alt="" width={m.width} height={m.height} priority={priority} sizes="48px" className="h-9 w-auto transition-[height] duration-300 group-data-[condensed=true]/header:h-8 sm:h-10" />
      <span className="flex flex-col leading-none">
        <span className={cn('font-heading text-[1.3rem] font-semibold tracking-tight sm:text-[1.4rem]', onDark ? 'text-onDark' : 'text-text')}>{siteBrand.wordmark.primary}</span>
        <span className={cn('mt-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em]', onDark ? 'text-onDarkMuted' : 'text-primary')}>{siteBrand.wordmark.secondary}</span>
      </span>
    </Link>
  );
}
