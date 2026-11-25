'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  BookOpen,
  Calendar,
  ShieldCheck,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Pin,
  PinOff,
  Lock,
  Unlock,
  Trash2,
  Plus,
  Send,
  Sparkles,
  Save,
  Star,
} from 'lucide-react';
import { UserRole } from '@/lib/rbac';
import { SYLLABUS_BRANCHES } from '@/lib/makaut-syllabus';
import { AdminSyllabusManager } from '@/components/AdminSyllabusManager';

type AdminTab = 'users' | 'syllabus' | 'schedule' | 'governance';

interface ManagedUser {
  id: string;
  clerkId: string;
  fullName: string;
  email: string;
  role: UserRole;
  department: string;
  branch?: string | null;
  semester?: number | null;
  studentId?: string;
}

interface OverviewKPIs {
  totalStudents: number;
  activeFaculty: number;
  totalAdmins: number;
  totalNotes: number;
  verifiedNotes: number;
  totalForumPosts: number;
  totalNotices: number;
}

interface AuditEntry {
  id: string;
  actorId: string;
  actor: string;
  actorEmail?: string | null;
  actorRole?: string | null;
  action: string;
  target: string;
  targetType?: string | null;
  targetLabel?: string | null;
  details: string;
  createdAt: string;
}

interface NoticeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  targetBranch: string;
  examDate?: string | null;
  isPinned: boolean;
  createdAt: string;
}

interface CampusEventItem {
  id: string;
  title: string;
  category: string;
  dateLabel: string;
  venue: string;
  description: string;
  isFeatured: boolean;
  createdAt: string;
}

interface ModerationForumPost {
  id: string;
  title: string;
  category: string | null;
  branch: string | null;
  isPinned: boolean;
  isLocked: boolean;
  isResolved: boolean;
  createdAt: string;
  author?: { fullName?: string | null; email?: string | null; role?: string | null };
  _count?: { replies: number };
}

