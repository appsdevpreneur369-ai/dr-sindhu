import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { ImageRef } from '@/lib/content/schemas';
import { cn } from '@/lib/cn';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { JsonLd } from '../seo/JsonLd';
import { Icon } from '../ui/Icon';

export type Crumb = { name: string; path: string };

/**
 * Image layouts for the banner photo:
 *  - 'default'  : text ~55% / photo ~45%, 3:2, desktop only (treatment pages).
 *  - 'wide'     : text ~40% / photo ~60%, 16:11, also full width below the heading on mobile (About).
 *  - 'portrait' : 4:5 portrait ~440px wide on desktop, full width up to 420px on mobile (doctor pages).
 * The photo is priority-loaded (it is usually the LCP element) and cropped around image.objectPosition.
 */
type Layout = 'default' | 'wide' | 'portrait';
const GRID: Record<Layout, string> = {
  default: 'lg:grid-cols-[1.2fr_1fr]',
  wide: 'lg:grid-cols-[2fr_3fr]',
  portrait: 'lg:grid-cols-[1fr_auto]',
};
const FRAME: Record<Layout, string> = {
  default: 'hidden lg:block',
  wide: 'block',
  portrait: 'mx-auto block w-full max-w-[420px] lg:mx-0 lg:w-[440px] lg:max-w-none',
};
const ASPECT: Record<Layout, string> = { default: 'aspect-[3/2]', wide: 'aspect-[16/11]', portrait: 'aspect-[4/5]' };
const SIZES: Record<Layout, string> = {
  default: '(min-width:1024px) 40vw, 0px',
  wide: '(min-width:1280px) 730px, (min-width:1024px) 58vw, 100vw',
  portrait: '(min-width:1024px) 440px, min(420px, 100vw)',
};

/** Inner-page banner: breadcrumbs (+ BreadcrumbList JSON-LD), the page's single H1, intro and optional photo. */
export function PageHeader({
  title, intro, crumbs, badge, children, image, imageLayout = 'default',
}: { title: string; intro?: string; crumbs: Crumb[]; badge?: ReactNode; children?: ReactNode; image?: ImageRef; imageLayout?: Layout }) {
  const all = [{ name: 'Home', path: '/' }, ...crumbs];
  return (
    <section className="on-dark relative overflow-hidden bg-gradient-to-br from-primaryDeep via-primary to-primaryHover text-onDark">
      <JsonLd data={breadcrumbJsonLd(all)} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(rgb(255_255_255/0.35)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-leaf/25 blur-3xl" />
      <div className={cn('container-site relative grid items-center gap-8 py-12 sm:py-16 lg:gap-12', image && GRID[imageLayout])}>
        <div>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-onDarkMuted">
              {all.map((c, i) => (
                <li key={c.path} className="flex items-center gap-1">
                  {i > 0 && <Icon name="chevron-right" className="h-3.5 w-3.5" />}
                  {i < all.length - 1 ? (
                    <Link href={c.path} className="inline-flex min-h-[44px] items-center hover:text-onDark hover:underline">
                      {c.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="font-medium text-onDark">
                      {c.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="mt-2 max-w-3xl text-balance !text-onDark">
            {title} {badge}
          </h1>
          {intro && <p className="mt-4 max-w-2xl text-lg text-onDarkMuted">{intro}</p>}
          {children}
        </div>
        {image && (
          <div className={cn('relative', FRAME[imageLayout])}>
            <div className="overflow-hidden rounded-3xl shadow-2xl ring-4 ring-onDark/20">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                priority
                sizes={SIZES[imageLayout]}
                className={cn('w-full object-cover', ASPECT[imageLayout])}
                style={{ objectPosition: image.objectPosition }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
