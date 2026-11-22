import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Bell, 
  MessageSquare, 
  Send, 
  ExternalLink, 
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { requireRole } from '@/lib/rbac';
import { FacultyWorkspaceClient } from './FacultyWorkspaceClient';
import { PageHeader } from '@/components/PageHeader';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Faculty Academic Desk | SanakaHub',
  description: 'SETGOI Department Professor & Faculty Moderation Desk.',
};

export default async function FacultyWorkspacePage() {
  const user = await requireRole(['faculty', 'admin'], {
    redirectTo: '/sign-in?redirect_url=/faculty',
  });

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Unified Compact Page Header Strip */}
      <PageHeader
        badge="FACULTY DESK"
        badgeCode="SETGOI School of Engineering"
        title={`Faculty Academic Portal • ${user.fullName || 'Professor'}`}
        subtitle="Review and stamp student-uploaded notes, broadcast official department notices, and resolve verified engineering doubts."
        action={
          <Link
            href="/campus?tab=directory"
            className="sanaka-btn-secondary px-3.5 py-2 text-xs font-mono inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>HOD Directory</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
        }
      />

      {/* Interactive Faculty Client Desk */}
      <FacultyWorkspaceClient userEmail={user.email || ''} userName={user.fullName || 'Faculty Member'} />
    </div>
  );
}
