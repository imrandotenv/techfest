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
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4E4E7]">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px] font-bold">
              FACULTY DESK
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/60 font-mono text-[11px] font-semibold">
              SETGOI School of Engineering
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#09090B] tracking-tight">
            Faculty Academic Portal • {user.fullName || 'Professor'}
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] font-sans">
            Review and stamp student-uploaded notes, broadcast official department notices, and resolve verified engineering doubts.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/campus?tab=directory"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E4E4E7] hover:border-zinc-300 text-xs font-mono font-medium text-[#09090B] shadow-2xs hover:bg-zinc-50 transition-all"
          >
            <span>HOD Directory</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
        </div>
      </div>

      {/* Interactive Faculty Client Desk */}
      <FacultyWorkspaceClient userEmail={user.email || ''} userName={user.fullName || 'Faculty Member'} />
    </div>
  );
}
