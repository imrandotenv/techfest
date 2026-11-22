import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  MessageSquare, 
  Sparkles, 
  ArrowRight, 
  ExternalLink, 
  Upload, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Calculator,
  Compass,
  FileText
} from 'lucide-react';
import { requireRole } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Student Academic Workspace | SanakaHub',
  description: 'Centralized B.Tech student academic cockpit for SETGOI Durgapur.',
};

export default async function StudentWorkspacePage() {
  const user = await requireRole(['student', 'faculty', 'admin'], {
    redirectTo: '/sign-in?redirect_url=/student',
  });

  const studentName = user.fullName || 'SETGOI Engineer';
  const department = user.department || 'B.Tech CSE';

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4E4E7]">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[#09090B] border border-[#E4E4E7] font-mono text-[11px] font-bold">
              STUDENT WORKSPACE
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/60 font-mono text-[11px] font-semibold">
              {department} • Sem 5
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#09090B] tracking-tight">
            Welcome back, {studentName}
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] font-sans">
            Your centralized B.Tech engineering cockpit for MAKAUT coursework, lab manuals, and attendance metrics.
          </p>
        </div>

        {/* Quick External Portals */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://icampus.setgoi.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E4E4E7] hover:border-zinc-300 text-xs font-mono font-medium text-[#09090B] shadow-2xs hover:bg-zinc-50 transition-all"
          >
            <span>iCampus Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>
        </div>
      </div>

      {/* Quick Action Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/notes?action=upload"
          className="p-4 rounded-xl bg-white border border-[#E4E4E7] hover:border-[#2563EB]/40 hover:shadow-xs transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#2563EB]">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#09090B] font-sans">Upload Notes / PYQ</div>
              <div className="text-[11px] font-mono text-[#52525B]">Pending faculty review</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-[#2563EB] transition-colors" />
        </Link>

        <Link
          href="/forum"
          className="p-4 rounded-xl bg-white border border-[#E4E4E7] hover:border-[#2563EB]/40 hover:shadow-xs transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#09090B] font-sans">Ask on Forum</div>
              <div className="text-[11px] font-mono text-[#52525B]">Get peer &amp; faculty help</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-600 transition-colors" />
        </Link>

        <Link
          href="/viva"
          className="p-4 rounded-xl bg-white border border-[#E4E4E7] hover:border-[#2563EB]/40 hover:shadow-xs transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#09090B] font-sans">AI Viva Studio</div>
              <div className="text-[11px] font-mono text-[#52525B]">Rapid-fire exam practice</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-purple-600 transition-colors" />
        </Link>
      </div>

      {/* 4-Card Bento Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: SGPA & 75% Attendance Snapshot */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#2563EB]">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold font-sans text-[#09090B]">Academic Standing &amp; Attendance</h3>
                <p className="text-[11px] font-mono text-[#52525B]">MAKAUT 10-Point &amp; Mandatory 75%</p>
              </div>
            </div>
            <Link
              href="/tools?tab=calculator"
              className="text-xs font-mono font-medium text-[#2563EB] hover:underline"
            >
              Recalculate →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E4E4E7] space-y-1">
              <div className="text-[10px] uppercase text-[#52525B]">Cumulative CGPA</div>
              <div className="text-xl font-bold text-[#09090B]">8.84</div>
              <div className="text-[10px] text-emerald-700 font-semibold">First Class with Honours</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E4E4E7] space-y-1">
              <div className="text-[10px] uppercase text-[#52525B]">Current Attendance</div>
              <div className="text-xl font-bold text-emerald-700">81.4%</div>
              <div className="text-[10px] text-[#52525B]">3 Safe Bunks Remaining</div>
            </div>
          </div>

          <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
            <div className="bg-[#2563EB] h-2 rounded-full w-[81.4%]" />
          </div>
        </div>

        {/* Card 2: Saved Notes & Lab Manuals */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold font-sans text-[#09090B]">Saved Course Vaults</h3>
                <p className="text-[11px] font-mono text-[#52525B]">Theory Notes &amp; External Viva Questions</p>
              </div>
            </div>
            <Link
              href="/notes"
              className="text-xs font-mono font-medium text-[#2563EB] hover:underline"
            >
              Browse All →
            </Link>
          </div>

          <div className="space-y-2 text-xs font-sans">
            <div className="p-3 rounded-xl bg-slate-50 border border-[#E4E4E7] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-50 text-[#2563EB] border border-blue-200/60">
                  PCC-CS501
                </span>
                <span className="font-medium text-[#09090B]">Compiler Design &amp; Lexical Analysis</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-700">Verified</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-[#E4E4E7] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60">
                  PCC-CS591
                </span>
                <span className="font-medium text-[#09090B]">DBMS Lab &amp; External Viva Q&amp;A</span>
              </div>
              <span className="text-[11px] font-mono text-purple-700">Lab Manual</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-[#E4E4E7] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
                  ESC391
                </span>
                <span className="font-medium text-[#09090B]">Analog &amp; Digital Electronics Lab</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">5 Viva Qs</span>
            </div>
          </div>
        </div>

        {/* Card 3: My Forum Doubts */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#2563EB]">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold font-sans text-[#09090B]">My Engineering Queries</h3>
                <p className="text-[11px] font-mono text-[#52525B]">Campus Q&amp;A &amp; Faculty Answers</p>
              </div>
            </div>
            <Link
              href="/forum"
              className="text-xs font-mono font-medium text-[#2563EB] hover:underline"
            >
              View Forum →
            </Link>
          </div>

          <div className="space-y-2.5 text-xs font-sans">
            <div className="p-3 rounded-xl bg-slate-50 border border-[#E4E4E7] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#09090B]">
                  LRU Page Replacement vs Optimal in MAKAUT 2024 paper?
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Faculty Solved
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#52525B]">Prof. Subhash Mukherjee answered • 6 replies</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-[#E4E4E7] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#09090B]">
                  Where to submit CA2 lab practical assignments for Sem 5?
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  Open
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#52525B]">Posted 2 days ago in Department Notice board</div>
            </div>
          </div>
        </div>

        {/* Card 4: AI Viva Buddy Status */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold font-sans text-[#09090B]">AI Viva Studio Status</h3>
                <p className="text-[11px] font-mono text-[#52525B]">Full Student Access Enabled</p>
              </div>
            </div>
            <Link
              href="/viva"
              className="text-xs font-mono font-medium text-[#2563EB] hover:underline"
            >
              Open Studio →
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#09090B] flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                Active Viva Streak
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                Unlimited Rounds
              </span>
            </div>
            <p className="text-xs text-[#52525B] font-sans">
              You are signed in as a verified SETGOI student. Practice rapid-fire viva voce questions in English or conversational Hinglish with real model answers.
            </p>
            <div className="pt-1">
              <Link
                href="/viva"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#2563EB] hover:underline"
              >
                <span>Launch Today&apos;s Viva Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
