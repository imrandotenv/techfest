'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, CornerDownLeft } from 'lucide-react';

const POPULAR_SEARCHES = [
  { label: 'PCC-CS301', query: 'PCC-CS301' },
  { label: 'ESC301', query: 'ESC301' },
  { label: 'Data Structures', query: 'Data Structures' },
  { label: 'MAKAUT PYQs', query: 'MAKAUT PYQ' },
];

export function HeroQuickSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/notes?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/notes');
    }
  };

  const handleChipClick = (searchQuery: string) => {
    router.push(`/notes?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-5 text-left">
      {/* Search Input Bar */}
      <form
        onSubmit={handleSearch}
        className="relative flex items-center bg-white border border-[#E2E8F0] rounded-xl sm:rounded-full p-1.5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] focus-within:border-[#0F172A] focus-within:ring-1 focus-within:ring-[#0F172A]/10 transition-all"
      >
        <Search className="w-4 h-4 text-[#475569] ml-3 shrink-0 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search course code (e.g. PCC-CS301), topic, or faculty..."
          className="w-full px-3 py-1.5 bg-transparent text-xs sm:text-sm text-[#0F172A] placeholder:text-[#475569]/60 focus:outline-hidden font-sans"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-full bg-[#0F172A] text-white hover:bg-slate-800 text-xs font-sans font-medium transition-colors shrink-0 shadow-2xs cursor-pointer"
        >
          <span>Search Vault</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
        </button>
      </form>

      {/* Suggested Quick Search Chips */}
      <div className="flex items-center gap-1.5 mt-2.5 px-2 flex-wrap">
        <span className="text-[11px] font-mono text-[#475569]/80 shrink-0">
          Popular:
        </span>
        {POPULAR_SEARCHES.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => handleChipClick(chip.query)}
            className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white border border-[#E2E8F0] text-[#0F172A] hover:border-[#0F172A] hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
