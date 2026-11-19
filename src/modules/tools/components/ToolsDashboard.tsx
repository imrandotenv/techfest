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

  const tabs = [
    {
      id: 'calculator' as ToolTab,
      label: 'SGPA / CGPA / YGPA',
      shortLabel: 'Calculator',
      icon: Calculator,
      description: 'MAKAUT 10-point credit index & degree division',
      badge: 'Official MAKAUT',
    },
    {
      id: 'notices' as ToolTab,
      label: 'Priority Notice Board',
      shortLabel: 'Notices',
      icon: Bell,
      description: 'Official academic & transit circulars',
      badge: 'Live Board',
    },
    {
      id: 'calendar' as ToolTab,
      label: 'Academic Calendar',
      shortLabel: 'Calendar',
      icon: Calendar,
      description: '2026–27 timeline & CA/PCA test windows',
      badge: '2026–27',
    },
    {
      id: 'pdf-merger' as ToolTab,
      label: 'Client PDF Merger',
      shortLabel: 'PDF Merger',
      icon: FileSpreadsheet,
      description: 'In-browser notes & PYQ merger (pdf-lib)',
      badge: 'Private',
    },
    {
      id: 'techfest' as ToolTab,
      label: 'TechFest 2026 Board',
      shortLabel: 'TechFest',
      icon: Ticket,
      description: 'Flagship hackathons & digital pass passes',
      badge: 'Nov 2026',
    },
    {
      id: 'ai-companion' as ToolTab,
      label: 'AI Campus Companion',
      shortLabel: 'AI Assistant',
      icon: Bot,
      description: 'Streaming SETGOI study & rules assistant',
      badge: 'Gemini',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-md bg-[#0F172A] text-white font-mono text-xs font-bold">
            UTILITIES
          </span>
          <span className="text-xs font-mono uppercase text-[#475569] tracking-wider">
            SETGOI Academic &amp; Student Tools Suite
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] font-display mt-2">
          Student Utilities &amp; Academic Calculators
        </h1>
        <p className="text-sm text-[#475569] mt-1 max-w-3xl font-sans leading-relaxed">
          Centralized high-performance engineering utilities for SETGOI Durgapur. Calculate exact MAKAUT credit-indexed grades, track assessment schedules, merge study documents securely, and interact with the campus AI companion.
        </p>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 border-b border-[#E2E8F0] pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isActive
                  ? 'bg-white border-[#0F172A] shadow-xs ring-1 ring-[#0F172A]'
                  : 'bg-white border-[#E2E8F0] hover:border-slate-300 hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <div
                  className={`p-1.5 rounded-lg border ${
                    isActive
                      ? 'bg-[#0F172A] text-white border-[#0F172A]'
                      : 'bg-slate-50 text-[#475569] border-[#E2E8F0]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-semibold ${
                    isActive
                      ? 'bg-slate-100 text-[#0F172A]'
                      : 'bg-slate-100 text-[#475569]'
                  }`}
                >
                  {tab.badge}
                </span>
              </div>

              <div className="mt-3">
                <p className="text-xs font-bold text-[#0F172A] tracking-tight leading-tight font-display">
                  {tab.label}
                </p>
                <p className="text-[10px] text-[#475569] mt-0.5 truncate hidden sm:block font-sans">
                  {tab.description}
                </p>
              </div>
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
