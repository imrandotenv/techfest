import React from 'react';
import { Metadata } from 'next';
import { StudentAcademicCockpit } from '@/modules/tools/components/StudentAcademicCockpit';

export const metadata: Metadata = {
  title: 'Student Academic Dashboard | SanakaHub SETGOI',
  description: 'Official student academic cockpit, enrolled courses, attendance progress, upcoming MAKAUT examinations, and quick campus utilities.',
};

export default function StudentDashboardPage() {
  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <StudentAcademicCockpit />
      </div>
    </div>
  );
}
