'use client';

import React from 'react';
import { 
  Upload, 
  Download, 
  CheckCircle2, 
  Clock, 
  Award, 
  BookOpen 
} from 'lucide-react';
import { CustomUserRole } from '@/types';

interface NotesHeroProps {
  stats: {
    totalNotes: number;
    approvedCount: number;
    pendingCount: number;
    totalDownloads: number;
    makautPyqs: number;
  };
  onOpenUpload: () => void;
  onFilterPending: () => void;
  currentRole: CustomUserRole;
}

export function NotesHero({
  stats,
  onOpenUpload,
  onFilterPending,
  currentRole,
}: NotesHeroProps) {
  const isFacultyOrAdmin = currentRole === 'college' || currentRole === 'admin';

  return (
    <section className="bg-white border-b border-zinc-200 pt-8 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-mono text-zinc-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>MAKAUT Curriculum 2026–2027</span>
            <span className="text-zinc-300">/</span>
            <span>SETGOI Durgapur Vault</span>
          </div>

          <div className="flex items-center gap-2">
            {stats.pendingCount > 0 && (
              <button
                type="button"
                onClick={onFilterPending}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-amber-300 bg-amber-50 text-amber-800 text-xs font-medium hover:bg-amber-100 transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>{stats.pendingCount} Pending Approvals</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenUpload}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-medium tracking-wide shadow-sm transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Notes / PYQ</span>
            </button>
          </div>
        </div>

        {/* Headline & Description */}
        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
            Academic Lecture Notes & <span className="text-sky-600">MAKAUT PYQ Vault</span>
          </h1>
          <p className="mt-3 text-base text-zinc-600 leading-relaxed font-sans">
            Centralized peer-reviewed repository for Sanaka Educational Trust&apos;s Group of Institutions.
            Verified syllabus notes, 10-year solved question papers, and lab manuals organized by
            MAKAUT subject codes across Semesters 1 to 8 for CSE, ECE, EE, ME, and CE.
          </p>
        </div>

        {/* Swiss 1px Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Approved Resources */}
          <div className="bg-zinc-50/70 border border-zinc-200 rounded-lg p-4 hover:border-zinc-300 transition-colors">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">Verified Notes</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-zinc-900 font-mono tracking-tight">
              {stats.approvedCount}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 font-mono">
              Faculty vetted &amp; syllabus matched
            </p>
          </div>

          {/* MAKAUT Solved PYQ */}
          <div className="bg-zinc-50/70 border border-zinc-200 rounded-lg p-4 hover:border-zinc-300 transition-colors">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">Solved PYQs</span>
              <BookOpen className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-zinc-900 font-mono tracking-tight">
              {stats.makautPyqs}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 font-mono">
              Previous semester exams with answers
            </p>
          </div>

          {/* Downloads Counter */}
          <div className="bg-zinc-50/70 border border-zinc-200 rounded-lg p-4 hover:border-zinc-300 transition-colors">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">Total Downloads</span>
              <Download className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-zinc-900 font-mono tracking-tight">
              {stats.totalDownloads.toLocaleString()}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 font-mono">
              Cumulative student downloads
            </p>
          </div>

          {/* Verification Status */}
          <div className={`border rounded-lg p-4 transition-colors ${
            stats.pendingCount > 0
              ? 'bg-amber-50/60 border-amber-200 hover:border-amber-300'
              : 'bg-zinc-50/70 border-zinc-200 hover:border-zinc-300'
          }`}>
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">Verification Queue</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-zinc-900 font-mono tracking-tight">
                {stats.pendingCount}
              </span>
              <span className="text-xs text-zinc-500 font-mono">awaiting review</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 font-mono">
              {isFacultyOrAdmin ? 'Requires faculty action' : 'SETGOI role-based approval'}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
