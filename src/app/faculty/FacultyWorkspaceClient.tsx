'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  FileCheck2,
  Bell,
  MessageSquare,
  Sparkles,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Send,
  Trash2,
  Pin,
  PinOff,
  Plus,
  BookOpen,
  ExternalLink,
  Check,
  HelpCircle,
} from 'lucide-react';

type FacultyTab = 'overview' | 'notes' | 'notices' | 'doubts' | 'viva';

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
  fileUrl: string;
  verified: boolean;
  createdAt: string;
  uploader?: { fullName?: string | null; email?: string | null; branch?: string | null };
}

interface NoticeRecord {
  id: string;
  title: string;
  content: string;
  category: string;
  targetBranch: string;
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

interface VivaTopicRecord {
  id: string;
  subjectCode: string;
  subjectName: string;
  branch: string;
  semester: number;
  topicTitle: string;
  keyConcepts: string;
  sampleVivaQ: string;
  authorName: string;
  createdAt: string;
}

export function FacultyWorkspaceClient({ userEmail, userName }: { userEmail: string; userName: string }) {
  const [activeTab, setActiveTab] = useState<FacultyTab>('overview');
  const [toast, setToast] = useState<{ text: string; isError?: boolean } | null>(null);

  const showToast = useCallback((text: string, isError = false) => {
    setToast({ text, isError });
    setTimeout(() => setToast(null), 4500);
  }, []);

  // Overview + Notes + Notices state
  const [kpis, setKpis] = useState<FacultyKPIs>({
    uploadedNotes: 0,
    totalNotes: 0,
    pendingSubmissions: 0,
    unansweredDoubts: 0,
    activeNotices: 0,
  });
  const [notesQueue, setNotesQueue] = useState<NoteRecord[]>([]);
  const [notices, setNotices] = useState<NoticeRecord[]>([]);
  const [loadingOverview, setLoadingOverview] = useState(false);

  // Publish Note form state
  const [pubTitle, setPubTitle] = useState('');
  const [pubSubjectCode, setPubSubjectCode] = useState('');
  const [pubSubjectName, setPubSubjectName] = useState('');
  const [pubBranch, setPubBranch] = useState('CSE');
  const [pubSemester, setPubSemester] = useState(3);
  const [pubUnit, setPubUnit] = useState('');
  const [pubMode, setPubMode] = useState<'url' | 'file'>('url');
  const [pubUrl, setPubUrl] = useState('');
  const [pubFile, setPubFile] = useState<File | null>(null);
  const [publishingNote, setPublishingNote] = useState(false);

  // Notice form state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDepartment, setNoticeDepartment] = useState('CSE');
  const [noticeCategory, setNoticeCategory] = useState<'ACADEMIC' | 'EXAM' | 'URGENT' | 'EVENT'>('ACADEMIC');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticePinned, setNoticePinned] = useState(false);
  const [publishingNotice, setPublishingNotice] = useState(false);

