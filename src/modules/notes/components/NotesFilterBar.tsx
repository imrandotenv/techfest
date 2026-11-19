'use client';

import React from 'react';
import { Search, X, Upload } from 'lucide-react';
import { NoteFilterState, BranchCode } from '../types';
import { NoteCategory } from '@/types';

interface NotesFilterBarProps {
  filters: NoteFilterState;
  onFilterChange: (filters: NoteFilterState) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  resultCount: number;
  onOpenUpload?: () => void;
}

const BRANCHES: { code: BranchCode | 'ALL'; label: string }[] = [
  { code: 'ALL', label: 'All Branches' },
  { code: 'CSE', label: 'CSE' },
  { code: 'ECE', label: 'ECE' },
  { code: 'EE', label: 'EE' },
  { code: 'ME', label: 'ME' },
  { code: 'CE', label: 'CE' },
];

const SEMESTERS: (number | 'ALL')[] = ['ALL', 1, 2, 3, 4, 5, 6, 7, 8];

const CATEGORIES: { key: NoteCategory | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'All Types' },
  { key: 'LECTURE_NOTE', label: 'Lecture Notes' },
  { key: 'MAKAUT_PYQ', label: 'MAKAUT PYQs' },
  { key: 'LAB_MANUAL', label: 'Lab Manuals' },
  { key: 'SYLLABUS_COPY', label: 'Syllabus' },
];

export function NotesFilterBar({
  filters,
  onFilterChange,
  resultCount,
  onOpenUpload,
}: NotesFilterBarProps) {
  return (
    <div className="sticky top-20 z-30 bg-[#FAFAFA]/95 backdrop-blur-md border-b border-[#E2E8F0] py-3 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Single-Line Clean Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] sm:min-w-[280px]">
            <Search className="w-4 h-4 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) =>
                onFilterChange({ ...filters, searchQuery: e.target.value })
              }
              placeholder="Search PCC-CS301, topic, or faculty..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs sm:text-sm text-[#0F172A] placeholder:text-[#475569]/60 focus:outline-hidden focus:border-[#0F172A] transition-colors shadow-2xs font-sans"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#0F172A]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls: Branch + Semester + Category Dropdowns + + Upload */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Branch Dropdown */}
            <select
              value={filters.branch}
              onChange={(e) =>
                onFilterChange({ ...filters, branch: e.target.value as any })
              }
              className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs font-mono text-[#0F172A] focus:outline-hidden focus:border-[#0F172A] cursor-pointer shadow-2xs"
            >
              {BRANCHES.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.label}
                </option>
              ))}
            </select>

            {/* Semester Dropdown */}
            <select
              value={filters.semester}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  semester: e.target.value === 'ALL' ? 'ALL' : Number(e.target.value),
                })
              }
              className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs font-mono text-[#0F172A] focus:outline-hidden focus:border-[#0F172A] cursor-pointer shadow-2xs"
            >
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>
                  {s === 'ALL' ? 'All Semesters' : `Sem ${s}`}
                </option>
              ))}
            </select>

            {/* Category Dropdown */}
            <select
              value={filters.category}
              onChange={(e) =>
                onFilterChange({ ...filters, category: e.target.value as any })
              }
              className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs font-mono text-[#0F172A] focus:outline-hidden focus:border-[#0F172A] cursor-pointer shadow-2xs"
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>

            {/* + Upload Button */}
            {onOpenUpload && (
              <button
                type="button"
                onClick={onOpenUpload}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0F172A] text-white hover:bg-slate-800 text-xs font-medium tracking-wide shadow-2xs transition-colors shrink-0 font-sans"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>+ Upload</span>
              </button>
            )}

            {/* Results count pill */}
            <span className="hidden md:inline-flex text-[11px] font-mono text-[#475569]/80 pl-1">
              ({resultCount} files)
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
