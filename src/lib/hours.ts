// Opening hours: formatting, grouping and open/closed-now in the clinic's time zone. Pure (unit-tested).
import { DAYS, type Day } from './days';

type Session = { opens: string; closes: string };
export type DayHours = { day: Day; sessions: Session[] };

export const DAY_LABEL: Record<Day, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
};
export const DAY_SHORT: Record<Day, string> = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' };
export const SCHEMA_DAY: Record<Day, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
};

const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

export function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}
/** Compact "10–2" style used in chips: drops :00 and AM/PM. */
export function shortTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${h12}:${String(m).padStart(2, '0')}` : String(h12);
}
export const formatSession = (s: Session) => `${formatTime(s.opens)} – ${formatTime(s.closes)}`;
export const shortSessions = (ss: Session[]) => ss.map((s) => `${shortTime(s.opens)}–${shortTime(s.closes)}`).join(' & ');

/** Consecutive days with identical sessions: [Mon..Sat], [Sun]. */
export function groupDays(hours: DayHours[]): { days: Day[]; sessions: Session[] }[] {
  const out: { days: Day[]; sessions: Session[] }[] = [];
  for (const h of hours) {
    const last = out[out.length - 1];
    if (last && JSON.stringify(last.sessions) === JSON.stringify(h.sessions)) last.days.push(h.day);
    else out.push({ days: [h.day], sessions: h.sessions });
  }
  return out;
}

const range = (days: Day[], labels: Record<Day, string>) => (days.length > 1 ? `${labels[days[0]]}–${labels[days[days.length - 1]]}` : labels[days[0]]);

/** "Monday–Saturday 10:00 AM – 2:00 PM and 5:00 PM – 9:00 PM; Sunday closed" */
export function hoursSummary(hours: DayHours[]): string {
  return groupDays(hours)
    .map((g) => `${range(g.days, DAY_LABEL)} ${g.sessions.length ? g.sessions.map(formatSession).join(' and ') : 'closed'}`)
    .join('; ');
}
/** "Mon–Sat 10–2 & 5–9" (first open group). */
export function hoursShort(hours: DayHours[]): string {
  const g = groupDays(hours).find((x) => x.sessions.length);
  return g ? `${range(g.days, DAY_SHORT)} ${shortSessions(g.sessions)}` : '';
}

export function nowInZone(timeZone: string, date = new Date()): { day: Day; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return { day: get('weekday').toLowerCase() as Day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

export type OpenStatus =
  | { open: true; closesAt: string }
  | { open: false; nextOpen: { day: Day; time: string; isToday: boolean; isTomorrow: boolean } | null };

export function openStatus(hours: DayHours[], timeZone: string, date = new Date()): OpenStatus {
  const { day, minutes } = nowInZone(timeZone, date);
  const today = hours.find((h) => h.day === day);
  const current = today?.sessions.find((s) => minutes >= toMin(s.opens) && minutes < toMin(s.closes));
  if (current) return { open: true, closesAt: current.closes };
  const later = today?.sessions.find((s) => toMin(s.opens) > minutes);
  if (later) return { open: false, nextOpen: { day, time: later.opens, isToday: true, isTomorrow: false } };
  const idx = DAYS.indexOf(day);
  for (let i = 1; i <= 7; i++) {
    const d = DAYS[(idx + i) % 7];
    const h = hours.find((x) => x.day === d);
    if (h?.sessions.length) return { open: false, nextOpen: { day: d, time: h.sessions[0].opens, isToday: false, isTomorrow: i === 1 } };
  }
  return { open: false, nextOpen: null };
}

/** One-line status for the UI ("Open now · closes 2:00 PM", "Closed · opens tomorrow 10:00 AM"). */
export function openStatusText(s: OpenStatus): string {
  if (s.open) return `Open now · closes ${formatTime(s.closesAt)}`;
  if (!s.nextOpen) return 'Closed';
  const when = s.nextOpen.isToday ? 'today' : s.nextOpen.isTomorrow ? 'tomorrow' : DAY_LABEL[s.nextOpen.day];
  return `Closed · opens ${when} ${formatTime(s.nextOpen.time)}`;
}
