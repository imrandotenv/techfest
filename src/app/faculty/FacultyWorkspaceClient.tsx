'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  MessageSquare,
  Bell,
  Sparkles,
  Upload,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Send,
  Trash2,
  Pin,
  PinOff,
  Plus,
  BookOpen,
  Calendar,
  AlertTriangle,
  BarChart3,
  ExternalLink,
  X,
} from 'lucide-react';
import { SYLLABUS_BRANCHES } from '@/lib/makaut-syllabus';
import { useSyllabusSubjects } from '@/hooks/useSyllabusSubjects';

type FacultyTab = 'content' | 'doubts' | 'notices' | 'viva';

interface FacultyKPIs {
  uploadedNotes: number;
  totalNotes: number;
  pendingSubmissions: number;
  unansweredDoubts: number;
  activeNotices: number;
}

interface NoteRecord {
  id: string;
  title: string;
  subjectCode: string;
  subjectName?: string | null;
  branch: string;
  semester: number;
  category?: string | null;
  content?: string | null;
  fileUrl: string;
  verified: boolean;
  isVerified?: boolean;
  authorName?: string | null;
  verifiedBy?: string | null;
  createdAt: string;
  uploader?: { fullName?: string | null; email?: string | null; branch?: string | null };
}

interface NoticeRecord {
  id: string;
  title: string;
  content: string;
  category: string;
  targetBranch: string;
  targetSemester?: number | null;
  examDate?: string | null;
  isPinned: boolean;
  createdAt: string;
}

interface DoubtRecord {
  id: string;
  title: string;
  content: string;
  category: string | null;
  branch: string | null;
  semester: number | null;
  isResolved?: boolean;
  createdAt: string;
  hasOfficialAnswer: boolean;
  author?: { fullName?: string | null; email?: string | null; branch?: string | null; semester?: number | null };
  replies: Array<{
    id: string;
    content: string;
    isOfficialAnswer: boolean;
    author?: { fullName?: string | null; role?: string | null };
  }>;
}

interface CustomVivaQuestionRecord {
  id: string;
  branch: string;
  semester: number;
  subjectCode: string;
  question: string;
  expectedKeyPoints: string;
  createdBy: string;
  createdAt: string;
}

interface VivaInsights {
  totalSessions: number;
  lowestScoringTopics: Array<{ topic: string; count: number; subjectCode: string }>;
  subjectBreakdown: Array<{
    subjectCode: string;
    subjectName: string;
    sessions: number;
    accuracyPercent: number;
  }>;
}

const SEMESTERS = [3, 4, 5, 6, 7, 8];

