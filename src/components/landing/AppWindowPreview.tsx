'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Download, 
  CheckCircle2, 
  FileText, 
  Compass, 
  Calculator, 
  ExternalLink,
  BookOpen,
  ArrowRight
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'notes' | 'map'>('notes');

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] overflow-hidden text-left transition-all">
      {/* Window Titlebar */}
      <div className="h-11 bg-slate-50/80 border-b border-[#E2E8F0] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
        </div>

        {/* Address / Search Bar Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white border border-[#E2E8F0] rounded-md text-xs font-mono text-[#475569] w-80 max-w-full justify-between shadow-2xs">
          <span className="truncate">sanakahub.durgapur.dev/notes/vault</span>
          <span className="text-[10px] text-slate-400 font-sans">v2.4</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono text-[#475569] uppercase tracking-wider hidden sm:inline">
            MAKAUT LIVE
          </span>
        </div>
      </div>

      {/* Window Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
        {/* Mock Sidebar */}
        <div className="hidden lg:block lg:col-span-3 border-r border-[#E2E8F0] bg-slate-50/50 p-4 space-y-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#475569] px-2 mb-2">
              Academic Hub
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('notes')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-sans font-medium flex items-center gap-2.5 transition-colors ${
                  activeTab === 'notes'
                    ? 'bg-blue-50 text-[#2563EB] border border-blue-200/60 font-semibold'
                    : 'text-[#475569] hover:bg-slate-100 hover:text-[#0F172A]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Notes & PYQs</span>
                <span className="ml-auto text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                  14
                </span>
              </button>

              <button
                onClick={() => setActiveTab('map')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-sans font-medium flex items-center gap-2.5 transition-colors ${
                  activeTab === 'map'
                    ? 'bg-blue-50 text-[#2563EB] border border-blue-200/60 font-semibold'
                    : 'text-[#475569] hover:bg-slate-100 hover:text-[#0F172A]'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>3D Campus Map</span>
                <span className="ml-auto text-[10px] font-mono bg-blue-100 text-[#2563EB] px-1.5 py-0.5 rounded">
                  3D
                </span>
              </button>

              <Link
                href="/tools"
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-sans font-medium text-[#475569] hover:bg-slate-100 hover:text-[#0F172A] flex items-center gap-2.5 transition-colors"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>SGPA Calculator</span>
              </Link>
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
        <div className="lg:col-span-9 p-5 sm:p-6 flex flex-col justify-between bg-white">
          {activeTab === 'notes' ? (
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
            </div>
          ) : (
            /* 3D Map Preview inside Window */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-sans font-semibold text-[#0F172A]">
                    SETGOI 3D Spatial Campus Visualizer
                  </h4>
                  <p className="text-xs text-[#475569] font-sans">
                    6-level U-shaped academic core, transit bays, and labs
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
                  Click to explore building floor plans, faculty offices, and emergency gates in 3D.
                </div>
              </div>
            </div>
          )}

          {/* Bottom Bar inside Mockup */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-[#475569]">
            <span>SETGOI Vault System • Synchronized with MAKAUT</span>
            <Link
              href="/notes"
              className="text-[#0F172A] hover:text-[#2563EB] font-sans font-semibold inline-flex items-center gap-1"
            >
              Open Full Vault <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
