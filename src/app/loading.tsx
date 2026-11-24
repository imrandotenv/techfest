import React from 'react';

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-200 border-t-[#2563EB] animate-spin" />
        <span className="text-xs font-mono text-zinc-500">Loading SETTech...</span>
      </div>
    </div>
  );
}
