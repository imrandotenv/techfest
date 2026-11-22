import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { AcademicCalendarTimeline } from '@/modules/tools/components/AcademicCalendarTimeline';

export const metadata: Metadata = {
  title: 'MAKAUT Academic Calendar 2026-2027 | SETTech SETGOI',
  description:
    'Official MAKAUT university academic timeline, odd and even semester examination schedules, CA/PCA class assessment dates, and semester recess for SETGOI Durgapur.',
};

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-4 sm:pt-6 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Suspense
          fallback={
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center text-xs text-[#475569] font-mono shadow-2xs">
              Loading MAKAUT Academic Calendar...
            </div>
          }
        >
          <AcademicCalendarTimeline />
        </Suspense>
      </div>
    </div>
  );
}
