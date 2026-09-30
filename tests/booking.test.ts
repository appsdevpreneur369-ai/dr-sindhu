import { afterEach, describe, expect, it, vi } from 'vitest';
import { BookingError } from '@/lib/booking/api';
import { autoOpenDelayMs, canAutoOpen, isExcludedPath, type PopupConfig } from '@/lib/booking/popupRules';
import { fallbackOrder, selectMode } from '@/lib/booking/selectMode';
import { EnquiryBookingService, WhatsAppBookingService, resolveBookingService } from '@/lib/booking/services';
import { isValidEmail, isValidFullName, normalizeIndianMobile, splitFullName } from '@/lib/booking/validation';
import { contactChannels } from '@/lib/contact';
import { bookingConfig, content } from './fixtures';

afterEach(() => vi.unstubAllGlobals());

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const req = { fullName: 'Ravi Teja', phone: '9876543210', email: 'ravi@example.com', branchId: 'content', treatmentLabel: 'Toothache', doctorSlug: 'dr-sindhu', date: '2026-10-05', time: '10:30' };

describe('fallback selection', () => {
  it('clinicflow → enquiry → whatsapp when WhatsApp is approved', () => {
    expect(fallbackOrder('clinicflow', true)).toEqual(['clinicflow', 'enquiry', 'whatsapp']);
    expect(selectMode('clinicflow', { clinicflow: { ok: false }, enquiry: { ok: true } }, true).mode).toBe('enquiry');
    expect(selectMode('clinicflow', { clinicflow: { ok: false }, enquiry: { ok: false } }, true).mode).toBe('whatsapp');
  });

  it('placeholder phone rule: WhatsApp is never a fallback; enquiry is final; otherwise honestly unavailable', () => {
    expect(fallbackOrder('clinicflow', false)).toEqual(['clinicflow', 'enquiry']);
    expect(selectMode('clinicflow', { clinicflow: { ok: false }, enquiry: { ok: true } }, false).mode).toBe('enquiry');
    const r = selectMode('clinicflow', { clinicflow: { ok: false, reason: 'x' }, enquiry: { ok: false, reason: 'y' } }, false);
    expect(r.mode).toBe('unavailable');
    expect(r.reasons.join()).toMatch(/whatsapp disabled/);
    expect(selectMode('whatsapp', {}, false).mode).toBe('unavailable');
  });

  it('prefers clinicflow when healthy', () => {
    expect(selectMode('clinicflow', { clinicflow: { ok: true }, enquiry: { ok: true } }, true).mode).toBe('clinicflow');
  });
});

describe('resolveBookingService (stubbed network)', () => {
  it('empty apiBaseUrl (today\'s config) → WhatsApp while the number is approved, without any network call', async () => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    const r = await resolveBookingService(bookingConfig());
    expect(r.mode).toBe('whatsapp');
    expect(f).not.toHaveBeenCalled();
  });

  it('empty apiBaseUrl + placeholder WhatsApp → unavailable, no service, no fake success', async () => {
    vi.stubGlobal('fetch', vi.fn());
    const r = await resolveBookingService(bookingConfig({ whatsappDigits: null }));
    expect(r.mode).toBe('unavailable');
    expect(r.service).toBeNull();
  });

  it('API reachable but clinic doctors missing → enquiry (real leads endpoint)', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url.endsWith('/clinics/public/dr-sindhu-dental-clinic')) return json(200, { id: 'c1', slug: 'dr-sindhu-dental-clinic', name: 'x' });
      if (url.includes('/branches')) return json(200, [{ id: 'b1', name: 'Main' }]);
      if (url.includes('/doctors')) return json(200, []);
      return json(404, {});
    }));
    const r = await resolveBookingService(bookingConfig({ baseUrl: 'http://api.test/api/v1', clinicSlug: 'dr-sindhu-dental-clinic', whatsappDigits: null }));
    expect(r.mode).toBe('enquiry');
  });

  it('browser blocked by CORS → skips both API modes', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url.startsWith('/api/clinicflow')) return json(200, { id: 'c1', slug: 's', name: 'x' });
      throw new TypeError('Failed to fetch');
    }));
    const r = await resolveBookingService(bookingConfig({ baseUrl: 'http://api.test/api/v1', clinicSlug: 'dr-sindhu-dental-clinic' }));
    expect(r.mode).toBe('whatsapp');
    expect(r.reasons.join()).toMatch(/CORS/);
  });

  it('full clinicflow when clinic, branches and a matching doctor exist', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (/\/clinics\/public\/[^/]+$/.test(url)) return json(200, { success: true, data: { id: 'c1', slug: 's', name: 'x' } });
      if (url.includes('/branches')) return json(200, [{ id: 'b1', name: 'Main', city: 'Tadepalli' }]);
      if (url.endsWith('/doctors')) return json(200, [{ id: 'd1', firstName: 'Sindhu', lastName: 'MDS' }]);
      return json(404, {});
    }));
    const r = await resolveBookingService(bookingConfig({ baseUrl: 'http://api.test/api/v1', clinicSlug: 'dr-sindhu-dental-clinic' }));
    expect(r.mode).toBe('clinicflow');
    expect(r.service!.requiresOtp).toBe(true);
  });

  it('enquiry never fakes success: a failed lead POST throws', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => json(500, { success: false, error: { code: 'X' } })));
    const s = new EnquiryBookingService(bookingConfig({ baseUrl: 'http://api.test', clinicSlug: 'dr-sindhu-dental-clinic' }));
    await expect(s.book(req)).rejects.toBeInstanceOf(BookingError);
  });

  it('WhatsApp service refuses to exist with a placeholder number, and builds a wa.me link otherwise', async () => {
    expect(() => new WhatsAppBookingService(bookingConfig({ whatsappDigits: null }))).toThrow(BookingError);
    const r = await new WhatsAppBookingService(bookingConfig()).book(req);
    expect(r.kind).toBe('whatsapp');
    expect(r.kind === 'whatsapp' && r.href).toMatch(/^https:\/\/wa\.me\/919441695953\?text=/);
  });
});

