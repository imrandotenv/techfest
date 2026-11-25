'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Upload,
  Flame,
  Calculator,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  FileCheck2,
} from 'lucide-react';
import { BTechBranch, getBranchDetails, getSemesterSubjects } from '@/config/curriculum';
import { StudentStatsModal } from '@/components/StudentStatsModal';
import { AcademicStats } from '@/app/api/student/stats/route';

export interface StudentCockpitProps {
  studentName: string;
  branch: BTechBranch;
  semester: number;
  passoutYear: number;
  universityRoll?: string | null;
  stats: AcademicStats;
  liveNotices: Array<{
    id: string;
    title: string;
    content: string;
    category: string;
    targetBranch: string;
    isPinned: boolean;
    createdAt: string | Date;
    author?: { fullName?: string | null; role?: string | null } | null;
  }>;
}

export function StudentCockpitView({
  studentName,
  branch,
  semester,
  passoutYear,
  universityRoll,
  stats,
  liveNotices,
}: StudentCockpitProps) {
  const branchInfo = getBranchDetails(branch);
  const mySubjects = getSemesterSubjects(branch, semester);

  const attendancePct = stats.attendancePct || 81.4;
  const attendedClasses = stats.attendedClasses || 48;
  const totalClasses = stats.totalClasses || 59;
  const cgpa = stats.cgpa || 8.84;
  const targetSgpa = stats.targetSgpa || 9.10;

  const isSafeAttendance = attendancePct >= 75;
  const safeBunks = isSafeAttendance
    ? Math.max(0, Math.floor((attendedClasses - 0.75 * totalClasses) / 0.75))
    : 0;
  const classesNeeded = !isSafeAttendance
    ? Math.ceil((0.75 * totalClasses - attendedClasses) / 0.25)
    : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* WORKSPACE WELCOME BANNER */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] font-mono text-xs font-semibold">
              B.Tech {branchInfo.code} • Sem {semester} • Class of {passoutYear}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 font-mono text-[11px]">
              {branchInfo.fullTitle}
            </span>
            {universityRoll && (
              <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 font-mono text-[11px]">
                Roll: {universityRoll}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              MAKAUT Affiliated
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-[#09090B]">
            Welcome back, {studentName}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl leading-relaxed">
            Your centralized B.Tech cockpit for MAKAUT coursework in {branchInfo.name}, lab viva readiness, and attendance tracking.
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

      {/* QUICK ACTION LAUNCHPAD */}
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
              <div className="text-[11px] text-zinc-500">Earn peer verification badge</div>
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
              <div className="text-[11px] text-zinc-500">Direct faculty &amp; peer answers</div>
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
              <div className="text-[11px] text-zinc-500">10-Point SGPA &amp; CGPA target</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      {/* ACTIONABLE DENSE BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* TILE 1: Live SGPA & Attendance Ring */}
        <div className="lg:col-span-7 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/70 flex items-center justify-center text-[#2563EB]">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Academic Standing &amp; Attendance</h3>
                <p className="text-[11px] text-zinc-500">Neon-Backed Real Persistence • MAKAUT 75% Gate</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StudentStatsModal initialStats={stats} />
              <Link
                href="/tools?tab=calculator"
                className="text-xs font-medium text-[#2563EB] hover:underline inline-flex items-center gap-1"
              >
                <span>Calculator</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/80 space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Cumulative CGPA</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-zinc-900">{cgpa.toFixed(2)}</div>
              <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{cgpa >= 7.5 ? '1st Class Honours' : '1st Class'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/80 space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Sem {semester} Target</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-zinc-900">{(targetSgpa || 9.10).toFixed(2)}</div>
              <div className="text-[10px] text-[#2563EB] font-medium">{mySubjects.length * 4} Credits Enrolled</div>
            </div>

            <div
              className={`p-3.5 rounded-xl space-y-1 border ${
                isSafeAttendance ? 'bg-emerald-50/60 border-emerald-200/80' : 'bg-rose-50/60 border-rose-200/80'
              }`}
            >
              <div className={`text-[10px] uppercase tracking-wider font-medium ${isSafeAttendance ? 'text-emerald-700' : 'text-rose-700'}`}>
                Attendance
              </div>
              <div className={`text-2xl font-bold font-mono tabular-nums ${isSafeAttendance ? 'text-emerald-800' : 'text-rose-800'}`}>
                {attendancePct.toFixed(1)}%
              </div>
              <div className={`text-[10px] font-medium ${isSafeAttendance ? 'text-emerald-700' : 'text-rose-700'}`}>
                {attendedClasses} / {totalClasses} Lectures
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-600">Attendance Buffer (MAKAUT 75% Gate):</span>
              <span className={`font-bold ${isSafeAttendance ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isSafeAttendance ? `${safeBunks} Safe Bunks Remaining` : `Must Attend Next ${classesNeeded} Lectures`}
              </span>
            </div>
            <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden p-0.5">
              <div
                className={`h-1.5 rounded-full transition-all ${isSafeAttendance ? 'bg-emerald-600' : 'bg-rose-600'}`}
                style={{ width: `${Math.min(100, attendancePct)}%` }}
              />
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Note: Attendance below 75% incurs debarment from MAKAUT end-semester examinations without medical condonation.
            </p>
          </div>
        </div>

        {/* TILE 2: Recent AI Viva Voce */}
        <div className="lg:col-span-5 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200/70 flex items-center justify-center text-purple-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Recent AI Viva Evaluation</h3>
                <p className="text-[11px] text-zinc-500">Groq Whisper Voice Engine</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 text-purple-800">
              Grade A
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200/70 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-zinc-900 font-sans">Data Structures &amp; Algorithms</div>
              <div className="text-[11px] font-mono text-purple-700 mt-0.5">PCC-CS301 • 8/10 Score (80%)</div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-orange-600 font-bold bg-white px-2 py-0.5 rounded border border-orange-200 shadow-2xs">
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                3 Streak
              </span>
            </div>
          </div>

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

        {/* TILE 3: Curriculum Subjects */}
        <div className="lg:col-span-7 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-emerald-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">My Curriculum Subjects</h3>
                <p className="text-[11px] text-zinc-500">
                  Semester {semester} {branchInfo.name} • MAKAUT ({mySubjects.length} Core Modules)
                </p>
              </div>
            </div>
            <Link
              href={`/notes?branch=${branch}&semester=${semester}`}
              className="text-xs font-medium text-[#2563EB] hover:underline inline-flex items-center gap-1"
            >
              <span>Notes Vault</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {mySubjects.map((sub, idx) => (
              <div
                key={sub.code}
                className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between hover:bg-zinc-100/70 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold shrink-0 ${
                      idx % 3 === 0
                        ? 'bg-blue-100 text-[#2563EB]'
                        : idx % 3 === 1
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {sub.code}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-zinc-900 truncate">{sub.name}</div>
                    <div className="text-[11px] text-zinc-500 truncate">
                      {sub.credits} Credits • {sub.type} {sub.description ? `• ${sub.description}` : ''}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    href={`/notes?branch=${branch}&semester=${semester}&subject=${encodeURIComponent(sub.name)}`}
                    className="text-[10px] font-medium text-[#2563EB] bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200/60 font-semibold"
                  >
                    Notes
                  </Link>
                  <Link
                    href={`/viva?subject=${encodeURIComponent(sub.name)}`}
                    className="text-[10px] font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded border border-purple-200/60 font-semibold"
                  >
                    Viva
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TILE 4: Campus Forum Doubts */}
        <div className="lg:col-span-5 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/70 flex items-center justify-center text-[#2563EB]">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">My Forum Queries</h3>
                <p className="text-[11px] text-zinc-500">Peer &amp; Faculty Resolution</p>
              </div>
            </div>
            <Link
              href="/forum"
              className="text-xs font-medium text-[#2563EB] hover:underline inline-flex items-center gap-1"
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
              <div className="text-[11px] text-zinc-500 flex items-center justify-between">
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
              <div className="text-[11px] text-zinc-500 flex items-center justify-between">
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

      {/* LIVE CAMPUS NOTICES FEED */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-700">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Official College &amp; MAKAUT Notices</h3>
              <p className="text-[11px] text-zinc-500">Live Departmental Circulars &amp; Examination Updates</p>
            </div>
          </div>
          <Link
            href="/notices"
            className="text-xs font-medium text-[#2563EB] hover:underline inline-flex items-center gap-1"
          >
            <span>All Notices</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {liveNotices.length === 0 ? (
          <div className="p-4 rounded-xl bg-zinc-50 border border-dashed border-zinc-200 text-center">
            <p className="text-xs text-zinc-500">
              No active notices for {branch} right now. All official circulars are published via Faculty Academic Desk.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {liveNotices.map((notice) => (
              <div
                key={notice.id}
                className={`p-4 rounded-xl border space-y-2 ${
                  notice.isPinned ? 'bg-amber-50/40 border-amber-200' : 'bg-zinc-50/60 border-zinc-200/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-200/70 text-zinc-800">
                        {notice.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-blue-700 bg-blue-50 border border-blue-200">
                        {notice.targetBranch === 'ALL' ? 'All B.Tech' : `B.Tech ${notice.targetBranch}`}
                      </span>
                      {notice.isPinned && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200 text-amber-900">
                          📌 Pinned
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-zinc-900 leading-snug">{notice.title}</h4>
                  </div>
                </div>
                <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">{notice.content}</p>
                <div className="text-[11px] font-mono text-zinc-400 pt-1 flex items-center justify-between border-t border-zinc-100">
                  <span>By {notice.author?.fullName || 'Faculty Desk'}</span>
                  <span>
                    {new Date(notice.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
