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
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#09090B] font-display">
              Campus Q&amp;A Forum
            </h1>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/60 font-medium">
              {totalPosts} {totalPosts === 1 ? 'Thread' : 'Threads'}
            </span>
          </div>
          <p className="text-sm text-[#52525B] mt-1 max-w-2xl font-sans leading-relaxed">
            MAKAUT academic doubts, TechFest innovation tracks, placement roadmaps, and verified Official Faculty Answers from SETGOI professors.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#2563EB] text-white hover:bg-blue-700 text-xs sm:text-sm font-medium transition-colors shadow-xs shrink-0 cursor-pointer font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>+ Ask Question</span>
        </button>
      </div>

      {/* Search and Sort Control Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#52525B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search questions, course codes (e.g. PCC-CS301), faculty names, or topics..."
            className="w-full h-10 pl-9 pr-9 bg-white border border-[#E4E4E7] rounded-lg text-xs sm:text-sm text-[#09090B] placeholder:text-[#52525B]/60 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-colors shadow-2xs font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#09090B] cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Toggles: Trending, Recent, Unanswered, Official */}
        <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-mono text-[#52525B] shrink-0 mr-1 hidden sm:inline-block">
            Sort by:
          </span>
          <div className="inline-flex items-center p-0.5 bg-zinc-100 rounded-lg border border-[#E4E4E7]">
            <button
              type="button"
              onClick={() => onSortChange('upvotes')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium font-sans transition-all cursor-pointer ${
                sortOption === 'upvotes'
                  ? 'bg-white text-[#09090B] shadow-2xs font-bold'
                  : 'text-[#52525B] hover:text-[#09090B]'
              }`}
            >
              Trending
            </button>
            <button
              type="button"
              onClick={() => onSortChange('recent')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium font-sans transition-all cursor-pointer ${
                sortOption === 'recent'
                  ? 'bg-white text-[#09090B] shadow-2xs font-bold'
                  : 'text-[#52525B] hover:text-[#09090B]'
              }`}
            >
              Recent
            </button>
            <button
              type="button"
              onClick={() => onSortChange('unanswered')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium font-sans transition-all cursor-pointer ${
                sortOption === 'unanswered'
                  ? 'bg-white text-[#09090B] shadow-2xs font-bold'
                  : 'text-[#52525B] hover:text-[#09090B]'
              }`}
            >
              Unanswered
            </button>
            <button
              type="button"
              onClick={() => onSortChange('official')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium font-sans transition-all cursor-pointer ${
                sortOption === 'official'
                  ? 'bg-white text-[#09090B] shadow-2xs font-bold'
                  : 'text-[#52525B] hover:text-[#09090B]'
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
