import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ToolsDashboard } from '@/modules/tools';

export const metadata: Metadata = {
  title: 'Student Utilities & MAKAUT Calculator | SETTech',
  description:
    'Official MAKAUT 10-point SGPA/CGPA/YGPA calculator, 2026-27 academic calendar timeline, private client-side PDF merger, TechFest 2026 registration, and AI study companion.',
};

export default function ToolsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-zinc-400 font-mono">
          Loading SETTech Utilities...
        </div>
      }
    >
      <ToolsDashboard />
    </Suspense>
  );
}
