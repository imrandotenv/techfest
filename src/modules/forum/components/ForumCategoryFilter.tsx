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
      case 'Engineering Campus':
      case 'Campus Life':
        return Building2;
      case 'Placements':
        return Briefcase;
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
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border font-sans transition-colors cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
              : 'bg-white text-[#52525B] border-[#E4E4E7] hover:border-zinc-300 hover:bg-zinc-50 hover:text-[#09090B]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All</span>
          <span
            className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'All'
                ? 'bg-blue-700 text-white'
                : 'bg-zinc-100 text-[#52525B]'
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
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border font-sans transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                  : 'bg-white text-[#52525B] border-[#E4E4E7] hover:border-zinc-300 hover:bg-zinc-50 hover:text-[#09090B]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.id === 'Campus Life' ? 'Campus' : cat.id === 'TechFest' ? 'Coding & Tech' : cat.id}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-blue-700 text-white'
                    : 'bg-zinc-100 text-[#52525B]'
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
