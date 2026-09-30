import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { ImageRef } from '@/lib/content/schemas';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { JsonLd } from '../seo/JsonLd';
import { Icon } from '../ui/Icon';

export type Crumb = { name: string; path: string };

/**
 * Inner-page banner: blue gradient with breadcrumbs (+ BreadcrumbList JSON-LD), the page's single H1, an intro
 * and optionally a photo on the right.
 */
export function PageHeader({ title, intro, crumbs, badge, children, image }: { title: string; intro?: string; crumbs: Crumb[]; badge?: ReactNode; children?: ReactNode; image?: ImageRef }) {
  const all = [{ name: 'Home', path: '/' }, ...crumbs];
  return (
    <section className="on-dark relative overflow-hidden bg-gradient-to-br from-primaryDeep via-primary to-primaryHover text-onDark">
      <JsonLd data={breadcrumbJsonLd(all)} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(rgb(255_255_255/0.35)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-leaf/25 blur-3xl" />
      <div className={`container-site relative grid items-center gap-10 py-12 sm:py-16 ${image ? 'lg:grid-cols-[1.2fr_1fr]' : ''}`}>
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
          <div className="relative hidden lg:block">
            <div className="overflow-hidden rounded-3xl shadow-2xl ring-4 ring-onDark/20">
              <Image src={image.src} alt={image.alt} width={image.width} height={image.height} priority sizes="(min-width:1024px) 40vw, 0px" className="aspect-[3/2] w-full object-cover" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
