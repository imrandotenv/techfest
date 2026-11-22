'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Bell, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Clock, 
  ArrowRight,
  Filter,
  Check,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface PendingNote {
  id: string;
  courseCode: string;
  title: string;
  branch: string;
  semester: number;
  uploadedBy: string;
  uploadedDate: string;
  fileFormat: string;
  status: 'pending' | 'approved' | 'rejected';
}

const INITIAL_QUEUE: PendingNote[] = [
  {
    id: 'note-pend-01',
    courseCode: 'PCC-CS501',
    title: 'Compiler Design Handwritten Lecture Notes (Syntax Directed Translation)',
    branch: 'CSE',
    semester: 5,
    uploadedBy: 'Arjun Chatterjee (CSE CR)',
    uploadedDate: '2 hours ago',
    fileFormat: 'PDF (4.2 MB)',
    status: 'pending',
  },
  {
    id: 'note-pend-02',
    courseCode: 'ESC301',
    title: 'K-Map Minimization & Master-Slave Flip-Flop Lab Viva Solved Sheet',
    branch: 'ECE',
    semester: 3,
    uploadedBy: 'Priya Sen (ECE Sec A)',
    uploadedDate: '5 hours ago',
    fileFormat: 'PDF (2.8 MB)',
    status: 'pending',
  },
  {
    id: 'note-pend-03',
    courseCode: 'PC-EE391',
    title: 'Circuit Theory Practical Manual & Thevenin Theorem Calculation Log',
    branch: 'EE',
    semester: 3,
    uploadedBy: 'Rahul Mondal (EE)',
    uploadedDate: '1 day ago',
    fileFormat: 'PDF (6.1 MB)',
    status: 'pending',
  },
];

interface OpenDoubt {
  id: string;
  courseCode: string;
  author: string;
  title: string;
  snippet: string;
  replies: number;
  timeAgo: string;
}

const OPEN_DOUBTS: OpenDoubt[] = [
  {
    id: 'doubt-01',
    courseCode: 'PCC-CS502',
    author: 'Debjit Roy (CSE Sem 5)',
    title: 'Banker’s algorithm safety test matrix: handling multiple resource instances',
    snippet: 'In the 2024 MAKAUT question 4(b), if Work array becomes less than Need after allocation, does the system immediately declare deadlock or continue checking remaining processes?',
    replies: 2,
    timeAgo: '4 hours ago',
  },
  {
    id: 'doubt-02',
    courseCode: 'PCC-CS302',
    author: 'Ananya Mukherjee (CSE Sem 3)',
    title: 'Booth’s algorithm bit pair encoding: handling odd number of multiplier bits',
    snippet: 'When recoding multiplier bits in Radix-4 Booth multiplication, do we always append an extra 0 at LSB and MSB sign-extension?',
    replies: 1,
    timeAgo: '1 day ago',
  },
];

