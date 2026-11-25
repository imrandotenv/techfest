'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Calculator,
  ShieldCheck,
  Bell,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { SgpaCgpaCalculator } from './SgpaCgpaCalculator';
import { AttendanceTracker } from './AttendanceTracker';
import { NoticeBoard } from './NoticeBoard';
import { TechFestBoard } from './TechFestBoard';
import { PageHeader } from '@/components/PageHeader';
import { useAcademicProfile } from '@/hooks/useAcademicProfile';

export type ToolTab = 'cgpa' | 'attendance' | 'exams' | 'events';

function normalizeToolTab(raw?: string | null): ToolTab {
  if (!raw) return 'cgpa';
  if (raw === 'calculator' || raw === 'cgpa') return 'cgpa';
  if (raw === 'attendance') return 'attendance';
  if (raw === 'notices' || raw === 'exams') return 'exams';
  if (raw === 'events') return 'events';
  return 'cgpa';
}

export function ToolsDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { profile } = useAcademicProfile();

  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<ToolTab>(() => normalizeToolTab(tabParam));

  useEffect(() => {
    if (tabParam) {
      setActiveTab(normalizeToolTab(tabParam));
    }
  }, [tabParam]);

  const handleTabChange = (newTab: ToolTab) => {
    setActiveTab(newTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', newTab);
    router.replace(`/tools?${params.toString()}`, { scroll: false });
  };

  const pillTabs: Array<{ id: ToolTab; label: string; icon: React.ElementType }> = [
    { id: 'cgpa', label: 'CGPA & SGPA Calculator', icon: Calculator },
    { id: 'attendance', label: '75% Attendance Auditor', icon: ShieldCheck },
    { id: 'exams', label: 'Exam Countdown & Notices', icon: Bell },
    { id: 'events', label: 'TechFest & Campus Events', icon: Sparkles },
  ];

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Unified Compact Page Header Strip */}
      <PageHeader
        badge="STUDENT UTILITIES"
        badgeCode="MAKAUT 10-PT"
        title="Student Utilities & Academic Calculators"
        subtitle="Centralized engineering utilities for SETGOI Durgapur: MAKAUT credit-indexed grades, mandatory 75% attendance auditor, exam countdowns, and campus events."
        action={
          <Link
            href="/viva"
            className="sanaka-btn-primary px-4 py-2 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>AI Viva Studio →</span>
          </Link>
        }
      />

      {profile.onboardingCompleted && (
        <div className="flex items-center gap-2 text-xs text-zinc-600 bg-blue-50/70 border border-blue-200/60 px-3.5 py-2 rounded-xl">
          <GraduationCap className="w-4 h-4 text-[#2563EB] shrink-0" />
          <span>
            Calculators &amp; utilities configured for{' '}
            <strong>
              B.Tech {profile.branch} • Semester {profile.semester}
            </strong>{' '}
            ({profile.passoutYear ? `Class of ${profile.passoutYear}` : 'MAKAUT'})
          </span>
        </div>
      )}

      {/* Balanced 4-Tab Segmented Navigation (Zero Truncation on Desktop or Mobile) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-zinc-100/90 border border-[#E4E4E7] rounded-2xl">
        {pillTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer text-center ${
                isActive
                  ? 'bg-white text-[#2563EB] border border-[#E4E4E7] shadow-xs'
                  : 'text-[#52525B] hover:text-[#09090B] hover:bg-white/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panes */}
      <div className="animate-in fade-in duration-150">
        {activeTab === 'cgpa' && <SgpaCgpaCalculator />}
        {activeTab === 'attendance' && <AttendanceTracker />}
        {activeTab === 'exams' && <NoticeBoard />}
        {activeTab === 'events' && <TechFestBoard />}
      </div>
    </div>
  );
}
