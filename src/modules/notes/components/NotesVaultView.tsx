'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { NoteItem } from '@/types';
import { BranchCode, UploadNoteFormData } from '../types';
import { getResolvedRole } from '@/lib/auth-client';
import { AuthPromptModal, AuthPromptReason } from '@/components/auth/AuthPromptModal';
import { 
  getInitialNotes, 
  incrementDownload, 
  verifyNoteAction, 
  uploadNewNote 
} from '../services/notes-service';
import { NoteCard } from './NoteCard';
import { UploadNoteModal } from './UploadNoteModal';
import { VerificationQueue } from './VerificationQueue';
import { NotePreviewModal } from './NotePreviewModal';
import { LabPracticalsView } from './LabPracticalsView';
import { LAB_PRACTICALS } from '../data/lab-practicals-data';
import { useAcademicProfile } from '@/hooks/useAcademicProfile';
import { useSyllabusSubjects } from '@/hooks/useSyllabusSubjects';
import { 
  Laptop, 
  Cpu, 
  Zap, 
  Cog, 
  Building2, 
  Network,
  BrainCircuit,
  GraduationCap,
  ArrowRight, 
  ArrowLeft, 
  Search, 
  Plus, 
  UploadCloud, 
  CheckCircle2, 
  BookOpen, 
  RotateCcw,
  Sparkles,
  FileText,
  X,
  FlaskConical
} from 'lucide-react';

interface BranchConfig {
  code: BranchCode;
  name: string;
  shortName: string;
  icon: React.ComponentType<{ className?: string }>;
}

const BTECH_BRANCHES: BranchConfig[] = [
  {
    code: 'CSE',
    name: 'Computer Science & Engineering',
    shortName: 'Computer Science (CSE)',
    icon: Laptop,
  },
  {
    code: 'CSE-AIML',
    name: 'CSE (Artificial Intelligence & Machine Learning)',
    shortName: 'CSE (AI & ML)',
    icon: BrainCircuit,
  },
  {
    code: 'CSE-DS',
    name: 'CSE (Data Science)',
    shortName: 'CSE (Data Science)',
    icon: Network,
  },
  {
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    shortName: 'Electronics & Comm (ECE)',
    icon: Cpu,
  },
  {
    code: 'EE',
    name: 'Electrical Engineering',
    shortName: 'Electrical Engg (EE)',
    icon: Zap,
  },
  {
    code: 'EEE',
    name: 'Electrical & Electronics Engineering',
    shortName: 'Electrical & Electronics (EEE)',
    icon: Zap,
  },
  {
    code: 'ME',
    name: 'Mechanical Engineering',
    shortName: 'Mechanical Engg (ME)',
    icon: Cog,
  },
  {
    code: 'CE',
    name: 'Civil Engineering',
    shortName: 'Civil Engg (CE)',
    icon: Building2,
  },
];

const SEMESTERS = [
  { num: 1, year: '1st Year', term: 'Autumn' },
  { num: 2, year: '1st Year', term: 'Spring' },
  { num: 3, year: '2nd Year', term: 'Autumn' },
  { num: 4, year: '2nd Year', term: 'Spring' },
  { num: 5, year: '3rd Year', term: 'Autumn' },
  { num: 6, year: '3rd Year', term: 'Spring' },
  { num: 7, year: '4th Year', term: 'Autumn' },
  { num: 8, year: '4th Year', term: 'Spring' },
];

