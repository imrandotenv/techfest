'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Download, 
  CheckCircle2, 
  Compass, 
  Calculator, 
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkles,
  Mic,
  Volume2,
  Award,
  Flame,
  Check
} from 'lucide-react';
import { VivaBuddyCharacter, VivaEmotion } from '@/components/VivaBuddyCharacter';

const PREVIEW_NOTES = [
  {
    code: 'PCC-CS301',
    title: 'Data Structures & Algorithms - Complete Unit 1 to 5',
    sem: 'Sem 3',
    branch: 'CSE',
    size: '4.2 MB',
    downloads: '384',
    verified: true,
  },
  {
    code: 'ESC301',
    title: 'Digital Electronics (ESC301) Boolean Algebra & K-Map Cheat Sheet',
    sem: 'Sem 3',
    branch: 'CSE',
    size: '1.5 MB',
    downloads: '198',
    verified: true,
  },
  {
    code: 'PCC-CS302',
    title: 'IT Workshop (Python & Linux CLI Handouts & Lab Solutions)',
    sem: 'Sem 3',
    branch: 'CSE',
    size: '2.8 MB',
    downloads: '512',
    verified: true,
  },
];

export function AppWindowPreview() {
  const [activeTab, setActiveTab] = useState<'viva' | 'notes' | 'map' | 'tools'>('viva');
  const [previewEmotion, setPreviewEmotion] = useState<VivaEmotion>('happy');

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] overflow-hidden text-left transition-all">
      {/* Window Titlebar */}
      <div className="h-11 bg-slate-50/80 border-b border-[#E2E8F0] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
        </div>

        {/* Dynamic Address / Search Bar Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white border border-[#E2E8F0] rounded-md text-xs font-mono text-[#475569] w-88 max-w-full justify-between shadow-2xs">
          <span className="truncate text-zinc-800 font-medium">
            {activeTab === 'viva' && 'settech.dev/viva'}
            {activeTab === 'notes' && 'settech.dev/notes/vault'}
            {activeTab === 'map' && 'settech.dev/campus'}
            {activeTab === 'tools' && 'settech.dev/tools'}
          </span>
          <span className="text-[10px] text-blue-600 font-mono font-semibold">
            {activeTab === 'viva' ? 'VOICE AI' : 'v2.4'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {activeTab === 'viva' ? (
            <>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono text-emerald-700 font-semibold tracking-wider hidden sm:inline">
                GROQ WHISPER LIVE
              </span>
            </>
          ) : activeTab === 'notes' ? (
            <>
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[11px] font-mono text-[#475569] uppercase tracking-wider hidden sm:inline">
                MAKAUT LIVE
              </span>
            </>
          ) : activeTab === 'map' ? (
            <>
              <span className="inline-block w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-[11px] font-mono text-[#475569] uppercase tracking-wider hidden sm:inline">
                WEBGL SPATIAL
              </span>
            </>
          ) : (
            <>
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-mono text-[#475569] uppercase tracking-wider hidden sm:inline">
                10-PT MAKAUT
              </span>
            </>
          )}
        </div>
      </div>

      {/* Window Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
        {/* Mock Sidebar */}
        <div className="hidden lg:block lg:col-span-3 border-r border-[#E2E8F0] bg-slate-50/50 p-4 space-y-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#475569] px-2 mb-2">
              Academic Hub
            </div>
            <div className="space-y-1">
              {/* Tab 1: AI Viva Studio (Default) */}
              <button
                onClick={() => setActiveTab('viva')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-sans font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'viva'
                    ? 'bg-blue-50 text-[#2563EB] border border-blue-200/60 font-semibold shadow-2xs'
                    : 'text-[#475569] hover:bg-slate-100 hover:text-[#0F172A]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>AI Viva Studio</span>
                <span className="ml-auto text-[10px] font-mono bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">
                  LIVE
                </span>
              </button>

              {/* Tab 2: Notes & PYQs */}
              <button
                onClick={() => setActiveTab('notes')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-sans font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'notes'
                    ? 'bg-blue-50 text-[#2563EB] border border-blue-200/60 font-semibold shadow-2xs'
                    : 'text-[#475569] hover:bg-slate-100 hover:text-[#0F172A]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Notes &amp; PYQs</span>
                <span className="ml-auto text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                  14
                </span>
              </button>

              {/* Tab 3: 3D Campus Map */}
              <button
                onClick={() => setActiveTab('map')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-sans font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'map'
                    ? 'bg-blue-50 text-[#2563EB] border border-blue-200/60 font-semibold shadow-2xs'
                    : 'text-[#475569] hover:bg-slate-100 hover:text-[#0F172A]'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>3D Campus Map</span>
                <span className="ml-auto text-[10px] font-mono bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">
                  3D
                </span>
              </button>

              {/* Tab 4: SGPA Calculator */}
              <button
                onClick={() => setActiveTab('tools')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-sans font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === 'tools'
                    ? 'bg-blue-50 text-[#2563EB] border border-blue-200/60 font-semibold shadow-2xs'
                    : 'text-[#475569] hover:bg-slate-100 hover:text-[#0F172A]'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>SGPA Calculator</span>
                <span className="ml-auto text-[10px] font-mono bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                  10.0
                </span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#475569] px-2 mb-2">
              Current Semester
            </div>
            <div className="px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] shadow-2xs">
              <div className="text-xs font-sans font-semibold text-[#0F172A]">B.Tech Sem 3 (CSE)</div>
              <div className="text-[11px] text-[#475569] font-mono mt-0.5">MAKAUT Syllabus 2026-27</div>
            </div>
          </div>
        </div>

        {/* Mock Main Pane */}
        <div className="lg:col-span-9 p-4 sm:p-6 flex flex-col justify-between bg-white">
          {activeTab === 'viva' ? (
            /* =========================================================================
               TAB 1: AI VIVA STUDIO HERO PREVIEW (DEFAULT)
               ========================================================================= */
            <div className="space-y-4">
              {/* Studio Header Strip inside preview */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#2563EB] font-mono text-[10px] font-bold">
                    PCC-CS301
                  </span>
                  <span className="text-xs font-sans font-semibold text-zinc-900">
                    Data Structures &amp; Algorithms Viva
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Mic className="w-3 h-3 text-emerald-600" />
                    <span>Whisper 0.2s</span>
                  </span>
                  <span className="hidden sm:inline text-zinc-300">|</span>
                  <span className="hidden sm:inline bg-zinc-100 px-2 py-0.5 rounded text-zinc-700">EN + Hinglish</span>
                </div>
              </div>

              {/* Main Viva Mockup Grid: Left Mini Robot + Right Sample Chat */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-stretch">
                {/* Left Mini Robot & Reaction Controls */}
                <div className="sm:col-span-4 bg-slate-50/80 border border-zinc-200/90 rounded-xl p-3 flex flex-col items-center justify-between text-center gap-2">
                  <div className="py-1">
                    <VivaBuddyCharacter emotion={previewEmotion} size={88} />
                  </div>
                  <div className="w-full space-y-1.5">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                      Interactive Reaction
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setPreviewEmotion('happy')}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium transition-all ${
                          previewEmotion === 'happy'
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        😃 Full Marks
                      </button>
                      <button
                        onClick={() => setPreviewEmotion('shocked')}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium transition-all ${
                          previewEmotion === 'shocked'
                            ? 'bg-rose-600 text-white font-bold'
                            : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        😲 Roast
                      </button>
                      <button
                        onClick={() => setPreviewEmotion('thinking')}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium transition-all ${
                          previewEmotion === 'thinking'
                            ? 'bg-amber-600 text-white font-bold'
                            : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        🤔 Think
                      </button>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400">
                    Live Score: <span className="font-bold text-zinc-900">10/10</span> • Streak <span className="text-orange-600 font-bold">3🔥</span>
                  </div>
                </div>

                {/* Right Viva Multi-Turn Exchange Preview */}
                <div className="sm:col-span-8 space-y-2.5 flex flex-col justify-between">
                  {/* Examiner Question Bubble */}
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#2563EB] font-bold">
                      <span>VIVA EXAMINER • QUESTION</span>
                      <span>PCC-CS301</span>
                    </div>
                    <p className="text-zinc-900 font-medium leading-relaxed">
                      &ldquo;What is the key difference between a Graph and a Tree in DSA, and how do you detect cycles in an undirected graph?&rdquo;
                    </p>
                  </div>

                  {/* Student Answer Bubble */}
                  <div className="p-2.5 rounded-xl bg-[#2563EB] text-white space-y-0.5 text-xs ml-auto max-w-[92%] shadow-xs">
                    <div className="text-[9px] font-mono text-blue-200">YOU (Oral Voice Answer)</div>
                    <p className="leading-relaxed">
                      &ldquo;Sir, Tree ek connected graph hai bina cycle ke (N nodes, N-1 edges). Cycle detect karne ke liye DFS/BFS mein parent tracking use karte hain ya Disjoint Set Union (DSU).&rdquo;
                    </p>
                  </div>

                  {/* Examiner Reaction Bubble */}
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="leading-snug">
                      <strong className="text-emerald-900">10/10 Marks!</strong> Spot on explanation. DSU and DFS parent tracking concepts are crystal clear.
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Prominent Launch Action */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-zinc-500 font-sans">
                  Practicing DSA, COA, OS, DBMS &amp; Digital Electronics with Groq + Gemini
                </span>
                <Link
                  href="/viva"
                  className="w-full sm:w-auto settech-btn-primary px-5 py-2 text-xs font-semibold inline-flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Launch Live AI Viva →</span>
                </Link>
              </div>
            </div>
          ) : activeTab === 'notes' ? (
            /* =========================================================================
               TAB 2: NOTES & PYQS
               ========================================================================= */
            <div className="space-y-4">
              {/* Filter Row Preview */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    readOnly
                    value="PCC-CS301 Data Structures"
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs bg-slate-50/50 text-[#0F172A] font-mono"
                  />
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2 py-1 rounded bg-slate-100 text-[#0F172A] text-[11px] font-mono">
                    All Branches
                  </span>
                  <span className="px-2 py-1 rounded bg-blue-50 text-[#2563EB] border border-blue-200 text-[11px] font-mono font-medium">
                    Sem 3
                  </span>
                </div>
              </div>

              {/* Note Cards List */}
              <div className="space-y-2.5">
                {PREVIEW_NOTES.map((note) => (
                  <div
                    key={note.code + note.title}
                    className="p-3.5 rounded-xl border border-[#E2E8F0] hover:border-slate-300 hover:shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0F172A] text-white">
                          {note.code}
                        </span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                          2026-27
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-sans font-semibold text-[#0F172A] truncate">
                        {note.title}
                      </h4>
                      <div className="text-[11px] text-[#475569] font-mono">
                        {note.sem} • {note.branch} • {note.size} • {note.downloads} dls
                      </div>
                    </div>

                    <Link
                      href="/notes"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F172A] text-white hover:bg-slate-800 text-xs font-sans font-medium transition-colors shrink-0"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-[#475569]">
                <span>SETGOI Vault System • Synchronized with MAKAUT</span>
                <Link
                  href="/notes"
                  className="text-[#0F172A] hover:text-[#2563EB] font-sans font-semibold inline-flex items-center gap-1"
                >
                  Open Full Vault <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ) : activeTab === 'map' ? (
            /* =========================================================================
               TAB 3: 3D CAMPUS MAP
               ========================================================================= */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-sans font-semibold text-[#0F172A]">
                    SETGOI 3D Spatial Campus Visualizer
                  </h4>
                  <p className="text-xs text-[#475569] font-sans">
                    6-level academic core, transit bays, and B.Tech engineering labs
                  </p>
                </div>
                <Link
                  href="/campus"
                  className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-sans font-medium flex items-center gap-1"
                >
                  Full 3D Map <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="h-56 rounded-xl border border-[#E2E8F0] bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 flex flex-col items-center justify-center relative overflow-hidden p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center text-[#2563EB] mb-3">
                  <Compass className="w-6 h-6 animate-spin-slow" />
                </div>
                <div className="text-sm font-sans font-bold text-[#0F172A]">
                  Interactive WebGL Campus Model Loaded
                </div>
                <div className="text-xs text-[#475569] font-sans mt-1 max-w-sm">
                  Click to explore engineering blocks, B.Tech labs, and bus pickup points in 3D.
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-[#475569]">
                <span>Interactive Three.js Spatial Engine</span>
                <Link
                  href="/campus"
                  className="text-[#0F172A] hover:text-[#2563EB] font-sans font-semibold inline-flex items-center gap-1"
                >
                  Open 3D Explorer <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ) : (
            /* =========================================================================
               TAB 4: SGPA / CGPA CALCULATOR
               ========================================================================= */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-sans font-semibold text-[#0F172A]">
                    Official MAKAUT 10-Point Credit Index Calculator
                  </h4>
                  <p className="text-xs text-[#475569] font-sans">
                    Real-time SGPA, YGPA, and percentage formula: (CGPA - 0.75) × 10
                  </p>
                </div>
                <Link
                  href="/tools"
                  className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-sans font-medium flex items-center gap-1"
                >
                  Open Calculator <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-slate-50/70 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 bg-white rounded-lg border border-zinc-200">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">Odd Sem SGPA</div>
                    <div className="text-base font-bold font-mono text-zinc-900 mt-0.5">8.92</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-zinc-200">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">Even Sem SGPA</div>
                    <div className="text-base font-bold font-mono text-zinc-900 mt-0.5">9.14</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-[10px] font-mono text-[#2563EB] uppercase font-bold">MAKAUT %</div>
                    <div className="text-base font-bold font-mono text-[#2563EB] mt-0.5">82.8%</div>
                  </div>
                </div>
                <p className="text-xs text-zinc-600 font-mono text-center">
                  Formula: (9.03 CGPA - 0.75) × 10 = 82.80% • First Class with Distinction
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-[#475569]">
                <span>100% Client-Side Private Calculation</span>
                <Link
                  href="/tools"
                  className="text-[#0F172A] hover:text-[#2563EB] font-sans font-semibold inline-flex items-center gap-1"
                >
                  Calculate My SGPA <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
