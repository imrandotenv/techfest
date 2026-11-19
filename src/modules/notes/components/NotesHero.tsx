'use client';

import React from 'react';
import { Clock } from 'lucide-react';
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
  onFilterPending,
}: NotesHeroProps) {
  return (
    <section className="bg-white border-b border-zinc-200 pt-6 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badges & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-mono text-zinc-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>MAKAUT Curriculum 2026–2027</span>
            <span className="text-zinc-300">/</span>
            <span>SETGOI Durgapur Vault</span>
          </div>

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
        </div>

        {/* Headline & Description */}
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 leading-tight">
            Academic Lecture Notes &amp; <span className="text-blue-600">MAKAUT PYQ Vault</span>
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-zinc-500 leading-relaxed font-sans">
            Verified syllabus notes, 10-year solved question papers, and lab manuals organized by
            MAKAUT subject codes across Semesters 1 to 8 for CSE, ECE, EE, ME, and CE.
          </p>
        </div>
      </div>
    </section>
  );
}
