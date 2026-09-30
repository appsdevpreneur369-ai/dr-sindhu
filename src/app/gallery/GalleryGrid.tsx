'use client';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/cn';

type Item = { src: string; width: number; height: number; alt: string; caption: string; category: string };

/** Filterable photo grid. Filters are real buttons with aria-pressed; all photos render server-side. */
export function GalleryGrid({ items, categories }: { items: Item[]; categories: string[] }) {
  const [cat, setCat] = useState<string | null>(null);
  const shown = cat ? items.filter((i) => i.category === cat) : items;
  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter photos">
        {[null, ...categories].map((c) => (
          <button key={c ?? 'all'} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={cn('chip', cat === c && 'border-primary bg-mint text-primaryDeep')}>
            {c ?? 'All'}
          </button>
        ))}
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((i, n) => (
          <li key={i.src} className={cn('group', n === 0 && !cat && 'sm:col-span-2 sm:row-span-2')}>
            <figure className="card h-full overflow-hidden">
              <Image src={i.src} alt={i.alt} width={i.width} height={i.height} sizes={n === 0 && !cat ? '(min-width:1024px) 66vw, 100vw' : '(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw'} className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
              <figcaption className="px-4 py-3 text-sm font-medium text-text">{i.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </>
  );
}
