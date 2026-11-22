import React from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Users, 
  Building2, 
  ShieldCheck, 
  ExternalLink,
  Activity,
  FileText
} from 'lucide-react';
import { requireRole } from '@/lib/rbac';
import { AdminConsoleClient } from './AdminConsoleClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Executive Admin Console | SanakaHub',
  description: 'SETGOI Super Admin Control Panel & Role Management.',
};

export default async function AdminPage() {
  const user = await requireRole(['admin'], {
    redirectTo: '/sign-in?redirect_url=/admin',
  });

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4E4E7]">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-mono text-[11px] font-bold">
              SUPER ADMIN CONSOLE
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Zero-Trust RBAC
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#09090B] tracking-tight">
            System Administration • {user.fullName || 'Admin'}
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] font-sans">
            Manage user roles in Clerk publicMetadata, edit official campus contacts, and oversee community moderation logs.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/faculty"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E4E4E7] hover:border-zinc-300 text-xs font-mono font-medium text-[#09090B] shadow-2xs hover:bg-zinc-50 transition-all"
          >
            <span>Faculty View</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
          <Link
            href="/student"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E4E4E7] hover:border-zinc-300 text-xs font-mono font-medium text-[#09090B] shadow-2xs hover:bg-zinc-50 transition-all"
          >
            <span>Student View</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
        </div>
      </div>

      {/* Admin Client Operations Console */}
      <AdminConsoleClient currentAdminId={user.userId || ''} />
    </div>
  );
}
