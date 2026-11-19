'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Calculator, 
  Calendar, 
  FileSpreadsheet, 
  Sparkles, 
  Bot, 
  Layers,
  Wrench,
  CheckCircle2,
  Ticket,
  Bell
} from 'lucide-react';
import { SgpaCgpaCalculator } from './SgpaCgpaCalculator';
import { AcademicCalendarTimeline } from './AcademicCalendarTimeline';
import { PdfMerger } from './PdfMerger';
import { TechFestBoard } from './TechFestBoard';
import { AiStudyCompanion } from './AiStudyCompanion';
import { NoticeBoard } from './NoticeBoard';

export type ToolTab = 'calculator' | 'notices' | 'calendar' | 'pdf-merger' | 'techfest' | 'ai-companion';

export function ToolsDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get('tab') as ToolTab | null;
  const validTabs = ['calculator', 'notices', 'calendar', 'pdf-merger', 'techfest', 'ai-companion'];
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
    { id: 'calculator' as ToolTab, label: 'SGPA Calculator', icon: Calculator },
    { id: 'notices' as ToolTab, label: 'Notice Board', icon: Bell },
    { id: 'calendar' as ToolTab, label: 'Academic Calendar', icon: Calendar },
    { id: 'pdf-merger' as ToolTab, label: 'PDF Merger', icon: FileSpreadsheet },
    { id: 'ai-companion' as ToolTab, label: 'AI Helper', icon: Bot },
  ];

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/60 font-mono text-xs font-bold">
            UTILITIES
          </span>
          <span className="text-xs font-mono uppercase text-[#52525B] tracking-wider">
            SETGOI Academic &amp; Student Tools Suite
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#09090B] font-display mt-2">
          Student Utilities &amp; Academic Calculators
        </h1>
        <p className="text-sm text-[#52525B] mt-1 max-w-3xl font-sans leading-relaxed">
          Centralized high-performance engineering utilities for SETGOI Durgapur. Calculate exact MAKAUT credit-indexed grades, track assessment schedules, merge study documents securely, and interact with the campus AI companion.
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
        {activeTab === 'calculator' && <SgpaCgpaCalculator />}
        {activeTab === 'notices' && <NoticeBoard />}
        {activeTab === 'calendar' && <AcademicCalendarTimeline />}
        {activeTab === 'pdf-merger' && <PdfMerger />}
        {activeTab === 'techfest' && <TechFestBoard />}
        {activeTab === 'ai-companion' && <AiStudyCompanion />}
      </div>
    </div>
  );
}