export function FacultyWorkspaceClient({
  userEmail,
  userName,
}: {
  userEmail: string;
  userName: string;
}) {
  const [activeTab, setActiveTab] = useState<FacultyTab>('content');
  const [toast, setToast] = useState<{ text: string; isError?: boolean } | null>(null);

  const showToast = useCallback((text: string, isError = false) => {
    setToast({ text, isError });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Overview + Queue state
  const [kpis, setKpis] = useState<FacultyKPIs>({
    uploadedNotes: 0,
    totalNotes: 0,
    pendingSubmissions: 0,
    unansweredDoubts: 0,
    activeNotices: 0,
  });
  const [notesQueue, setNotesQueue] = useState<NoteRecord[]>([]);
  const [notices, setNotices] = useState<NoticeRecord[]>([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [queueFilter, setQueueFilter] = useState<'pending' | 'all'>('pending');
  const [previewNote, setPreviewNote] = useState<NoteRecord | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  // Tab 1: Publish Official Faculty Material state
  const [pubBranch, setPubBranch] = useState<string>('CSE');
  const [pubSemester, setPubSemester] = useState<number>(3);
  const pubSubjects = useSyllabusSubjects(pubBranch, pubSemester);
  const [pubSubjectCode, setPubSubjectCode] = useState<string>('');
  const [pubType, setPubType] = useState<'LECTURE_NOTE' | 'MAKAUT_PYQ' | 'LAB_MANUAL'>('LECTURE_NOTE');
  const [pubUnit, setPubUnit] = useState<string>('');
  const [pubTitle, setPubTitle] = useState<string>('');
  const [pubContent, setPubContent] = useState<string>('');
  const [pubFileUrl, setPubFileUrl] = useState<string>('');
  const [publishingNote, setPublishingNote] = useState(false);

  useEffect(() => {
    if (pubSubjects.length > 0 && !pubSubjects.some((s) => s.code === pubSubjectCode)) {
      setPubSubjectCode(pubSubjects[0].code);
    }
  }, [pubSubjects, pubSubjectCode]);

  // Tab 2: Doubt Resolution state
  const [doubts, setDoubts] = useState<DoubtRecord[]>([]);
  const [loadingDoubts, setLoadingDoubts] = useState(false);
  const [doubtBranch, setDoubtBranch] = useState<string>('ALL');
  const [doubtFilter, setDoubtFilter] = useState<'unanswered' | 'all'>('unanswered');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [submittingReplyId, setSubmittingReplyId] = useState<string | null>(null);

  // Tab 3: Academic Notices & CA/Viva Schedules state
  const [noticeBranch, setNoticeBranch] = useState<string>('ALL');
  const [noticeSemester, setNoticeSemester] = useState<string>('ALL');
  const [noticeCategory, setNoticeCategory] = useState<'EXAM' | 'LAB' | 'ACADEMIC' | 'URGENT'>('EXAM');
  const [noticeTitle, setNoticeTitle] = useState<string>('');
  const [noticeContent, setNoticeContent] = useState<string>('');
  const [noticeExamDate, setNoticeExamDate] = useState<string>('');
  const [noticePinned, setNoticePinned] = useState<boolean>(true);
  const [publishingNotice, setPublishingNotice] = useState(false);

  // Tab 4: AI Viva Question Bank & Subject Insights state
  const [vivaBranch, setVivaBranch] = useState<string>('CSE');
  const [vivaSemester, setVivaSemester] = useState<number>(3);
  const vivaSubjects = useSyllabusSubjects(vivaBranch, vivaSemester);
  const [vivaSubjectCode, setVivaSubjectCode] = useState<string>('');
  const [vivaQuestion, setVivaQuestion] = useState<string>('');
  const [vivaKeyPoints, setVivaKeyPoints] = useState<string>('');
  const [customQuestions, setCustomQuestions] = useState<CustomVivaQuestionRecord[]>([]);
  const [vivaInsights, setVivaInsights] = useState<VivaInsights>({
    totalSessions: 0,
    lowestScoringTopics: [],
    subjectBreakdown: [],
  });
  const [loadingViva, setLoadingViva] = useState(false);
  const [savingVivaQ, setSavingVivaQ] = useState(false);

  useEffect(() => {
    if (vivaSubjects.length > 0 && !vivaSubjects.some((s) => s.code === vivaSubjectCode)) {
      setVivaSubjectCode(vivaSubjects[0].code);
    }
  }, [vivaSubjects, vivaSubjectCode]);

  const loadOverview = useCallback(async () => {
    setLoadingOverview(true);
    try {
      const res = await fetch('/api/faculty/overview');
      const data = await res.json();
      if (data.success) {
        setKpis(data.kpis);
        setNotesQueue(data.notesQueue || []);
        setNotices(data.notices || []);
      }
    } catch {
      showToast('Failed to load faculty overview.', true);
    } finally {
      setLoadingOverview(false);
    }
  }, [showToast]);

  const loadDoubts = useCallback(async () => {
    setLoadingDoubts(true);
    try {
      const res = await fetch(
        `/api/faculty/doubts?branch=${encodeURIComponent(doubtBranch)}&filter=${doubtFilter}`
      );
      const data = await res.json();
      if (data.success) {
        setDoubts(data.doubts || []);
      }
    } catch {
      showToast('Failed to load student doubts.', true);
    } finally {
      setLoadingDoubts(false);
    }
  }, [doubtBranch, doubtFilter, showToast]);

  const loadVivaBank = useCallback(async () => {
    setLoadingViva(true);
    try {
      const res = await fetch(`/api/faculty/viva-questions?branch=${encodeURIComponent(vivaBranch)}`);
      const data = await res.json();
      if (data.success) {
        setCustomQuestions(data.questions || []);
        if (data.insights) setVivaInsights(data.insights);
      }
    } catch {
      showToast('Failed to load AI Viva question bank.', true);
    } finally {
      setLoadingViva(false);
    }
  }, [vivaBranch, showToast]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    if (activeTab === 'doubts') loadDoubts();
    if (activeTab === 'viva') loadVivaBank();
  }, [activeTab, loadDoubts, loadVivaBank]);

  // Tab 1 Actions
  const handlePublishMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    const chosenSubject = pubSubjects.find((s) => s.code === pubSubjectCode);
    if (!pubTitle.trim() || !pubSubjectCode || (!pubContent.trim() && !pubFileUrl.trim())) {
      showToast('Provide a title, subject, and formatted content or resource URL.', true);
      return;
    }

    setPublishingNote(true);
    try {
      const res = await fetch('/api/faculty/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pubTitle.trim(),
          subjectCode: pubSubjectCode,
          subjectName: chosenSubject?.name || pubSubjectCode,
          branch: pubBranch,
          semester: pubSemester,
          category: pubType,
          unitModule: pubUnit.trim() || undefined,
          content: pubContent.trim() || undefined,
          fileUrl: pubFileUrl.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to publish official material.', true);
        return;
      }
      showToast(`Published & verified "${data.note.title}" in /notes.`);
      setPubTitle('');
      setPubUnit('');
      setPubContent('');
      setPubFileUrl('');
      loadOverview();
    } catch {
      showToast('Network error while publishing material.', true);
    } finally {
      setPublishingNote(false);
    }
  };

  const handleVerifyNote = async (id: string, verified: boolean) => {
    setVerifyingId(id);
    try {
      const res = await fetch(`/api/faculty/notes/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to update note verification.', true);
        return;
      }
      showToast(verified ? 'Material approved & stamped as Faculty Verified.' : 'Verification revoked.');
      loadOverview();
    } catch {
      showToast('Network error updating note.', true);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleDeleteNote = async (id: string) => {
    setVerifyingId(id);
    try {
      const res = await fetch(`/api/faculty/notes/${id}/verify`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to reject/remove note.', true);
        return;
      }
      showToast('Submission rejected and removed.');
      if (previewNote?.id === id) setPreviewNote(null);
      loadOverview();
    } catch {
      showToast('Network error removing note.', true);
    } finally {
      setVerifyingId(null);
    }
  };

  // Tab 2 Actions
  const handlePostOfficialAnswer = async (postId: string) => {
    const content = (replyDrafts[postId] || '').trim();
    if (!content) {
      showToast('Write an official faculty explanation before posting.', true);
      return;
    }

    setSubmittingReplyId(postId);
    try {
      const res = await fetch('/api/faculty/doubts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to post official answer.', true);
        return;
      }
      showToast('Official Verified Answer pinned in /forum and thread marked Resolved.');
      setReplyDrafts((prev) => ({ ...prev, [postId]: '' }));
      loadDoubts();
      loadOverview();
    } catch {
      showToast('Network error posting official answer.', true);
    } finally {
      setSubmittingReplyId(null);
    }
  };

  // Tab 3 Actions
  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      showToast('Notice title and details are required.', true);
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
          targetSemester: noticeSemester === 'ALL' ? null : Number(noticeSemester),
          examDate: noticeExamDate || null,
          isPinned: noticePinned,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to publish notice.', true);
        return;
      }
      showToast('Official notice published to /tools & /dashboard.');
      setNoticeTitle('');
      setNoticeContent('');
      setNoticeExamDate('');
      loadOverview();
    } catch {
      showToast('Network error publishing notice.', true);
    } finally {
      setPublishingNotice(false);
    }
  };

  const handleToggleNoticePin = async (notice: NoticeRecord) => {
    try {
      const res = await fetch(`/api/notices/${notice.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !notice.isPinned }),
      });
      if (res.ok) {
        showToast(notice.isPinned ? 'Notice unpinned.' : 'Notice pinned as priority.');
        loadOverview();
      }
    } catch {
      showToast('Failed to update notice.', true);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    try {
      const res = await fetch(`/api/notices/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Notice deleted.');
        loadOverview();
      }
    } catch {
      showToast('Failed to delete notice.', true);
    }
  };

  // Tab 4 Actions
  const handleAddCustomVivaQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vivaSubjectCode || !vivaQuestion.trim() || !vivaKeyPoints.trim()) {
      showToast('Select a subject and fill in both the question and expected key points.', true);
      return;
    }

    setSavingVivaQ(true);
    try {
      const res = await fetch('/api/faculty/viva-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch: vivaBranch,
          semester: vivaSemester,
          subjectCode: vivaSubjectCode,
          question: vivaQuestion.trim(),
          expectedKeyPoints: vivaKeyPoints.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to add custom viva question.', true);
        return;
      }
      showToast('Custom viva question added — AI Viva Studio will prioritize it.');
      setVivaQuestion('');
      setVivaKeyPoints('');
      loadVivaBank();
    } catch {
      showToast('Network error saving viva question.', true);
    } finally {
      setSavingVivaQ(false);
    }
  };

  const handleDeleteCustomVivaQuestion = async (id: string) => {
    try {
      const res = await fetch(`/api/faculty/viva-questions?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('Viva question removed.');
        loadVivaBank();
      }
    } catch {
      showToast('Failed to remove viva question.', true);
    }
  };

  const visibleNotesQueue =
    queueFilter === 'pending' ? notesQueue.filter((n) => !n.verified) : notesQueue;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
            Verified Materials
          </p>
          <p className="text-2xl font-bold text-[#09090B] mt-1 font-mono">{kpis.uploadedNotes}</p>
          <p className="text-[11px] text-emerald-700 mt-0.5">Live on /notes</p>
        </div>
        <div className="bg-white border border-[#E4E4E7] rounded-xl p-4">
          <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            Pending Review
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1 font-mono">
            {kpis.pendingSubmissions}
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Student uploads awaiting stamp</p>
        </div>
        <div className="bg-white border border-[#E4E4E7] rounded-xl p-4">
          <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            Open Student Doubts
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1 font-mono">{kpis.unansweredDoubts}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Needs verified answer</p>
        </div>
        <div className="bg-white border border-[#E4E4E7] rounded-xl p-4">
          <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            Active Notices
          </p>
          <p className="text-2xl font-bold text-[#09090B] mt-1 font-mono">{kpis.activeNotices}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Broadcast to campus</p>
        </div>
      </div>

      {/* 4-Tab Swiss Segmented Navigation */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-1.5 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'content'
              ? 'bg-[#09090B] text-white shadow-xs'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Content & Verification</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('doubts')}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'doubts'
              ? 'bg-[#09090B] text-white shadow-xs'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Doubt Resolution</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notices')}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'notices'
              ? 'bg-[#09090B] text-white shadow-xs'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
          }`}
        >
          <Bell className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Notices & CA/Viva</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('viva')}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'viva'
              ? 'bg-[#09090B] text-white shadow-xs'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">AI Viva Bank</span>
        </button>
      </div>

      {/* TAB 1: Content & Verification Queue */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Publish Official Faculty Material */}
          <div className="lg:col-span-5 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-1">
              <Upload className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base font-bold text-[#09090B]">
                Publish Official Faculty Material
              </h2>
            </div>
            <p className="text-xs text-zinc-500 mb-4">
              Auto-stamped with <span className="text-emerald-700 font-semibold">Faculty Verified</span> and published directly to /notes as {userName || userEmail}.
            </p>

            <form onSubmit={handlePublishMaterial} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-600 mb-1">Branch</label>
                  <select
                    value={pubBranch}
                    onChange={(e) => setPubBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs font-medium text-zinc-900"
                  >
                    {SYLLABUS_BRANCHES.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.code} — {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-600 mb-1">Semester</label>
                  <select
                    value={pubSemester}
                    onChange={(e) => setPubSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs font-medium text-zinc-900"
                  >
                    {SEMESTERS.map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-600 mb-1">
                  MAKAUT Syllabus Subject
                </label>
                <select
                  value={pubSubjectCode}
                  onChange={(e) => setPubSubjectCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs font-medium text-zinc-900"
                >
                  {pubSubjects.map((s) => (
                    <option key={`${s.code}-${s.name}`} value={s.code}>
                      {s.code} — {s.name} ({s.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-600 mb-1">
                    Material Type
                  </label>
                  <select
                    value={pubType}
                    onChange={(e) => setPubType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs font-medium text-zinc-900"
                  >
                    <option value="LECTURE_NOTE">Theory Notes (NOTE)</option>
                    <option value="MAKAUT_PYQ">Solved PYQ Bank (PYQ)</option>
                    <option value="LAB_MANUAL">Lab Practical Manual (LAB)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-600 mb-1">
                    Module / Unit (Optional)
                  </label>
                  <input
                    type="text"
                    value={pubUnit}
                    onChange={(e) => setPubUnit(e.target.value)}
                    placeholder="e.g. Module 2"
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs text-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-600 mb-1">Title</label>
                <input
                  type="text"
                  value={pubTitle}
                  onChange={(e) => setPubTitle(e.target.value)}
                  placeholder="e.g. AVL Trees, Rotations & Time Complexity"
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs text-zinc-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-600 mb-1">
                  Formatted Study Content (Markdown / Exam Notes)
                </label>
                <textarea
                  rows={6}
                  value={pubContent}
                  onChange={(e) => setPubContent(e.target.value)}
                  placeholder="## Key Concepts&#10;- Write structured exam notes, derivations, or solved MAKAUT questions here..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs font-mono text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-600 mb-1">
                  External PDF / Drive Link (Optional if content above is filled)
                </label>
                <input
                  type="url"
                  value={pubFileUrl}
                  onChange={(e) => setPubFileUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs text-zinc-900"
                />
              </div>

              <button
                type="submit"
                disabled={publishingNote}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{publishingNote ? 'Publishing...' : 'Publish & Verify Material'}</span>
              </button>
            </form>
          </div>

          {/* Pending Student Submissions Queue */}
          <div className="lg:col-span-7 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-[#09090B]">
                  Student Upload Verification Queue
                </h2>
                <p className="text-xs text-zinc-500">
                  Preview student-submitted materials, stamp as Faculty Verified, or reject spam.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQueueFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                    queueFilter === 'pending'
                      ? 'bg-[#09090B] text-white border-[#09090B]'
                      : 'bg-white text-zinc-600 border-[#E4E4E7]'
                  }`}
                >
                  Pending ({notesQueue.filter((n) => !n.verified).length})
                </button>
                <button
                  type="button"
                  onClick={() => setQueueFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                    queueFilter === 'all'
                      ? 'bg-[#09090B] text-white border-[#09090B]'
                      : 'bg-white text-zinc-600 border-[#E4E4E7]'
                  }`}
                >
                  All ({notesQueue.length})
                </button>
                <button
                  type="button"
                  onClick={loadOverview}
                  className="p-1.5 rounded-lg border border-[#E4E4E7] text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                  title="Refresh queue"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingOverview ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {visibleNotesQueue.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-[#E4E4E7] rounded-xl bg-[#FAFAFA]">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-zinc-800">Queue Clear</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {queueFilter === 'pending'
                    ? 'No pending student uploads waiting for review.'
                    : 'No study materials found.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {visibleNotesQueue.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 rounded bg-white border border-[#E4E4E7] font-mono text-[10px] font-semibold text-zinc-700">
                          {note.branch} • Sem {note.semester}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 font-mono text-[10px] font-semibold text-blue-700">
                          {note.subjectCode}
                        </span>
                        {note.verified ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 font-mono text-[10px] font-semibold text-emerald-700">
                            Verified
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 font-mono text-[10px] font-semibold text-amber-700">
                            Pending Review
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-[#09090B] truncate">{note.title}</h3>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        By {note.authorName || note.uploader?.fullName || 'SETGOI Student'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewNote(note)}
                        className="px-2.5 py-1.5 rounded-lg border border-[#E4E4E7] bg-white hover:bg-zinc-100 text-xs font-medium text-zinc-700 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      {!note.verified ? (
                        <button
                          type="button"
                          disabled={verifyingId === note.id}
                          onClick={() => handleVerifyNote(note.id, true)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={verifyingId === note.id}
                          onClick={() => handleVerifyNote(note.id, false)}
                          className="px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-medium cursor-pointer"
                        >
                          Unverify
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={verifyingId === note.id}
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
                        title="Reject & Delete"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Doubt Resolution (/forum integration) */}
      {activeTab === 'doubts' && (
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#09090B]">
                Student Doubt Resolution Desk
              </h2>
              <p className="text-xs text-zinc-500">
                Answers posted here are pinned at the top of{' '}
                <Link href="/forum" className="text-blue-600 hover:underline font-medium">
                  /forum
                </Link>{' '}
                with a green <span className="text-emerald-700 font-semibold">Verified Faculty Answer</span> badge and mark the thread Resolved.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={doubtBranch}
                onChange={(e) => setDoubtBranch(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] text-xs font-medium text-zinc-800"
              >
                <option value="ALL">All Branches</option>
                {SYLLABUS_BRANCHES.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.code}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setDoubtFilter('unanswered')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                  doubtFilter === 'unanswered'
                    ? 'bg-[#09090B] text-white border-[#09090B]'
                    : 'bg-white text-zinc-600 border-[#E4E4E7]'
                }`}
              >
                Unresolved
              </button>
              <button
                type="button"
                onClick={() => setDoubtFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                  doubtFilter === 'all'
                    ? 'bg-[#09090B] text-white border-[#09090B]'
                    : 'bg-white text-zinc-600 border-[#E4E4E7]'
                }`}
              >
                All Threads
              </button>
            </div>
          </div>

          {loadingDoubts ? (
            <div className="py-12 text-center text-xs text-zinc-500">Loading student doubts...</div>
          ) : doubts.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-[#E4E4E7] rounded-xl bg-[#FAFAFA]">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-zinc-800">No Unresolved Doubts</p>
              <p className="text-xs text-zinc-500 mt-1">
                All student questions for this filter already have a verified faculty answer.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {doubts.map((doubt) => (
                <div
                  key={doubt.id}
                  className="p-4 sm:p-5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {doubt.branch && (
                        <span className="px-2 py-0.5 rounded bg-white border border-[#E4E4E7] font-mono text-[10px] font-semibold text-zinc-700">
                          {doubt.branch} {doubt.semester ? `• Sem ${doubt.semester}` : ''}
                        </span>
                      )}
                      {doubt.category && (
                        <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 font-mono text-[10px] font-semibold text-blue-700">
                          {doubt.category}
                        </span>
                      )}
                      {doubt.hasOfficialAnswer || doubt.isResolved ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 font-mono text-[10px] font-semibold text-emerald-700">
                          Resolved • Verified Answer Posted
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 font-mono text-[10px] font-semibold text-amber-700">
                          Needs Faculty Answer
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500">
                      Asked by {doubt.author?.fullName || 'SETGOI Student'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#09090B]">{doubt.title}</h3>
                    <p className="text-xs text-zinc-600 mt-1 whitespace-pre-wrap leading-relaxed">
                      {doubt.content}
                    </p>
                  </div>

                  {/* Inline Official Answer Composer */}
                  <div className="pt-2 border-t border-[#E4E4E7] space-y-2">
                    <textarea
                      rows={3}
                      value={replyDrafts[doubt.id] || ''}
                      onChange={(e) =>
                        setReplyDrafts((prev) => ({ ...prev, [doubt.id]: e.target.value }))
                      }
                      placeholder="Write a clear, syllabus-aligned Official Faculty Answer (supports Markdown)..."
                      className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-white text-xs text-zinc-900"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        disabled={submittingReplyId === doubt.id}
                        onClick={() => handlePostOfficialAnswer(doubt.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>
                          {submittingReplyId === doubt.id
                            ? 'Posting...'
                            : 'Post Official Verified Answer'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Academic Notices & CA/Viva Schedules */}
      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-[#09090B]">
                Publish Notice / CA & Viva Schedule
              </h2>
            </div>
            <p className="text-xs text-zinc-500 mb-4">
              Targeted notices appear immediately on /tools (Exam Countdown & Notices) and /dashboard.
            </p>

            <form onSubmit={handlePublishNotice} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-600 mb-1">
                    Target Branch
                  </label>
                  <select
                    value={noticeBranch}
                    onChange={(e) => setNoticeBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs font-medium text-zinc-900"
                  >
                    <option value="ALL">All Branches</option>
                    {SYLLABUS_BRANCHES.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-600 mb-1">
                    Target Semester
                  </label>
                  <select
                    value={noticeSemester}
                    onChange={(e) => setNoticeSemester(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs font-medium text-zinc-900"
                  >
                    <option value="ALL">All Semesters</option>
                    {SEMESTERS.map((sem) => (
                      <option key={sem} value={String(sem)}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-600 mb-1">Category</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs font-medium text-zinc-900"
                  >
                    <option value="EXAM">Examination</option>
                    <option value="LAB">Laboratories</option>
                    <option value="ACADEMIC">Academic</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-600 mb-1">
                    Exam / Viva Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={noticeExamDate}
                    onChange={(e) => setNoticeExamDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs text-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-600 mb-1">
                  Notice Title
                </label>
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. CA-3 & Practical Viva Schedule (Sem 3 CSE)"
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs text-zinc-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-600 mb-1">
                  Announcement Details
                </label>
                <textarea
                  rows={4}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="Include lab room numbers, reporting times, and syllabus scope..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs text-zinc-900"
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
                <span>Pin as Priority Notice</span>
              </label>

              <button
                type="submit"
                disabled={publishingNotice}
                className="w-full py-2.5 px-4 rounded-xl bg-[#09090B] hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{publishingNotice ? 'Broadcasting...' : 'Publish Official Notice'}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#09090B]">Published Campus Notices</h2>
              <span className="text-xs font-mono text-zinc-500">{notices.length} active</span>
            </div>

            {notices.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-[#E4E4E7] rounded-xl bg-[#FAFAFA] text-xs text-zinc-500">
                No active notices published yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-4 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {notice.isPinned && (
                          <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 font-mono text-[10px] font-semibold text-amber-700">
                            Pinned
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-white border border-[#E4E4E7] font-mono text-[10px] font-semibold text-zinc-700">
                          {notice.targetBranch}
                          {notice.targetSemester ? ` • Sem ${notice.targetSemester}` : ''}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 font-mono text-[10px] font-semibold text-blue-700">
                          {notice.category}
                        </span>
                        {notice.examDate && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 font-mono text-[10px] font-semibold text-emerald-700">
                            <Calendar className="w-3 h-3" />
                            {new Date(notice.examDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-[#09090B]">{notice.title}</h3>
                      <p className="text-xs text-zinc-600 whitespace-pre-wrap">{notice.content}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleNoticePin(notice)}
                        className="p-1.5 rounded-lg border border-[#E4E4E7] bg-white hover:bg-zinc-100 text-zinc-600 cursor-pointer"
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
                        onClick={() => handleDeleteNotice(notice.id)}
                        className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
                        title="Delete notice"
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

      {/* TAB 4: AI Viva Question Bank & Subject Insights */}
      {activeTab === 'viva' && (
        <div className="space-y-6">
          {/* Live Branch Viva Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-500">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>Viva Sessions Practiced ({vivaBranch})</span>
              </div>
              <p className="text-3xl font-bold text-[#09090B] font-mono mt-2">
                {vivaInsights.totalSessions}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Recorded student practice sessions in Neon DB
              </p>
            </div>

            <div className="md:col-span-2 bg-white border border-[#E4E4E7] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#09090B]">
                  Lowest-Scoring Topics in {vivaBranch}
                </h3>
                <span className="text-[11px] font-mono text-zinc-500">
                  From student VivaSession weakTopics
                </span>
              </div>
              {vivaInsights.lowestScoringTopics.length === 0 ? (
                <p className="text-xs text-zinc-500">
                  No weak-topic flags recorded yet for {vivaBranch}.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {vivaInsights.lowestScoringTopics.map((item, idx) => (
                    <span
                      key={`${item.subjectCode}-${item.topic}-${idx}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900"
                    >
                      <span className="font-mono font-semibold text-[10px] text-amber-700">
                        {item.subjectCode}
                      </span>
                      <span>{item.topic}</span>
                      <span className="font-mono text-[10px] text-amber-700">({item.count})</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Seed Custom MAKAUT Viva Question */}
            <div className="lg:col-span-5 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h2 className="text-base font-bold text-[#09090B]">
                  Seed Custom MAKAUT Viva Question
                </h2>
              </div>
              <p className="text-xs text-zinc-500 mb-4">
                AI Viva Studio prioritizes these faculty questions when examining students in the selected subject.
              </p>

              <form onSubmit={handleAddCustomVivaQuestion} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-600 mb-1">Branch</label>
                    <select
                      value={vivaBranch}
                      onChange={(e) => setVivaBranch(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs font-medium text-zinc-900"
                    >
                      {SYLLABUS_BRANCHES.map((b) => (
                        <option key={b.code} value={b.code}>
                          {b.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-600 mb-1">
                      Semester
                    </label>
                    <select
                      value={vivaSemester}
                      onChange={(e) => setVivaSemester(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs font-medium text-zinc-900"
                    >
                      {SEMESTERS.map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-600 mb-1">
                    MAKAUT Subject
                  </label>
                  <select
                    value={vivaSubjectCode}
                    onChange={(e) => setVivaSubjectCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs font-medium text-zinc-900"
                  >
                    {vivaSubjects.map((s) => (
                      <option key={`${s.code}-${s.name}`} value={s.code}>
                        {s.code} — {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-600 mb-1">
                    Viva Question
                  </label>
                  <textarea
                    rows={3}
                    value={vivaQuestion}
                    onChange={(e) => setVivaQuestion(e.target.value)}
                    placeholder="e.g. Why is a circular queue preferred over a linear array queue, and how do we detect full vs empty?"
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs text-zinc-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-600 mb-1">
                    Expected Key Points (for AI Examiner rubric)
                  </label>
                  <textarea
                    rows={3}
                    value={vivaKeyPoints}
                    onChange={(e) => setVivaKeyPoints(e.target.value)}
                    placeholder="e.g. Avoids false overflow; uses (rear + 1) % N == front for full; reuses freed slots in O(1)."
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs text-zinc-900"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingVivaQ}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{savingVivaQ ? 'Saving...' : 'Add to AI Viva Bank'}</span>
                </button>
              </form>
            </div>

            {/* Existing Custom Viva Questions */}
            <div className="lg:col-span-7 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-[#09090B]">
                  Faculty Viva Question Bank ({vivaBranch})
                </h2>
                <button
                  type="button"
                  onClick={loadVivaBank}
                  className="p-1.5 rounded-lg border border-[#E4E4E7] text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingViva ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {customQuestions.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-[#E4E4E7] rounded-xl bg-[#FAFAFA] text-xs text-zinc-500">
                  No custom viva questions seeded for {vivaBranch} yet.
                </div>
              ) : (
                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                  {customQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-white border border-[#E4E4E7] font-mono text-[10px] font-semibold text-zinc-700">
                            {q.branch} • Sem {q.semester}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 font-mono text-[10px] font-semibold text-blue-700">
                            {q.subjectCode}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-[#09090B]">{q.question}</p>
                        <p className="text-xs text-zinc-600">
                          <span className="font-semibold text-emerald-700">Expected Key Points:</span>{' '}
                          {q.expectedKeyPoints}
                        </p>
                        <p className="text-[11px] font-mono text-zinc-400">Added by {q.createdBy}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteCustomVivaQuestion(q.id)}
                        className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 shrink-0 cursor-pointer"
                        title="Delete question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* In-App Preview Modal for Student Submissions */}
      {previewNote && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E4E4E7] rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-xl">
            <div className="p-5 border-b border-[#E4E4E7] flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 font-mono text-[10px] font-semibold text-blue-700">
                    {previewNote.subjectCode}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    {previewNote.branch} • Sem {previewNote.semester}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#09090B]">{previewNote.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewNote(null)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {previewNote.content ? (
                <pre className="whitespace-pre-wrap font-sans text-xs text-zinc-800 leading-relaxed bg-[#FAFAFA] p-4 rounded-xl border border-[#E4E4E7]">
                  {previewNote.content}
                </pre>
              ) : (
                <div className="p-4 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs text-zinc-600 flex items-center justify-between gap-3">
                  <span className="truncate">External resource: {previewNote.fileUrl}</span>
                  <a
                    href={previewNote.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 font-semibold shrink-0 hover:underline"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#E4E4E7] flex items-center justify-end gap-2 bg-[#FAFAFA] rounded-b-2xl">
              <button
                type="button"
                onClick={() => handleDeleteNote(previewNote.id)}
                className="px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold cursor-pointer"
              >
                Reject & Delete
              </button>
              {!previewNote.verified && (
                <button
                  type="button"
                  onClick={() => {
                    handleVerifyNote(previewNote.id, true);
                    setPreviewNote(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Approve & Stamp Verified
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
