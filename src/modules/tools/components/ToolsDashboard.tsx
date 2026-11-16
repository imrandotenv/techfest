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
          <span className="p-1.5 rounded bg-zinc-900 text-white font-mono text-xs font-bold">
            UTILITIES
          </span>
          <span className="text-xs font-mono uppercase text-zinc-500 tracking-wider">
            SETGOI Academic & Student Tools Suite
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 mt-2">
          Student Utilities & Academic Calculators
        </h1>
        <p className="text-sm text-zinc-600 mt-1 max-w-3xl">
          Centralized high-performance engineering utilities for SETGOI Durgapur. Calculate exact MAKAUT credit-indexed grades, track assessment schedules, merge study documents securely, and interact with the campus AI companion.
        </p>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 border-b border-zinc-200 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isActive
                  ? 'bg-white border-zinc-900 shadow-sm ring-1 ring-zinc-900'
                  : 'bg-zinc-50/60 border-zinc-200 hover:bg-white hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <div
                  className={`p-1.5 rounded-lg border ${
                    isActive
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-white text-zinc-600 border-zinc-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-semibold ${
                    isActive
                      ? 'bg-zinc-100 text-zinc-900'
                      : 'bg-zinc-100 text-zinc-500'
                  }`}
                >
                  {tab.badge}
                </span>
              </div>

              <div className="mt-3">
                <p className="text-xs font-bold text-zinc-900 tracking-tight leading-tight">
                  {tab.label}
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5 truncate hidden sm:block">
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
