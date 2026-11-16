'use client';

import React from 'react';
import { ForumCategory, FORUM_CATEGORIES } from '../types';
import { 
  GraduationCap, 
  Zap, 
  Building2, 
  Briefcase, 
  Home, 
  Layers 
} from 'lucide-react';

interface ForumCategoryFilterProps {
  selectedCategory: string; // 'All' or ForumCategory
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
}

export function ForumCategoryFilter({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: ForumCategoryFilterProps) {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'Academic':
        return GraduationCap;
      case 'TechFest':
        return Zap;
      case 'Campus Life':
        return Building2;
      case 'Placements':
        return Briefcase;
      case 'Hostel':
        return Home;
      default:
        return Layers;
    }
  };

  const totalCount = Object.values(categoryCounts).reduce((acc, count) => acc + count, 0);

  return (
    <div className="w-full overflow-x-auto pb-1 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        {/* All Categories Option */}
        <button
          type="button"
          onClick={() => onSelectCategory('All')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium border transition-colors ${
            selectedCategory === 'All'
              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
              : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Categories</span>
          <span
            className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'All'
                ? 'bg-zinc-800 text-zinc-200'
                : 'bg-zinc-100 text-zinc-600'
            }`}
          >
            {totalCount}
          </span>
        </button>

        {/* 5 Distinct Categories */}
        {FORUM_CATEGORIES.map((cat) => {
          const Icon = getCategoryIcon(cat.id);
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium border transition-colors ${
                isSelected
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.id}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-zinc-800 text-zinc-200'
                    : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