export function NotesVaultView() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const activeRole = getResolvedRole(user);
  const userName =
    user?.fullName ||
    (activeRole === 'college'
      ? 'SETGOI Faculty'
      : activeRole === 'admin'
      ? 'SETGOI Admin'
      : 'SETGOI Student');

  const searchParams = useSearchParams();
  const initialQ = searchParams?.get('q') || searchParams?.get('search') || '';
  const initialBranch = searchParams?.get('branch') as BranchCode | null;
  const initialSem = searchParams?.get('sem') || searchParams?.get('semester');

  const { profile } = useAcademicProfile();
  const [hasAppliedStudentDefaults, setHasAppliedStudentDefaults] = useState(false);

  // Master notes state — hydrated live from Neon PostgreSQL (/api/notes)
  const [notes, setNotes] = useState<NoteItem[]>([]);

  useEffect(() => {
    let active = true;
    fetch('/api/notes')
      .then((res) => res.json())
      .then((json) => {
        if (active && json.success && Array.isArray(json.data)) {
          setNotes(json.data);
        }
      })
      .catch((err) => console.warn('[NotesVaultView] Failed to fetch notes:', err));
    return () => {
      active = false;
    };
  }, []);

  // Progressive Vault Flow State
  const [selectedBranch, setSelectedBranch] = useState<BranchCode | null>(() => {
    return initialBranch && ['CSE', 'ECE', 'EE', 'ME', 'CE', 'IT', 'AIML'].includes(initialBranch)
      ? initialBranch
      : null;
  });

  const [selectedSemester, setSelectedSemester] = useState<number | null>(() => {
    const s = initialSem ? Number(initialSem) : null;
    return s && s >= 1 && s <= 8 ? s : null;
  });

  // Auto-apply student academic profile if no URL params specified
  useEffect(() => {
    if (hasAppliedStudentDefaults) return;
    if (!initialBranch && !initialSem && !initialQ && profile.onboardingCompleted && profile.branch) {
      if (['CSE', 'ECE', 'EE', 'ME', 'CE', 'IT', 'AIML'].includes(profile.branch)) {
        setSelectedBranch(profile.branch as BranchCode);
        setSelectedSemester(profile.semester);
        setHasAppliedStudentDefaults(true);
      }
    }
  }, [profile, initialBranch, initialSem, initialQ, hasAppliedStudentDefaults]);

  // Direct Search Mode (e.g. from homepage quick search)
  const [isDirectSearch, setIsDirectSearch] = useState<boolean>(() => Boolean(initialQ));
  const [searchQuery, setSearchQuery] = useState<string>(initialQ);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [viewQueue, setViewQueue] = useState<boolean>(false);
  const [activeVaultTab, setActiveVaultTab] = useState<'theory' | 'practicals'>('theory');

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadPrefill, setUploadPrefill] = useState<{ branch: BranchCode; semester: number }>({
    branch: 'CSE',
    semester: 3,
  });
  const [previewNote, setPreviewNote] = useState<NoteItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [authPromptReason, setAuthPromptReason] = useState<AuthPromptReason | null>(null);

  // Sync params if they change
  useEffect(() => {
    if (!searchParams) return;
    const q = searchParams.get('q') || searchParams.get('search');
    const b = searchParams.get('branch') as BranchCode | null;
    const s = searchParams.get('sem') || searchParams.get('semester');

    if (q) {
      setSearchQuery(q);
      setIsDirectSearch(true);
    }
    if (b && ['CSE', 'ECE', 'EE', 'ME', 'CE'].includes(b)) {
      setSelectedBranch(b);
    }
    if (s && Number(s) >= 1 && Number(s) <= 8) {
      setSelectedSemester(Number(s));
    }
  }, [searchParams]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleOpenUpload = (branch?: BranchCode, sem?: number) => {
    if (!isSignedIn) {
      setAuthPromptReason('upload_notes');
      return;
    }
    setUploadPrefill({
      branch: branch || selectedBranch || 'CSE',
      semester: sem || selectedSemester || 3,
    });
    setIsUploadOpen(true);
  };

  // Branch notes count helper
  const getBranchNotesCount = (code: BranchCode) => {
    return notes.filter(
      (n) => n.status === 'approved' && (n.departmentCode === code || n.departmentCode === 'ALL')
    ).length;
  };

  // Semester notes count helper
  const getSemesterNotesCount = (branch: BranchCode, sem: number) => {
    return notes.filter(
      (n) =>
        n.status === 'approved' &&
        (n.departmentCode === branch || n.departmentCode === 'ALL') &&
        n.semester === sem
    ).length;
  };

  // Lab practicals count helpers
  const getBranchLabsCount = (code: BranchCode) => {
    return LAB_PRACTICALS.filter((l) => l.departmentCode === code).length;
  };

  const getSemesterLabsCount = (branch: BranchCode, sem: number) => {
    return LAB_PRACTICALS.filter((l) => l.departmentCode === branch && l.semester === sem).length;
  };

  // Filtered Notes for Step 3
  const step3Notes = useMemo(() => {
    if (!selectedBranch || !selectedSemester) return [];

    let filtered = notes.filter((n) => {
      if (n.status !== 'approved') return false;
      const matchesBranch = n.departmentCode === selectedBranch || n.departmentCode === 'ALL';
      const matchesSem = n.semester === selectedSemester;
      return matchesBranch && matchesSem;
    });

    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter((n) => n.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.subjectCode.toLowerCase().includes(q) ||
          n.subjectName.toLowerCase().includes(q) ||
          n.uploaderName.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [notes, selectedBranch, selectedSemester, selectedCategory, searchQuery]);

  // Global search notes
  const globalSearchNotes = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return notes.filter(
      (n) =>
        n.status === 'approved' &&
        (n.title.toLowerCase().includes(q) ||
          n.subjectCode.toLowerCase().includes(q) ||
          n.subjectName.toLowerCase().includes(q) ||
          n.departmentCode.toLowerCase().includes(q) ||
          n.uploaderName.toLowerCase().includes(q))
    );
  }, [notes, searchQuery]);

  // Pending notes list for faculty/admin
  const pendingNotesList = useMemo(() => {
    return notes.filter((n) => n.status === 'pending');
  }, [notes]);

  // Actions
  const handleDownload = (note: NoteItem) => {
    const { updatedNotes, targetNote } = incrementDownload(notes, note.id);
    setNotes(updatedNotes);
    if (previewNote && previewNote.id === note.id && targetNote) {
      setPreviewNote(targetNote);
    }
    showToast(`Downloading "${note.title}". Download counter updated!`);

    if (typeof window !== 'undefined') {
      const blob = new Blob(
        [
          `SETGOI MAKAUT VAULT DOCUMENT\nTitle: ${note.title}\nSubject: ${note.subjectName} (${note.subjectCode})\nDepartment: ${note.departmentCode}\nSemester: ${note.semester}\nAcademic Year: ${note.academicYear}\nStatus: ${note.status}\n\n[Official MAKAUT Curriculum Verified Copy]`,
        ],
        { type: 'text/plain' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${note.subjectCode}-${note.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleApprove = async (noteId: string) => {
    if (!isSignedIn) {
      setAuthPromptReason('verify_notes');
      return;
    }
    if (activeRole !== 'college' && activeRole !== 'admin') {
      showToast('Faculty or Admin privileges required to verify notes.');
      setAuthPromptReason('verify_notes');
      return;
    }
    const verifier = {
      id: user?.id || `verifier-${activeRole}`,
      name: userName,
      role: activeRole,
    };
    const { updatedNotes, targetNote } = verifyNoteAction(notes, noteId, 'approved', verifier);
    setNotes(updatedNotes);
    showToast(`Approved "${targetNote?.title}". The note is verified!`);

    try {
      await fetch(`/api/faculty/notes/${encodeURIComponent(noteId)}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: true }),
      });
      router.refresh();
    } catch {}
  };

  const handleReject = async (noteId: string) => {
    if (!isSignedIn) {
      setAuthPromptReason('verify_notes');
      return;
    }
    if (activeRole !== 'college' && activeRole !== 'admin') {
      showToast('Faculty or Admin privileges required.');
      setAuthPromptReason('verify_notes');
      return;
    }
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    showToast('Submission rejected and removed.');

    try {
      await fetch(`/api/faculty/notes/${encodeURIComponent(noteId)}/verify`, {
        method: 'DELETE',
      });
      router.refresh();
    } catch {}
  };

  const handleUploadSubmit = async (formData: UploadNoteFormData) => {
    if (formData.file) {
      try {
        const bodyData = new FormData();
        bodyData.append('file', formData.file);
        bodyData.append('title', formData.title);
        bodyData.append('subjectCode', formData.subjectCode);
        bodyData.append('subjectName', formData.subjectName);
        bodyData.append('branch', formData.departmentCode);
        bodyData.append('semester', String(formData.semester));

        const res = await fetch('/api/notes/upload', {
          method: 'POST',
          body: bodyData,
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok && json.note) {
          const listRes = await fetch('/api/notes').then((r) => r.json()).catch(() => null);
          if (listRes?.data) setNotes(listRes.data);
          showToast(json.message || 'Uploaded to SETGOI Vault!');
          router.refresh();
          return;
        }
        showToast(json.error || 'Upload failed.');
      } catch (err) {
        console.warn('[Notes Upload] Error:', err);
        showToast('Network error uploading note.');
      }
      return;
    }

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          subjectCode: formData.subjectCode,
          subjectName: formData.subjectName,
          departmentCode: formData.departmentCode,
          semester: formData.semester,
          category: formData.category,
          fileUrl: formData.fileUrl,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.data) {
        setNotes((prev) => [json.data, ...prev]);
        showToast(json.message || 'Resource submitted!');
        router.refresh();
      } else {
        showToast(json.error || 'Failed to submit note.');
      }
    } catch (err) {
      console.warn('[Notes Submit] Error:', err);
      showToast('Network error submitting note.');
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 max-w-md bg-[#09090B] text-white px-4 py-3 rounded-xl shadow-xl border border-zinc-800 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1 font-sans">{toastMessage}</span>
        </div>
      )}

      {/* Top Vault Mode Switcher: Theory Notes & PYQs vs Lab Practicals & Viva */}
      {!viewQueue && !isDirectSearch && (
        <div className="flex items-center justify-center pb-6 sm:pb-8">
          <div className="inline-flex items-center bg-zinc-100 p-1 rounded-full border border-[#E4E4E7] shadow-2xs">
            <button
              onClick={() => setActiveVaultTab('theory')}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold font-sans transition-all cursor-pointer ${
                activeVaultTab === 'theory'
                  ? 'bg-white text-[#09090B] shadow-xs border border-zinc-200/80'
                  : 'text-[#52525B] hover:text-[#09090B]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Theory Notes &amp; PYQs</span>
            </button>
            <button
              onClick={() => setActiveVaultTab('practicals')}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold font-sans transition-all cursor-pointer ${
                activeVaultTab === 'practicals'
                  ? 'bg-white text-[#09090B] shadow-xs border border-zinc-200/80'
                  : 'text-[#52525B] hover:text-[#09090B]'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Lab Practicals &amp; Viva</span>
            </button>
          </div>
        </div>
      )}

      {/* Verification Queue View for College / Admin if active */}
      {viewQueue ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E7]">
            <button
              onClick={() => setViewQueue(false)}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#2563EB] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to Academic Vault</span>
            </button>
            <span className="text-xs font-mono text-[#52525B]">
              {pendingNotesList.length} Pending Submissions
            </span>
          </div>
          <VerificationQueue
            pendingNotes={pendingNotesList}
            currentRole={activeRole}
            onApprove={handleApprove}
            onReject={handleReject}
            onPreview={(note) => setPreviewNote(note)}
            onDownload={handleDownload}
          />
        </div>
      ) : isDirectSearch ? (
        /* Global Search Mode View */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={() => {
                  setIsDirectSearch(false);
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-1 text-[#2563EB] hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Branch Selection</span>
              </button>
              <span className="text-[#52525B]/40">/</span>
              <span className="font-bold text-[#09090B]">Search: &ldquo;{searchQuery}&rdquo;</span>
            </div>

            <button
              onClick={() => handleOpenUpload()}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-medium font-sans transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Contribute Note</span>
            </button>
          </div>

          <div className="relative max-w-xl">
            <Search className="w-4 h-4 text-[#52525B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, course code, or professor..."
              className="w-full h-10 pl-9 pr-9 bg-white border border-[#E4E4E7] rounded-xl text-xs sm:text-sm text-[#09090B] placeholder:text-[#52525B]/60 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#09090B]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {globalSearchNotes.length === 0 ? (
            <div className="bg-white border border-[#E4E4E7] rounded-2xl p-10 text-center shadow-xs">
              <FileText className="w-10 h-10 text-[#52525B]/40 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#09090B] font-display">
                No notes found matching &ldquo;{searchQuery}&rdquo;
              </h3>
              <p className="text-xs text-[#52525B] mt-1 max-w-sm mx-auto font-sans">
                Try searching with a shorter course code (e.g. CS301) or browse by branch.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setIsDirectSearch(false);
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-full border border-[#E4E4E7] bg-white text-xs font-mono text-[#09090B] hover:bg-zinc-50"
                >
                  Browse by Branch →
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {globalSearchNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  currentRole={activeRole}
                  onPreview={(n) => setPreviewNote(n)}
                  onDownload={handleDownload}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
        </div>
      ) : !selectedBranch ? (
        /* STEP 1: SELECT BRANCH */
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Centered Heading */}
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/60 text-xs font-mono font-medium">
              {activeVaultTab === 'practicals' ? (
                <>
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>MAKAUT LAB PRACTICALS &amp; VIVA HUB</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>MAKAUT ACADEMIC VAULT</span>
                </>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#09090B] font-display">
              {activeVaultTab === 'practicals' ? 'Select Branch for Lab Practicals' : 'Select your B.Tech Branch'}
            </h1>
            <p className="text-sm text-[#52525B] font-sans leading-relaxed">
              {activeVaultTab === 'practicals'
                ? 'Departmental laboratory manuals, experiment instructions, and top 5 External Examiner Viva Q&As.'
                : 'Curated lecture notes, solved 10-year MAKAUT question papers, and lab manuals organized by engineering discipline.'}
            </p>
          </div>

          {/* 5 Crisp, Airy Branch Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BTECH_BRANCHES.map((b) => {
              const Icon = b.icon;
              const count = getBranchNotesCount(b.code);
              const labCount = getBranchLabsCount(b.code);
              return (
                <div
                  key={b.code}
                  onClick={() => {
                    setSelectedBranch(b.code);
                    setSelectedSemester(null);
                  }}
                  className="group sanaka-card-interactive rounded-2xl p-6 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#2563EB] bg-blue-50/60 px-2.5 py-0.5 rounded-full border border-blue-200/50">
                        {b.code}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#09090B] font-display group-hover:text-[#2563EB] transition-colors">
                      {b.name}
                    </h3>
                    <p className="text-xs text-[#52525B] mt-1">
                      Semesters 1 to 8 • MAKAUT CBCS
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E4E4E7] flex items-center justify-between text-xs">
                    <span className="text-[#52525B]">
                      {activeVaultTab === 'practicals' ? (
                        <>
                          <strong className="text-[#09090B]">{labCount}</strong> {labCount === 1 ? 'Lab' : 'Labs'} &amp; Viva
                        </>
                      ) : (
                        <>
                          <strong className="text-[#09090B]">{count}</strong> {count === 1 ? 'Resource' : 'Resources'}
                        </>
                      )}
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium text-[#2563EB] group-hover:translate-x-0.5 transition-transform">
                      Select Branch
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Quick Search Card */}
            <div
              onClick={() => setIsDirectSearch(true)}
              className="group sanaka-card-interactive border-dashed rounded-2xl p-6 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-700 border border-zinc-200 flex items-center justify-center mb-4">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#09090B] font-display group-hover:text-[#2563EB] transition-colors">
                  Quick Search Vault
                </h3>
                <p className="text-xs text-[#52525B] font-sans mt-1 leading-relaxed">
                  Already know your MAKAUT subject code? Search directly across all disciplines.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-200/60 flex items-center justify-between text-xs text-[#2563EB] font-medium">
                <span>Search by Course Code</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Optional Faculty Pending Queue Pill */}
          {(activeRole === 'college' || activeRole === 'admin') && pendingNotesList.length > 0 && (
            <div className="pt-2 text-center">
              <button
                onClick={() => setViewQueue(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-medium hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Faculty Review Desk: {pendingNotesList.length} notes awaiting verification →</span>
              </button>
            </div>
          )}
        </div>
      ) : !selectedSemester ? (
        /* STEP 2: SELECT SEMESTER */
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={() => setSelectedBranch(null)}
                className="text-[#52525B] hover:text-[#2563EB] cursor-pointer"
              >
                Vault
              </button>
              <span className="text-[#52525B]/40">/</span>
              <span className="font-bold text-[#09090B]">{selectedBranch}</span>
            </div>

            <button
              onClick={() => setSelectedBranch(null)}
              className="inline-flex items-center gap-1.5 text-xs font-sans text-[#2563EB] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Branch</span>
            </button>
          </div>

          {/* Centered Heading */}
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/60 text-xs font-mono font-medium">
              <span>{selectedBranch} {activeVaultTab === 'practicals' ? 'LAB PRACTICALS' : 'CURRICULUM'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#09090B] font-display">
              {activeVaultTab === 'practicals' ? `Select Semester for ${selectedBranch} Labs` : `Select Semester for ${selectedBranch}`}
            </h1>
            <p className="text-sm text-[#52525B] font-sans leading-relaxed">
              {activeVaultTab === 'practicals'
                ? 'Choose an academic semester to view laboratory manuals, hardware setups, and viva Q&A pairs.'
                : 'Choose an academic semester to view curated lecture notes, syllabus modules, and solved papers.'}
            </p>
          </div>

          {/* 8 Clean Semester Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {SEMESTERS.map((s) => {
              const count = getSemesterNotesCount(selectedBranch, s.num);
              const labCount = getSemesterLabsCount(selectedBranch, s.num);
              const displayCount = activeVaultTab === 'practicals' ? labCount : count;
              return (
                <div
                  key={s.num}
                  onClick={() => setSelectedSemester(s.num)}
                  className="group sanaka-card-interactive rounded-2xl p-5 flex flex-col justify-between cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#52525B] font-semibold">
                      {s.year} • {s.term}
                    </span>
                    <h3 className="text-lg font-bold text-[#09090B] font-display group-hover:text-[#2563EB] transition-colors">
                      Semester {s.num}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E4E4E7] flex items-center justify-between text-xs">
                    <span
                      className={`font-mono text-[11px] ${
                        displayCount > 0 ? 'text-[#2563EB] font-semibold' : 'text-[#52525B]/70'
                      }`}
                    >
                      {activeVaultTab === 'practicals'
                        ? displayCount > 0
                          ? `${displayCount} ${displayCount === 1 ? 'Lab' : 'Labs'}`
                          : '0 Labs'
                        : displayCount > 0
                        ? `${displayCount} ${displayCount === 1 ? 'Note' : 'Notes'}`
                        : '0 Notes'}
                    </span>
                    <ArrowRight className="w-3 h-3 text-[#52525B] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* STEP 3: FILTERED NOTES VIEW (Max 2 columns, Clean Toolbar, Empty State) */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Breadcrumb Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={() => {
                  setSelectedBranch(null);
                  setSelectedSemester(null);
                }}
                className="text-[#52525B] hover:text-[#2563EB] cursor-pointer"
              >
                Vault
              </button>
              <span className="text-[#52525B]/40">/</span>
              <button
                onClick={() => setSelectedSemester(null)}
                className="text-[#52525B] hover:text-[#2563EB] cursor-pointer"
              >
                {selectedBranch}
              </button>
              <span className="text-[#52525B]/40">/</span>
              <span className="font-bold text-[#09090B]">Semester {selectedSemester}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedSemester(null)}
                className="inline-flex items-center gap-1 text-xs font-sans text-[#2563EB] hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Semester</span>
              </button>
              <span className="text-zinc-300">|</span>
              <button
                onClick={() => {
                  setSelectedBranch(null);
                  setSelectedSemester(null);
                }}
                className="text-xs font-sans text-zinc-500 hover:text-zinc-900 cursor-pointer"
              >
                All Branches
              </button>
            </div>
          </div>

          {/* Student Profile Quick-Tag */}
          {profile.onboardingCompleted && selectedBranch === profile.branch && selectedSemester === profile.semester && (
            <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#2563EB] font-medium">
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span>Showing your enrolled <strong>{profile.branch} • Semester {profile.semester}</strong> MAKAUT vault</span>
              </div>
              <button
                onClick={() => {
                  setSelectedBranch(null);
                  setSelectedSemester(null);
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 font-mono text-[11px] font-semibold transition-all shadow-2xs cursor-pointer"
              >
                View All Departments
              </button>
            </div>
          )}

          {activeVaultTab === 'practicals' ? (
            /* LAB PRACTICALS & VIVA HUB VIEW */
            <LabPracticalsView
              branch={selectedBranch}
              semester={selectedSemester}
              onOpenUpload={handleOpenUpload}
            />
          ) : (
            <>
              {/* Subject Code Filter Chips from Official MAKAUT Syllabus */}
              <SyllabusChipsBar
                branch={selectedBranch}
                semester={selectedSemester}
                searchQuery={searchQuery}
                onSelectCode={setSearchQuery}
              />

              {/* Section Toolbar: Search + Category Pills + Upload CTA */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white border border-[#E4E4E7] rounded-2xl p-3.5 shadow-xs">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-[#52525B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${selectedBranch} Sem ${selectedSemester} notes, topics, or course codes...`}
                className="w-full h-9 pl-9 pr-8 bg-zinc-50 border border-[#E4E4E7] rounded-xl text-xs text-[#09090B] placeholder:text-[#52525B]/60 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#09090B]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'LECTURE_NOTE', label: 'Notes' },
                { id: 'MAKAUT_PYQ', label: 'PYQ' },
                { id: 'LAB_MANUAL', label: 'Lab Manual' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-colors shrink-0 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#2563EB] text-white shadow-2xs'
                      : 'bg-zinc-50 text-[#52525B] border border-[#E4E4E7] hover:bg-zinc-100 hover:text-[#09090B]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Primary Blue Upload Note Button */}
            <button
              onClick={() => handleOpenUpload(selectedBranch, selectedSemester)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-medium font-sans transition-colors shadow-xs shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Contribute Note</span>
            </button>
          </div>

          {/* Filtered Notes List: Max 2 Columns OR Clean Centered Empty State */}
          {step3Notes.length === 0 ? (
            /* EMPTY STATE: "Be the First to Upload" */
            <div className="bg-white border border-[#E4E4E7] rounded-2xl p-10 sm:p-14 text-center shadow-xs max-w-2xl mx-auto space-y-4 my-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center justify-center mx-auto">
                <UploadCloud className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-[#09090B] font-display">
                  No notes uploaded for {selectedBranch} Semester {selectedSemester} yet.
                </h3>
                <p className="text-xs sm:text-sm text-[#52525B] font-sans max-w-md mx-auto leading-relaxed">
                  Help your classmates out—be the first one to upload notes or PYQs for this semester.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => handleOpenUpload(selectedBranch, selectedSemester)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold font-sans transition-all shadow-xs cursor-pointer"
                >
                  <span>Be the First to Upload →</span>
                </button>
                <button
                  onClick={() => setSelectedSemester(null)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-[#E4E4E7] bg-white text-xs font-mono text-[#52525B] hover:text-[#09090B] hover:bg-zinc-50"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Choose Another Semester</span>
                </button>
              </div>
            </div>
          ) : (
            /* Spaced 2-Column Notes Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {step3Notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  currentRole={activeRole}
                  onPreview={(n) => setPreviewNote(n)}
                  onDownload={handleDownload}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
            </>
          )}
        </div>
      )}

      {/* Upload Note Modal with Pre-filled Branch & Semester */}
      <UploadNoteModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={handleUploadSubmit}
        currentRole={activeRole}
        uploaderName={userName}
        defaultBranch={uploadPrefill.branch}
        defaultSemester={uploadPrefill.semester}
      />

      {/* Note Preview Modal */}
      <NotePreviewModal
        note={previewNote}
        onClose={() => setPreviewNote(null)}
        onDownload={handleDownload}
      />

      {/* Auth Guard Prompt Modal */}
      <AuthPromptModal
        isOpen={authPromptReason !== null}
        onClose={() => setAuthPromptReason(null)}
        reason={authPromptReason || 'upload_notes'}
      />
    </div>
  );
}

function SyllabusChipsBar({
  branch,
  semester,
  searchQuery,
  onSelectCode,
}: {
  branch: BranchCode;
  semester: number;
  searchQuery: string;
  onSelectCode: (code: string) => void;
}) {
  const subjects = useSyllabusSubjects(branch, semester);
  if (subjects.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 bg-white border border-[#E4E4E7] rounded-2xl p-3 shadow-xs">
      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-1.5">
        Syllabus Codes:
      </span>
      <button
        type="button"
        onClick={() => onSelectCode('')}
        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold border transition-colors cursor-pointer ${
          !searchQuery
            ? 'bg-[#09090B] text-white border-[#09090B]'
            : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
        }`}
      >
        ALL
      </button>
      {subjects.map((sub) => {
        const isActive = searchQuery.toUpperCase() === sub.code.toUpperCase();
        const typeLabel = sub.type === 'LAB' ? 'Lab' : sub.type === 'ELECTIVE' ? 'Elective' : 'Theory';
        return (
          <button
            key={sub.code}
            type="button"
            onClick={() => onSelectCode(sub.code)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold border inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
              isActive
                ? 'bg-[#2563EB] text-white border-[#2563EB]'
                : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
            }`}
            title={`${sub.name} (${typeLabel})`}
          >
            <span>{sub.code}</span>
            <span
              className={`text-[9px] px-1 py-0.2 rounded ${
                isActive
                  ? 'bg-white/20 text-white'
                  : sub.type === 'LAB'
                  ? 'bg-emerald-100 text-emerald-800'
                  : sub.type === 'ELECTIVE'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-[#2563EB]'
              }`}
            >
              {typeLabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}
