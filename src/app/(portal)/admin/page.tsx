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
import { PageHeader } from '@/components/PageHeader';

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
      {/* Unified Compact Page Header Strip */}
      <PageHeader
        badge="SUPER ADMIN CONSOLE"
        badgeCode="Live Zero-Trust RBAC"
        title={`System Administration • ${user.fullName || 'Admin'}`}
        subtitle="Manage user roles in Clerk publicMetadata, edit official campus contacts, and oversee community moderation logs."
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/faculty"
              className="sanaka-btn-secondary px-3.5 py-2 text-xs font-mono inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Faculty View</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </Link>
            <Link
              href="/student"
              className="sanaka-btn-secondary px-3.5 py-2 text-xs font-mono inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Student View</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </Link>
          </div>
        }
      />

      {/* Admin Client Operations Console */}
      <AdminConsoleClient currentAdminId={user.userId || ''} />
    </div>
  );
}
