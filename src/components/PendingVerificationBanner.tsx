'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, RefreshCw, ShieldAlert, ArrowRight } from 'lucide-react';

interface PendingProps {
  requestedRole?: string | null;
  department?: string | null;
  designation?: string | null;
  requestedScopes?: Array<{ branch: string; semesters: number[] }> | null;
}

export function PendingVerificationBanner({
  requestedRole,
  department,
  designation,
}: PendingProps) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetch('/api/profile');
      router.refresh();
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  return (
    <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4 text-amber-700" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-amber-950">Verification Pending</span>
            {requestedRole && (
              <span className="px-2 py-0.5 rounded bg-white border border-amber-200 font-mono text-[10px] font-semibold text-amber-800">
                Requested: {requestedRole}
              </span>
            )}
            {department && (
              <span className="px-2 py-0.5 rounded bg-white border border-amber-200 font-mono text-[10px] font-semibold text-amber-800">
                {department}
              </span>
            )}
          </div>
          <p className="text-xs text-amber-900 mt-1">
            Your {designation || requestedRole || 'academic'} verification request is awaiting Master Admin approval. You currently have temporary Student read access.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleRefresh}
        disabled={refreshing}
        className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-950 text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
        <span>Refresh Status</span>
      </button>
    </div>
  );
}

export function VerificationPendingScreen({
  requestedRole,
  department,
  designation,
  requestedScopes,
}: PendingProps) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (data?.profile?.approvalStatus === 'APPROVED') {
        const nextRole = String(data.profile.role || '').toUpperCase();
        if (nextRole === 'ADMIN') router.push('/admin');
        else if (nextRole === 'FACULTY') router.push('/faculty');
        else router.push('/student');
      }
      router.refresh();
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-[#FAFAFA]">
      <div className="max-w-lg w-full bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-700 font-semibold">
              Verification Pending
            </span>
            <h1 className="text-lg font-bold text-[#09090B]">
              Awaiting Master Admin Approval
            </h1>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
          Your request for{' '}
          <span className="font-semibold text-[#09090B]">
            {requestedRole || 'Elevated'}
          </span>{' '}
          clearance ({designation || department || 'SETGOI'}) is queued for review. Once approved and assigned your branch/semester scopes, this portal unlocks automatically.
        </p>

        {Array.isArray(requestedScopes) && requestedScopes.length > 0 && (
          <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] space-y-1.5">
            <p className="text-[11px] font-mono uppercase text-zinc-500 font-semibold">
              Requested Teaching Scopes
            </p>
            <div className="flex flex-wrap gap-1.5">
              {requestedScopes.map((s) => (
                <span
                  key={s.branch}
                  className="px-2 py-0.5 rounded bg-white border border-[#E4E4E7] font-mono text-[11px] text-zinc-800"
                >
                  {s.branch}: Sem {s.semesters.join(', ')}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2.5 rounded-xl bg-[#09090B] hover:bg-zinc-800 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Checking...' : 'Refresh Status'}</span>
          </button>

          <Link
            href="/student"
            className="px-4 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] hover:bg-zinc-100 text-xs font-semibold text-zinc-700 inline-flex items-center gap-1.5"
          >
            <span>Open Student Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
