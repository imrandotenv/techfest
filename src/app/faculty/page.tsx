import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { requireRole, syncAndGetCurrentUser } from '@/lib/rbac';
import { FacultyWorkspaceClient } from './FacultyWorkspaceClient';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { VerificationPendingScreen } from '@/components/PendingVerificationBanner';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Faculty Academic Desk | SETTech',
  description: 'SETGOI Department Professor & Faculty Moderation Desk.',
};

export default async function FacultyWorkspacePage() {
  const syncedUser = await syncAndGetCurrentUser();
  if (
    syncedUser &&
    syncedUser.approvalStatus === 'PENDING' &&
    syncedUser.requestedRole === 'FACULTY'
  ) {
    return (
      <VerificationPendingScreen
        requestedRole={syncedUser.requestedRole}
        department={syncedUser.department}
        designation={syncedUser.designation}
        requestedScopes={syncedUser.requestedScopes as any}
      />
    );
  }

  const user = await requireRole(['faculty', 'admin'], {
    redirectTo: '/sign-in?redirect_url=/faculty',
  });

  const assignedScopes = Array.isArray(syncedUser?.assignedScopes)
    ? (syncedUser.assignedScopes as Array<{ branch: string; semesters: number[] }>)
    : [];
  const isAdminUnrestricted = user.role === 'admin';

  return (
    <WorkspaceShell
      breadcrumbs={[
        { label: 'SETTech', href: '/' },
        { label: 'Faculty Desk', href: '/faculty' },
        { label: 'Review & Moderation' },
      ]}
      roleTitle="Faculty"
      currentRole="faculty"
      userName={user.fullName || 'Professor'}
      userEmail={user.email || 'faculty@setgoi.ac.in'}
      primaryAction={{
        label: '+ Post Notice',
        href: '/faculty#notices',
        variant: 'emerald',
      }}
    >
      {/* Header Banner */}
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
            Faculty Academic Portal • {user.fullName || 'Professor'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl leading-relaxed">
            Publish verified study materials, stamp student-uploaded notes, broadcast official notices, and answer engineering doubts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/campus?tab=directory"
            className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 font-mono text-xs font-medium inline-flex items-center gap-1.5 transition-colors border border-zinc-200"
          >
            <span>HOD Directory</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
        </div>
      </div>

      {/* Interactive Faculty Client Desk */}
      <FacultyWorkspaceClient
        userEmail={user.email || ''}
        userName={user.fullName || 'Faculty Member'}
        assignedScopes={assignedScopes}
        isAdminUnrestricted={isAdminUnrestricted}
        currentDbUserId={syncedUser?.id || null}
      />
    </WorkspaceShell>
  );
}
