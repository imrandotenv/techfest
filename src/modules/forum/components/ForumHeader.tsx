'use client';

import React from 'react';
import { Search, Plus, X } from 'lucide-react';
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
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search questions, course codes (e.g. PCC-CS301), faculty names, or topics..."
            className="w-full h-10 pl-9 pr-9 bg-white border border-[#E2E8F0] rounded-lg text-xs sm:text-sm text-[#0F172A] placeholder:text-[#475569]/60 focus:outline-hidden focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]/10 transition-colors shadow-2xs font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#0F172A] cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Toggles: Trending, Recent, Unanswered, Official */}
        <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-mono text-[#475569] shrink-0 mr-1 hidden sm:inline-block">
            Sort by:
          </span>
          <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => onSortChange('upvotes')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium font-sans transition-all cursor-pointer ${
                sortOption === 'upvotes'
                  ? 'bg-white text-[#0F172A] shadow-2xs font-bold'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              Trending
            </button>
            <button
              type="button"
              onClick={() => onSortChange('recent')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium font-sans transition-all cursor-pointer ${
                sortOption === 'recent'
                  ? 'bg-white text-[#0F172A] shadow-2xs font-bold'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              Recent
            </button>
            <button
              type="button"
              onClick={() => onSortChange('unanswered')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium font-sans transition-all cursor-pointer ${
                sortOption === 'unanswered'
                  ? 'bg-white text-[#0F172A] shadow-2xs font-bold'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              Unanswered
            </button>
            <button
              type="button"
              onClick={() => onSortChange('official')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium font-sans transition-all cursor-pointer ${
                sortOption === 'official'
                  ? 'bg-white text-[#0F172A] shadow-2xs font-bold'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              Official
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
