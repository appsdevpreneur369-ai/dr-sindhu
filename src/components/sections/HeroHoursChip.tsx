'use client';
import { useEffect, useState } from 'react';
import { todayHoursText, type DayHours } from '@/lib/hours';

/**
 * Hero chip, computed in the visitor's browser for "today" in the clinic's time zone (static pages stay correct):
 * "Open today Morning 10:00 AM – 2:00 PM & Evening 5:00 PM – 9:00 PM" or "Closed today · Opens Monday 10:00 AM".
 * `fallback` (rendered on the server from the same formatter) shows until the browser has computed it.
 */
export function HeroHoursChip({ hours, timeZone, fallback }: { hours: DayHours[]; timeZone: string; fallback: string }) {
  const [text, setText] = useState(fallback);
  useEffect(() => setText(todayHoursText(hours, timeZone)), [hours, timeZone]);
  // Same text, laid out one session per line: "Open today Morning … –" / "& Evening …".
  const [first, ...rest] = text.split(' & ');
  return (
    <>
      <span className="block whitespace-nowrap">{first}</span>
      {rest.map((r) => (
        <span key={r} className="block whitespace-nowrap">
          &amp; {r}
        </span>
      ))}
    </>
  );
}
