import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { requireRole } from '@/lib/rbac';
import { AdminConsoleClient } from './AdminConsoleClient';
import { AppShell } from '@/components/AppShell';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Executive Admin Console | SETTech',
  description: 'SETGOI Super Admin Control Panel & Role Management.',
};

export default async function AdminPage() {
  const user = await requireRole(['admin'], {
    redirectTo: '/sign-in?redirect_url=/admin',
  });

  return (
    <AppShell
      breadcrumbs={[
        { label: 'SETTech', href: '/' },
        { label: 'Super Admin', href: '/admin' },
        { label: 'System Console' },
      ]}
      roleTitle="Super Admin"
      currentRole="admin"
      userName={user.fullName || 'Super Admin Imran'}
      userEmail={user.email || 'mail@ceimran.in'}
      primaryAction={{
        label: '+ Manage Users',
        href: '/admin#users',
        variant: 'purple',
      }}
    >
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
            System Administration • {user.fullName || 'Admin'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl leading-relaxed">
            Manage user roles in Clerk publicMetadata, monitor system audit trails, and oversee campus platform moderation.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/faculty"
            className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 font-mono text-xs font-medium inline-flex items-center gap-1.5 transition-colors border border-zinc-200"
          >
            <span>Faculty View</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
          <Link
            href="/student"
            className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 font-mono text-xs font-medium inline-flex items-center gap-1.5 transition-colors border border-zinc-200"
          >
            <span>Student View</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
        </div>
      </div>

      {/* Admin Client Operations Console */}
      <AdminConsoleClient currentAdminId={user.userId || ''} />
    </AppShell>
  );
}
