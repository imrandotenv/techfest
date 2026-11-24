'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Admin Console Error]:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-8 shadow-xs text-center space-y-5">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-zinc-900 font-sans">
            Unable to Load Admin Console
          </h2>
          <p className="text-xs text-zinc-500 font-sans leading-relaxed">
            A temporary sync or clearance check issue occurred while initializing the admin console.
          </p>
          {error?.message && (
            <div className="mt-2 p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-[11px] font-mono text-zinc-600 text-left overflow-x-auto">
              {error.message}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold font-sans inline-flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 text-xs font-medium font-sans inline-flex items-center justify-center gap-2 transition-colors border border-zinc-200"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
