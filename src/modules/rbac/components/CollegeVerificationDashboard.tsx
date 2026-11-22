'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Download, 
  Clock, 
  Check, 
  Filter, 
  Search, 
  AlertCircle,
  GraduationCap,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Upload,
  Bell,
  Send,
  PlusCircle
} from 'lucide-react';
import { NoteItem, ForumPost, Department, NoteCategory } from '@/types';
import { 
  verifyNoteAction, 
  toggleOfficialAnswerAction, 
  uploadVerifiedNoteAction, 
  postOfficialNoticeAction 
} from '../actions';
import { RoleBadge } from './RoleBadge';

interface CollegeVerificationDashboardProps {
  initialNotes: NoteItem[];
  departments: Department[];
  forumPosts: ForumPost[];
  currentUserName: string;
  currentUserRole: string;
}

export function CollegeVerificationDashboard({
  initialNotes,
  departments,
  forumPosts,
  currentUserName,
  currentUserRole,
}: CollegeVerificationDashboardProps) {
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [activeTab, setActiveTab] = useState<'notes' | 'upload' | 'notice' | 'forum' | 'curriculum'>('notes');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Upload verified note form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    subjectCode: 'PCC-CS301',
    subjectName: 'Data Structures & Algorithms',
    departmentCode: 'CSE',
    semester: 3,
    category: 'LECTURE_NOTE' as NoteCategory,
    academicYear: '2026-27',
  });
  const [uploadSubmitting, setUploadSubmitting] = useState(false);

  // Post official notice form state
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    department: 'All Departments',
    category: 'Academic' as 'Examination' | 'Academic' | 'Laboratories' | 'Transit' | 'Administration',
    priority: 'high' as 'low' | 'medium' | 'high' | 'urgent',
  });
  const [noticeSubmitting, setNoticeSubmitting] = useState(false);

  // Forum state for official answer toggles
  const [posts, setPosts] = useState<ForumPost[]>(forumPosts);

  // Statistics
  const pendingCount = notes.filter((n) => n.status === 'pending').length;
  const approvedCount = notes.filter((n) => n.status === 'approved').length;
  const totalDownloads = notes.reduce((sum, n) => sum + (n.downloadsCount || 0), 0);

  const handleUploadVerifiedNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) return;
    setUploadSubmitting(true);
    try {
      const res = await uploadVerifiedNoteAction({
        title: uploadForm.title,
        subjectCode: uploadForm.subjectCode,
        subjectName: uploadForm.subjectName,
        departmentCode: uploadForm.departmentCode,
        semester: Number(uploadForm.semester),
        category: uploadForm.category,
        academicYear: uploadForm.academicYear,
      });
      if (res.success && res.note) {
        setNotes((prev) => [res.note!, ...prev]);
        setToastMessage(`Verified resource "${res.note.title}" published with faculty endorsement!`);
        setActiveTab('notes');
        setUploadForm({
          title: '',
          subjectCode: 'PCC-CS301',
          subjectName: 'Data Structures & Algorithms',
          departmentCode: 'CSE',
          semester: 3,
          category: 'LECTURE_NOTE',
          academicYear: '2026-27',
        });
      } else {
        setToastMessage(res.error || 'Failed to publish verified note.');
      }
    } catch (err: any) {
      setToastMessage(err.message || 'Error publishing verified note.');
    } finally {
      setUploadSubmitting(false);
    }
  };

  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title.trim() || !noticeForm.content.trim()) return;
    setNoticeSubmitting(true);
    try {
      const res = await postOfficialNoticeAction({
        title: noticeForm.title,
        content: noticeForm.content,
        department: noticeForm.department,
        category: noticeForm.category,
        priority: noticeForm.priority,
      });
      if (res.success && res.notice) {
        setToastMessage(`Official notice "${res.notice.title}" broadcasted successfully!`);
        setNoticeForm({
          title: '',
          content: '',
          department: 'All Departments',
          category: 'Academic',
          priority: 'high',
        });
      } else {
        setToastMessage(res.error || 'Failed to broadcast notice.');
      }
    } catch (err: any) {
      setToastMessage(err.message || 'Error broadcasting notice.');
    } finally {
      setNoticeSubmitting(false);
    }
  };

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    const matchesDept = deptFilter === 'ALL' || n.departmentCode === deptFilter;
    const matchesStatus = statusFilter === 'all' || n.status === statusFilter;
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.uploaderName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDept && matchesStatus && matchesSearch;
  });

  // Handle Note Verification
  const handleVerifyNote = async (noteId: string, status: 'approved' | 'rejected') => {
    setProcessingId(noteId);
    setToastMessage(null);
    try {
      const res = await verifyNoteAction({ noteId, status });
      if (res.success) {
        setNotes((prev) =>
          prev.map((n) =>
            n.id === noteId
              ? {
                  ...n,
                  status,
                  verifiedByName: res.verifiedByName,
                  verifiedAt: res.verifiedAt,
                }
              : n
          )
        );
        setToastMessage(
          status === 'approved'
            ? `Note approved and published to SETGOI Notes Vault.`
            : `Note marked as rejected.`
        );
      } else {
        setToastMessage(`Action failed: ${res.error}`);
      }
    } catch (err: any) {
      setToastMessage(`Error: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Official Answer Endorsement
  const handleToggleOfficialAnswer = async (postId: string, replyId: string, currentState: boolean) => {
    setProcessingId(replyId);
    setToastMessage(null);
    try {
      const newState = !currentState;
      const res = await toggleOfficialAnswerAction({ replyId, isOfficial: newState });
      if (res.success) {
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id !== postId) return p;
            return {
              ...p,
              replies: p.replies.map((r) =>
                r.id === replyId ? { ...r, isOfficialAnswer: newState } : r
              ),
            };
          })
        );
        setToastMessage(
          newState
            ? 'Endorsed reply with official SETGOI Faculty Verification badge!'
            : 'Removed official faculty endorsement badge.'
        );
      } else {
        setToastMessage(`Action failed: ${res.error}`);
      }
    } catch (err: any) {
      setToastMessage(`Error: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Review */}
        <div className="bg-white border border-zinc-200 rounded-lg p-5">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Awaiting Verification</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 tracking-tight font-mono">
            {pendingCount}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Requires Faculty Approval
          </div>
        </div>

        {/* Total Approved */}
        <div className="bg-white border border-zinc-200 rounded-lg p-5">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Verified In Vault</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 tracking-tight font-mono">
            {approvedCount}
          </div>
          <div className="mt-2 text-xs text-zinc-500 font-mono">
            Official MAKAUT curriculum items
          </div>
        </div>

        {/* Total Downloads */}
        <div className="bg-white border border-zinc-200 rounded-lg p-5">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Student Downloads</span>
            <Download className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 tracking-tight font-mono">
            {totalDownloads.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-zinc-500 font-mono">
            Across CSE, ECE, EE, ME, CE
          </div>
        </div>

        {/* Active Verifier */}
        <div className="bg-white border border-zinc-200 rounded-lg p-5">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Reviewing As</span>
            <GraduationCap className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-sm font-semibold text-zinc-900 truncate">
            {currentUserName}
          </div>
          <div className="mt-2">
            <RoleBadge role={currentUserRole as any} showIcon={false} />
          </div>
        </div>
      </div>

      {/* Toast feedback */}
      {toastMessage && (
        <div className="p-3 bg-zinc-900 text-white text-xs font-mono rounded-lg flex items-center justify-between shadow-sm">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-zinc-400 hover:text-white text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex border-b border-zinc-200 bg-white rounded-t-lg px-4 pt-2 gap-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 px-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'notes'
              ? 'border-zinc-900 text-zinc-900 font-bold'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Notes Review Queue
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`pb-3 px-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'upload'
              ? 'border-zinc-900 text-zinc-900 font-bold'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Upload className="w-4 h-4 text-emerald-600" />
          Upload Verified Resource
        </button>

        <button
          onClick={() => setActiveTab('notice')}
          className={`pb-3 px-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'notice'
              ? 'border-zinc-900 text-zinc-900 font-bold'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Bell className="w-4 h-4 text-sky-600" />
          Post Official Notice
        </button>

        <button
          onClick={() => setActiveTab('forum')}
          className={`pb-3 px-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'forum'
              ? 'border-zinc-900 text-zinc-900 font-bold'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Faculty Q&A Endorsements
        </button>

        <button
          onClick={() => setActiveTab('curriculum')}
          className={`pb-3 px-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'curriculum'
              ? 'border-zinc-900 text-zinc-900 font-bold'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Departments & Curriculum Overview
        </button>
      </div>

      {/* TAB 1: NOTES VERIFICATION QUEUE */}
      {activeTab === 'notes' && (
        <div className="bg-white border border-zinc-200 rounded-b-lg overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 border-b border-zinc-200 bg-zinc-50/50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Department Selector */}
              <div className="flex items-center gap-1 bg-white p-1 rounded border border-zinc-200 text-xs font-mono">
                {['ALL', 'CSE', 'ECE', 'EE', 'ME', 'CE'].map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setDeptFilter(dept)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      deptFilter === dept
                        ? 'bg-zinc-900 text-white font-medium'
                        : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-1 bg-white p-1 rounded border border-zinc-200 text-xs font-mono">
                {(['pending', 'approved', 'rejected', 'all'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2 py-0.5 rounded capitalize transition-colors ${
                      statusFilter === st
                        ? 'bg-zinc-900 text-white font-medium'
                        : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="w-full sm:w-64 relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search subject code or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-zinc-200 rounded bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400"
              />
            </div>
          </div>

          {/* Notes Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
                  <th className="py-2.5 px-4 font-medium">Subject Code / Title</th>
                  <th className="py-2.5 px-4 font-medium">Dept & Sem</th>
                  <th className="py-2.5 px-4 font-medium">Uploader</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                  <th className="py-2.5 px-4 font-medium text-right">Faculty Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredNotes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-zinc-400 font-mono">
                      No notes found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredNotes.map((note) => {
                    const isBusy = processingId === note.id;

                    return (
                      <tr key={note.id} className="hover:bg-zinc-50/75 transition-colors">
                        <td className="py-3 px-4 max-w-xs sm:max-w-md">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                              {note.subjectCode}
                            </span>
                            <span className="text-[11px] font-mono text-zinc-500">
                              {note.category.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="font-medium text-zinc-900 mt-1 line-clamp-1">
                            {note.title}
                          </div>
                          <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                            {note.subjectName} • {(note.fileSize / 1024 / 1024).toFixed(1)} MB
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-medium text-zinc-800">{note.departmentCode}</div>
                          <div className="text-[11px] text-zinc-500 font-mono">
                            Semester {note.semester}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="text-zinc-900 font-medium">{note.uploaderName}</div>
                          <RoleBadge role={note.uploaderRole} showIcon={false} />
                        </td>

                        <td className="py-3 px-4">
                          {note.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 font-mono text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              <Clock className="w-3 h-3" /> Pending Review
                            </span>
                          )}
                          {note.status === 'approved' && (
                            <div>
                              <span className="inline-flex items-center gap-1 font-mono text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" /> Verified
                              </span>
                              {note.verifiedByName && (
                                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                                  by {note.verifiedByName}
                                </div>
                              )}
                            </div>
                          )}
                          {note.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1 font-mono text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              <XCircle className="w-3 h-3" /> Rejected
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <a
                              href={note.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1 text-[11px] font-mono rounded border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 inline-flex items-center gap-1 transition-colors"
                              title="Download & inspect note"
                            >
                              <Download className="w-3 h-3 text-zinc-500" />
                              View
                            </a>

                            <button
                              disabled={isBusy || note.status === 'approved'}
                              onClick={() => handleVerifyNote(note.id, 'approved')}
                              className={`px-2.5 py-1 text-[11px] font-mono rounded border transition-colors inline-flex items-center gap-1 ${
                                note.status === 'approved'
                                  ? 'bg-emerald-50 text-emerald-400 border-emerald-200 cursor-default'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600'
                              }`}
                            >
                              <Check className="w-3 h-3" />
                              Approve
                            </button>

                            <button
                              disabled={isBusy || note.status === 'rejected'}
                              onClick={() => handleVerifyNote(note.id, 'rejected')}
                              className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors inline-flex items-center gap-1 ${
                                note.status === 'rejected'
                                  ? 'bg-rose-50 text-rose-400 border-rose-200 cursor-default'
                                  : 'border-zinc-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200'
                              }`}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-zinc-200 bg-zinc-50/50 flex items-center justify-between text-zinc-500 font-mono text-[11px]">
            <span>Showing {filteredNotes.length} notes</span>
            <span className="text-zinc-600">SETGOI Academic Standards Committee</span>
          </div>
        </div>
      )}

      {/* TAB: UPLOAD VERIFIED NOTE */}
      {activeTab === 'upload' && (
        <div className="bg-white border border-zinc-200 rounded-b-lg p-6">
          <div className="border-b border-zinc-100 pb-4 mb-6">
            <h3 className="text-sm font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              Upload Verified Faculty Resource
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Resources uploaded here bypass the student verification queue and are immediately marked with your official Faculty Endorsement.
            </p>
          </div>

          <form onSubmit={handleUploadVerifiedNote} className="max-w-2xl space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-zinc-700 mb-1">
                Resource Title
              </label>
              <input
                type="text"
                required
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                placeholder="e.g. Module 3: Binary Search Trees & AVL Rotations Lecture Notes"
                className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-zinc-700 mb-1">
                  Subject Code
                </label>
                <input
                  type="text"
                  required
                  value={uploadForm.subjectCode}
                  onChange={(e) => setUploadForm({ ...uploadForm, subjectCode: e.target.value.toUpperCase() })}
                  placeholder="PCC-CS301"
                  className="w-full px-3 py-2 text-xs font-mono border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-zinc-700 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  value={uploadForm.subjectName}
                  onChange={(e) => setUploadForm({ ...uploadForm, subjectName: e.target.value })}
                  placeholder="Data Structures & Algorithms"
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-zinc-700 mb-1">
                  Department
                </label>
                <select
                  value={uploadForm.departmentCode}
                  onChange={(e) => setUploadForm({ ...uploadForm, departmentCode: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-zinc-900"
                >
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="CE">CE</option>
                  <option value="EE">EE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-zinc-700 mb-1">
                  Semester
                </label>
                <select
                  value={uploadForm.semester}
                  onChange={(e) => setUploadForm({ ...uploadForm, semester: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs font-mono border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-zinc-900"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-zinc-700 mb-1">
                  Category
                </label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value as NoteCategory })}
                  className="w-full px-3 py-2 text-xs font-mono border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-zinc-900"
                >
                  <option value="LECTURE_NOTE">Lecture Note</option>
                  <option value="MAKAUT_PYQ">MAKAUT PYQ</option>
                  <option value="LAB_MANUAL">Lab Manual</option>
                  <option value="SYLLABUS_COPY">Syllabus Copy</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={uploadSubmitting}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-mono font-medium transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {uploadSubmitting ? 'Publishing...' : 'Publish Verified Note Directly'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB: POST OFFICIAL NOTICE */}
      {activeTab === 'notice' && (
        <div className="bg-white border border-zinc-200 rounded-b-lg p-6">
          <div className="border-b border-zinc-100 pb-4 mb-6">
            <h3 className="text-sm font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-600" />
              Broadcast Official Campus Notice
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Notices published here are displayed across SETTech overview cards, campus alerts, and student feeds.
            </p>
          </div>

          <form onSubmit={handlePostNotice} className="max-w-2xl space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-zinc-700 mb-1">
                Notice Title
              </label>
              <input
                type="text"
                required
                value={noticeForm.title}
                onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                placeholder="e.g. Schedule for Odd Semester MAKAUT Practical Lab Evaluations"
                className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-zinc-700 mb-1">
                  Department
                </label>
                <select
                  value={noticeForm.department}
                  onChange={(e) => setNoticeForm({ ...noticeForm, department: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-zinc-900"
                >
                  <option value="All Departments">All Departments</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="CE">CE</option>
                  <option value="EE">EE</option>
                  <option value="Transport">Transport</option>
                  <option value="Laboratories">Engineering Labs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-zinc-700 mb-1">
                  Category
                </label>
                <select
                  value={noticeForm.category}
                  onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs font-mono border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-zinc-900"
                >
                  <option value="Academic">Academic</option>
                  <option value="Examination">Examination</option>
                  <option value="Laboratories">Laboratories</option>
                  <option value="Transit">Transit</option>
                  <option value="Administration">Administration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-zinc-700 mb-1">
                  Priority Level
                </label>
                <select
                  value={noticeForm.priority}
                  onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs font-mono border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-zinc-900"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-zinc-700 mb-1">
                Notice Content & Instructions
              </label>
              <textarea
                rows={4}
                required
                value={noticeForm.content}
                onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                placeholder="Full notice text, dates, venues, and student compliance requirements..."
                className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={noticeSubmitting}
                className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 text-xs font-mono font-medium transition-colors flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                {noticeSubmitting ? 'Broadcasting...' : 'Publish Official Notice'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: OFFICIAL FACULTY Q&A ENDORSEMENTS */}
      {activeTab === 'forum' && (
        <div className="bg-white border border-zinc-200 rounded-b-lg p-6 space-y-6">
          <div className="border-b border-zinc-100 pb-4">
            <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
              Academic Forum Official Answer Endorsement
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              SETGOI faculty members can endorse accurate answers with the official verified badge to assist students during exam preparations.
            </p>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="border border-zinc-200 rounded-lg p-5 bg-zinc-50/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                    {post.category}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    Posted by {post.authorName} ({post.authorRole})
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-zinc-900">{post.title}</h4>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{post.content}</p>

                {/* Replies list */}
                <div className="mt-4 pt-4 border-t border-zinc-200 space-y-3">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">
                    Replies ({post.replies.length})
                  </span>

                  {post.replies.map((reply) => {
                    const isBusy = processingId === reply.id;

                    return (
                      <div
                        key={reply.id}
                        className={`p-3.5 rounded border transition-colors ${
                          reply.isOfficialAnswer
                            ? 'bg-sky-50/50 border-sky-300 ring-1 ring-sky-200'
                            : 'bg-white border-zinc-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-zinc-900">
                                {reply.authorName}
                              </span>
                              <RoleBadge role={reply.authorRole} showIcon={false} />

                              {reply.isOfficialAnswer && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-mono font-semibold border border-sky-300">
                                  <ShieldCheck className="w-3 h-3 text-sky-700" />
                                  OFFICIAL FACULTY ANSWER
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-700 leading-relaxed">
                              {reply.content}
                            </p>
                          </div>

                          <button
                            disabled={isBusy}
                            onClick={() =>
                              handleToggleOfficialAnswer(post.id, reply.id, reply.isOfficialAnswer)
                            }
                            className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors shrink-0 ${
                              reply.isOfficialAnswer
                                ? 'bg-white text-rose-600 border-zinc-300 hover:bg-rose-50 hover:border-rose-200'
                                : 'bg-sky-600 text-white border-sky-600 hover:bg-sky-700'
                            }`}
                          >
                            {reply.isOfficialAnswer ? 'Remove Endorsement' : 'Endorse as Official'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CURRICULUM OVERVIEW */}
      {activeTab === 'curriculum' && (
        <div className="bg-white border border-zinc-200 rounded-b-lg p-6">
          <div className="border-b border-zinc-100 pb-4 mb-6">
            <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
              SETGOI Department Directory & Syllabus Oversight
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Sanaka Educational Trust's Group of Institutions • MAKAUT Affiliated Codes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept) => (
              <div key={dept.id} className="p-4 rounded-lg border border-zinc-200 bg-zinc-50/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-900 text-white">
                    {dept.code}
                  </span>
                  <span className="font-mono text-xs text-zinc-500">
                    Est. {dept.establishedYear} • Intake: {dept.intakeCapacity}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-zinc-900">{dept.name}</h4>
                <p className="text-xs text-zinc-600 mt-1">{dept.description}</p>

                <div className="mt-3 pt-3 border-t border-zinc-200 flex flex-col gap-1 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Head of Department:</span>
                    <span className="text-zinc-900 font-medium">{dept.hodName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Official Email:</span>
                    <a href={`mailto:${dept.hodEmail}`} className="text-sky-600 hover:underline">
                      {dept.hodEmail}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Location:</span>
                    <span className="text-zinc-700">{dept.locationBuilding}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
