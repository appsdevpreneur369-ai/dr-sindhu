import { describe, expect, it } from 'vitest';
import { formatSessions, hoursShort, hoursSummary, openStatus, openStatusText, sessionLabel, todayHoursText } from '@/lib/hours';
import { hasFeature, patientBenefits } from '@/lib/plan';
import { buildRedirects, portalBase, portalUrl } from '@/lib/site-redirects.mjs';
import { content } from './fixtures';

describe('plan gating', () => {
  it('the clinic is on STARTER', async () => {
    const plan = (await import('../content/plan.json')).default.plan;
    expect(plan).toBe('starter');
  });
  it('starter has exactly the promised features and none of the Pro/Enterprise ones', () => {
    for (const f of ['onlineBooking', 'liveQueue', 'digitalPrescriptions', 'emailReminders', 'whatsappReminders', 'smsReminders'] as const) expect(hasFeature('starter', f)).toBe(true);
    for (const f of ['portalGallery', 'analytics', 'reviewRequests', 'noShowAlerts', 'winBackCampaigns', 'waitlist', 'brandedPortal', 'customSubdomain', 'customAppointmentFields', 'dedicatedOnboarding'] as const)
      expect(hasFeature('starter', f)).toBe(false);
  });
  it('the site never lists a benefit the plan lacks', () => {
    expect(patientBenefits('starter').join()).not.toMatch(/waitlist/i);
    expect(patientBenefits('enterprise').join()).toMatch(/waitlist/i);
    expect(patientBenefits('free').join()).not.toMatch(/WhatsApp|SMS|Email/);
  });
});

describe('portal links + redirects', () => {
  const portal = content.portal;
  it('starter: shared ClinicFlow portal with the clinic slug', () => {
    expect(portalUrl(portal, 'starter', 'login')).toBe('https://clinicflow247.com/clinic/dr-sindhu-dental-clinic/login');
    expect(portalUrl(portal, 'starter', 'register')).toBe('https://clinicflow247.com/clinic/dr-sindhu-dental-clinic/register');
    expect(portalUrl(portal, 'starter', 'staffLogin')).toBe('https://clinicflow247.com/login');
  });
  it('a subdomain is ignored on starter and used on enterprise (upgrade = config change)', () => {
    const p = { ...portal, enterprise: { subdomain: 'drsindhu' } };
    expect(portalBase(p, 'starter')).toBe('https://clinicflow247.com');
    expect(portalBase(p, 'enterprise')).toBe('https://drsindhu.clinicflow247.com');
  });
  it('serves /login, /register, /clinic/:slug/* and alias redirects', () => {
    const r = buildRedirects({ portal, plan: 'starter', doctors: [] });
    const find = (s: string) => r.find((x) => x.source === s);
    expect(find('/login')?.destination).toBe('https://clinicflow247.com/clinic/dr-sindhu-dental-clinic/login');
    expect(find('/register')?.destination).toBe('https://clinicflow247.com/clinic/dr-sindhu-dental-clinic/register');
    expect(find('/clinic/:path*')?.destination).toBe('https://clinicflow247.com/clinic/:path*');
    expect(find('/services/:slug')?.destination).toBe('/treatments/:slug');
    expect(find('/login')?.permanent).toBe(false);
  });
  it('a renamed doctor keeps the old URL working (minimal-effort rename)', () => {
    const r = buildRedirects({ portal, plan: 'starter', doctors: [{ slug: 'dr-sindhu-rao', previousSlugs: ['dr-sindhu'] }] });
    expect(r.find((x) => x.source === '/doctors/dr-sindhu')).toMatchObject({ destination: '/doctors/dr-sindhu-rao', permanent: true });
  });
});

describe('hours (Asia/Kolkata)', () => {
  const days = content.clinic.hours.days;
  const at = (iso: string) => openStatus(days, 'Asia/Kolkata', new Date(iso));
  it('one formatter for all human-readable timings (full times, Morning/Evening labels)', () => {
    expect(formatSessions(days[0].sessions)).toBe('Morning 10:00 AM – 2:00 PM & Evening 5:00 PM – 9:00 PM');
    expect(hoursShort(days)).toBe('Mon–Sat, Morning 10:00 AM – 2:00 PM & Evening 5:00 PM – 9:00 PM');
    expect(hoursSummary(days)).toBe('Monday–Saturday, Morning 10:00 AM – 2:00 PM & Evening 5:00 PM – 9:00 PM; Sunday closed');
    expect(sessionLabel({ opens: '14:00', closes: '16:00' })).toBe('Afternoon');
  });
  it('a timing change in content flows through the formatter', () => {
    const changed = days.map((d: { day: string; sessions: unknown[] }) => (d.sessions.length ? { ...d, sessions: [{ opens: '09:30', closes: '13:00' }, { opens: '18:00', closes: '20:30' }] } : d));
    expect(hoursShort(changed)).toBe('Mon–Sat, Morning 9:30 AM – 1:00 PM & Evening 6:00 PM – 8:30 PM');
  });
  it('hero chip: open day vs Sunday (Asia/Kolkata)', () => {
    expect(todayHoursText(days, 'Asia/Kolkata', new Date('2026-10-05T03:00:00Z'))).toBe('Open today Morning 10:00 AM – 2:00 PM & Evening 5:00 PM – 9:00 PM'); // Mon 08:30 IST
    expect(todayHoursText(days, 'Asia/Kolkata', new Date('2026-10-11T06:00:00Z'))).toBe('Closed today · Opens Monday 10:00 AM'); // Sun 11:30 IST
    expect(todayHoursText(days, 'Asia/Kolkata', new Date('2026-10-10T19:00:00Z'))).toBe('Closed today · Opens Monday 10:00 AM'); // Sun 00:30 IST (still Sat in UTC)
    const wedClosed = days.map((d: { day: string }) => (d.day === 'wednesday' ? { ...d, sessions: [] } : d));
    expect(todayHoursText(wedClosed, 'Asia/Kolkata', new Date('2026-10-07T06:00:00Z'))).toBe('Closed today · Opens Thursday 10:00 AM');
  });
  it('open / lunch break / evening / Sunday', () => {
    expect(at('2026-10-05T05:00:00Z')).toEqual({ open: true, closesAt: '14:00' }); // Mon 10:30 IST
    expect(openStatusText(at('2026-10-05T09:30:00Z'))).toBe('Closed · opens today 5:00 PM'); // Mon 15:00 IST
    expect(at('2026-10-05T15:00:00Z')).toEqual({ open: true, closesAt: '21:00' }); // Mon 20:30 IST
    expect(openStatusText(at('2026-10-10T16:00:00Z'))).toBe('Closed · opens Monday 10:00 AM'); // Sat 21:30 IST
    expect(openStatusText(at('2026-10-11T06:00:00Z'))).toBe('Closed · opens tomorrow 10:00 AM'); // Sun
  });
});