export function AdminConsoleClient({ currentAdminId }: { currentAdminId: string }) {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [toast, setToast] = useState<{ text: string; isError?: boolean } | null>(null);

  const showToast = useCallback((text: string, isError = false) => {
    setToast({ text, isError });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // KPIs
  const [kpis, setKpis] = useState<OverviewKPIs>({
    totalStudents: 0,
    activeFaculty: 0,
    totalAdmins: 0,
    totalNotes: 0,
    verifiedNotes: 0,
    totalForumPosts: 0,
    totalNotices: 0,
  });

  // Tab 1: Users & Department Roles
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'STUDENT' | 'FACULTY' | 'ADMIN'>('ALL');
  const [userEdits, setUserEdits] = useState<Record<string, { role: UserRole; department: string }>>({});
  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  // Tab 3: Notices, Exam Countdown & Campus Events
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'EXAM' | 'ACADEMIC' | 'URGENT'>('EXAM');
  const [noticeBranch, setNoticeBranch] = useState('ALL');
  const [noticeExamDate, setNoticeExamDate] = useState('');
  const [noticePinned, setNoticePinned] = useState(true);
  const [publishingNotice, setPublishingNotice] = useState(false);

  const [events, setEvents] = useState<CampusEventItem[]>([]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<'TECHFEST' | 'WORKSHOP' | 'SEMINAR' | 'CULTURAL'>('TECHFEST');
  const [eventDateLabel, setEventDateLabel] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventFeatured, setEventFeatured] = useState(true);
  const [publishingEvent, setPublishingEvent] = useState(false);

  // Tab 4: Forum Moderation & Audit Logs
  const [forumPosts, setForumPosts] = useState<ModerationForumPost[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [auditSearch, setAuditSearch] = useState('');
  const [loadingGov, setLoadingGov] = useState(false);

  const loadOverview = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/overview');
      const data = await res.json();
      if (data.success && data.kpis) {
        setKpis(data.kpis);
      }
    } catch {}
  }, []);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams();
      if (userSearch.trim()) params.set('q', userSearch.trim());
      if (roleFilter !== 'ALL') params.set('role', roleFilter);
      params.set('limit', '50');
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        const list: ManagedUser[] = data.users || [];
        setUsers(list);
        const initialEdits: Record<string, { role: UserRole; department: string }> = {};
        for (const u of list) {
          const deptMatch = SYLLABUS_BRANCHES.find((b) =>
            String(u.department || u.branch || '').toUpperCase().includes(b.code)
          );
          initialEdits[u.id] = {
            role: u.role,
            department: deptMatch?.code || u.branch || 'CSE',
          };
        }
        setUserEdits(initialEdits);
      }
    } catch {
      showToast('Failed to load user directory.', true);
    } finally {
      setLoadingUsers(false);
    }
  }, [userSearch, roleFilter, showToast]);

  const loadScheduleAndEvents = useCallback(async () => {
    try {
      const [noticesRes, eventsRes] = await Promise.all([
        fetch('/api/notices'),
        fetch('/api/events'),
      ]);
      const [noticesJson, eventsJson] = await Promise.all([
        noticesRes.json(),
        eventsRes.json(),
      ]);
      if (noticesJson.success) setNotices(noticesJson.notices || []);
      if (eventsJson.success) setEvents(eventsJson.events || []);
    } catch {
      showToast('Failed to load notices and events.', true);
    }
  }, [showToast]);

  const loadGovernance = useCallback(async () => {
    setLoadingGov(true);
    try {
      const [modRes, auditRes] = await Promise.all([
        fetch('/api/admin/moderation'),
        fetch(`/api/admin/audit?q=${encodeURIComponent(auditSearch.trim())}`),
      ]);
      const [modJson, auditJson] = await Promise.all([modRes.json(), auditRes.json()]);
      if (modJson.success) setForumPosts(modJson.forumPosts || []);
      if (auditJson.success) setAuditLogs(auditJson.logs || []);
    } catch {
      showToast('Failed to load forum moderation & audit logs.', true);
    } finally {
      setLoadingGov(false);
    }
  }, [auditSearch, showToast]);

  useEffect(() => {
    loadOverview();
    loadUsers();
  }, [loadOverview, loadUsers]);

  useEffect(() => {
    if (activeTab === 'schedule') loadScheduleAndEvents();
    if (activeTab === 'governance') loadGovernance();
  }, [activeTab, loadScheduleAndEvents, loadGovernance]);

  const handleSaveUserGovernance = async (userId: string) => {
    const edit = userEdits[userId];
    if (!edit) return;
    setSavingUserId(userId);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: edit.role, department: edit.department }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to update user role.', true);
        return;
      }
      showToast(data.message || 'User role & department updated.');
      loadUsers();
      loadOverview();
    } catch {
      showToast('Network error updating user governance.', true);
    } finally {
      setSavingUserId(null);
    }
  };

  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      showToast('Notice title and content are required.', true);
      return;
    }
    setPublishingNotice(true);
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: noticeTitle.trim(),
          content: noticeContent.trim(),
          category: noticeCategory,
          targetBranch: noticeBranch,
          examDate: noticeExamDate || null,
          isPinned: noticePinned,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to publish notice.', true);
        return;
      }
      showToast('Notice & exam schedule published.');
      setNoticeTitle('');
      setNoticeContent('');
      setNoticeExamDate('');
      loadScheduleAndEvents();
      loadOverview();
    } catch {
      showToast('Network error publishing notice.', true);
    } finally {
      setPublishingNotice(false);
    }
  };

  const handleToggleNoticePin = async (notice: NoticeItem) => {
    const res = await fetch(`/api/notices/${notice.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPinned: !notice.isPinned }),
    });
    if (res.ok) {
      showToast(notice.isPinned ? 'Notice unpinned.' : 'Notice pinned.');
      loadScheduleAndEvents();
    }
  };

  const handleDeleteNotice = async (id: string) => {
    const res = await fetch(`/api/notices/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Notice deleted.');
      loadScheduleAndEvents();
      loadOverview();
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDateLabel.trim() || !eventVenue.trim() || !eventDescription.trim()) {
      showToast('Fill in event title, date, venue, and description.', true);
      return;
    }
    setPublishingEvent(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventTitle.trim(),
          category: eventCategory,
          dateLabel: eventDateLabel.trim(),
          venue: eventVenue.trim(),
          description: eventDescription.trim(),
          isFeatured: eventFeatured,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to publish event.', true);
        return;
      }
      showToast('Campus event published to /tools.');
      setEventTitle('');
      setEventDateLabel('');
      setEventVenue('');
      setEventDescription('');
      loadScheduleAndEvents();
    } catch {
      showToast('Network error publishing event.', true);
    } finally {
      setPublishingEvent(false);
    }
  };

  const handleToggleEventFeature = async (ev: CampusEventItem) => {
    const res = await fetch('/api/events', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: ev.id, isFeatured: !ev.isFeatured }),
    });
    if (res.ok) {
      showToast(ev.isFeatured ? 'Removed featured flag.' : 'Event featured.');
      loadScheduleAndEvents();
    }
  };

  const handleDeleteEvent = async (id: string) => {
    const res = await fetch(`/api/events?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Event deleted.');
      loadScheduleAndEvents();
    }
  };

  const handleForumModerate = async (
    id: string,
    action: 'pin' | 'unpin' | 'lock' | 'unlock' | 'delete'
  ) => {
    try {
      const res = await fetch('/api/admin/moderation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'forum', id, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Moderation failed.', true);
        return;
      }
      showToast(`Forum thread ${action}ed.`);
      loadGovernance();
    } catch {
      showToast('Network error moderating thread.', true);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 px-4 py-3 rounded-xl border shadow-lg text-xs font-medium flex items-center gap-2 ${
            toast.isError
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          {toast.isError ? (
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Swiss KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E4E4E7] rounded-xl p-4">
          <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            Students / Faculty
          </p>
          <p className="text-2xl font-bold text-[#09090B] mt-1 font-mono">
            {kpis.totalStudents} / {kpis.activeFaculty}
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5">{kpis.totalAdmins} Admin(s)</p>
        </div>
        <div className="bg-white border border-[#E4E4E7] rounded-xl p-4">
          <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            Notes Vault
          </p>
          <p className="text-2xl font-bold text-emerald-700 mt-1 font-mono">
            {kpis.verifiedNotes}/{kpis.totalNotes}
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Faculty verified</p>
        </div>
        <div className="bg-white border border-[#E4E4E7] rounded-xl p-4">
          <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            Forum Threads
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1 font-mono">
            {kpis.totalForumPosts}
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Active discussions</p>
        </div>
        <div className="bg-white border border-[#E4E4E7] rounded-xl p-4">
          <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            Official Notices
          </p>
          <p className="text-2xl font-bold text-[#09090B] mt-1 font-mono">
            {kpis.totalNotices}
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Campus announcements</p>
        </div>
      </div>

      {/* 4-Tab Segmented Navigation */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-1.5 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#09090B] text-white shadow-xs'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
          }`}
        >
          <Users className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Users & Dept Roles</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('syllabus')}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'syllabus'
              ? 'bg-[#09090B] text-white shadow-xs'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">8-Branch Syllabus</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'schedule'
              ? 'bg-[#09090B] text-white shadow-xs'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Exams, Notices & Events</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('governance')}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'governance'
              ? 'bg-[#09090B] text-white shadow-xs'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Forum & Audit Logs</span>
        </button>
      </div>

      {/* TAB 1: Users & Department Roles */}
      {activeTab === 'users' && (
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#09090B]">
                Users & SETGOI Department Role Management
              </h2>
              <p className="text-xs text-zinc-500">
                Assign STUDENT, FACULTY, or ADMIN clearance and SETGOI department across Neon DB &amp; Clerk.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search name or email..."
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] text-xs text-zinc-900 w-52"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] text-xs font-medium text-zinc-800"
              >
                <option value="ALL">All Roles</option>
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button
                type="button"
                onClick={loadUsers}
                className="p-1.5 rounded-lg border border-[#E4E4E7] text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-[#E4E4E7] rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#E4E4E7] text-[11px] font-mono uppercase text-zinc-500">
                  <th className="py-2.5 px-4">Member</th>
                  <th className="py-2.5 px-4">Role Clearance</th>
                  <th className="py-2.5 px-4">SETGOI Department</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7] text-xs">
                {users.map((u) => {
                  const edit = userEdits[u.id] || { role: u.role, department: 'CSE' };
                  const isSelf = u.clerkId === currentAdminId || u.id === currentAdminId;
                  return (
                    <tr key={u.id} className="hover:bg-[#FAFAFA]">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#09090B]">
                          {u.fullName}{' '}
                          {isSelf && (
                            <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-zinc-500">{u.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={edit.role}
                          disabled={isSelf}
                          onChange={(e) =>
                            setUserEdits((prev) => ({
                              ...prev,
                              [u.id]: { ...edit, role: e.target.value as UserRole },
                            }))
                          }
                          className="px-2.5 py-1.5 rounded-lg border border-[#E4E4E7] bg-white text-xs font-medium text-zinc-900 disabled:opacity-60"
                        >
                          <option value="student">STUDENT</option>
                          <option value="faculty">FACULTY</option>
                          <option value="admin">ADMIN</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={edit.department}
                          onChange={(e) =>
                            setUserEdits((prev) => ({
                              ...prev,
                              [u.id]: { ...edit, department: e.target.value },
                            }))
                          }
                          className="px-2.5 py-1.5 rounded-lg border border-[#E4E4E7] bg-white text-xs font-medium text-zinc-900"
                        >
                          {SYLLABUS_BRANCHES.map((b) => (
                            <option key={b.code} value={b.code}>
                              {b.code} — {b.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          disabled={savingUserId === u.id}
                          onClick={() => handleSaveUserGovernance(u.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#09090B] hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{savingUserId === u.id ? 'Saving...' : 'Save'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && !loadingUsers && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-zinc-500">
                      No matching users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: 8-Branch MAKAUT Syllabus Manager */}
      {activeTab === 'syllabus' && <AdminSyllabusManager />}

      {/* TAB 3: Exam Schedule, Notices & TechFest Events */}
      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Official Exam Schedule & Notices */}
          <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#09090B]">
                Official Exam Countdown &amp; Notices
              </h2>
              <p className="text-xs text-zinc-500">
                Set MAKAUT Theory/Practical exam dates and broadcast institution-wide priority notices.
              </p>
            </div>

            <form onSubmit={handlePublishNotice} className="space-y-3">
              <div className="grid grid-cols-3 gap-2.5">
                <select
                  value={noticeCategory}
                  onChange={(e) => setNoticeCategory(e.target.value as any)}
                  className="px-2.5 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs font-medium"
                >
                  <option value="EXAM">EXAM</option>
                  <option value="ACADEMIC">ACADEMIC</option>
                  <option value="URGENT">URGENT</option>
                </select>
                <select
                  value={noticeBranch}
                  onChange={(e) => setNoticeBranch(e.target.value)}
                  className="px-2.5 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs font-medium"
                >
                  <option value="ALL">All Branches</option>
                  {SYLLABUS_BRANCHES.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.code}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={noticeExamDate}
                  onChange={(e) => setNoticeExamDate(e.target.value)}
                  className="px-2.5 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs"
                  title="Official Exam Date"
                />
              </div>

              <input
                type="text"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                placeholder="e.g. MAKAUT Odd Semester Theory Exam Schedule"
                className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs"
                required
              />

              <textarea
                rows={3}
                value={noticeContent}
                onChange={(e) => setNoticeContent(e.target.value)}
                placeholder="Exam reporting guidelines, admit card instructions, or campus directive..."
                className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs"
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noticePinned}
                    onChange={(e) => setNoticePinned(e.target.checked)}
                  />
                  <span>Pin Priority Notice</span>
                </label>
                <button
                  type="submit"
                  disabled={publishingNotice}
                  className="px-4 py-2 rounded-xl bg-[#09090B] hover:bg-zinc-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{publishingNotice ? 'Publishing...' : 'Publish Notice'}</span>
                </button>
              </div>
            </form>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pt-2 border-t border-[#E4E4E7]">
              {notices.map((n) => (
                <div
                  key={n.id}
                  className="p-3 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-[#E4E4E7] font-semibold">
                        {n.category} • {n.targetBranch}
                      </span>
                      {n.examDate && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                          Exam: {new Date(n.examDate).toLocaleDateString('en-IN')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-[#09090B] truncate">{n.title}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleNoticePin(n)}
                      className="p-1.5 rounded-lg border border-[#E4E4E7] bg-white text-zinc-600 cursor-pointer"
                    >
                      {n.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteNotice(n.id)}
                      className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TechFest & Campus Events Manager */}
          <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-bold text-[#09090B]">
                  TechFest &amp; Campus Events (/tools)
                </h2>
              </div>
              <p className="text-xs text-zinc-500">
                Publish live campus events and workshops synced directly to /tools.
              </p>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value as any)}
                  className="px-2.5 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs font-medium"
                >
                  <option value="TECHFEST">TECHFEST</option>
                  <option value="WORKSHOP">WORKSHOP</option>
                  <option value="SEMINAR">SEMINAR</option>
                  <option value="CULTURAL">CULTURAL</option>
                </select>
                <input
                  type="text"
                  value={eventDateLabel}
                  onChange={(e) => setEventDateLabel(e.target.value)}
                  placeholder="Date e.g. Dec 12–13, 2026"
                  className="px-2.5 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Event Title e.g. SETGOI TechExpo 2026"
                  className="px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs"
                  required
                />
                <input
                  type="text"
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  placeholder="Venue e.g. Main Auditorium"
                  className="px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs"
                  required
                />
              </div>

              <textarea
                rows={3}
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Describe tracks, prizes, eligibility, or registration notes..."
                className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs"
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eventFeatured}
                    onChange={(e) => setEventFeatured(e.target.checked)}
                  />
                  <span>Feature on /tools</span>
                </label>
                <button
                  type="submit"
                  disabled={publishingEvent}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{publishingEvent ? 'Publishing...' : 'Add Campus Event'}</span>
                </button>
              </div>
            </form>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pt-2 border-t border-[#E4E4E7]">
              {events.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-4">
                  No custom events published yet.
                </p>
              ) : (
                events.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] flex items-start justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-[#E4E4E7] font-semibold">
                          {ev.category} • {ev.dateLabel}
                        </span>
                        {ev.isFeatured && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 font-semibold">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-[#09090B] truncate">{ev.title}</p>
                      <p className="text-[11px] text-zinc-500 truncate">{ev.venue}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleEventFeature(ev)}
                        className="p-1.5 rounded-lg border border-[#E4E4E7] bg-white text-amber-600 cursor-pointer"
                        title="Toggle Featured"
                      >
                        <Star className={`w-3.5 h-3.5 ${ev.isFeatured ? 'fill-amber-500' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 cursor-pointer"
                        title="Delete Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Forum Moderation & Audit Logs */}
      {activeTab === 'governance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Forum Thread Moderation */}
          <div className="lg:col-span-6 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#09090B]">Forum Thread Moderation</h2>
                <p className="text-xs text-zinc-500">
                  Pin, lock, or remove /forum threads with automatic AuditLog tracking.
                </p>
              </div>
              <button
                type="button"
                onClick={loadGovernance}
                className="p-1.5 rounded-lg border border-[#E4E4E7] text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingGov ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
              {forumPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-3.5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] flex items-start justify-between gap-3"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {post.isPinned && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 font-semibold">
                          Pinned
                        </span>
                      )}
                      {post.isLocked && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700 font-semibold">
                          Locked
                        </span>
                      )}
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-[#E4E4E7] text-zinc-600">
                        {post.category || 'Academic'} • {post._count?.replies || 0} replies
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#09090B] truncate">{post.title}</p>
                    <p className="text-[11px] text-zinc-500">
                      By {post.author?.fullName || post.author?.email || 'Student'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleForumModerate(post.id, post.isPinned ? 'unpin' : 'pin')}
                      className="p-1.5 rounded-lg border border-[#E4E4E7] bg-white hover:bg-zinc-100 text-zinc-700 cursor-pointer"
                      title={post.isPinned ? 'Unpin' : 'Pin'}
                    >
                      {post.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleForumModerate(post.id, post.isLocked ? 'unlock' : 'lock')}
                      className="p-1.5 rounded-lg border border-[#E4E4E7] bg-white hover:bg-zinc-100 text-zinc-700 cursor-pointer"
                      title={post.isLocked ? 'Unlock' : 'Lock'}
                    >
                      {post.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleForumModerate(post.id, 'delete')}
                      className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
                      title="Delete thread"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {forumPosts.length === 0 && (
                <p className="text-xs text-zinc-500 text-center py-8">No forum threads found.</p>
              )}
            </div>
          </div>

          {/* Immutable Audit Log Feed */}
          <div className="lg:col-span-6 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-[#09090B]">Immutable Audit Log</h2>
                <p className="text-xs text-zinc-500">
                  Chronological record of role changes, syllabus edits, notices, and deletions.
                </p>
              </div>
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Filter logs..."
                className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] text-xs w-40"
              />
            </div>

            <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#E4E4E7] font-semibold text-[#09090B]">
                      {log.action}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {new Date(log.createdAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#09090B]">
                    {log.targetLabel || log.target}
                  </p>
                  <p className="text-[11px] text-zinc-600">{log.details}</p>
                  <p className="text-[10px] font-mono text-zinc-400">
                    Actor: {log.actorEmail || log.actor} ({log.actorRole || 'ADMIN'})
                  </p>
                </div>
              ))}
              {auditLogs.length === 0 && (
                <p className="text-xs text-zinc-500 text-center py-8">No audit logs recorded.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
