'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, CornerDownLeft } from 'lucide-react';

export function QuickSearchBar() {
  const [query, setQuery] = useState('');
  const [isMac, setIsMac] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // Check if the query is more campus/directory related
    const campusKeywords = ['bus', 'route', 'hostel', 'faculty', 'professor', 'library', 'canteen', 'map', 'hospital', 'pharmacy', 'campus'];
    const isCampus = campusKeywords.some((kw) => trimmed.toLowerCase().includes(kw));

    if (isCampus) {
      router.push(`/campus?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(`/notes?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mt-6 relative group"
    >
      <div className="relative flex items-center bg-white border border-zinc-200/90 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-zinc-300 focus-within:border-zinc-950 focus-within:ring-2 focus-within:ring-zinc-950/5 transition-all px-4 py-2">
        <Search className="w-4 h-4 text-zinc-400 group-focus-within:text-zinc-950 shrink-0 mr-2.5 transition-colors" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search PCC-CS301, faculty, or bus timings..."
          className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
        />

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {query.trim() ? (
            <button
              type="submit"
              className="p-1.5 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
              title="Search"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-100 border border-zinc-200/80 rounded-md">
              {isMac ? '⌘K' : 'Ctrl+K'}
            </kbd>
          )}
        </div>
      </div>
    </form>
  );
}
