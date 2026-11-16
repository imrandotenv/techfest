'use client';

import React from 'react';
import { Search, X, LayoutGrid, Table, Check, Clock } from 'lucide-react';
import { NoteFilterState, BranchCode } from '../types';
import { NoteCategory } from '@/types';

interface NotesFilterBarProps {
  filters: NoteFilterState;
  onFilterChange: (filters: NoteFilterState) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  resultCount: number;
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
  { key: 'ALL', label: 'All Categories' },
  { key: 'LECTURE_NOTE', label: 'Lecture Notes' },
  { key: 'MAKAUT_PYQ', label: 'MAKAUT PYQs' },
  { key: 'LAB_MANUAL', label: 'Lab Manuals' },
  { key: 'SYLLABUS_COPY', label: 'Syllabus' },
];

export function NotesFilterBar({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  resultCount,
}: NotesFilterBarProps) {
  const isFiltered =
    filters.searchQuery !== '' ||
    filters.branch !== 'ALL' ||
    filters.semester !== 'ALL' ||
    filters.category !== 'ALL' ||
    filters.status !== 'ALL';

  const handleReset = () => {
    onFilterChange({
      searchQuery: '',
      branch: 'ALL',
      semester: 'ALL',
      category: 'ALL',
      status: 'ALL',
    });
  };

  return (
    <div className="bg-white border-b border-zinc-200 sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
        
        {/* Top Row: Search Input, Status Toggle, and View Mode */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) =>
                onFilterChange({ ...filters, searchQuery: e.target.value })
              }
              placeholder="Search by MAKAUT code (PCC-CS301, ESC301...), topic, or professor..."
              className="w-full pl-9 pr-8 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:border-zinc-900 focus:bg-white transition-colors"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Tools: Verification Status Filter, View Toggle, Results Count */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            
            {/* Status Selector */}
            <div className="flex items-center rounded-md border border-zinc-200 bg-zinc-50 p-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, status: 'ALL' })}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filters.status === 'ALL'
                    ? 'bg-white text-zinc-900 font-semibold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                All Status
              </button>
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, status: 'approved' })}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                  filters.status === 'approved'
                    ? 'bg-white text-emerald-800 font-semibold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Check className="w-3 h-3 text-emerald-600" />
                Verified
              </button>
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, status: 'pending' })}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                  filters.status === 'pending'
                    ? 'bg-white text-amber-800 font-semibold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Clock className="w-3 h-3 text-amber-600" />
                Pending
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center rounded-md border border-zinc-200 bg-zinc-50 p-0.5">
              <button
                type="button"
                title="Grid Card View"
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-700'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                title="Tabular List View"
                onClick={() => onViewModeChange('table')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-700'
                }`}
              >
                <Table className="w-4 h-4" />
              </button>
            </div>

            {isFiltered && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-zinc-500 hover:text-zinc-900 underline font-mono ml-1"
              >
                Reset
              </button>
            )}

          </div>

        </div>

        {/* Second Row: Branch and Semester Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          
          {/* Branch Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-zinc-400 font-mono text-[11px] mr-1 hidden sm:inline">
              Branch:
            </span>
            {BRANCHES.map((b) => (
              <button
                key={b.code}
                type="button"
                onClick={() => onFilterChange({ ...filters, branch: b.code })}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors whitespace-nowrap ${
                  filters.branch === b.code
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Semester Selector */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-zinc-400 font-mono text-[11px] mr-1 hidden sm:inline">
              Sem:
            </span>
            {SEMESTERS.map((sem) => (
              <button
                key={sem}
                type="button"
                onClick={() => onFilterChange({ ...filters, semester: sem })}
                className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                  filters.semester === sem
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {sem === 'ALL' ? 'All' : `S${sem}`}
              </button>
            ))}
          </div>

        </div>

        {/* Third Row: Category Selector & Matching Count */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-100 text-xs">
          
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => onFilterChange({ ...filters, category: cat.key })}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  filters.category === cat.key
                    ? 'bg-zinc-200 text-zinc-900 font-medium'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Matching Result Count */}
          <div className="text-[11px] font-mono text-zinc-500">
            Showing <span className="font-semibold text-zinc-900">{resultCount}</span> resource{resultCount === 1 ? '' : 's'}
          </div>

        </div>

      </div>
    </div>
  );
}
