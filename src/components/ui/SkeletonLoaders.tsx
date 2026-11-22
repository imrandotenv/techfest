import React from 'react';

export function ToolsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-24 h-5 bg-zinc-200/90 rounded-full" />
            <div className="w-16 h-5 bg-blue-100 rounded-full" />
          </div>
          <div className="w-64 sm:w-80 h-7 bg-zinc-200/80 rounded-lg" />
          <div className="w-48 sm:w-60 h-4 bg-zinc-100 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-28 h-9 bg-zinc-200/70 rounded-xl" />
          <div className="w-32 h-9 bg-zinc-200/70 rounded-xl" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <div className="w-32 h-10 bg-zinc-200/80 rounded-xl shrink-0" />
        <div className="w-36 h-10 bg-zinc-100 rounded-xl shrink-0" />
        <div className="w-28 h-10 bg-zinc-100 rounded-xl shrink-0" />
        <div className="w-40 h-10 bg-zinc-100 rounded-xl shrink-0" />
      </div>

      {/* Tool Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white border border-[#E4E4E7] rounded-2xl p-6 space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 bg-zinc-200/80 rounded-xl" />
              <div className="w-16 h-5 bg-zinc-100 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="w-3/4 h-5 bg-zinc-200/90 rounded-md" />
              <div className="w-full h-3.5 bg-zinc-100 rounded" />
              <div className="w-2/3 h-3.5 bg-zinc-100 rounded" />
            </div>
            <div className="pt-2 flex items-center justify-between">
              <div className="w-20 h-4 bg-zinc-200/60 rounded" />
              <div className="w-14 h-4 bg-blue-100/70 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NotesVaultSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-8 space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-28 h-5 bg-blue-100 rounded-full" />
          <div className="w-20 h-5 bg-zinc-200/70 rounded-full" />
        </div>
        <div className="w-72 sm:w-96 h-8 bg-zinc-200/90 rounded-lg" />
        <div className="w-56 sm:w-72 h-4 bg-zinc-100 rounded-md" />
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:flex-1 h-11 bg-white border border-[#E4E4E7] rounded-xl" />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="w-28 h-11 bg-white border border-[#E4E4E7] rounded-xl shrink-0" />
          <div className="w-28 h-11 bg-white border border-[#E4E4E7] rounded-xl shrink-0" />
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white border border-[#E4E4E7] rounded-2xl p-5 space-y-3.5 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="w-20 h-5 bg-zinc-200/80 rounded-md" />
              <div className="w-16 h-5 bg-emerald-100/70 rounded-full" />
            </div>
            <div className="space-y-1.5">
              <div className="w-4/5 h-5 bg-zinc-200/90 rounded" />
              <div className="w-3/5 h-4 bg-zinc-100 rounded" />
            </div>
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
              <div className="w-24 h-4 bg-zinc-200/60 rounded" />
              <div className="w-16 h-7 bg-zinc-200/80 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CalendarSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Calendar Header Card */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-8 space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-24 h-5 bg-blue-100 rounded-full" />
          <div className="w-20 h-5 bg-zinc-200/70 rounded-full" />
        </div>
        <div className="w-72 h-8 bg-zinc-200/90 rounded-lg" />
        <div className="w-60 h-4 bg-zinc-100 rounded-md" />
      </div>

      {/* Timeline List Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-zinc-200/80 rounded-xl shrink-0" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-18 h-4 bg-blue-100/80 rounded" />
                  <div className="w-14 h-4 bg-zinc-100 rounded" />
                </div>
                <div className="w-56 sm:w-72 h-5 bg-zinc-200/90 rounded-md" />
                <div className="w-40 h-3.5 bg-zinc-100 rounded" />
              </div>
            </div>
            <div className="w-24 h-6 bg-zinc-200/70 rounded-full self-start sm:self-center" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function NoticesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Notice Board Header Card */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-8 space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-28 h-5 bg-amber-100 rounded-full" />
          <div className="w-16 h-5 bg-zinc-200/70 rounded-full" />
        </div>
        <div className="w-80 h-8 bg-zinc-200/90 rounded-lg" />
        <div className="w-64 h-4 bg-zinc-100 rounded-md" />
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <div className="w-24 h-9 bg-zinc-200/80 rounded-xl shrink-0" />
        <div className="w-28 h-9 bg-zinc-100 rounded-xl shrink-0" />
        <div className="w-28 h-9 bg-zinc-100 rounded-xl shrink-0" />
        <div className="w-28 h-9 bg-zinc-100 rounded-xl shrink-0" />
      </div>

      {/* Notice Cards List */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-20 h-5 bg-red-100/80 rounded-full" />
                <div className="w-24 h-4 bg-zinc-200/70 rounded" />
              </div>
              <div className="w-16 h-4 bg-zinc-100 rounded" />
            </div>
            <div className="w-4/5 h-5 bg-zinc-200/90 rounded-md" />
            <div className="w-full h-3.5 bg-zinc-100 rounded" />
            <div className="pt-2 flex items-center justify-between">
              <div className="w-32 h-4 bg-zinc-200/60 rounded" />
              <div className="w-20 h-6 bg-zinc-200/80 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
