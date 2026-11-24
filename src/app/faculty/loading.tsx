import React from 'react';

export default function FacultyLoading() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] p-4 sm:p-6 lg:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Banner Skeleton */}
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="h-5 w-44 bg-emerald-100 rounded-full" />
              <div className="h-5 w-36 bg-zinc-100 rounded-md" />
            </div>
            <div className="h-7 w-72 bg-zinc-200 rounded-lg" />
            <div className="h-4 w-96 max-w-full bg-zinc-100 rounded" />
          </div>
          <div className="h-10 w-32 bg-zinc-100 rounded-xl" />
        </div>

        {/* Content Tabs & Moderation Queue Skeleton */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="h-9 w-32 bg-emerald-100 rounded-full" />
            <div className="h-9 w-32 bg-zinc-100 rounded-full" />
            <div className="h-9 w-32 bg-zinc-100 rounded-full" />
          </div>
          <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 h-96" />
        </div>
      </div>
    </div>
  );
}