  // Doubts state
  const [doubts, setDoubts] = useState<DoubtRecord[]>([]);
  const [doubtBranchFilter, setDoubtBranchFilter] = useState('ALL');
  const [doubtShowAll, setDoubtShowAll] = useState(false);
  const [loadingDoubts, setLoadingDoubts] = useState(false);
  const [answeringDoubtId, setAnsweringDoubtId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  // Viva Curator state
  const [vivaTopics, setVivaTopics] = useState<VivaTopicRecord[]>([]);
  const [loadingViva, setLoadingViva] = useState(false);
  const [vivaSubjectCode, setVivaSubjectCode] = useState('');
  const [vivaSubjectName, setVivaSubjectName] = useState('');
  const [vivaBranch, setVivaBranch] = useState('CSE');
  const [vivaSemester, setVivaSemester] = useState(3);
  const [vivaTopicTitle, setVivaTopicTitle] = useState('');
  const [vivaKeyConcepts, setVivaKeyConcepts] = useState('');
  const [vivaSampleQ, setVivaSampleQ] = useState('');
  const [savingViva, setSavingViva] = useState(false);

  // Sync hash (#queue, #notices, #doubts, #viva)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace('#', '');
    if (hash === 'queue' || hash === 'notes') setActiveTab('notes');
    if (hash === 'notices') setActiveTab('notices');
    if (hash === 'doubts') setActiveTab('doubts');
    if (hash === 'viva') setActiveTab('viva');
  }, []);

  const fetchOverview = useCallback(async () => {
    setLoadingOverview(true);
    try {
      const res = await fetch('/api/faculty/overview');
      if (res.ok) {
        const data = await res.json();
        if (data.kpis) setKpis(data.kpis);
        setNotesQueue(data.notesQueue || []);
        setNotices(data.notices || []);
      }
    } finally {
      setLoadingOverview(false);
    }
  }, []);

  const fetchDoubts = useCallback(async () => {
    setLoadingDoubts(true);
    try {
      const params = new URLSearchParams({
        branch: doubtBranchFilter,
        filter: doubtShowAll ? 'all' : 'unanswered',
      });
      const res = await fetch(`/api/faculty/doubts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDoubts(data.doubts || []);
      }
    } finally {
      setLoadingDoubts(false);
    }
  }, [doubtBranchFilter, doubtShowAll]);

  const fetchVivaTopics = useCallback(async () => {
    setLoadingViva(true);
    try {
      const res = await fetch('/api/faculty/viva-topics');
      if (res.ok) {
        const data = await res.json();
        setVivaTopics(data.topics || []);
      }
    } finally {
      setLoadingViva(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    if (activeTab === 'doubts') fetchDoubts();
    if (activeTab === 'viva') fetchVivaTopics();
  }, [activeTab, fetchDoubts, fetchVivaTopics]);

  // Approve or Reject a student note
  const handleVerifyNote = async (id: string, verified: boolean) => {
    try {
      const res = await fetch(`/api/faculty/notes/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified }),
      });
      if (res.ok) {
        showToast(verified ? 'Note stamped as Faculty Verified!' : 'Verification removed.');
        fetchOverview();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to update verification', true);
      }
    } catch (e: any) {
      showToast(e?.message || 'Network error', true);
    }
  };

  const handleRejectNote = async (id: string) => {
    try {
      const res = await fetch(`/api/faculty/notes/${id}/verify`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Submission rejected and removed from queue.');
        fetchOverview();
      }
    } catch {}
  };

  // Publish official Faculty Verified note
  const handlePublishMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubTitle.trim() || !pubSubjectCode.trim()) return;
    setPublishingNote(true);

    try {
      if (pubMode === 'file' && pubFile) {
        const formData = new FormData();
        formData.append('file', pubFile);
        formData.append('title', pubUnit ? `[${pubUnit.trim()}] ${pubTitle.trim()}` : pubTitle.trim());
        formData.append('subjectCode', pubSubjectCode.trim().toUpperCase());
        formData.append('subjectName', pubSubjectName.trim());
        formData.append('branch', pubBranch);
        formData.append('semester', String(pubSemester));

        const res = await fetch('/api/notes/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
      } else {
        const res = await fetch('/api/faculty/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: pubTitle,
            subjectCode: pubSubjectCode,
            subjectName: pubSubjectName,
            branch: pubBranch,
            semester: pubSemester,
            unitModule: pubUnit,
            fileUrl: pubUrl,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Publish failed');
      }

      showToast('Official Faculty Verified study material published to Notes Vault!');
      setPubTitle('');
      setPubSubjectCode('');
      setPubSubjectName('');
      setPubUnit('');
      setPubUrl('');
      setPubFile(null);
      fetchOverview();
    } catch (err: any) {
      showToast(err?.message || 'Failed to publish study material', true);
    } finally {
      setPublishingNote(false);
    }
  };

  // Publish Notice
  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;
    setPublishingNotice(true);

    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: noticeTitle.trim(),
          content: noticeContent.trim(),
          targetBranch: noticeDepartment,
          category: noticeCategory,
          isPinned: noticePinned,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish notice');

      showToast('Department notice published to all target students!');
      setNoticeTitle('');
      setNoticeContent('');
      setNoticePinned(false);
      fetchOverview();
    } catch (err: any) {
      showToast(err?.message || 'Failed to publish notice', true);
    } finally {
      setPublishingNotice(false);
    }
  };

  const handleTogglePin = async (n: NoticeRecord) => {
    const res = await fetch(`/api/notices/${n.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPinned: !n.isPinned }),
    });
    if (res.ok) fetchOverview();
  };

  const handleDeleteNotice = async (id: string) => {
    const res = await fetch(`/api/notices/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Notice removed.');
      fetchOverview();
    }
  };

  // Submit Official Faculty Answer
  const handleSubmitDoubtAnswer = async (postId: string) => {
    if (!answerText.trim()) return;
    setSubmittingAnswer(true);
    try {
      const res = await fetch('/api/faculty/doubts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content: answerText.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit answer');

      showToast('Official Faculty Answer posted and highlighted on Campus Forum!');
      setAnsweringDoubtId(null);
      setAnswerText('');
      fetchDoubts();
      fetchOverview();
    } catch (err: any) {
      showToast(err?.message || 'Failed to submit official answer', true);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // Save Curated AI Viva Topic
  const handleSaveVivaTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vivaSubjectCode.trim() || !vivaTopicTitle.trim() || !vivaKeyConcepts.trim() || !vivaSampleQ.trim()) return;
    setSavingViva(true);
    try {
      const res = await fetch('/api/faculty/viva-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectCode: vivaSubjectCode,
          subjectName: vivaSubjectName || vivaSubjectCode,
          branch: vivaBranch,
          semester: vivaSemester,
          topicTitle: vivaTopicTitle,
          keyConcepts: vivaKeyConcepts,
          sampleVivaQ: vivaSampleQ,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save viva topic');

      showToast('Curated AI Viva topic & questions saved to Neon DB!');
      setVivaTopicTitle('');
      setVivaKeyConcepts('');
      setVivaSampleQ('');
      fetchVivaTopics();
    } catch (err: any) {
      showToast(err?.message || 'Failed to save viva topic', true);
    } finally {
      setSavingViva(false);
    }
  };

  const handleDeleteVivaTopic = async (id: string) => {
    const res = await fetch(`/api/faculty/viva-topics?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Viva topic removed.');
      fetchVivaTopics();
    }
  };

  const tabs: Array<{
    id: FacultyTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'overview', label: 'Overview Desk', icon: LayoutDashboard },
    { id: 'notes', label: 'Notes & Verification', icon: FileCheck2, badge: kpis.pendingSubmissions },
    { id: 'notices', label: 'Notices & Assignments', icon: Bell },
    { id: 'doubts', label: 'Official Doubt Solver', icon: MessageSquare, badge: kpis.unansweredDoubts },
    { id: 'viva', label: 'AI Viva Curator', icon: Sparkles },
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
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold tabular-nums ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-sans flex items-center justify-between ${
            toast.isError
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.isError ? (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
            <span>{toast.text}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-[11px] font-mono underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* =========================================================================
          TAB 1: FACULTY OVERVIEW DESK
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 4 KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 shadow-xs space-y-1.5">
              <div className="text-[11px] font-mono text-zinc-500 uppercase">Verified Vault Notes</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-[#09090B]">
                {kpis.uploadedNotes}
              </div>
              <div className="text-[11px] font-mono text-emerald-700">
                of {kpis.totalNotes} total submissions
              </div>
            </div>

            <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 shadow-xs space-y-1.5">
              <div className="text-[11px] font-mono text-zinc-500 uppercase">Pending Verification</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-amber-700">
                {kpis.pendingSubmissions}
              </div>
              <div className="text-[11px] font-mono text-zinc-500">Awaiting Faculty Stamp</div>
            </div>

            <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 shadow-xs space-y-1.5">
              <div className="text-[11px] font-mono text-zinc-500 uppercase">Unanswered Doubts</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-[#2563EB]">
                {kpis.unansweredDoubts}
              </div>
              <div className="text-[11px] font-mono text-zinc-500">Need Official Reply</div>
            </div>

            <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 shadow-xs space-y-1.5">
              <div className="text-[11px] font-mono text-zinc-500 uppercase">Active Notices</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-[#09090B]">
                {kpis.activeNotices}
              </div>
              <div className="text-[11px] font-mono text-purple-700">Live Circulars</div>
            </div>
          </div>

          {/* Quick Actions Launchpad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <button
              onClick={() => setActiveTab('notes')}
              className="p-4 rounded-2xl bg-white border border-[#E4E4E7] hover:border-emerald-400 text-left space-y-1.5 shadow-xs transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Upload className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-[#09090B]">Publish Verified Notes</div>
              <div className="text-[11px] text-zinc-500">Upload PDF or review student queue</div>
            </button>

            <button
              onClick={() => setActiveTab('notices')}
              className="p-4 rounded-2xl bg-white border border-[#E4E4E7] hover:border-blue-400 text-left space-y-1.5 shadow-xs transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-[#09090B]">Broadcast Notice</div>
              <div className="text-[11px] text-zinc-500">Lab schedules &amp; CA exam circulars</div>
            </button>

            <button
              onClick={() => setActiveTab('doubts')}
              className="p-4 rounded-2xl bg-white border border-[#E4E4E7] hover:border-purple-400 text-left space-y-1.5 shadow-xs transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-[#09090B]">Solve Forum Doubts</div>
              <div className="text-[11px] text-zinc-500">Post Official Faculty Answers</div>
            </button>

            <button
              onClick={() => setActiveTab('viva')}
              className="p-4 rounded-2xl bg-white border border-[#E4E4E7] hover:border-amber-400 text-left space-y-1.5 shadow-xs transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-[#09090B]">Curate AI Viva Topics</div>
              <div className="text-[11px] text-zinc-500">Add key concepts per subject code</div>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: NOTES & PYQ PUBLISHER + VERIFICATION QUEUE
          ========================================================================= */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Publisher Form */}
          <div className="lg:col-span-5 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 h-fit">
            <div className="pb-3 border-b border-zinc-100">
              <h2 className="text-sm font-bold text-[#09090B]">Publish Official Faculty-Verified Material</h2>
              <p className="text-xs text-zinc-500">Automatically stamped with the green Faculty Verified badge</p>
            </div>

            <form onSubmit={handlePublishMaterial} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">Material Title</label>
                <input
                  type="text"
                  value={pubTitle}
                  onChange={(e) => setPubTitle(e.target.value)}
                  placeholder="e.g. Trees & Graph Algorithms Complete Notes"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">MAKAUT Code</label>
                  <input
                    type="text"
                    value={pubSubjectCode}
                    onChange={(e) => setPubSubjectCode(e.target.value)}
                    placeholder="PCC-CS301"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">Unit / Module</label>
                  <input
                    type="text"
                    value={pubUnit}
                    onChange={(e) => setPubUnit(e.target.value)}
                    placeholder="Module 3"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">Branch</label>
                  <select
                    value={pubBranch}
                    onChange={(e) => setPubBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EE">EE</option>
                    <option value="ME">ME</option>
                    <option value="CE">CE</option>
                    <option value="IT">IT</option>
                    <option value="AIML">AIML</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">Semester</label>
                  <select
                    value={pubSemester}
                    onChange={(e) => setPubSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Sem {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setPubMode('url')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono border cursor-pointer ${
                    pubMode === 'url' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                  }`}
                >
                  PDF Link / URL
                </button>
                <button
                  type="button"
                  onClick={() => setPubMode('file')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono border cursor-pointer ${
                    pubMode === 'file' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                  }`}
                >
                  Upload File
                </button>
              </div>

              {pubMode === 'url' ? (
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">Document URL</label>
                  <input
                    type="url"
                    value={pubUrl}
                    onChange={(e) => setPubUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">PDF / Image File</label>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    onChange={(e) => setPubFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-zinc-600"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={publishingNote}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{publishingNote ? 'Publishing...' : 'Publish Faculty-Verified Material'}</span>
              </button>
            </form>
          </div>

          {/* Student Submission Verification Queue */}
          <div className="lg:col-span-7 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h2 className="text-sm font-bold text-[#09090B]">Student Submissions Queue ({notesQueue.length})</h2>
                <p className="text-xs text-zinc-500">Approve to stamp &ldquo;Faculty Verified&rdquo; or reject low-quality uploads</p>
              </div>
              <button onClick={fetchOverview} className="p-1.5 rounded-lg border border-zinc-200 cursor-pointer">
                <RefreshCw className={`w-3.5 h-3.5 ${loadingOverview ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {notesQueue.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                No student note submissions in Neon DB yet.
              </div>
            ) : (
              <div className="space-y-3">
                {notesQueue.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border space-y-2.5 ${
                      item.verified ? 'bg-emerald-50/30 border-emerald-200' : 'bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-[#2563EB] font-mono text-[10px] font-bold">
                            {item.subjectCode}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {item.branch} • Sem {item.semester}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                              item.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.verified ? 'Faculty Verified' : 'Pending Review'}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-[#09090B]">{item.title}</div>
                        <div className="text-[11px] font-mono text-zinc-500">
                          Submitted by {item.uploader?.fullName || item.uploader?.email || 'Student'}
                        </div>
                      </div>

                      {item.fileUrl && (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono text-[#2563EB] hover:underline inline-flex items-center gap-1 shrink-0"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!item.verified ? (
                        <button
                          onClick={() => handleVerifyNote(item.id, true)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve &amp; Verify</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVerifyNote(item.id, false)}
                          className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-semibold cursor-pointer"
                        >
                          Revoke Badge
                        </button>
                      )}
                      <button
                        onClick={() => handleRejectNote(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
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
          TAB 3: ACADEMIC NOTICE & ASSIGNMENT BOARD
          ========================================================================= */}
      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 h-fit">
            <div className="pb-3 border-b border-zinc-100">
              <h2 className="text-sm font-bold text-[#09090B]">Broadcast Department Notice</h2>
              <p className="text-xs text-zinc-500">Appears immediately on Student Cockpits &amp; /notices</p>
            </div>

            <form onSubmit={handlePublishNotice} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">Notice Title</label>
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. CA2 Internal Lab Viva Schedule (CSE Sem 5)"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">Target Department</label>
                  <select
                    value={noticeDepartment}
                    onChange={(e) => setNoticeDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
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
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">Category</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
                  >
                    <option value="ACADEMIC">Academic</option>
                    <option value="EXAM">Exam / CA</option>
                    <option value="URGENT">Urgent</option>
                    <option value="EVENT">Lab / Event</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">Circular Details</label>
                <textarea
                  rows={4}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="Include dates, lab room numbers, or submission instructions..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs"
                  required
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={noticePinned}
                  onChange={(e) => setNoticePinned(e.target.checked)}
                />
                <span>Pin to top of Student Dashboard</span>
              </label>

              <button
                type="submit"
                disabled={publishingNotice}
                className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{publishingNotice ? 'Publishing...' : 'Publish Official Notice'}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h2 className="text-sm font-bold text-[#09090B]">Active Notices ({notices.length})</h2>
                <p className="text-xs text-zinc-500">Live departmental circulars</p>
              </div>
              <button onClick={fetchOverview} className="p-1.5 rounded-lg border border-zinc-200 cursor-pointer">
                <RefreshCw className={`w-3.5 h-3.5 ${loadingOverview ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {notices.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                No active notices. Publish a circular using the form on the left.
              </div>
            ) : (
              <div className="space-y-3">
                {notices.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-xl border space-y-2 ${
                      n.isPinned ? 'bg-amber-50/40 border-amber-200' : 'bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-zinc-200/80 text-zinc-800 font-mono text-[10px] font-bold">
                            {n.category}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px]">
                            {n.targetBranch}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-[#09090B]">{n.title}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleTogglePin(n)}
                          className="p-1.5 rounded-lg hover:bg-white text-zinc-600 cursor-pointer"
                          title={n.isPinned ? 'Unpin' : 'Pin'}
                        >
                          {n.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
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
          TAB 4: Q&A FORUM OFFICIAL DOUBT SOLVER
          ========================================================================= */}
      {activeTab === 'doubts' && (
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-base font-bold text-[#09090B]">Student Doubts &amp; Official Faculty Answers</h2>
              <p className="text-xs text-zinc-500">
                Answers posted here are highlighted with the <span className="text-emerald-700 font-semibold">Official Faculty Answer</span> badge on /forum.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={doubtBranchFilter}
                onChange={(e) => setDoubtBranchFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
              >
                <option value="ALL">ALL Branches</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EE">EE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
              </select>
              <button
                onClick={() => setDoubtShowAll((prev) => !prev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono border cursor-pointer ${
                  doubtShowAll ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                }`}
              >
                {doubtShowAll ? 'Showing All' : 'Unanswered Only'}
              </button>
              <button onClick={fetchDoubts} className="p-2 rounded-xl border border-zinc-200 cursor-pointer">
                <RefreshCw className={`w-3.5 h-3.5 ${loadingDoubts ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {doubts.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
              {loadingDoubts ? 'Loading student doubts...' : 'All student questions have been answered!'}
            </div>
          ) : (
            <div className="space-y-3.5">
              {doubts.map((doubt) => (
                <div key={doubt.id} className="p-4 rounded-xl bg-zinc-50/70 border border-[#E4E4E7] space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-200 font-mono text-[10px] font-bold">
                          {doubt.branch || doubt.category || 'Academic'}
                        </span>
                        {doubt.hasOfficialAnswer ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                            Official Answer Posted
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">
                            Awaiting Faculty Reply
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-[#09090B]">{doubt.title}</h3>
                      <p className="text-xs text-zinc-600 leading-relaxed">{doubt.content}</p>
                      <div className="text-[11px] font-mono text-zinc-400">
                        Asked by {doubt.author?.fullName || 'Student'} • {doubt.replies.length} replies
                      </div>
                    </div>
                  </div>

                  {/* Existing Official Replies */}
                  {doubt.replies.filter((r) => r.isOfficialAnswer).map((r) => (
                    <div key={r.id} className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                      <div className="font-mono text-[10px] font-bold text-emerald-800">
                        ✓ OFFICIAL FACULTY ANSWER • {r.author?.fullName || userName}
                      </div>
                      <p className="text-emerald-950">{r.content}</p>
                    </div>
                  ))}

                  {answeringDoubtId === doubt.id ? (
                    <div className="space-y-2 pt-1">
                      <textarea
                        rows={3}
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        placeholder="Write your authoritative explanation or MAKAUT exam tip..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E4E4E7] text-xs"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSubmitDoubtAnswer(doubt.id)}
                          disabled={submittingAnswer}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{submittingAnswer ? 'Posting...' : 'Post Official Answer'}</span>
                        </button>
                        <button
                          onClick={() => {
                            setAnsweringDoubtId(null);
                            setAnswerText('');
                          }}
                          className="px-3 py-1.5 rounded-xl border border-zinc-200 text-xs text-zinc-600 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setAnsweringDoubtId(doubt.id);
                        setAnswerText('');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white border border-zinc-200 hover:border-[#2563EB] text-xs font-semibold text-[#09090B] inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Write Official Faculty Answer</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 5: AI VIVA TOPIC & QUESTION CURATOR
          ========================================================================= */}
      {activeTab === 'viva' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 h-fit">
            <div className="pb-3 border-b border-zinc-100">
              <h2 className="text-sm font-bold text-[#09090B]">Curate AI Viva Questions &amp; Concepts</h2>
              <p className="text-xs text-zinc-500">Enrich student AI Viva practice with MAKAUT examiner questions</p>
            </div>

            <form onSubmit={handleSaveVivaTopic} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={vivaSubjectCode}
                    onChange={(e) => setVivaSubjectCode(e.target.value)}
                    placeholder="PCC-CS301"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">Subject Name</label>
                  <input
                    type="text"
                    value={vivaSubjectName}
                    onChange={(e) => setVivaSubjectName(e.target.value)}
                    placeholder="DSA"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">Branch</label>
                  <select
                    value={vivaBranch}
                    onChange={(e) => setVivaBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EE">EE</option>
                    <option value="ME">ME</option>
                    <option value="CE">CE</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">Semester</label>
                  <select
                    value={vivaSemester}
                    onChange={(e) => setVivaSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Sem {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">Topic Title</label>
                <input
                  type="text"
                  value={vivaTopicTitle}
                  onChange={(e) => setVivaTopicTitle(e.target.value)}
                  placeholder="e.g. AVL Tree Rotations & Time Complexity"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">Key Concepts Expected</label>
                <textarea
                  rows={2}
                  value={vivaKeyConcepts}
                  onChange={(e) => setVivaKeyConcepts(e.target.value)}
                  placeholder="Balance factor (-1, 0, +1), LL/RR/LR/RL rotations, O(log n) search..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">Curated Viva Questions</label>
                <textarea
                  rows={3}
                  value={vivaSampleQ}
                  onChange={(e) => setVivaSampleQ(e.target.value)}
                  placeholder="1. Why does BST degrade to O(n)? 2. When is an LR double rotation required?"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={savingViva}
                className="w-full py-2.5 rounded-xl bg-[#09090B] hover:bg-zinc-800 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{savingViva ? 'Saving...' : 'Add Curated Viva Topic'}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h2 className="text-sm font-bold text-[#09090B]">Curated Viva Bank ({vivaTopics.length})</h2>
                <p className="text-xs text-zinc-500">Persisted in Neon PostgreSQL</p>
              </div>
              <button onClick={fetchVivaTopics} className="p-1.5 rounded-lg border border-zinc-200 cursor-pointer">
                <RefreshCw className={`w-3.5 h-3.5 ${loadingViva ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {vivaTopics.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                No curated viva topics yet. Add your first subject topic on the left.
              </div>
            ) : (
              <div className="space-y-3">
                {vivaTopics.map((vt) => (
                  <div key={vt.id} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-[10px] font-bold">
                            {vt.subjectCode}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {vt.subjectName} • {vt.branch} Sem {vt.semester}
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-[#09090B] mt-1">{vt.topicTitle}</h3>
                      </div>
                      <button
                        onClick={() => handleDeleteVivaTopic(vt.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-zinc-600">
                      <span className="font-semibold text-zinc-800">Concepts:</span> {vt.keyConcepts}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-700 bg-white p-2.5 rounded-lg border border-zinc-200/80">
                      {vt.sampleVivaQ}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
