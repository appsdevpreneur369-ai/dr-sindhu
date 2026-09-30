'use client';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useBooking } from '@/components/booking/BookingProvider';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { writePopupState } from '@/lib/booking/storage';

/** /book: the wizard inline, pre-filled from ?problem= / ?treatment= / ?doctor=. */
export function BookPageWizard() {
  const { config } = useBooking();
  const sp = useSearchParams();
  const prefill = useMemo(
    () => ({ problem: sp.get('problem') ?? undefined, treatment: sp.get('treatment') ?? undefined, doctor: sp.get('doctor') ?? undefined }),
    [sp],
  );
  return <BookingWizard config={config} prefill={prefill} onBooked={() => writePopupState('booked')} headingLevel="h2" />;
}
