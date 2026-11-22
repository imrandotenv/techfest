'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Calculator, 
  ShieldCheck, 
  Bot, 
  Bell,
  Sparkles,
  GraduationCap,
  ArrowRight,
  Languages,
  Volume2,
  CheckCircle2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { SgpaCgpaCalculator } from './SgpaCgpaCalculator';
import { AttendanceTracker } from './AttendanceTracker';
import { NoticeBoard } from './NoticeBoard';
import { AiStudyCompanion } from './AiStudyCompanion';
import { TechFestBoard } from './TechFestBoard';
import { StudentAcademicCockpit } from './StudentAcademicCockpit';
import { VivaBuddyCharacter } from '@/components/VivaBuddyCharacter';

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
    { id: 'viva-buddy' as ToolTab, label: 'AI Viva Studio', icon: Sparkles },
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
          Centralized high-performance engineering utilities for SETGOI Durgapur. Calculate exact MAKAUT credit-indexed grades, audit mandatory 75% attendance and safe bunks, register for campus TechFest events, and launch the dedicated AI Viva Studio.
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
        {/* Sleek Launch Card for AI Viva Studio */}
        {activeTab === 'viva-buddy' && (
          <div className="w-full bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-xl text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/60 font-mono text-[11px] font-bold">
                    DEDICATED FULL-FOCUS ROUTE
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[11px] font-semibold flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-emerald-600" />
                    Natural Speech Voice
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-mono text-[11px] font-semibold flex items-center gap-1">
                    <Languages className="w-3 h-3 text-purple-600" />
                    English &amp; Hinglish
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#09090B]">
                    Expressive AI Viva Studio
                  </h2>
                  <p className="text-sm text-[#52525B] font-sans leading-relaxed">
                    AI Viva has graduated to its own dedicated, distraction-free studio at <code className="px-1.5 py-0.5 bg-zinc-100 rounded text-xs font-mono text-[#09090B]">/viva</code>. Conduct rapid-fire technical viva sessions with animated character reactions, humanized examiner feedback, and voice speech in English and conversational Hinglish.
                  </p>
                </div>

                {/* Key Features Pill Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono text-[#52525B] pt-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Exact technical answer first</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Bilingual: English + Hinglish</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>DSA, COA, OS, ADE, DBMS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pulsing Mic Speech Input</span>
                  </div>
                </div>

                {/* Big Launch CTA */}
                <div className="pt-2">
                  <Link
                    href="/viva"
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-sans text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-blue-200" />
                    <span>Launch AI Viva Studio →</span>
                  </Link>
                </div>
              </div>

              {/* Character Illustration Preview */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50/70 border border-[#E4E4E7] rounded-2xl shrink-0">
                <VivaBuddyCharacter emotion="happy" size={160} />
                <div className="mt-2 text-center">
                  <span className="text-xs font-mono font-bold text-[#09090B]">
                    Viva Buddy AI
                  </span>
                  <p className="text-[11px] font-mono text-[#52525B]">
                    MAKAUT External Examiner
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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
