import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  Database, 
  FileCheck2, 
  Home, 
  GraduationCap, 
  ArrowRight,
  Lock,
  Layers,
  KeyRound,
  AlertTriangle
} from 'lucide-react';
import { getCurrentAuthUser } from '@/modules/rbac/server-utils';
import { hasRole } from '@/modules/rbac/guards';
import { RoleBadge } from '@/modules/rbac/components/RoleBadge';
import { WhitelistBanner } from '@/modules/rbac/components/WhitelistBanner';
import { UserRoleSwitcher } from '@/modules/rbac/components/UserRoleSwitcher';
import { AdminNotesApprover } from '@/modules/rbac/components/AdminNotesApprover';
import { getSuperAdminEmails } from '@/modules/rbac/whitelist';
import { getAdminDirectoryUsers, getReviewableNotes } from '@/modules/rbac/actions';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Super-Admin Console & RBAC Management | SanakaHub',
  description: 'SETGOI Master Administration, Clerk RBAC user promotion, SUPER_ADMIN_EMAILS whitelist telemetry, and institution oversight.',
};

export default async function AdminDashboardPage() {
  const user = await getCurrentAuthUser();
  const whitelistedEmails = getSuperAdminEmails();
  const users = await getAdminDirectoryUsers();
  const notes = await getReviewableNotes();

  const isAuthorized = hasRole(user.role, ['admin']);

  // Compute telemetry
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const facultyCount = users.filter((u) => u.role === 'college').length;
  const studentCount = users.filter((u) => u.role === 'student').length;
  const pendingNotesCount = notes.filter((n) => n.status === 'pending').length;

  return (
    <div className="min-h-screen bg-zinc-50 pt-16 md:pt-28 pb-28 md:pb-20">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-2">
            <Link href="/" className="hover:text-zinc-900 transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>SanakaHub</span>
            </Link>
            <span>/</span>
            <span className="text-zinc-400">Institutional Directorate</span>
            <span>/</span>
            <span className="text-zinc-900 font-medium">RBAC Master Console</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                  Super-Admin Console & RBAC Authority
                </h1>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
                  CLERK RBAC v7
                </span>
              </div>
              <p className="text-xs text-zinc-500 max-w-2xl">
                Master institution administration for Sanaka Educational Trust's Group of Institutions.
                Manage user role assignments, audit super-admin whitelist elevation, and oversee campus modules.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-zinc-900">{user.fullName || 'Institution Admin'}</div>
                <div className="text-[11px] text-zinc-500 font-mono">{user.email || 'admin@setgoi.ac.in'}</div>
              </div>
              <RoleBadge role={user.role} isSuperAdmin={user.isSuperAdmin} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {!isAuthorized ? (
          <div className="bg-white border border-rose-200 rounded-lg p-6 max-w-2xl mx-auto my-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">
                  Super-Admin Access Clearance Required
                </h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  You are currently authenticated as <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">{user.role}</code>.
                  Access to institutional user role assignments, super-admin whitelist configuration, and system telemetry is strictly restricted to designated Directors and Principals.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Link
                    href="/unauthorized"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
                  >
                    View Access Policy
                  </Link>
                  <Link
                    href="/dashboard/college"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    Faculty Portal <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Telemetry Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Users */}
              <div className="bg-white border border-zinc-200 rounded-lg p-5">
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider">Total Members</span>
                  <Users className="w-4 h-4 text-zinc-600" />
                </div>
                <div className="text-2xl font-bold text-zinc-900 tracking-tight font-mono">
                  {users.length}
                </div>
                <div className="mt-2 text-xs text-zinc-500 font-mono">
                  {studentCount} Students • {facultyCount} Faculty • {adminCount} Admins
                </div>
              </div>

              {/* Super Admin Whitelist */}
              <div className="bg-white border border-zinc-200 rounded-lg p-5">
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider">Whitelist Policy</span>
                  <KeyRound className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-2xl font-bold text-zinc-900 tracking-tight font-mono">
                  {whitelistedEmails.length} Active
                </div>
                <div className="mt-2 text-xs text-emerald-600 font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Auto-Promotion Enabled
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="bg-white border border-zinc-200 rounded-lg p-5">
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider">Notes Vault Queue</span>
                  <FileCheck2 className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-zinc-900 tracking-tight font-mono">
                  {pendingNotesCount} Pending
                </div>
                <div className="mt-2 text-xs text-zinc-500 font-mono">
                  {notes.length - pendingNotesCount} verified & published
                </div>
              </div>

              {/* Security Guard */}
              <div className="bg-white border border-zinc-200 rounded-lg p-5">
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider">Security State</span>
                  <Lock className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-sm font-semibold text-zinc-900">
                  Role Guards Enforced
                </div>
                <div className="mt-2 text-xs text-zinc-500 font-mono">
                  Clerk Middleware + Server Action Assertions
                </div>
              </div>
            </div>

            {/* Whitelist Banner */}
            <WhitelistBanner
              currentEmail={user.email}
              currentRole={user.role}
              isSuperAdmin={user.isSuperAdmin}
              whitelistedEmails={whitelistedEmails}
            />

            {/* Pending Notes Approval Queue */}
            <AdminNotesApprover initialPendingNotes={notes.filter((n) => n.status === 'pending')} />

            {/* User Directory & Role Assignment Table */}
            <UserRoleSwitcher initialUsers={users} />

            {/* Architecture & Institutional Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* College Faculty Portal Quick Link */}
              <div className="bg-white border border-zinc-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Faculty Delegation
                  </span>
                  <GraduationCap className="w-4 h-4 text-sky-600" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900">
                  Departmental Notes & Solution Verification Portal
                </h3>
                <p className="text-xs text-zinc-600 mt-1">
                  Access the faculty queue to directly approve student lecture notes and mark official answers.
                </p>
                <div className="mt-4">
                  <Link
                    href="/dashboard/college"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
                  >
                    Open Faculty Dashboard <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Security Policy & Error Simulation */}
              <div className="bg-white border border-zinc-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Security Policy Test
                  </span>
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900">
                  HTTP 403 Access Restriction Template
                </h3>
                <p className="text-xs text-zinc-600 mt-1">
                  Preview the institutional policy notification presented to unauthorized visitors and student accounts.
                </p>
                <div className="mt-4">
                  <Link
                    href="/unauthorized"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    Inspect /unauthorized View <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
