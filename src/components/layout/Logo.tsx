import Image from 'next/image';
import Link from 'next/link';
import { siteBrand, siteImages } from '@/lib/content';
import { cn } from '@/lib/cn';

/** Logo mark (content/images.json → logo.mark) + text wordmark in Roboto. */
export function Logo({ onDark, className, priority }: { onDark?: boolean; className?: string; priority?: boolean }) {
  const m = siteImages.logo.mark;
  return (
    <Link href="/" className={cn('inline-flex min-h-[44px] shrink-0 items-center gap-3', className)} aria-label={`${siteBrand.wordmark.primary} ${siteBrand.wordmark.secondary} — home`}>
      <span className={cn('flex h-12 w-12 items-center justify-center rounded-xl', onDark ? 'bg-onDark' : 'bg-sky')}>
        <Image src={m.src} alt="" width={m.width} height={m.height} priority={priority} sizes="64px" className="h-9 w-auto" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn('font-heading text-[1.45rem] font-black tracking-tight', onDark ? 'text-onDark' : 'text-primaryDeep')}>{siteBrand.wordmark.primary}</span>
        <span className={cn('mt-1 font-heading text-[0.72rem] font-bold uppercase tracking-[0.24em]', onDark ? 'text-greenOnDark' : 'text-green')}>{siteBrand.wordmark.secondary}</span>
      </span>
    </Link>
  );
}
