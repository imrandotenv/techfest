import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ToolsDashboard } from '@/modules/tools';
import { ToolsSkeleton } from '@/components/ui/SkeletonLoaders';

export const metadata: Metadata = {
  title: 'Student Utilities & MAKAUT Calculator | SETTech',
  description:
    'Official MAKAUT 10-point SGPA/CGPA/YGPA calculator, 2026-27 academic calendar timeline, private client-side PDF merger, TechFest 2026 registration, and AI study companion.',
};

export default function ToolsPage() {
  return (
    <Suspense fallback={<ToolsSkeleton />}>
      <ToolsDashboard />
    </Suspense>
  );
}
