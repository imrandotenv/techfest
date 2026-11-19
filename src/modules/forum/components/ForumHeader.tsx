'use client';

import React from 'react';
import { Search, Plus, SlidersHorizontal, X } from 'lucide-react';
import { ForumSortOption } from '../types';

interface ForumHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: ForumSortOption;
  onSortChange: (sort: ForumSortOption) => void;
  onOpenCreateModal: () => void;
  totalPosts: number;
}

export function ForumHeader({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  onOpenCreateModal,
  totalPosts,
}: ForumHeaderProps) {
  return (
    <div className="flex flex-col gap-5 mb-6">
      {/* Title & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] font-display">
              Campus Q&amp;A Forum
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-[#0F172A] border border-[#E2E8F0]">
              {totalPosts} {totalPosts === 1 ? 'Thread' : 'Threads'}
            </span>
          </div>
          <p className="text-sm text-[#475569] mt-1 max-w-2xl font-sans leading-relaxed">
            MAKAUT academic doubts, TechFest innovation tracks, placement roadmaps, and verified Official Faculty Answers from SETGOI professors.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F172A] text-white hover:bg-slate-800 text-xs sm:text-sm font-medium transition-colors shadow-2xs shrink-0 cursor-pointer font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>Ask Question</span>
        </button>
      </div>

      {/* Search and Sort Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="relative md:col-span-8">
          <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search questions, MAKAUT course codes (e.g. PCC-CS301), faculty names, or topics..."
            className="w-full pl-9 pr-9 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs sm:text-sm text-[#0F172A] placeholder:text-[#475569]/60 focus:outline-hidden focus:border-[#0F172A] transition-all font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#0F172A]"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Filter Selector */}
        <div className="md:col-span-4 flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#475569] font-mono shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Sort:</span>
          </div>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as ForumSortOption)}
            className="w-full py-2 px-3 bg-white border border-[#E2E8F0] rounded-lg text-xs font-mono text-[#0F172A] focus:outline-hidden focus:border-[#0F172A] cursor-pointer"
          >
            <option value="recent">Most Recent First</option>
            <option value="upvotes">Highest Upvoted</option>
            <option value="official">Official Faculty Answers First</option>
            <option value="unanswered">Unanswered First</option>
          </select>
        </div>
      </div>
    </div>
  );
}
