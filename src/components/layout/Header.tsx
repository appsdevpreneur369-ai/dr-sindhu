'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { BookButton } from '../booking/BookButton';
import { Icon } from '../ui/Icon';

type Item = { label: string; href: string };

/** Light glass navigation that condenses after the first scroll. Mobile: a disclosure menu panel. */
export function Header({ logo, items, signInHref, registerHref, callHref }: { logo: ReactNode; items: Item[]; signInHref: string; registerHref: string; callHref: string | null }) {
  const pathname = usePathname();
  const [condensed, setCondensed] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => setMenu(false), [pathname]);
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menu]);

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header data-condensed={condensed} className="group/header sticky top-0 z-50">
      <div className={cn('glass border-b transition-all duration-300', condensed || menu ? 'border-border shadow-soft' : 'border-transparent')}>
        <div className={cn('container-site flex items-center justify-between gap-4 transition-[padding] duration-300', condensed ? 'py-1.5' : 'py-3 lg:py-4')}>
          {logo}
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {items.map((it) => (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    aria-current={active(it.href) ? 'page' : undefined}
                    className={cn('inline-flex min-h-[44px] items-center rounded-full px-3.5 text-[0.95rem] font-medium transition-colors hover:bg-mint', active(it.href) ? 'text-primaryDeep' : 'text-text')}
                  >
                    {it.label}
                    {active(it.href) && <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-decorativeCoral" aria-hidden="true" />}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <a href={signInHref} className="hidden min-h-[44px] items-center gap-1.5 rounded-full px-3 text-[0.95rem] font-medium text-text hover:bg-mint md:inline-flex">
              <Icon name="log-in" className="h-4 w-4" /> Sign in
            </a>
            <BookButton className="btn-cta hidden !min-h-[44px] !px-5 sm:inline-flex">Book now</BookButton>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-text hover:bg-mint lg:hidden"
              aria-expanded={menu}
              aria-controls="mobile-menu"
              aria-label={menu ? 'Close menu' : 'Open menu'}
              onClick={() => setMenu((m) => !m)}
            >
              <Icon name={menu ? 'x' : 'menu'} className="h-6 w-6" />
            </button>
          </div>
        </div>
        <nav id="mobile-menu" aria-label="Mobile" hidden={!menu} className="border-t border-border lg:hidden">
          <ul className="container-site grid gap-1 py-3">
            {items.map((it) => (
              <li key={it.href}>
                <Link href={it.href} aria-current={active(it.href) ? 'page' : undefined} className="flex min-h-[48px] items-center justify-between rounded-xl px-3 text-lg font-medium text-text hover:bg-mint">
                  {it.label} <Icon name="chevron-right" className="h-5 w-5 text-primary" />
                </Link>
              </li>
            ))}
            <li className="mt-2 grid grid-cols-2 gap-2">
              <a href={signInHref} className="btn-ghost !px-3">
                <Icon name="log-in" className="h-4 w-4" /> Sign in
              </a>
              <a href={registerHref} className="btn-ghost !px-3">
                <Icon name="user-plus" className="h-4 w-4" /> Register
              </a>
            </li>
            {callHref && (
              <li>
                <a href={callHref} className="btn-primary mt-1 w-full">
                  <Icon name="phone" className="h-4 w-4" /> Call the clinic
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
