import React from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  ArrowLeft, 
  GraduationCap, 
  ShieldCheck, 
  User, 
  CheckCircle2, 
  HelpCircle,
  Mail,
  Home,
  FileText
} from 'lucide-react';
import { getCurrentAuthUser } from '@/modules/rbac/server-utils';
import { RoleBadge } from '@/modules/rbac/components/RoleBadge';
import { getSuperAdminEmails } from '@/modules/rbac/whitelist';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Access Restricted (403) | SanakaHub',
  description: 'Role-based access restriction. Requires elevated SETGOI faculty or super-admin clearance.',
};

export default async function UnauthorizedPage() {
  const user = await getCurrentAuthUser();
  const superAdminEmails = getSuperAdminEmails();

  return (
    <div className="min-h-[85vh] bg-[#FAFAFA] text-[#0F172A] pt-16 md:pt-28 pb-28 md:pb-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-6">
          <Link href="/" className="hover:text-zinc-900 transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>SanakaHub</span>
          </Link>
          <span>/</span>
          <span className="text-zinc-400">Security</span>
          <span>/</span>
          <span className="text-zinc-900 font-medium">403 Restricted</span>
        </div>

        {/* Main Warning Box */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 sm:p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-md bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 text-rose-600">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-rose-50 text-rose-700 border border-rose-200">
                  HTTP 403 • FORBIDDEN
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-zinc-100 text-zinc-600 border border-[#E2E8F0]">
                  POLICY ENFORCED
                </span>
              </div>

              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                Access Restricted by Institutional Policy
              </h1>

              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                The administrative view or mutation you attempted to perform requires elevated clearance.
                Under SETGOI academic policy, access to Faculty Portals and Super Admin Consoles is
                restricted strictly to verified roles.
              </p>
            </div>
          </div>

          {/* Current Session Identity Card */}
          <div className="mt-6 p-4 rounded-md bg-[#FAFAFA] text-[#0F172A] border border-[#E2E8F0]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                  Active Session Identity
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-900">
                    {user.isAuthenticated ? user.fullName : 'Guest Visitor'}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    ({user.email || 'No email attached'})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono">Assigned Role:</span>
                <RoleBadge role={user.role} isSuperAdmin={user.isSuperAdmin} />
              </div>
            </div>
          </div>

          {/* Clearance Matrix */}
          <div className="mt-8">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3">
              SETGOI RBAC Clearance Hierarchy
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Student */}
              <div className={`p-4 rounded-md border ${user.role === 'student' ? 'border-zinc-400 bg-[#FAFAFA] text-[#0F172A]/50' : 'border-[#E2E8F0] bg-white'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-zinc-500" />
                  <span className="text-xs font-bold text-zinc-900 font-mono uppercase">Student</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-normal">
                  Standard scholar access. Can browse campus facilities, upload lecture notes, calculate SGPA/CGPA, and participate in discussion threads.
                </p>
              </div>

              {/* College */}
              <div className={`p-4 rounded-md border ${user.role === 'college' ? 'border-sky-400 bg-sky-50/20' : 'border-[#E2E8F0] bg-white'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-bold text-zinc-900 font-mono uppercase">College Faculty</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-normal">
                  Academic verification tier. Access to <code className="font-mono text-zinc-700 font-medium">/dashboard/college</code> to approve pending student PYQ uploads and verify official forum answers.
                </p>
              </div>

              {/* Admin */}
              <div className={`p-4 rounded-md border ${user.role === 'admin' ? 'border-indigo-400 bg-indigo-50/20' : 'border-[#E2E8F0] bg-white'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-zinc-900 font-mono uppercase">Super Admin</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-normal">
                  Institution Director & IT Control. Access to <code className="font-mono text-zinc-700 font-medium">/dashboard/admin</code> for RBAC role promotions, whitelist inspection, and system metrics.
                </p>
              </div>
            </div>
          </div>

          {/* Whitelist Notice */}
          <div className="mt-6 p-4 rounded-md border border-[#E2E8F0] bg-[#FAFAFA] text-[#0F172A] text-xs">
            <div className="flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-zinc-900 block mb-0.5">
                  Are you an institutional administrator or designated faculty?
                </span>
                <p className="text-zinc-600 leading-normal">
                  If your email address is part of the authorized whitelist, ensure you are signed in with your official account. 
                  Whitelisted accounts are automatically assigned full administrator clearance upon authentication.
                </p>
                <div className="mt-2 flex items-center gap-2 font-mono text-[11px] text-zinc-500">
                  <span>Authorizing Domain:</span>
                  <span className="text-zinc-700 font-medium">setgoi.ac.in</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Homepage
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/notes"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium rounded-md border border-[#E2E8F0] bg-white text-zinc-700 hover:bg-[#FAFAFA] text-[#0F172A] transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-zinc-500" />
                Notes Vault
              </Link>

              <a
                href="mailto:principal@setgoi.ac.in?subject=SanakaHub%20Role%20Access%20Request"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium rounded-md border border-[#E2E8F0] bg-white text-zinc-700 hover:bg-[#FAFAFA] text-[#0F172A] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                Request Access
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
