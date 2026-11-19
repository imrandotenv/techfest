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
    <section className="bg-white border-b border-[#E4E4E7] pt-5 pb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badges & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E4E4E7] bg-slate-50 text-xs font-mono text-[#52525B]">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>MAKAUT Curriculum 2026–2027</span>
            <span className="text-slate-300">/</span>
            <span>SETGOI Durgapur Vault</span>
          </div>

          {stats.pendingCount > 0 && (
            <button
              type="button"
              onClick={onFilterPending}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-300 bg-amber-50 text-amber-800 text-xs font-sans font-medium hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>{stats.pendingCount} Pending Approvals</span>
            </button>
          )}
        </div>

        {/* Headline & Description */}
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-[#09090B] leading-tight">
            Academic Lecture Notes &amp; <span className="text-[#2563EB]">MAKAUT PYQ Vault</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#52525B] leading-relaxed font-sans">
            Verified syllabus notes, 10-year solved question papers, and lab manuals organized by
            MAKAUT subject codes across Semesters 1 to 8 for CSE, ECE, EE, ME, and CE.
          </p>
        </div>
      </div>
    </section>
  );
}
