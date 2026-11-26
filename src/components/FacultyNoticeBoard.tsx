'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Bell,
  Plus,
  Pin,
  PinOff,
  Edit3,
  Trash2,
  Calendar,
  Send,
  X,
  Eye,
  BookOpen,
} from 'lucide-react';
import { SYLLABUS_BRANCHES } from '@/lib/makaut-syllabus';

export interface NoticeBoardItem {
  id: string;
  title: string;
  content: string;
  category: string;
  subjectCode?: string | null;
  subjectName?: string | null;
  targetBranch: string;
  targetSemester?: number | null;
  targetBranches?: string[];
  targetSemesters?: number[];
  examDate?: string | null;
  eventDate?: string | null;
  isPinned: boolean;
  authorId: string;
  authorName?: string | null;
  authorRole?: string | null;
  authorDesignation?: string | null;
  createdAt: string;
  author?: { fullName?: string | null; role?: string | null; designation?: string | null };
}

interface ScopeItem {
  branch: string;
  semesters: number[];
  subjectCodes?: string[];
}

interface SyllabusSubjectOption {
  code: string;
  name: string;
  branch: string;
  semester: number;
}

const CATEGORY_LABELS: Record<string, { label: string; cls: string }> = {
  EXAM: { label: 'CA Exam', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  LAB_VIVA: { label: 'Lab Viva', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
  LAB: { label: 'Lab Viva', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
  ASSIGNMENT: { label: 'Assignment', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  ACADEMIC: { label: 'Academic', cls: 'bg-zinc-100 text-zinc-700 border-zinc-200' },
  URGENT: { label: 'Urgent', cls: 'bg-red-50 text-red-700 border-red-200' },
};

export function FacultyNoticeBoard({
  assignedScopes,
  isAdminUnrestricted,
  currentDbUserId,
  onToast,
}: {
  assignedScopes: ScopeItem[];
  isAdminUnrestricted: boolean;
  currentDbUserId?: string | null;
  onToast: (msg: string, isError?: boolean) => void;
}) {
  const [notices, setNotices] = useState<NoticeBoardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState<string>('ALL'); // 'ALL' | 'GENERAL' | subjectCode
  const [designatedSubjects, setDesignatedSubjects] = useState<SyllabusSubjectOption[]>([]);

  // Composer Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeBoardItem | null>(null);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('GENERAL');
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]); // "BRANCH::SEM"
  const [category, setCategory] = useState<string>('EXAM');
  const [eventDate, setEventDate] = useState<string>('');
  const [isPinned, setIsPinned] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // All (Branch, Semester) pairs available to this user
  const targetPairs = useMemo(() => {
    const pairs: Array<{ key: string; branch: string; semester: number }> = [];
    if (isAdminUnrestricted) {
      for (const b of SYLLABUS_BRANCHES) {
        for (const sem of [3, 4, 5, 6, 7, 8]) {
          pairs.push({ key: `${b.code}::${sem}`, branch: b.code, semester: sem });
        }
      }
      return pairs;
    }
    for (const s of assignedScopes) {
      for (const sem of s.semesters) {
        pairs.push({ key: `${s.branch}::${sem}`, branch: s.branch, semester: sem });
      }
    }
    return pairs;
  }, [assignedScopes, isAdminUnrestricted]);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notices');
      const data = await res.json();
      if (data.success) {
        setNotices(data.notices || []);
      }
    } catch {
      onToast('Failed to load notices.', true);
    } finally {
      setLoading(false);
    }
  }, [onToast]);

  // Fetch designated subjects from /api/syllabus for assignedScopes
  useEffect(() => {
    fetchNotices();

    const scopesToLoad: ScopeItem[] = isAdminUnrestricted
      ? [{ branch: 'CSE', semesters: [3] }]
      : assignedScopes;

    if (scopesToLoad.length === 0) return;

    let cancelled = false;
    Promise.all(
      scopesToLoad.flatMap((scope) =>
        scope.semesters.map((sem) =>
          fetch(`/api/syllabus?branch=${encodeURIComponent(scope.branch)}&semester=${sem}`)
            .then((r) => r.json())
            .then((d) => {
              if (!d?.success || !Array.isArray(d.subjects)) return [];
              const allowedCodes =
                Array.isArray(scope.subjectCodes) && scope.subjectCodes.length > 0
                  ? scope.subjectCodes.map((c) => c.toUpperCase())
                  : null;
              return d.subjects
                .filter((subj: any) =>
                  allowedCodes ? allowedCodes.includes(String(subj.code).toUpperCase()) : true
                )
                .map((subj: any) => ({
                  code: subj.code,
                  name: subj.name,
                  branch: scope.branch,
                  semester: sem,
                }));
            })
            .catch(() => [])
        )
      )
    ).then((chunks) => {
      if (cancelled) return;
      const seen = new Set<string>();
      const merged: SyllabusSubjectOption[] = [];
      for (const list of chunks) {
        for (const item of list) {
          if (!seen.has(item.code)) {
            seen.add(item.code);
            merged.push(item);
          }
        }
      }
      setDesignatedSubjects(merged);
    });

    return () => {
      cancelled = true;
    };
  }, [assignedScopes, isAdminUnrestricted, fetchNotices]);

  const openCreateModal = () => {
    setEditingNotice(null);
    setSelectedSubjectCode(designatedSubjects[0]?.code || 'GENERAL');
    setSelectedTargets(
      isAdminUnrestricted
        ? ['ALL']
        : targetPairs.slice(0, 1).map((p) => p.key)
    );
    setCategory('EXAM');
    setEventDate('');
    setIsPinned(true);
    setTitle('');
    setContent('');
    setModalOpen(true);
  };

  const openEditModal = (notice: NoticeBoardItem) => {
    setEditingNotice(notice);
    setSelectedSubjectCode(notice.subjectCode || 'GENERAL');
    const branches = notice.targetBranches?.length
      ? notice.targetBranches
      : [notice.targetBranch];
    const sems = notice.targetSemesters?.length
      ? notice.targetSemesters
      : notice.targetSemester
      ? [notice.targetSemester]
      : [];
    const keys: string[] = [];
    if (branches.includes('ALL')) {
      keys.push('ALL');
    } else {
      for (const b of branches) {
        for (const s of sems) keys.push(`${b}::${s}`);
      }
    }
    setSelectedTargets(keys.length ? keys : targetPairs.slice(0, 1).map((p) => p.key));
    setCategory(notice.category || 'ACADEMIC');
    const rawD = notice.eventDate || notice.examDate;
    setEventDate(rawD ? new Date(rawD).toISOString().slice(0, 10) : '');
    setIsPinned(Boolean(notice.isPinned));
    setTitle(notice.title);
    setContent(notice.content);
    setModalOpen(true);
  };

  const toggleTargetKey = (key: string) => {
    if (key === 'ALL') {
      setSelectedTargets((prev) => (prev.includes('ALL') ? [] : ['ALL']));
      return;
    }
    setSelectedTargets((prev) => {
      const cleaned = prev.filter((k) => k !== 'ALL');
      return cleaned.includes(key)
        ? cleaned.filter((k) => k !== key)
        : [...cleaned, key];
    });
  };

  const audiencePreviewText = useMemo(() => {
    if (selectedTargets.includes('ALL')) return 'All B.Tech Branches & Semesters';
    if (selectedTargets.length === 0) return 'No target selected';
    const byBranch = new Map<string, number[]>();
    for (const key of selectedTargets) {
      const [b, s] = key.split('::');
      if (!b || !s) continue;
      const list = byBranch.get(b) || [];
      list.push(Number(s));
      byBranch.set(b, list);
    }
    return Array.from(byBranch.entries())
      .map(([b, sems]) => `${b} (Sem ${sems.sort((a, c) => a - c).join(', ')})`)
      .join(', ');
  }, [selectedTargets]);

  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      onToast('Notice title and message are required.', true);
      return;
    }
    if (selectedTargets.length === 0) {
      onToast('Select at least one target Branch & Semester.', true);
      return;
    }

    const subjObj = designatedSubjects.find((s) => s.code === selectedSubjectCode);
    const isAll = selectedTargets.includes('ALL');
    const targetBranches = isAll
      ? ['ALL']
      : Array.from(new Set(selectedTargets.map((k) => k.split('::')[0])));
    const targetSemesters = isAll
      ? []
      : Array.from(new Set(selectedTargets.map((k) => Number(k.split('::')[1]))));

    setSaving(true);
    try {
      const endpoint = editingNotice ? `/api/notices/${editingNotice.id}` : '/api/notices';
      const method = editingNotice ? 'PATCH' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category,
          subjectCode: selectedSubjectCode === 'GENERAL' ? null : selectedSubjectCode,
          subjectName: selectedSubjectCode === 'GENERAL' ? null : subjObj?.name || null,
          targetBranch: targetBranches[0] || 'ALL',
          targetSemester: targetSemesters[0] ?? null,
          targetBranches,
          targetSemesters,
          eventDate: eventDate || null,
          isPinned,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        onToast(data.error || 'Failed to save notice.', true);
        return;
      }
      onToast(
        editingNotice
          ? 'Notice updated.'
          : 'Notice published to student dashboards & /tools.'
      );
      setModalOpen(false);
      fetchNotices();
    } catch {
      onToast('Network error saving notice.', true);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePin = async (notice: NoticeBoardItem) => {
    const res = await fetch(`/api/notices/${notice.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPinned: !notice.isPinned }),
    });
    if (res.ok) {
      onToast(notice.isPinned ? 'Notice unpinned.' : 'Notice pinned.');
      fetchNotices();
    } else {
      const d = await res.json().catch(() => ({}));
      onToast(d.error || 'Only the notice author or Admin can pin.', true);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/notices/${id}`, { method: 'DELETE' });
    if (res.ok) {
      onToast('Notice deleted.');
      fetchNotices();
    } else {
      const d = await res.json().catch(() => ({}));
      onToast(d.error || 'Only the notice author or Admin can delete.', true);
    }
  };

  const filteredNotices = useMemo(() => {
    if (subjectFilter === 'ALL') return notices;
    if (subjectFilter === 'GENERAL') {
      return notices.filter((n) => !n.subjectCode || n.authorRole === 'ADMIN');
    }
    return notices.filter(
      (n) => (n.subjectCode || '').toUpperCase() === subjectFilter.toUpperCase()
    );
  }, [notices, subjectFilter]);

  const formatVisibility = (notice: NoticeBoardItem) => {
    const branches = notice.targetBranches?.length
      ? notice.targetBranches
      : [notice.targetBranch];
    if (branches.includes('ALL')) return 'All Branches & Semesters';
    const sems = notice.targetSemesters?.length
      ? notice.targetSemesters
      : notice.targetSemester
      ? [notice.targetSemester]
      : [];
    return branches
      .map((b) => (sems.length ? `${b} • Sem ${sems.join(', ')}` : b))
      .join(' • ');
  };

  return (
    <div className="space-y-5">
      {/* Clean Top Header */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#09090B]">
            Department &amp; Subject Notice Board
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {designatedSubjects.length > 0
              ? `Designated Subjects: ${designatedSubjects
                  .map((s) => `${s.code} (${s.name})`)
                  .join(' • ')}`
              : 'Targeted notices sync directly to student dashboards and /tools.'}
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 shrink-0 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post Notice to Students</span>
        </button>
      </div>

      {/* Two-Tier Clutter-Free Filter Bar */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-3.5 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tier 1: All Notices */}
          <button
            type="button"
            onClick={() => setSubjectFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              subjectFilter === 'ALL'
                ? 'bg-[#09090B] text-white'
                : 'bg-[#FAFAFA] text-zinc-700 border border-[#E4E4E7] hover:bg-zinc-100'
            }`}
          >
            All Notices ({notices.length})
          </button>

          {/* Tier 2: Subject-Wise Pills */}
          {designatedSubjects.map((subj) => (
            <button
              key={subj.code}
              type="button"
              onClick={() => setSubjectFilter(subj.code)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-colors cursor-pointer ${
                subjectFilter === subj.code
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#FAFAFA] text-zinc-700 border border-[#E4E4E7] hover:bg-zinc-100'
              }`}
            >
              {subj.code} • {subj.name.length > 26 ? `${subj.name.slice(0, 26)}…` : subj.name}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setSubjectFilter('GENERAL')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              subjectFilter === 'GENERAL'
                ? 'bg-[#09090B] text-white'
                : 'bg-[#FAFAFA] text-zinc-700 border border-[#E4E4E7] hover:bg-zinc-100'
            }`}
          >
            General / Admin
          </button>
        </div>
      </div>

      {/* Notice Cards Feed */}
      {loading ? (
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-10 text-center text-xs text-zinc-500">
          Loading notices...
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="bg-white border border-dashed border-[#E4E4E7] rounded-2xl p-10 text-center space-y-2">
          <Bell className="w-8 h-8 text-zinc-300 mx-auto" />
          <p className="text-sm font-semibold text-zinc-800">No Notices in This Filter</p>
          <p className="text-xs text-zinc-500">
            Click &ldquo;+ Post Notice to Students&rdquo; to publish an exam, lab viva, or assignment circular.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotices.map((notice) => {
            const catMeta = CATEGORY_LABELS[notice.category] || CATEGORY_LABELS.ACADEMIC;
            const isOwnNotice =
              isAdminUnrestricted ||
              (currentDbUserId && notice.authorId === currentDbUserId);
            const isAdminNotice =
              (notice.authorRole || notice.author?.role || '').toUpperCase() === 'ADMIN';
            const displayDate = notice.eventDate || notice.examDate;

            return (
              <div
                key={notice.id}
                className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-3 shadow-2xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-md border font-mono text-[10px] font-bold ${catMeta.cls}`}
                    >
                      {catMeta.label}
                    </span>

                    {notice.subjectCode && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 font-mono text-[10px] font-semibold text-zinc-800">
                        <BookOpen className="w-3 h-3 text-zinc-500" />
                        {notice.subjectCode}
                        {notice.subjectName ? ` • ${notice.subjectName}` : ''}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 font-mono text-[10px] font-semibold text-emerald-800">
                      <Eye className="w-3 h-3 text-emerald-600" />
                      Visible to: {formatVisibility(notice)}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold border ${
                        isOwnNotice && !isAdminNotice
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : isAdminNotice
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                      }`}
                    >
                      {isOwnNotice && !isAdminNotice
                        ? 'Your Notice'
                        : isAdminNotice
                        ? 'Official Admin Notice'
                        : `By ${notice.authorName || notice.author?.fullName || 'Faculty'}`}
                    </span>

                    {notice.isPinned && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 font-mono text-[10px] font-bold text-amber-800">
                        Pinned
                      </span>
                    )}
                  </div>

                  {isOwnNotice && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleTogglePin(notice)}
                        className="p-1.5 rounded-lg border border-zinc-200 bg-[#FAFAFA] hover:bg-zinc-100 text-zinc-600 cursor-pointer"
                        title={notice.isPinned ? 'Unpin' : 'Pin'}
                      >
                        {notice.isPinned ? (
                          <PinOff className="w-3.5 h-3.5" />
                        ) : (
                          <Pin className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(notice)}
                        className="p-1.5 rounded-lg border border-zinc-200 bg-[#FAFAFA] hover:bg-zinc-100 text-zinc-600 cursor-pointer"
                        title="Edit notice"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(notice.id)}
                        className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
                        title="Delete notice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#09090B]">
                    {notice.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 mt-1 whitespace-pre-wrap leading-relaxed">
                    {notice.content}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100 text-[11px] font-mono text-zinc-400">
                  <span>
                    Posted {new Date(notice.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  {displayDate && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 font-semibold">
                      <Calendar className="w-3 h-3" />
                      Scheduled / Due:{' '}
                      {new Date(displayDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* + Post Notice to Students Composer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E4E4E7] rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-xl">
            <div className="p-5 border-b border-[#E4E4E7] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#09090B]">
                  {editingNotice ? 'Edit Notice' : 'Post Notice to Students'}
                </h3>
                <p className="text-xs text-zinc-500">
                  Scoped to your Admin-designated subjects, branches, and semesters.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNotice} className="p-5 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-[11px] font-mono font-semibold text-zinc-700 mb-1">
                  Select Subject
                </label>
                <select
                  value={selectedSubjectCode}
                  onChange={(e) => setSelectedSubjectCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs font-medium text-zinc-900"
                >
                  {designatedSubjects.map((subj) => (
                    <option key={subj.code} value={subj.code}>
                      {subj.code} — {subj.name}
                    </option>
                  ))}
                  <option value="GENERAL">General Branch Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-zinc-700 mb-1.5">
                  Target Branches &amp; Semesters
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA]">
                  {isAdminUnrestricted && (
                    <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E4E4E7] text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTargets.includes('ALL')}
                        onChange={() => toggleTargetKey('ALL')}
                      />
                      <span>All Branches</span>
                    </label>
                  )}
                  {targetPairs.map((pair) => (
                    <label
                      key={pair.key}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E4E4E7] text-xs font-mono cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTargets.includes(pair.key)}
                        onChange={() => toggleTargetKey(pair.key)}
                      />
                      <span>
                        {pair.branch} • Sem {pair.semester}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-[11px] text-emerald-700 font-medium mt-1.5">
                  This notice will appear on the dashboards of:{' '}
                  <span className="font-mono font-semibold">{audiencePreviewText}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-zinc-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs font-medium text-zinc-900"
                  >
                    <option value="EXAM">CA Exam</option>
                    <option value="LAB_VIVA">Lab Viva</option>
                    <option value="ASSIGNMENT">Assignment</option>
                    <option value="ACADEMIC">Academic</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold text-zinc-700 mb-1">
                    Due / Exam Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs text-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-zinc-700 mb-1">
                  Notice Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CA-3 Viva & Lab Record Submission"
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs text-zinc-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-zinc-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Include syllabus coverage, lab room, reporting time..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs text-zinc-900"
                  required
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                />
                <span>Pin as Priority Notice</span>
              </label>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E4E4E7] bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {saving
                      ? 'Publishing...'
                      : editingNotice
                      ? 'Save Changes'
                      : 'Publish Notice'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
