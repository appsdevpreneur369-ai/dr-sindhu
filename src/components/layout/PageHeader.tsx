import Link from 'next/link';
import type { ReactNode } from 'react';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { JsonLd } from '../seo/JsonLd';
import { Icon } from '../ui/Icon';

export type Crumb = { name: string; path: string };

/** Inner-page header: breadcrumbs (+ BreadcrumbList JSON-LD), the page's single H1 and an intro. */
export function PageHeader({ title, intro, crumbs, badge, children }: { title: string; intro?: string; crumbs: Crumb[]; badge?: ReactNode; children?: ReactNode }) {
  const all = [{ name: 'Home', path: '/' }, ...crumbs];
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-mint/70 to-background">
      <JsonLd data={breadcrumbJsonLd(all)} />
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-6 h-64 w-64 rounded-full bg-coralSoft blur-2xl" />
      <div className="container-site relative py-10 sm:py-14">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-textSecondary">
            {all.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1">
                {i > 0 && <Icon name="chevron-right" className="h-3.5 w-3.5" />}
                {i < all.length - 1 ? (
                  <Link href={c.path} className="inline-flex min-h-[44px] items-center hover:text-primary hover:underline">
                    {c.name}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-medium text-text">
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mt-3 max-w-3xl">
          {title} {badge}
        </h1>
        {intro && <p className="lead mt-4 max-w-2xl">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
