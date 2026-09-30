'use client';
import { useEffect, useState } from 'react';
import { DAY_LABEL, nowInZone, shortSessions, type DayHours } from '@/lib/hours';
import { DAYS } from '@/lib/days';

/** Hero chip: "Open today 10–2 & 5–9", or "Closed today · opens Monday" on a closed day (IST). */
export function HeroHoursChip({ template, hours, timeZone, fallback }: { template: string; hours: DayHours[]; timeZone: string; fallback: string }) {
  const [text, setText] = useState(fallback);
  useEffect(() => {
    const { day } = nowInZone(timeZone);
    const today = hours.find((h) => h.day === day);
    if (today?.sessions.length) return setText(template.replace('{{todayHours}}', shortSessions(today.sessions)));
    const idx = DAYS.indexOf(day);
    for (let i = 1; i <= 7; i++) {
      const d = DAYS[(idx + i) % 7];
      if (hours.find((h) => h.day === d)?.sessions.length) return setText(`Closed today · opens ${i === 1 ? 'tomorrow' : DAY_LABEL[d]}`);
    }
  }, [template, hours, timeZone]);
  return <>{text}</>;
}
