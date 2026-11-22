'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Calculator, 
  ShieldCheck, 
  Bot, 
  Bell,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { SgpaCgpaCalculator } from './SgpaCgpaCalculator';
import { AttendanceTracker } from './AttendanceTracker';
import { NoticeBoard } from './NoticeBoard';
import { AiStudyCompanion } from './AiStudyCompanion';
import { AiVivaBuddy } from './AiVivaBuddy';
import { TechFestBoard } from './TechFestBoard';
import { StudentAcademicCockpit } from './StudentAcademicCockpit';

export type ToolTab = 'dashboard' | 'viva-buddy' | 'calculator' | 'attendance' | 'events' | 'notices' | 'ai-companion';

export function ToolsDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get('tab') as ToolTab | null;
  const validTabs: ToolTab[] = ['dashboard', 'viva-buddy', 'calculator', 'attendance', 'events', 'notices', 'ai-companion'];
  const [activeTab, setActiveTab] = useState<ToolTab>(
    tabParam && validTabs.includes(tabParam)
      ? tabParam
      : 'calculator'
  );

  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (newTab: ToolTab) => {
    setActiveTab(newTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', newTab);
    router.replace(`/tools?${params.toString()}`, { scroll: false });
  };

  const pillTabs = [
    { id: 'viva-buddy' as ToolTab, label: 'Expressive AI Viva Buddy', icon: Sparkles },
    { id: 'dashboard' as ToolTab, label: 'Student Cockpit', icon: GraduationCap },
    { id: 'calculator' as ToolTab, label: 'SGPA / CGPA Calculator', icon: Calculator },
    { id: 'attendance' as ToolTab, label: '75% Attendance Tracker', icon: ShieldCheck },
    { id: 'events' as ToolTab, label: 'Campus Events & TechFest', icon: Sparkles },
    { id: 'notices' as ToolTab, label: 'Notice Board & Exam Dates', icon: Bell },
    { id: 'ai-companion' as ToolTab, label: 'AI Syllabus Helper', icon: Bot },
  ];

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/60 font-mono text-xs font-bold">
            ACADEMIC SUITE
          </span>
          <span className="text-xs font-mono uppercase text-[#52525B] tracking-wider">
            SETGOI Engineering Utilities
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#09090B] font-display mt-2">
          Student Utilities &amp; Academic Calculators
        </h1>
        <p className="text-sm text-[#52525B] mt-1 max-w-3xl font-sans leading-relaxed">
          Centralized high-performance engineering utilities for SETGOI Durgapur. Calculate exact MAKAUT credit-indexed grades, audit mandatory 75% attendance and safe bunks, register for campus TechFest events, and get real-time AI syllabus guidance.
        </p>
      </div>

      {/* Clean Horizontal Pill Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#E4E4E7] pb-3">
        {pillTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold font-sans transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-white text-[#52525B] border border-[#E4E4E7] hover:border-zinc-300 hover:text-[#09090B] hover:bg-zinc-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panes */}
      <div className="animate-in fade-in duration-150">
        {activeTab === 'viva-buddy' && <AiVivaBuddy />}
        {activeTab === 'dashboard' && <StudentAcademicCockpit />}
        {activeTab === 'calculator' && <SgpaCgpaCalculator />}
        {activeTab === 'attendance' && <AttendanceTracker />}
        {activeTab === 'events' && <TechFestBoard />}
        {activeTab === 'notices' && <NoticeBoard />}
        {activeTab === 'ai-companion' && <AiStudyCompanion />}
      </div>
    </div>
  );
}