describe('contact placeholder rule', () => {
  it('approved number → call + WhatsApp; placeholder email → no mailto', () => {
    const ch = contactChannels(content.clinic);
    expect(ch.call?.href).toBe('tel:+919441695953');
    expect(ch.whatsapp?.digits).toBe('919441695953');
    expect(ch.email).toBeNull();
  });
  it('placeholder or fake-looking numbers never become links', () => {
    const fake = { ...content.clinic, phone: { status: 'placeholder', display: '+91 XXXXX XXXXX', e164: '+91XXXXXXXXXX' }, whatsapp: { status: 'approved', display: 'x', e164: '+91XXXXXXXXXX' } };
    const ch = contactChannels(fake);
    expect(ch.call).toBeNull();
    expect(ch.whatsapp).toBeNull();
  });
});

describe('phone / email / name validation', () => {
  it('normalises Indian mobiles', () => {
    expect(normalizeIndianMobile('+91 94416 95953')).toBe('9441695953');
    expect(normalizeIndianMobile('09441695953')).toBe('9441695953');
    expect(normalizeIndianMobile('919441695953')).toBe('9441695953');
    expect(normalizeIndianMobile('5441695953')).toBeNull();
    expect(normalizeIndianMobile('94416')).toBeNull();
    expect(normalizeIndianMobile('+91 XXXXX XXXXX')).toBeNull();
  });
  it('validates emails', () => {
    expect(isValidEmail('patient@gmail.com')).toBe(true);
    expect(isValidEmail('a@b')).toBe(false);
    expect(isValidEmail('email to be confirmed')).toBe(false);
    expect(isValidEmail('x..y@mail.com')).toBe(false);
  });
  it('names', () => {
    expect(isValidFullName('Ravi')).toBe(true);
    expect(isValidFullName(' 1 ')).toBe(false);
    expect(splitFullName('Ravi')).toEqual({ firstName: 'Ravi', lastName: '.' });
    expect(splitFullName('Sai Ravi Teja')).toEqual({ firstName: 'Sai Ravi', lastName: 'Teja' });
  });
});

describe('popup rules', () => {
  const config: PopupConfig = content.booking.popup;
  const base = { config, pathname: '/', isMobile: false, sessionState: null, shownThisPage: false } as const;
  it('opens after ~8s, once per session', () => {
    expect(autoOpenDelayMs(config)).toBe(8000);
    expect(canAutoOpen(base)).toBe(true);
    expect(canAutoOpen({ ...base, sessionState: 'closed' })).toBe(false);
    expect(canAutoOpen({ ...base, sessionState: 'opened' })).toBe(false);
    expect(canAutoOpen({ ...base, shownThisPage: true })).toBe(false);
  });
  it('never on excluded pages (book, legal, emergency) incl. sub-paths and trailing slashes', () => {
    for (const p of ['/book', '/book/', '/privacy', '/emergency', '/terms?x=1']) expect(canAutoOpen({ ...base, pathname: p })).toBe(false);
    expect(isExcludedPath('/bookings', config.excludedPaths)).toBe(false);
  });
  it('booked always wins, even when oncePerSession is off', () => {
    expect(canAutoOpen({ ...base, config: { ...config, oncePerSession: false }, sessionState: 'booked' })).toBe(false);
    expect(canAutoOpen({ ...base, config: { ...config, oncePerSession: false }, sessionState: 'closed' })).toBe(true);
  });
  it('respects enabled and showOnMobile', () => {
    expect(canAutoOpen({ ...base, config: { ...config, enabled: false } })).toBe(false);
    expect(canAutoOpen({ ...base, isMobile: true, config: { ...config, showOnMobile: false } })).toBe(false);
  });
});
