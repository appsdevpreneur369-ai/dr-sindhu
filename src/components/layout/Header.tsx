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
      <div className="on-dark hidden bg-navy text-[0.84rem] text-onDarkMuted md:block">
        <div className="container-site flex flex-wrap items-center justify-between gap-x-6 gap-y-0 py-1 lg:flex-nowrap lg:gap-x-4 lg:py-0 lg:max-xl:text-[0.78rem] xl:gap-x-6">
          <p className="flex min-w-0 items-center gap-2 py-1.5 lg:whitespace-nowrap lg:py-0">
            <Icon name="map-pin" className="h-4 w-4 shrink-0 text-greenOnDark" /> <span>{topLine}</span>
          </p>
          <div className="flex shrink-0 items-center gap-4 lg:max-xl:gap-3 xl:gap-5">
            {callHref && (
              <a href={callHref} className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap font-medium text-onDark hover:text-greenOnDark">
                <Icon name="phone" className="h-4 w-4" /> {callDisplay}
              </a>
            )}
            {whatsappHref && (
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 whitespace-nowrap font-medium text-onDark hover:text-greenOnDark">
                <WhatsAppIcon className="h-4 w-4" /> <span className="lg:max-xl:sr-only">WhatsApp</span>
              </a>
            )}
            <a href={signInHref} className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap border-l border-onDark/20 pl-4 font-medium text-onDark hover:text-greenOnDark xl:pl-5">
              <Icon name="log-in" className="h-4 w-4" /> <span className="lg:max-xl:hidden">Patient sign in</span>
              <span className="hidden lg:max-xl:inline">Sign in</span>
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
                <Link href={it.href} aria-current={active(it.href) ? 'page' : undefined} className="mobile-nav-link">
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
