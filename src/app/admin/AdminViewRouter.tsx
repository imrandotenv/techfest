'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { useRolePreview } from '@/context/RolePreviewContext';
import { AdminConsoleClient } from './AdminConsoleClient';
import { FacultyWorkspaceClient } from '@/app/faculty/FacultyWorkspaceClient';
import { StudentCockpitView, StudentCockpitProps } from '@/components/StudentCockpitView';

interface AdminViewRouterProps {
  currentAdminId: string;
  adminName: string;
  adminEmail: string;
  studentPreviewProps: StudentCockpitProps;
}

export function AdminViewRouter({
  currentAdminId,
  adminName,
  adminEmail,
  studentPreviewProps,
}: AdminViewRouterProps) {
  const { previewRole, setPreviewRole } = useRolePreview();

  const roleSwitcherBar = (
    <div className="bg-white border border-[#E4E4E7] rounded-2xl p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-xs font-mono font-semibold text-[#09090B]">
          Live Role View Switcher
        </span>
        <span className="hidden sm:inline text-[11px] text-zinc-500">
          • 1-click exhibition preview
        </span>
      </div>
      <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7]">
        {(['ADMIN', 'FACULTY', 'STUDENT'] as const).map((roleOption) => {
          const active = previewRole === roleOption;
          const label =
            roleOption === 'ADMIN'
              ? 'Admin View'
              : roleOption === 'FACULTY'
              ? 'Faculty View'
              : 'Student View';
          return (
            <button
              key={roleOption}
              type="button"
              onClick={() => setPreviewRole(roleOption)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                active
                  ? 'bg-[#09090B] text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (previewRole === 'STUDENT') {
    return (
      <div className="space-y-6">
        {roleSwitcherBar}
        <StudentCockpitView {...studentPreviewProps} />
      </div>
    );
  }

  if (previewRole === 'FACULTY') {
    return (
      <div className="space-y-6 sm:space-y-8">
        {roleSwitcherBar}
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-semibold">
                SETGOI School of Engineering
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                Academic Moderation Desk
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-[#09090B]">
              Faculty Academic Portal • {adminName}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl leading-relaxed">
              Verify student-uploaded MAKAUT notes, publish departmental notices, and resolve engineering doubts.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/notes"
              className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 font-mono text-xs font-medium inline-flex items-center gap-1.5 transition-colors border border-zinc-200"
            >
              <span>Notes Vault</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </Link>
          </div>
        </div>

        <FacultyWorkspaceClient userEmail={adminEmail} userName={adminName} />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {roleSwitcherBar}
      {/* Admin Welcome Strip */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-mono text-xs font-semibold">
              Live Zero-Trust RBAC
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
              Super Admin Authority
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-[#09090B]">
            System Administration • {adminName}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl leading-relaxed">
            Manage real Neon DB &amp; Clerk user roles, publish official SETGOI notices, moderate content, and inspect system audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/faculty"
            className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 font-mono text-xs font-medium inline-flex items-center gap-1.5 transition-colors border border-zinc-200"
          >
            <span>Faculty Route</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
          <Link
            href="/student"
            className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 font-mono text-xs font-medium inline-flex items-center gap-1.5 transition-colors border border-zinc-200"
          >
            <span>Student Route</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
        </div>
      </div>

      {/* Real DB-Backed Admin Console */}
      <AdminConsoleClient currentAdminId={currentAdminId} />
    </div>
  );
}
