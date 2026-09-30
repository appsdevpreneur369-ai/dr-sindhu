'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { BookButton } from '../booking/BookButton';
import { Icon, WhatsAppIcon } from '../ui/Icon';

type Item = { label: string; href: string };

/**
 * Navy info bar + white header. Navigation items are plain text links highlighted with an underline
 * (active page and hover). The header gains a soft shadow once the page scrolls. Mobile: disclosure menu.
 */
export function Header({
  logo, items, signInHref, registerHref, callHref, callDisplay, whatsappHref, topLine,
}: {
  logo: ReactNode; items: Item[]; signInHref: string; registerHref: string; callHref: string | null; callDisplay: string | null; whatsappHref: string | null; topLine: string;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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

  const active = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <>
      <div className="on-dark hidden bg-navy text-[0.85rem] text-onDarkMuted md:block">
        <div className="container-site flex items-center justify-between gap-4">
          <p className="flex items-center gap-2">
            <Icon name="map-pin" className="h-4 w-4 text-greenOnDark" /> {topLine}
          </p>
          <div className="flex items-center gap-5">
            {callHref && (
              <a href={callHref} className="inline-flex min-h-[44px] items-center gap-2 font-medium text-onDark hover:text-greenOnDark">
                <Icon name="phone" className="h-4 w-4" /> {callDisplay}
              </a>
            )}
            {whatsappHref && (
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 font-medium text-onDark hover:text-greenOnDark">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
            )}
            <a href={signInHref} className="inline-flex min-h-[44px] items-center gap-2 border-l border-onDark/20 pl-5 font-medium text-onDark hover:text-greenOnDark">
              <Icon name="log-in" className="h-4 w-4" /> Patient sign in
            </a>
          </div>
        </div>
      </div>
      <header className={cn('sticky top-0 z-50 border-b bg-surface transition-shadow duration-300', scrolled || menu ? 'border-border shadow-soft' : 'border-transparent')}>
        <div className={cn('container-site flex items-center justify-between gap-6 transition-[padding] duration-300', scrolled ? 'py-2' : 'py-3')}>
          {logo}
          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-5">
              {items.map((it) => (
                <li key={it.href}>
                  <Link href={it.href} aria-current={active(it.href) ? 'page' : undefined} className="nav-link">
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <BookButton className="btn-cta hidden whitespace-nowrap !min-h-[44px] !px-5 !text-[0.92rem] sm:inline-flex">
              <Icon name="calendar-check" className="h-4 w-4" /> Book Appointment
            </BookButton>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-text hover:bg-sky xl:hidden"
              aria-expanded={menu}
              aria-controls="mobile-menu"
              aria-label={menu ? 'Close menu' : 'Open menu'}
              onClick={() => setMenu((m) => !m)}
            >
              <Icon name={menu ? 'x' : 'menu'} className="h-6 w-6" />
            </button>
          </div>
        </div>
        <nav id="mobile-menu" aria-label="Mobile" hidden={!menu} className="border-t border-border xl:hidden">
          <ul className="container-site grid gap-0.5 py-3">
            {items.map((it) => (
              <li key={it.href}>
                <Link
                  href={it.href}
                  aria-current={active(it.href) ? 'page' : undefined}
                  className={cn('flex min-h-[48px] items-center justify-between border-l-[3px] px-3 font-heading text-lg font-medium', active(it.href) ? 'border-primary text-primary' : 'border-transparent text-text hover:text-primary')}
                >
                  {it.label} <Icon name="chevron-right" className="h-5 w-5 text-textSecondary" />
                </Link>
              </li>
            ))}
            <li className="mt-3 grid grid-cols-2 gap-2">
              <a href={signInHref} className="btn-ghost !px-3">
                <Icon name="log-in" className="h-4 w-4" /> Sign in
              </a>
              <a href={registerHref} className="btn-ghost !px-3">
                <Icon name="user-plus" className="h-4 w-4" /> Register
              </a>
            </li>
            {callHref && (
              <li>
                <a href={callHref} className="btn-primary mt-2 w-full">
                  <Icon name="phone" className="h-4 w-4" /> Call {callDisplay}
                </a>
              </li>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
}
