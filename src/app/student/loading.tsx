import React from 'react';

export default function StudentLoading() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] p-4 sm:p-6 lg:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Banner Skeleton */}
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="h-5 w-48 bg-blue-100 rounded-full" />
              <div className="h-5 w-28 bg-zinc-100 rounded-md" />
            </div>
            <div className="h-7 w-72 bg-zinc-200 rounded-lg" />
            <div className="h-4 w-96 max-w-full bg-zinc-100 rounded" />
          </div>
          <div className="flex gap-2.5">
            <div className="h-10 w-28 bg-zinc-100 rounded-xl" />
            <div className="h-10 w-36 bg-blue-200 rounded-xl" />
          </div>
        </div>

        {/* 3 Quick Action Launchpad Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-xl bg-white border border-[#E4E4E7] h-20" />
          <div className="p-4 rounded-xl bg-white border border-[#E4E4E7] h-20" />
          <div className="p-4 rounded-xl bg-white border border-[#E4E4E7] h-20" />
        </div>

        {/* Bento Grid Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 bg-white border border-[#E4E4E7] rounded-2xl p-6 h-72" />
          <div className="lg:col-span-5 bg-white border border-[#E4E4E7] rounded-2xl p-6 h-72" />
          <div className="lg:col-span-7 bg-white border border-[#E4E4E7] rounded-2xl p-6 h-80" />
          <div className="lg:col-span-5 bg-white border border-[#E4E4E7] rounded-2xl p-6 h-80" />
        </div>
      </div>
    </div>
  );
}
