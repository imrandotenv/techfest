import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { NoticeBoard } from '@/modules/tools/components/NoticeBoard';
import { NoticesSkeleton } from '@/components/ui/SkeletonLoaders';

export const metadata: Metadata = {
  title: 'SETGOI Priority Notice Board & MAKAUT Circulars | SETTech',
  description:
    'Official academic notices, examination cell announcements, lab schedules, transport updates, and placement circulars for SETGOI Durgapur students and faculty.',
};

export default function NoticesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-4 sm:pt-6 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Suspense fallback={<NoticesSkeleton />}>
          <NoticeBoard />
        </Suspense>
      </div>
    </div>
  );
}
