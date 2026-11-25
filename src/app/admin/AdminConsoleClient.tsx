'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  Users,
  Bell,
  ShieldCheck,
  Building2,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Pin,
  PinOff,
  Trash2,
  Edit3,
  Plus,
  Calendar,
  Save,
  Check,
  BookOpen,
  MessageSquare,
  Database,
  Lock,
  ChevronLeft,
  ChevronRight,
  X,
  PlayCircle,
} from 'lucide-react';
import { UserRole } from '@/lib/rbac';
import { CourseLectureManager } from '@/components/CourseLectureManager';

type AdminTab = 'overview' | 'users' | 'notices' | 'moderation' | 'lectures' | 'directory' | 'audit';

interface ManagedUser {
  id: string;
  clerkId: string;
  fullName: string;
  email: string;
  role: UserRole;
  department: string;
  studentId?: string;
  createdAt?: string;
  onboardingCompleted?: boolean;
}

interface OverviewData {
  kpis: {
    totalStudents: number;
    activeFaculty: number;
    totalAdmins: number;
    totalNotes: number;
    verifiedNotes: number;
    pendingNotes: number;
    totalForumPosts: number;
    totalNotices: number;
  };
  recentAuditLogs: AuditEntry[];
  recentUsers: Array<{
    id: string;
    fullName: string | null;
    email: string;
    role: string;
    branch: string | null;
    createdAt: string;
  }>;
  health: {
    neonDb: string;
    clerkAuth: string;
    checkedAt: string;
  };
}

interface AuditEntry {
  id: string;
  actorId: string;
  actor: string;
  action: string;
  target: string;
  details: string;
  createdAt: string;
}

interface NoticeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  targetBranch: string;
  isPinned: boolean;
  createdAt: string;
  author?: { fullName?: string | null; role?: string | null };
}

interface ModerationNote {
  id: string;
  title: string;
  subjectCode: string;
  branch: string;
  semester: number;
  verified: boolean;
  fileUrl: string;
  createdAt: string;
  uploader?: { fullName?: string | null; email?: string | null };
}

interface ModerationForumPost {
  id: string;
  title: string;
  content: string;
  category: string | null;
  branch: string | null;
  semester: number | null;
  upvotes: number;
  createdAt: string;
  author?: { fullName?: string | null; email?: string | null };
  _count?: { replies: number };
}

interface CampusFacilityItem {
  id: string;
  category: string;
  name: string;
  building: string | null;
  description: string;
  inCharge: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
}

