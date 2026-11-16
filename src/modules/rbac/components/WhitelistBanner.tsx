'use client';

import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { syncCurrentUserRoleAction } from '../actions';

interface WhitelistBannerProps {
  currentEmail?: string | null;
  currentRole: string;
  isSuperAdmin: boolean;
  whitelistedEmails: string[];
}

export function WhitelistBanner({
  currentEmail,
  currentRole,
  isSuperAdmin,
  whitelistedEmails,
}: WhitelistBannerProps) {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const isMatched = currentEmail ? whitelistedEmails.includes(currentEmail.toLowerCase().trim()) : false;

  const handleSync = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const res = await syncCurrentUserRoleAction();
      setStatusMessage(res.message);
    } catch {
      setStatusMessage('Sync failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
                Super-Admin Whitelist Engine
              </h3>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE POLICY
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              SETGOI institutional emails in this list receive instant administrative promotion upon sign-in.
            </p>
          </div>
        </div>

        <button
          onClick={handleSync}
          disabled={loading}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Verifying...' : 'Sync Whitelist Clearance'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
        <div>
          <span className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider block mb-1">
            Configured Whitelist ({whitelistedEmails.length} addresses)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {whitelistedEmails.map((email) => (
              <span
                key={email}
                className={`font-mono text-[11px] px-2 py-0.5 rounded border ${
                  currentEmail?.toLowerCase() === email
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-semibold ring-1 ring-indigo-200'
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                }`}
              >
                {email}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider block mb-1">
            Active Session Status
          </span>
          <div className="flex items-center gap-2">
            <span className="text-zinc-700 font-medium">{currentEmail || 'Not signed in'}</span>
            {isMatched ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" /> Whitelist Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500">
                <AlertCircle className="w-3.5 h-3.5" /> Standard Member
              </span>
            )}
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="mt-3 p-2.5 rounded bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-700">
          {statusMessage}
        </div>
      )}
    </div>
  );
}