export function FacultyWorkspaceClient({ userEmail, userName }: { userEmail: string; userName: string }) {
  const [queue, setQueue] = useState<PendingNote[]>(INITIAL_QUEUE);
  const [activeTab, setActiveTab] = useState<'queue' | 'notices' | 'doubts'>('queue');

  // Notice form state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDepartment, setNoticeDepartment] = useState('CSE');
  const [noticeType, setNoticeType] = useState<'Exam' | 'Academic' | 'Lab'>('Academic');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticePublished, setNoticePublished] = useState(false);

  // Doubt response state
  const [answeringDoubtId, setAnsweringDoubtId] = useState<string | null>(null);
  const [facultyAnswerText, setFacultyAnswerText] = useState('');
  const [answeredDoubts, setAnsweredDoubts] = useState<string[]>([]);

  const handleApprove = (id: string) => {
    setQueue((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'approved' as const } : n))
    );
  };

  const handleReject = (id: string) => {
    setQueue((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'rejected' as const } : n))
    );
  };

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    setNoticePublished(true);
    setTimeout(() => {
      setNoticeTitle('');
      setNoticeContent('');
      setNoticePublished(false);
    }, 3000);
  };

  const handleSubmitAnswer = (doubtId: string) => {
    if (!facultyAnswerText.trim()) return;
    setAnsweredDoubts((prev) => [...prev, doubtId]);
    setAnsweringDoubtId(null);
    setFacultyAnswerText('');
  };

  const pendingCount = queue.filter((n) => n.status === 'pending').length;

  return (
    <div className="w-full space-y-6">
      {/* Top Section Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E4E4E7] pb-3">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-full text-xs font-semibold font-sans transition-all inline-flex items-center gap-2 cursor-pointer ${
            activeTab === 'queue'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'bg-white text-[#52525B] border border-[#E4E4E7] hover:border-zinc-300 hover:text-[#09090B]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Notes Verification Queue</span>
          {pendingCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeTab === 'queue' ? 'bg-white/20 text-white' : 'bg-blue-100 text-[#2563EB]'
            }`}>
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`px-4 py-2 rounded-full text-xs font-semibold font-sans transition-all inline-flex items-center gap-2 cursor-pointer ${
            activeTab === 'notices'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'bg-white text-[#52525B] border border-[#E4E4E7] hover:border-zinc-300 hover:text-[#09090B]'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Publish Department Notice</span>
        </button>

        <button
          onClick={() => setActiveTab('doubts')}
          className={`px-4 py-2 rounded-full text-xs font-semibold font-sans transition-all inline-flex items-center gap-2 cursor-pointer ${
            activeTab === 'doubts'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'bg-white text-[#52525B] border border-[#E4E4E7] hover:border-zinc-300 hover:text-[#09090B]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Unanswered Engineering Doubts</span>
        </button>
      </div>

      {/* TAB 1: Notes Verification Queue */}
      {activeTab === 'queue' && (
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4E4E7]">
            <div>
              <h2 className="text-base font-bold font-sans text-[#09090B]">
                Student Submissions Awaiting Faculty Stamp
              </h2>
              <p className="text-xs text-[#52525B] font-sans">
                Approved notes receive the official <span className="font-semibold text-emerald-700">&ldquo;Faculty Verified&rdquo;</span> badge in the student vault.
              </p>
            </div>
            <span className="text-xs font-mono text-[#52525B]">
              Showing {queue.length} items
            </span>
          </div>

          <div className="divide-y divide-[#E4E4E7]">
            {queue.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-50 text-[#2563EB] border border-blue-200/60">
                      {item.courseCode}
                    </span>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-zinc-100 text-zinc-700">
                      {item.branch} • Sem {item.semester}
                    </span>
                    <span className="text-[11px] font-mono text-[#52525B]">
                      {item.fileFormat}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#09090B] font-sans">
                    {item.title}
                  </h3>

                  <div className="text-[11px] font-mono text-[#52525B]">
                    Uploaded by <span className="text-[#09090B] font-medium">{item.uploadedBy}</span> • {item.uploadedDate}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Stamp &ldquo;Faculty Verified&rdquo;</span>
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] text-zinc-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-mono transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  ) : item.status === 'approved' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-xs font-bold">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Stamped &amp; Published</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-mono text-xs font-semibold">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Rejected</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Publish Department Notice */}
      {activeTab === 'notices' && (
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 max-w-2xl">
          <div className="pb-3 border-b border-[#E4E4E7]">
            <h2 className="text-base font-bold font-sans text-[#09090B]">
              Broadcast Department Notice
            </h2>
            <p className="text-xs text-[#52525B] font-sans">
              Published notices appear immediately on the student Notice Board in `/tools` and the Campus Pulse ticker.
            </p>
          </div>

          {noticePublished && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-sans flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Notice broadcasted successfully to all engineering students!</span>
            </div>
          )}

          <form onSubmit={handlePublishNotice} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#52525B] mb-1">Target Department</label>
                <select
                  value={noticeDepartment}
                  onChange={(e) => setNoticeDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#E4E4E7] text-xs font-mono text-[#09090B] focus:outline-hidden focus:border-[#2563EB]"
                >
                  <option value="CSE">CSE (Computer Science)</option>
                  <option value="ECE">ECE (Electronics &amp; Comm)</option>
                  <option value="EE">EE (Electrical Engg)</option>
                  <option value="ME">ME (Mechanical Engg)</option>
                  <option value="CE">CE (Civil Engg)</option>
                  <option value="ALL">All B.Tech Departments</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#52525B] mb-1">Notice Category</label>
                <select
                  value={noticeType}
                  onChange={(e) => setNoticeType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#E4E4E7] text-xs font-mono text-[#09090B] focus:outline-hidden focus:border-[#2563EB]"
                >
                  <option value="Academic">Academic Schedule</option>
                  <option value="Exam">Exam Cell &amp; Routine</option>
                  <option value="Lab">Lab Practicals &amp; Viva</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#52525B] mb-1">Notice Headline</label>
              <input
                type="text"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                placeholder="e.g. Mandatory Submission Date for PCC-CS591 DBMS Lab Files"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E4E4E7] text-xs font-sans text-[#09090B] focus:outline-hidden focus:border-[#2563EB]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#52525B] mb-1">Notice Details</label>
              <textarea
                value={noticeContent}
                onChange={(e) => setNoticeContent(e.target.value)}
                placeholder="Provide clear exam date, room numbers, or practical instructions for students..."
                rows={4}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E4E4E7] text-xs font-sans text-[#09090B] focus:outline-hidden focus:border-[#2563EB]"
                required
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-sans text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Notice</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Unanswered Engineering Doubts */}
      {activeTab === 'doubts' && (
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#E4E4E7]">
            <h2 className="text-base font-bold font-sans text-[#09090B]">
              Open Engineering Doubts on Forum
            </h2>
            <p className="text-xs text-[#52525B] font-sans">
              Provide authoritative answers stamped with your faculty credentials.
            </p>
          </div>

          <div className="space-y-4">
            {OPEN_DOUBTS.map((doubt) => {
              const isAnswered = answeredDoubts.includes(doubt.id);
              const isReplying = answeringDoubtId === doubt.id;

              return (
                <div key={doubt.id} className="p-4 rounded-xl bg-slate-50 border border-[#E4E4E7] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-50 text-[#2563EB] border border-blue-200/60">
                        {doubt.courseCode}
                      </span>
                      <span className="text-xs font-mono text-[#52525B]">
                        Asked by {doubt.author} • {doubt.timeAgo}
                      </span>
                    </div>

                    {isAnswered && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Faculty Answered
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-[#09090B] font-sans">
                    {doubt.title}
                  </h3>

                  <p className="text-xs text-[#52525B] font-sans leading-relaxed">
                    {doubt.snippet}
                  </p>

                  {!isAnswered && !isReplying && (
                    <button
                      onClick={() => setAnsweringDoubtId(doubt.id)}
                      className="text-xs font-mono font-semibold text-[#2563EB] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Post Official Faculty Answer →</span>
                    </button>
                  )}

                  {isReplying && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-[#E4E4E7] space-y-2">
                      <textarea
                        value={facultyAnswerText}
                        onChange={(e) => setFacultyAnswerText(e.target.value)}
                        placeholder="Type authoritative faculty explanation..."
                        rows={3}
                        className="w-full p-2 text-xs font-sans border border-[#E4E4E7] rounded-lg focus:outline-hidden focus:border-[#2563EB]"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSubmitAnswer(doubt.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] text-white font-sans text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Submit Official Answer</span>
                        </button>
                        <button
                          onClick={() => setAnsweringDoubtId(null)}
                          className="px-3 py-1.5 text-xs font-mono text-[#52525B] hover:text-[#09090B]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