export function AdminConsoleClient({ currentAdminId }: { currentAdminId: string }) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const showToast = useCallback((text: string, isError = false) => {
    setStatusMessage({ text, isError });
    setTimeout(() => setStatusMessage(null), 4500);
  }, []);

  // 1. Overview state
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(false);

  // 2. Users state (real Neon DB + Clerk, zero mocks)
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [userCounts, setUserCounts] = useState({ total: 0, admin: 0, faculty: 0, student: 0 });
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | 'ADMIN' | 'FACULTY' | 'STUDENT'>('ALL');
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // 3. Notices state
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loadingNotices, setLoadingNotices] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'EXAM' | 'ACADEMIC' | 'URGENT' | 'EVENT'>('ACADEMIC');
  const [noticeBranch, setNoticeBranch] = useState('ALL');
  const [noticePinned, setNoticePinned] = useState(false);
  const [savingNotice, setSavingNotice] = useState(false);

  // 4. Moderation state
  const [modNotes, setModNotes] = useState<ModerationNote[]>([]);
  const [modForumPosts, setModForumPosts] = useState<ModerationForumPost[]>([]);
  const [loadingMod, setLoadingMod] = useState(false);

  // 5. Directory state
  const [facilities, setFacilities] = useState<CampusFacilityItem[]>([]);
  const [loadingDir, setLoadingDir] = useState(false);
  const [examDate, setExamDate] = useState('2026-12-04T10:00');
  const [editingFacilityId, setEditingFacilityId] = useState<string | null>(null);
  const [facCategory, setFacCategory] = useState('department');
  const [facName, setFacName] = useState('');
  const [facBuilding, setFacBuilding] = useState('');
  const [facInCharge, setFacInCharge] = useState('');
  const [facPhone, setFacPhone] = useState('');
  const [facEmail, setFacEmail] = useState('');
  const [facDesc, setFacDesc] = useState('');
  const [savingFac, setSavingFac] = useState(false);

  // 6. Audit Logs state
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditActionFilter, setAuditActionFilter] = useState('ALL');
  const [loadingAudit, setLoadingAudit] = useState(false);

  // Sync hash navigation (#users, #audit, etc.)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace('#', '') as AdminTab;
    if (['overview', 'users', 'notices', 'moderation', 'directory', 'audit'].includes(hash)) {
      setActiveTab(hash);
    }
    const savedExam = localStorage.getItem('settech_exam_target_date');
    if (savedExam) setExamDate(savedExam);
  }, []);

  const fetchOverview = useCallback(async () => {
    setLoadingOverview(true);
    try {
      const res = await fetch('/api/admin/overview');
      if (res.ok) {
        const data = await res.json();
        setOverview(data);
      }
    } catch (e) {
      console.error('Overview load error:', e);
    } finally {
      setLoadingOverview(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams({
        q: userSearch,
        role: userRoleFilter,
        page: String(userPage),
        limit: '15',
      });
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setUserTotalPages(data.totalPages || 1);
        if (data.counts) setUserCounts(data.counts);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to load users', true);
      }
    } catch (e: any) {
      showToast(e?.message || 'Network error loading users', true);
    } finally {
      setLoadingUsers(false);
    }
  }, [userSearch, userRoleFilter, userPage, showToast]);

  const fetchNotices = useCallback(async () => {
    setLoadingNotices(true);
    try {
      const res = await fetch('/api/notices');
      if (res.ok) {
        const data = await res.json();
        setNotices(data.notices || []);
      }
    } finally {
      setLoadingNotices(false);
    }
  }, []);

  const fetchModeration = useCallback(async () => {
    setLoadingMod(true);
    try {
      const res = await fetch('/api/admin/moderation');
      if (res.ok) {
        const data = await res.json();
        setModNotes(data.notes || []);
        setModForumPosts(data.forumPosts || []);
      }
    } finally {
      setLoadingMod(false);
    }
  }, []);

  const fetchDirectory = useCallback(async () => {
    setLoadingDir(true);
    try {
      const res = await fetch('/api/admin/directory');
      if (res.ok) {
        const data = await res.json();
        setFacilities(data.facilities || []);
      }
    } finally {
      setLoadingDir(false);
    }
  }, []);

  const fetchAuditLogs = useCallback(async () => {
    setLoadingAudit(true);
    try {
      const params = new URLSearchParams({
        q: auditSearch,
        action: auditActionFilter,
      });
      const res = await fetch(`/api/admin/audit?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs || []);
      }
    } finally {
      setLoadingAudit(false);
    }
  }, [auditSearch, auditActionFilter]);

  useEffect(() => {
    if (activeTab === 'overview') fetchOverview();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'notices') fetchNotices();
    if (activeTab === 'moderation') fetchModeration();
    if (activeTab === 'directory') fetchDirectory();
    if (activeTab === 'audit') fetchAuditLogs();
  }, [activeTab, fetchOverview, fetchUsers, fetchNotices, fetchModeration, fetchDirectory, fetchAuditLogs]);

  // Role Change Handler
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to update role', true);
        fetchUsers();
      } else {
        showToast(`Role updated to ${newRole.toUpperCase()} across Neon DB & Clerk.`);
        fetchUsers();
      }
    } catch (err: any) {
      showToast(err?.message || 'Network error updating role', true);
      fetchUsers();
    }
  };

  // Notice Save Handler
  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;
    setSavingNotice(true);
    try {
      const url = editingNoticeId ? `/api/notices/${editingNoticeId}` : '/api/notices';
      const method = editingNoticeId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: noticeTitle,
          content: noticeContent,
          category: noticeCategory,
          targetBranch: noticeBranch,
          isPinned: noticePinned,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to save notice', true);
      } else {
        showToast(editingNoticeId ? 'Notice updated successfully.' : 'Official notice published.');
        setEditingNoticeId(null);
        setNoticeTitle('');
        setNoticeContent('');
        setNoticeCategory('ACADEMIC');
        setNoticeBranch('ALL');
        setNoticePinned(false);
        fetchNotices();
      }
    } finally {
      setSavingNotice(false);
    }
  };

  const handleTogglePinNotice = async (notice: NoticeItem) => {
    try {
      const res = await fetch(`/api/notices/${notice.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !notice.isPinned }),
      });
      if (res.ok) {
        showToast(notice.isPinned ? 'Notice unpinned.' : 'Notice pinned to top.');
        fetchNotices();
      }
    } catch {}
  };

  const handleDeleteNotice = async (id: string) => {
    try {
      const res = await fetch(`/api/notices/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Notice deleted.');
        fetchNotices();
      }
    } catch {}
  };

  // Moderation Handler
  const handleModerate = async (
    type: 'note' | 'forum',
    id: string,
    action: 'verify' | 'unverify' | 'delete'
  ) => {
    try {
      const res = await fetch('/api/admin/moderation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Moderation failed', true);
      } else {
        showToast(`Moderation action (${action}) completed and logged.`);
        fetchModeration();
      }
    } catch (e: any) {
      showToast(e?.message || 'Network error', true);
    }
  };

  // Directory Save Handler
  const handleSaveFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facName.trim() || !facDesc.trim()) return;
    setSavingFac(true);
    try {
      const res = await fetch('/api/admin/directory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingFacilityId,
          category: facCategory,
          name: facName,
          building: facBuilding,
          inCharge: facInCharge,
          contactPhone: facPhone,
          contactEmail: facEmail,
          description: facDesc,
        }),
      });
      if (res.ok) {
        showToast(editingFacilityId ? 'Directory entry updated.' : 'Directory entry added.');
        setEditingFacilityId(null);
        setFacName('');
        setFacBuilding('');
        setFacInCharge('');
        setFacPhone('');
        setFacEmail('');
        setFacDesc('');
        fetchDirectory();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to save directory entry', true);
      }
    } finally {
      setSavingFac(false);
    }
  };

  const handleDeleteFacility = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/directory?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('Directory entry removed.');
        fetchDirectory();
      }
    } catch {}
  };

  const handleSaveExamDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('settech_exam_target_date', examDate);
    }
    showToast('MAKAUT Exam target date updated.');
  };

  const tabs: Array<{ id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'overview', label: 'Overview & Pulse', icon: Activity },
    { id: 'users', label: 'User & Role Manager', icon: Users },
    { id: 'notices', label: 'Notices & Circulars', icon: Bell },
    { id: 'moderation', label: 'Moderation Queue', icon: BookOpen },
    { id: 'lectures', label: 'Course Lectures (NPTEL)', icon: PlayCircle },
    { id: 'directory', label: 'Campus & HOD Directory', icon: Building2 },
    { id: 'audit', label: 'System Audit Logs', icon: ShieldCheck },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E4E4E7]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-sans whitespace-nowrap transition-all inline-flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#09090B] text-white shadow-2xs'
                  : 'bg-white text-zinc-600 border border-[#E4E4E7] hover:bg-zinc-50 hover:text-[#09090B]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Global Toast */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-sans flex items-center justify-between ${
            statusMessage.isError
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.isError ? (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-[11px] font-mono underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* =========================================================================
          TAB 1: OVERVIEW & SYSTEM PULSE
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 shadow-xs space-y-1.5">
              <div className="text-[11px] font-mono text-zinc-500 uppercase">Total Students</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-[#09090B]">
                {overview ? overview.kpis.totalStudents : '—'}
              </div>
              <div className="text-[11px] text-blue-600 font-mono">Registered in Neon DB</div>
            </div>

            <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 shadow-xs space-y-1.5">
              <div className="text-[11px] font-mono text-zinc-500 uppercase">Active Faculty</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-[#09090B]">
                {overview ? overview.kpis.activeFaculty : '—'}
              </div>
              <div className="text-[11px] text-emerald-700 font-mono">
                +{overview ? overview.kpis.totalAdmins : 0} Super Admins
              </div>
            </div>

            <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 shadow-xs space-y-1.5">
              <div className="text-[11px] font-mono text-zinc-500 uppercase">Verified Notes &amp; PYQs</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-[#09090B]">
                {overview ? overview.kpis.verifiedNotes : '—'}
              </div>
              <div className="text-[11px] text-amber-700 font-mono">
                {overview ? overview.kpis.pendingNotes : 0} pending review
              </div>
            </div>

            <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 shadow-xs space-y-1.5">
              <div className="text-[11px] font-mono text-zinc-500 uppercase">Forum Threads</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-[#09090B]">
                {overview ? overview.kpis.totalForumPosts : '—'}
              </div>
              <div className="text-[11px] text-purple-700 font-mono">
                {overview ? overview.kpis.totalNotices : 0} active notices
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Recent Activity Feed */}
            <div className="lg:col-span-8 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div>
                  <h2 className="text-sm font-bold text-[#09090B]">Recent Administrative Activity</h2>
                  <p className="text-xs text-zinc-500">Live events persisted in Neon PostgreSQL</p>
                </div>
                <button
                  onClick={fetchOverview}
                  className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                  title="Refresh"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingOverview ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {!overview || overview.recentAuditLogs.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                  No audit events recorded yet. Role changes, notices, and moderation actions will appear here.
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {overview.recentAuditLogs.map((log) => (
                    <div key={log.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-mono text-[10px] font-bold">
                            {log.action}
                          </span>
                          <span className="font-semibold text-[#09090B] truncate">{log.target}</span>
                        </div>
                        <p className="text-zinc-500 text-[11px] truncate">{log.details} • by {log.actor}</p>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 shrink-0 tabular-nums">
                        {new Date(log.createdAt).toLocaleString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Infrastructure Sync Health */}
            <div className="lg:col-span-4 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="pb-3 border-b border-zinc-100">
                <h2 className="text-sm font-bold text-[#09090B]">Clerk &amp; Neon Sync Health</h2>
                <p className="text-xs text-zinc-500">Zero-Trust RBAC Infrastructure</p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-emerald-700" />
                    <div>
                      <div className="text-xs font-bold text-emerald-950">Neon PostgreSQL</div>
                      <div className="text-[10px] font-mono text-emerald-700">Prisma ORM Pooled</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold uppercase">
                    {overview?.health.neonDb || 'connected'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-blue-700" />
                    <div>
                      <div className="text-xs font-bold text-blue-950">Clerk Auth &amp; RBAC</div>
                      <div className="text-[10px] font-mono text-blue-700">Auto-Heal + Metadata Sync</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono text-[10px] font-bold uppercase">
                    {overview?.health.clerkAuth || 'connected'}
                  </span>
                </div>
              </div>

              {overview && overview.recentUsers.length > 0 && (
                <div className="pt-2 space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                    Newest Registered Accounts
                  </div>
                  {overview.recentUsers.map((ru) => (
                    <div key={ru.id} className="flex items-center justify-between text-xs py-1 border-b border-zinc-50 last:border-0">
                      <span className="truncate font-medium text-zinc-800 max-w-[160px]">{ru.fullName || ru.email}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                        {ru.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: USER & ROLE MANAGER (REAL NEON DB + CLERK)
          ========================================================================= */}
      {activeTab === 'users' && (
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#E4E4E7]">
            <div>
              <h2 className="text-base font-bold text-[#09090B]">Registered Users &amp; RBAC Clearance</h2>
              <p className="text-xs text-zinc-500">
                Live directory from Neon PostgreSQL &amp; Clerk ({userCounts.total} total accounts). Role updates sync both databases immediately.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setUserPage(1);
                  }}
                  placeholder="Search name, email, roll..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs text-[#09090B] focus:outline-hidden focus:border-[#2563EB] w-56"
                />
              </div>
              <button
                onClick={fetchUsers}
                className="p-2 rounded-xl border border-[#E4E4E7] text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                title="Refresh"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Role Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(['ALL', 'ADMIN', 'FACULTY', 'STUDENT'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setUserRoleFilter(r);
                  setUserPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-[11px] font-mono font-semibold border transition-colors cursor-pointer ${
                  userRoleFilter === r
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                {r} (
                {r === 'ALL'
                  ? userCounts.total
                  : r === 'ADMIN'
                  ? userCounts.admin
                  : r === 'FACULTY'
                  ? userCounts.faculty
                  : userCounts.student}
                )
              </button>
            ))}
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E4E4E7] text-[11px] font-mono text-zinc-500 uppercase">
                  <th className="py-2.5 px-3">Member</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3 text-right">Assign Clearance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7]">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500">
                      {loadingUsers ? 'Loading registered accounts...' : 'No matching accounts found.'}
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const isCurrentAdmin = u.id === currentAdminId || u.clerkId === currentAdminId;
                    return (
                      <tr key={u.id} className="hover:bg-zinc-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-[#09090B] font-sans">{u.fullName}</div>
                          <div className="text-[10px] font-mono text-zinc-500">{u.department}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-zinc-600">{u.email}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                              u.onboardingCompleted
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {u.onboardingCompleted ? 'Active' : 'Onboarding'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                              u.role === 'admin'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : u.role === 'faculty'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-zinc-100 text-[#09090B] border-zinc-200'
                            }`}
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <select
                            value={u.role.toLowerCase()}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                            disabled={isCurrentAdmin}
                            className="px-2.5 py-1 rounded-lg bg-white border border-[#E4E4E7] text-xs font-mono font-medium text-[#09090B] focus:outline-hidden focus:border-[#2563EB] cursor-pointer disabled:bg-zinc-100 disabled:cursor-not-allowed"
                          >
                            <option value="student">STUDENT</option>
                            <option value="faculty">FACULTY</option>
                            <option value="admin">ADMIN</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {userTotalPages > 1 && (
            <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-xs font-mono text-zinc-500">
              <span>
                Page {userPage} of {userTotalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={userPage <= 1}
                  onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-zinc-200 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={userPage >= userTotalPages}
                  onClick={() => setUserPage((p) => Math.min(userTotalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-zinc-200 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: NOTICES & ANNOUNCEMENTS MANAGER
          ========================================================================= */}
      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Publish / Edit Form */}
          <div className="lg:col-span-5 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 h-fit">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h2 className="text-sm font-bold text-[#09090B]">
                {editingNoticeId ? 'Edit Official Notice' : 'Publish Official SETGOI Notice'}
              </h2>
              {editingNoticeId && (
                <button
                  onClick={() => {
                    setEditingNoticeId(null);
                    setNoticeTitle('');
                    setNoticeContent('');
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-900 inline-flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSaveNotice} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">Notice Title</label>
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. MAKAUT Odd Sem Form Fill-up Deadline"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs text-[#09090B] focus:outline-hidden focus:border-[#2563EB]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">Category</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono text-[#09090B]"
                  >
                    <option value="ACADEMIC">Academic</option>
                    <option value="EXAM">Exam</option>
                    <option value="URGENT">Urgent</option>
                    <option value="EVENT">Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">Target Branch</label>
                  <select
                    value={noticeBranch}
                    onChange={(e) => setNoticeBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono text-[#09090B]"
                  >
                    <option value="ALL">ALL B.Tech</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EE">EE</option>
                    <option value="ME">ME</option>
                    <option value="CE">CE</option>
                    <option value="IT">IT</option>
                    <option value="AIML">AIML</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">Circular Details</label>
                <textarea
                  rows={4}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="Enter full notice text, dates, or instructions..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs text-[#09090B] focus:outline-hidden focus:border-[#2563EB]"
                  required
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={noticePinned}
                  onChange={(e) => setNoticePinned(e.target.checked)}
                  className="rounded border-zinc-300"
                />
                <span>Pin this notice to top of Student &amp; Campus dashboards</span>
              </label>

              <button
                type="submit"
                disabled={savingNotice}
                className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{savingNotice ? 'Saving...' : editingNoticeId ? 'Update Notice' : 'Publish Official Notice'}</span>
              </button>
            </form>
          </div>

          {/* Live Notices List */}
          <div className="lg:col-span-7 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h2 className="text-sm font-bold text-[#09090B]">Published Circulars ({notices.length})</h2>
                <p className="text-xs text-zinc-500">Live in Neon DB &amp; visible to students</p>
              </div>
              <button onClick={fetchNotices} className="p-1.5 rounded-lg border border-zinc-200 cursor-pointer">
                <RefreshCw className={`w-3.5 h-3.5 ${loadingNotices ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {notices.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                No notices published yet. Use the form on the left to publish your first circular.
              </div>
            ) : (
              <div className="space-y-3">
                {notices.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-xl border space-y-2 ${
                      n.isPinned ? 'bg-amber-50/40 border-amber-200' : 'bg-zinc-50/60 border-zinc-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-200/70 text-zinc-800">
                            {n.category}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200">
                            {n.targetBranch}
                          </span>
                          {n.isPinned && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200 text-amber-900">
                              PINNED
                            </span>
                          )}
                        </div>
                        <h3 className="text-xs font-bold text-[#09090B]">{n.title}</h3>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleTogglePinNotice(n)}
                          className="p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-zinc-200 text-zinc-600 cursor-pointer"
                          title={n.isPinned ? 'Unpin' : 'Pin to top'}
                        >
                          {n.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => {
                            setEditingNoticeId(n.id);
                            setNoticeTitle(n.title);
                            setNoticeContent(n.content);
                            setNoticeCategory((n.category as any) || 'ACADEMIC');
                            setNoticeBranch(n.targetBranch || 'ALL');
                            setNoticePinned(n.isPinned);
                          }}
                          className="p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-zinc-200 text-zinc-600 cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteNotice(n.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">{n.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: CONTENT & FORUM MODERATION QUEUE
          ========================================================================= */}
      {activeTab === 'moderation' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Uploaded Notes & PYQs */}
          <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h2 className="text-sm font-bold text-[#09090B]">Notes &amp; PYQ Moderation ({modNotes.length})</h2>
                <p className="text-xs text-zinc-500">Approve, unverify, or remove uploaded resources</p>
              </div>
              <button onClick={fetchModeration} className="p-1.5 rounded-lg border border-zinc-200 cursor-pointer">
                <RefreshCw className={`w-3.5 h-3.5 ${loadingMod ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {modNotes.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                No uploaded notes in database yet.
              </div>
            ) : (
              <div className="space-y-3">
                {modNotes.map((note) => (
                  <div key={note.id} className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-[#2563EB] font-mono text-[10px] font-bold">
                            {note.subjectCode}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {note.branch} • Sem {note.semester}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              note.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {note.verified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-[#09090B] mt-1">{note.title}</div>
                        <div className="text-[10px] font-mono text-zinc-500">
                          By {note.uploader?.fullName || note.uploader?.email || 'Student'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleModerate('note', note.id, note.verified ? 'unverify' : 'verify')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                          note.verified
                            ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {note.verified ? 'Revoke Verification' : 'Approve & Verify'}
                      </button>
                      <button
                        onClick={() => handleModerate('note', note.id, 'delete')}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-semibold cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Forum Threads */}
          <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h2 className="text-sm font-bold text-[#09090B]">Campus Forum Threads ({modForumPosts.length})</h2>
                <p className="text-xs text-zinc-500">Review Q&amp;A threads and remove spam</p>
              </div>
              <MessageSquare className="w-4 h-4 text-zinc-400" />
            </div>

            {modForumPosts.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                No forum threads in database yet.
              </div>
            ) : (
              <div className="space-y-3">
                {modForumPosts.map((post) => (
                  <div key={post.id} className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-800 font-bold">
                            {post.category || 'Academic'}
                          </span>
                          <span>{post._count?.replies || 0} replies</span>
                          <span>• {post.upvotes} upvotes</span>
                        </div>
                        <div className="text-xs font-semibold text-[#09090B] mt-1">{post.title}</div>
                        <p className="text-[11px] text-zinc-600 line-clamp-2 mt-0.5">{post.content}</p>
                        <div className="text-[10px] font-mono text-zinc-400 mt-1">
                          Author: {post.author?.fullName || post.author?.email || 'Member'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleModerate('forum', post.id, 'delete')}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 shrink-0 cursor-pointer"
                        title="Remove thread"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4B: COURSE LECTURES (SWAYAM / NPTEL)
          ========================================================================= */}
      {activeTab === 'lectures' && <CourseLectureManager />}

      {/* =========================================================================
          TAB 5: CAMPUS & HOD DIRECTORY MANAGER
          ========================================================================= */}
      {activeTab === 'directory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 space-y-5">
            {/* Exam Countdown Setter */}
            <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 shadow-xs space-y-3">
              <h2 className="text-sm font-bold text-[#09090B] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#2563EB]" />
                <span>MAKAUT Exam Countdown Target</span>
              </h2>
              <form onSubmit={handleSaveExamDate} className="flex items-center gap-2">
                <input
                  type="datetime-local"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
                  required
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-[#09090B] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </form>
            </div>

            {/* Add / Edit HOD or Helpline */}
            <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <h2 className="text-sm font-bold text-[#09090B]">
                  {editingFacilityId ? 'Edit Directory Entry' : 'Add HOD / Helpline Contact'}
                </h2>
                {editingFacilityId && (
                  <button
                    onClick={() => {
                      setEditingFacilityId(null);
                      setFacName('');
                      setFacDesc('');
                    }}
                    className="text-xs text-zinc-500 underline"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveFacility} className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 mb-1">Category</label>
                    <select
                      value={facCategory}
                      onChange={(e) => setFacCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
                    >
                      <option value="department">Department / HOD</option>
                      <option value="emergency">Helpline / SOS</option>
                      <option value="hostel">Hostel / Block</option>
                      <option value="bus">Campus Transport</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 mb-1">Building / Cabin</label>
                    <input
                      type="text"
                      value={facBuilding}
                      onChange={(e) => setFacBuilding(e.target.value)}
                      placeholder="e.g. Block B, Room 204"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">Department / Facility Name</label>
                  <input
                    type="text"
                    value={facName}
                    onChange={(e) => setFacName(e.target.value)}
                    placeholder="e.g. CSE Department Office"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 mb-1">HOD / In-Charge</label>
                    <input
                      type="text"
                      value={facInCharge}
                      onChange={(e) => setFacInCharge(e.target.value)}
                      placeholder="Prof. Name"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={facPhone}
                      onChange={(e) => setFacPhone(e.target.value)}
                      placeholder="+91 94340 ..."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={facEmail}
                    onChange={(e) => setFacEmail(e.target.value)}
                    placeholder="hod.cse@setgoi.ac.in"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">Description / Office Hours</label>
                  <textarea
                    rows={2}
                    value={facDesc}
                    onChange={(e) => setFacDesc(e.target.value)}
                    placeholder="Mon–Fri 10:00 AM – 4:30 PM..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingFac}
                  className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{savingFac ? 'Saving...' : editingFacilityId ? 'Update Entry' : 'Save Directory Entry'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Saved Directory Entries */}
          <div className="lg:col-span-7 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h2 className="text-sm font-bold text-[#09090B]">Neon DB Campus Directory ({facilities.length})</h2>
                <p className="text-xs text-zinc-500">HOD cabins, blocks &amp; official helplines</p>
              </div>
              <button onClick={fetchDirectory} className="p-1.5 rounded-lg border border-zinc-200 cursor-pointer">
                <RefreshCw className={`w-3.5 h-3.5 ${loadingDir ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {facilities.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                No custom directory entries in Neon DB yet. Add department HODs or helpline contacts on the left.
              </div>
            ) : (
              <div className="space-y-2.5">
                {facilities.map((f) => (
                  <div key={f.id} className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-zinc-200/70 text-zinc-800 font-mono text-[10px] uppercase font-bold">
                          {f.category}
                        </span>
                        <span className="text-xs font-bold text-[#09090B]">{f.name}</span>
                      </div>
                      <div className="text-[11px] font-mono text-zinc-600">
                        {f.inCharge && <span>HOD/In-Charge: {f.inCharge} • </span>}
                        {f.building && <span>{f.building} • </span>}
                        {f.contactPhone && <span>{f.contactPhone}</span>}
                      </div>
                      <p className="text-xs text-zinc-500">{f.description}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingFacilityId(f.id);
                          setFacCategory(f.category);
                          setFacName(f.name);
                          setFacBuilding(f.building || '');
                          setFacInCharge(f.inCharge || '');
                          setFacPhone(f.contactPhone || '');
                          setFacEmail(f.contactEmail || '');
                          setFacDesc(f.description);
                        }}
                        className="p-1.5 rounded-lg hover:bg-white text-zinc-600 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteFacility(f.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: SYSTEM AUDIT LOGS
          ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4E4E7]">
            <div>
              <h2 className="text-base font-bold text-[#09090B]">System Audit Logs</h2>
              <p className="text-xs text-zinc-500">
                Searchable, immutable record of role changes, notice publications, and moderation actions.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  placeholder="Search actor, target, details..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs w-56"
                />
              </div>
              <select
                value={auditActionFilter}
                onChange={(e) => setAuditActionFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
              >
                <option value="ALL">ALL ACTIONS</option>
                <option value="ROLE_CHANGE">ROLE_CHANGE</option>
                <option value="NOTICE_PUBLISHED">NOTICE_PUBLISHED</option>
                <option value="NOTICE_UPDATED">NOTICE_UPDATED</option>
                <option value="NOTICE_DELETED">NOTICE_DELETED</option>
                <option value="NOTE_VERIFIED">NOTE_VERIFIED</option>
                <option value="FORUM_MODERATED">FORUM_MODERATED</option>
                <option value="DIRECTORY_UPDATED">DIRECTORY_UPDATED</option>
              </select>
              <button onClick={fetchAuditLogs} className="p-2 rounded-xl border border-zinc-200 cursor-pointer">
                <RefreshCw className={`w-3.5 h-3.5 ${loadingAudit ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E4E4E7] text-[11px] font-mono text-zinc-500 uppercase">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Actor</th>
                  <th className="py-2.5 px-3">Target</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7]">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500">
                      {loadingAudit ? 'Loading audit trail...' : 'No audit log entries match your filter.'}
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((entry) => (
                    <tr key={entry.id} className="hover:bg-zinc-50/70">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-500 whitespace-nowrap tabular-nums">
                        {new Date(entry.createdAt).toLocaleString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-200 font-mono text-[10px] font-bold">
                          {entry.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-zinc-700">{entry.actor}</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-900 font-medium">{entry.target}</td>
                      <td className="py-2.5 px-3 text-zinc-600">{entry.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
