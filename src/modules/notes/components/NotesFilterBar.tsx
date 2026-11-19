'use client';

import React from 'react';
import { Search, X, Plus } from 'lucide-react';
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
  { key: 'LECTURE_NOTE', label: 'Notes' },
  { key: 'MAKAUT_PYQ', label: 'PYQ' },
  { key: 'LAB_MANUAL', label: 'Lab Manual' },
  { key: 'CHEAT_SHEET', label: 'Cheat Sheet' },
  { key: 'SYLLABUS_COPY', label: 'Syllabus' },
];

export function NotesFilterBar({
  filters,
  onFilterChange,
  resultCount,
  onOpenUpload,
}: NotesFilterBarProps) {
  return (
    <div className="relative bg-white border-b border-[#E4E4E7] py-3.5 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Single-Line Clean Horizontal Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full sm:flex-1 sm:min-w-[240px]">
            <Search className="w-4 h-4 text-[#52525B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) =>
                onFilterChange({ ...filters, searchQuery: e.target.value })
              }
              placeholder="Search course code, topic, or faculty..."
              aria-label="Search lecture notes, PYQs, and syllabus"
              className="w-full h-9 pl-9 pr-8 bg-slate-50/70 border border-[#E4E4E7] rounded-full text-xs sm:text-sm text-[#09090B] placeholder:text-[#52525B]/70 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-colors shadow-2xs font-sans"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#09090B]"
                title="Clear search"
                aria-label="Clear search input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls: Branch + Semester + Category Dropdowns + + Upload Blue Pill */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            {/* Branch Dropdown */}
            <select
              value={filters.branch}
              onChange={(e) =>
                onFilterChange({ ...filters, branch: e.target.value as any })
              }
              aria-label="Filter by engineering branch"
              className="flex-1 sm:flex-none h-9 px-3 bg-white border border-[#E4E4E7] rounded-full text-xs font-mono text-[#09090B] focus:outline-hidden focus:border-[#2563EB] cursor-pointer shadow-2xs min-w-0"
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
              aria-label="Filter by semester"
              className="flex-1 sm:flex-none h-9 px-3 bg-white border border-[#E4E4E7] rounded-full text-xs font-mono text-[#09090B] focus:outline-hidden focus:border-[#2563EB] cursor-pointer shadow-2xs min-w-0"
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
              aria-label="Filter by resource type"
              className="flex-1 sm:flex-none h-9 px-3 bg-white border border-[#E4E4E7] rounded-full text-xs font-mono text-[#09090B] focus:outline-hidden focus:border-[#2563EB] cursor-pointer shadow-2xs min-w-0"
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>

            {/* + Upload Blue Pill Button */}
            {onOpenUpload && (
              <button
                type="button"
                onClick={onOpenUpload}
                aria-label="Upload lecture notes or PYQ"
                className="h-9 inline-flex items-center justify-center gap-1.5 px-4 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold tracking-wide shadow-sm transition-colors shrink-0 font-sans cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span>Upload</span>
              </button>
            )}

            {/* Results count pill */}
            <span className="hidden md:inline-flex text-xs font-mono text-[#52525B] pl-1">
              ({resultCount} {resultCount === 1 ? 'file' : 'files'})
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
