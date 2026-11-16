import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  ShieldCheck, 
  FileCheck, 
  Home, 
  ExternalLink,
  BookOpen,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { getCurrentAuthUser } from '@/modules/rbac/server-utils';
import { hasRole } from '@/modules/rbac/guards';
import { RoleBadge } from '@/modules/rbac/components/RoleBadge';
import { CollegeVerificationDashboard } from '@/modules/rbac/components/CollegeVerificationDashboard';
import { getReviewableNotes } from '@/modules/rbac/actions';
import { DEPARTMENTS, INITIAL_FORUM_POSTS } from '@/lib/seed-data';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Faculty & Academic Verification Portal | SanakaHub',
  description: 'SETGOI College Faculty portal for reviewing student lecture notes, MAKAUT PYQ vault uploads, and verifying academic discussion solutions.',
};

export default async function CollegeDashboardPage() {
  const user = await getCurrentAuthUser();
  const notes = await getReviewableNotes();

  // Role validation: require college or admin
  const isAuthorized = hasRole(user.role, ['college', 'admin']);

  return (
    <div className="min-h-screen bg-zinc-50 pb-16">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-2">
            <Link href="/" className="hover:text-zinc-900 transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>SanakaHub</span>
            </Link>
            <span>/</span>
            <span className="text-zinc-400">Institutional Faculty</span>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Academic Portal</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                  SETGOI Faculty & Academic Portal
                </h1>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-medium">
                  MAKAUT AFFILIATED
                </span>
              </div>
              <p className="text-xs text-zinc-500 max-w-2xl">
                Official review workspace for Sanaka Educational Trust's Group of Institutions faculty.
                Review student-contributed lecture notes, verify PYQ solutions, and endorse academic forum explanations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-zinc-900">{user.fullName || 'Faculty Member'}</div>
                <div className="text-[11px] text-zinc-500 font-mono">{user.email || 'faculty@setgoi.ac.in'}</div>
              </div>
              <RoleBadge role={user.role} isSuperAdmin={user.isSuperAdmin} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {!isAuthorized ? (
          <div className="bg-white border border-amber-200 rounded-lg p-6 max-w-2xl mx-auto my-8">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">
                  Faculty Clearance Required
                </h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  You are currently authenticated with role <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">{user.role}</code>.
                  Access to approve lecture notes and manage departmental verification queues is restricted to registered SETGOI Faculty members or Super Admins.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Link
                    href="/unauthorized"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
                  >
                    View Access Policy
                  </Link>
                  <Link
                    href="/dashboard/admin"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    Admin Console <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <CollegeVerificationDashboard
            initialNotes={notes}
            departments={DEPARTMENTS}
            forumPosts={INITIAL_FORUM_POSTS}
            currentUserName={user.fullName || 'Faculty Reviewer'}
            currentUserRole={user.role}
          />
        )}
      </div>
    </div>
  );
}
