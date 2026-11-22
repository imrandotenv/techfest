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
  FileText,
  AlertCircle,
  TrendingUp,
  Award,
  ChevronRight,
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { requireRole } from '@/lib/rbac';
import { AppShell } from '@/components/AppShell';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Student Academic Workspace | SETTech',
  description: 'Centralized B.Tech student academic cockpit for SETGOI Durgapur.',
};

export default async function StudentWorkspacePage() {
  const user = await requireRole(['student', 'faculty', 'admin'], {
    redirectTo: '/sign-in?redirect_url=/student',
  });

  const studentName = user.fullName || 'SETGOI Engineer';
  const department = user.department || 'B.Tech CSE';

  return (
    <AppShell
      breadcrumbs={[
        { label: 'SETTech', href: '/' },
        { label: 'Student Workspace', href: '/student' },
        { label: 'Overview' },
      ]}
      roleTitle="Student"
      currentRole="student"
      userName={studentName}
      userEmail={user.email || 'student@setgoi.ac.in'}
      primaryAction={{
        label: '+ Upload Note',
        href: '/notes?action=upload',
        variant: 'primary',
      }}
    >
      {/* =========================================================================
          WORKSPACE WELCOME BANNER
          ========================================================================= */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] font-mono text-xs font-semibold">
              B.Tech Engineering • Sem 5
            </span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 font-mono text-[11px]">
              {department}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              MAKAUT Affiliated
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-[#09090B]">
            Welcome back, {studentName}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl leading-relaxed">
            Your centralized B.Tech cockpit for MAKAUT coursework, lab viva readiness, and attendance tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="https://icampus.setgoi.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 font-mono text-xs font-medium inline-flex items-center gap-1.5 transition-colors border border-zinc-200"
          >
            <span>iCampus ERP</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>
          <Link
            href="/viva"
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-sans text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Viva Studio →</span>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          QUICK ACTION LAUNCHPAD
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Link
          href="/notes?action=upload"
          className="p-4 rounded-xl bg-white border border-[#E4E4E7] hover:border-[#2563EB]/40 hover:shadow-xs transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#2563EB] shrink-0">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#09090B]">Upload Notes / PYQs</div>
              <div className="text-[11px] font-mono text-zinc-500">Earn peer verification badge</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/forum"
          className="p-4 rounded-xl bg-white border border-[#E4E4E7] hover:border-emerald-500/40 hover:shadow-xs transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#09090B]">Ask on Campus Forum</div>
              <div className="text-[11px] font-mono text-zinc-500">Direct faculty &amp; peer answers</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/tools?tab=calculator"
          className="p-4 rounded-xl bg-white border border-[#E4E4E7] hover:border-purple-500/40 hover:shadow-xs transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-600 shrink-0">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#09090B]">MAKAUT Calculator</div>
              <div className="text-[11px] font-mono text-zinc-500">10-Point SGPA &amp; CGPA target</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      {/* =========================================================================
          ACTIONABLE DENSE BENTO GRID (4 CORE TILES)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* TILE 1: Live SGPA & Attendance Ring (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/70 flex items-center justify-center text-[#2563EB]">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Academic Standing &amp; Attendance</h3>
                <p className="text-[11px] font-mono text-zinc-500">MAKAUT 10-Point &amp; Mandatory 75% Rule</p>
              </div>
            </div>
            <Link
              href="/tools?tab=calculator"
              className="text-xs font-mono font-medium text-[#2563EB] hover:underline inline-flex items-center gap-1"
            >
              <span>Recalculate</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* CGPA */}
            <div className="p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/80 space-y-1">
              <div className="text-[10px] font-mono uppercase text-zinc-500">Cumulative CGPA</div>
              <div className="text-2xl font-bold font-mono text-zinc-900">8.84</div>
              <div className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>1st Class Honours</span>
              </div>
            </div>

            {/* Target SGPA */}
            <div className="p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/80 space-y-1">
              <div className="text-[10px] font-mono uppercase text-zinc-500">Sem 5 Target</div>
              <div className="text-2xl font-bold font-mono text-zinc-900">9.10</div>
              <div className="text-[10px] font-mono text-[#2563EB] font-semibold">28 Credits Enrolled</div>
            </div>

            {/* Attendance % */}
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
              <div className="text-[10px] font-mono uppercase text-emerald-700">Attendance</div>
              <div className="text-2xl font-bold font-mono text-emerald-800">81.4%</div>
              <div className="text-[10px] font-mono text-emerald-700 font-semibold">48 / 59 Lectures</div>
            </div>
          </div>

          {/* Attendance Safety Bar & Bunk Forecaster */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-600">Attendance Buffer (MAKAUT 75% Gate):</span>
              <span className="font-bold text-emerald-700">3 Safe Bunks Remaining</span>
            </div>
            <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden p-0.5">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all"
                style={{ width: '81.4%' }}
              />
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">
              Note: Attendance below 75% incurs debarment from MAKAUT end-semester examinations without medical condonation.
            </p>
          </div>
        </div>

        {/* TILE 2: Recent AI Viva Voce & Weak Topics (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200/70 flex items-center justify-center text-purple-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Recent AI Viva Evaluation</h3>
                <p className="text-[11px] font-mono text-zinc-500">Groq Whisper Voice Engine</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 text-purple-800">
              Grade A
            </span>
          </div>

          {/* Last Score & Subject */}
          <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200/70 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-zinc-900 font-sans">
                Data Structures &amp; Algorithms
              </div>
              <div className="text-[11px] font-mono text-purple-700 mt-0.5">
                PCC-CS301 • 8/10 Score (80%)
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-orange-600 font-bold bg-white px-2 py-0.5 rounded border border-orange-200 shadow-2xs">
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                3 Streak
              </span>
            </div>
          </div>

          {/* Tagged Weak Areas for Revision */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Recommended Practice Topics</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 rounded-md text-[11px] font-mono bg-amber-50 text-amber-800 border border-amber-200">
                AVL Double Rotations (LR/RL)
              </span>
              <span className="px-2 py-1 rounded-md text-[11px] font-mono bg-amber-50 text-amber-800 border border-amber-200">
                Dijkstra Negative Edge Flaw
              </span>
            </div>
          </div>

          <Link
            href="/viva?subject=DSA"
            className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-sans text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors shadow-2xs"
          >
            <span>Practice Weak Topics in Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* TILE 3: Saved MAKAUT Course Vaults & Lab Manuals (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-emerald-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Saved Course Vaults &amp; Lab Manuals</h3>
                <p className="text-[11px] font-mono text-zinc-500">Semester 5 MAKAUT Curriculum</p>
              </div>
            </div>
            <Link
              href="/notes"
              className="text-xs font-mono font-medium text-[#2563EB] hover:underline inline-flex items-center gap-1"
            >
              <span>Browse All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between hover:bg-zinc-100/70 transition-colors">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-100 text-[#2563EB]">
                  PCC-CS501
                </span>
                <div>
                  <div className="text-xs font-medium text-zinc-900">Compiler Design &amp; Lexical Analysis</div>
                  <div className="text-[11px] font-mono text-zinc-500">Unit 1–4 Complete Notes • Prof. Mukherjee Verified</div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold shrink-0">Verified</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between hover:bg-zinc-100/70 transition-colors">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-purple-100 text-purple-700">
                  PCC-CS591
                </span>
                <div>
                  <div className="text-xs font-medium text-zinc-900">DBMS Lab Manual &amp; Top 5 External Viva Q&amp;A</div>
                  <div className="text-[11px] font-mono text-zinc-500">ER-Model, SQL Queries &amp; Normalization Cheat Sheet</div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-purple-700 font-semibold shrink-0">Lab Manual</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between hover:bg-zinc-100/70 transition-colors">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-100 text-amber-800">
                  ESC391
                </span>
                <div>
                  <div className="text-xs font-medium text-zinc-900">Analog &amp; Digital Electronics Lab Handout</div>
                  <div className="text-[11px] font-mono text-zinc-500">5 Essential External Examiner Viva Questions</div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-amber-800 font-semibold shrink-0">5 Viva Qs</span>
            </div>
          </div>
        </div>

        {/* TILE 4: Campus Forum Doubts & Direct Answers (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/70 flex items-center justify-center text-[#2563EB]">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">My Forum Queries</h3>
                <p className="text-[11px] font-mono text-zinc-500">Peer &amp; Faculty Resolution</p>
              </div>
            </div>
            <Link
              href="/forum"
              className="text-xs font-mono font-medium text-[#2563EB] hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-900 line-clamp-1">
                  LRU Page Replacement vs Optimal in MAKAUT 2024?
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 shrink-0">
                  Faculty Solved
                </span>
              </div>
              <div className="text-[11px] font-mono text-zinc-500 flex items-center justify-between">
                <span>Prof. Subhash Mukherjee answered</span>
                <span>6 replies</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-900 line-clamp-1">
                  Where to submit CA2 lab practical assignments?
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 shrink-0">
                  Open
                </span>
              </div>
              <div className="text-[11px] font-mono text-zinc-500 flex items-center justify-between">
                <span>Posted in CSE Department Desk</span>
                <span>2 replies</span>
              </div>
            </div>
          </div>

          <Link
            href="/forum"
            className="w-full py-2 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 font-sans text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors shadow-2xs"
          >
            <span>Ask New Question on Forum</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
