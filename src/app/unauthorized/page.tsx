import React from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  ArrowRight, 
  Home, 
  Lock, 
  GraduationCap, 
  ShieldCheck, 
  HelpCircle,
  LogIn
} from 'lucide-react';
import { getCurrentAuthUser } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '403 Restricted Access | SETTech',
  description: 'Role-based access restriction. Requires elevated SETGOI faculty or super-admin clearance.',
};

export default async function UnauthorizedPage() {
  const user = await getCurrentAuthUser();

  const roleRedirect = user.isAuthenticated
    ? user.role === 'admin'
      ? '/admin'
      : user.role === 'faculty'
      ? '/faculty'
      : '/student'
    : '/';

  return (
    <div className="min-h-[80vh] bg-[#FAFAFA] text-[#09090B] pt-20 md:pt-28 pb-28 md:pb-20 px-4 sm:px-6 flex flex-col items-center justify-center">
      <div className="max-w-xl mx-auto w-full space-y-6 text-center">
        {/* Main 403 Card */}
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-10 shadow-xs space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 mx-auto flex items-center justify-center text-rose-600 shadow-2xs">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-mono text-[11px] font-bold">
                HTTP 403 • FORBIDDEN
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-[#52525B] border border-[#E4E4E7] font-mono text-[11px] font-medium">
                ZERO-TRUST RBAC
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#09090B] tracking-tight">
              Restricted Institutional Access
            </h1>

            <p className="text-xs sm:text-sm text-[#52525B] font-sans leading-relaxed max-w-md mx-auto">
              The workspace or administrative API you attempted to access requires elevated <span className="font-semibold text-[#09090B]">Faculty</span> or <span className="font-semibold text-[#09090B]">Admin</span> clearance.
            </p>
          </div>

          {/* Identity Snapshot Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-[#E4E4E7] text-left text-xs font-mono space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#52525B]">Signed in as:</span>
              <span className="font-bold text-[#09090B]">{user.isAuthenticated ? user.fullName : 'Guest Visitor'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#52525B]">Account Email:</span>
              <span className="text-[#52525B] truncate max-w-[200px]">{user.email || 'None'}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#E4E4E7]">
              <span className="text-[#52525B]">Active Role:</span>
              <span
                className={`px-2 py-0.5 rounded font-bold uppercase ${
                  user.role === 'admin'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : user.role === 'faculty'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-zinc-200/70 text-[#09090B]'
                }`}
              >
                {user.role}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {user.isAuthenticated ? (
              <Link
                href={roleRedirect}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-sans text-xs font-semibold inline-flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>Return to My Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                href="/sign-in?redirect_url=/dashboard"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-sans text-xs font-semibold inline-flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign in with SETGOI Account</span>
              </Link>
            )}

            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#E4E4E7] text-[#09090B] hover:bg-zinc-50 font-sans text-xs font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-[#52525B]" />
              <span>SETTech Home</span>
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-[11px] font-mono text-[#52525B]">
          Need elevated faculty clearance? Contact your department HOD or email <a href="mailto:mail@ceimran.in" className="text-[#2563EB] underline">mail@ceimran.in</a>.
        </p>
      </div>
    </div>
  );
}
