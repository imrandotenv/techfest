'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { NoteItem, CustomUserRole } from '@/types';
import { NoteFilterState, UploadNoteFormData } from '../types';
import { getResolvedRole } from '@/lib/auth-client';
import { AuthPromptModal, AuthPromptReason } from '@/components/auth/AuthPromptModal';
import { 
  getInitialNotes, 
  filterNotes, 
  getNoteStats, 
  incrementDownload, 
  verifyNoteAction, 
  uploadNewNote 
} from '../services/notes-service';
import { NotesHero } from './NotesHero';
import { NotesFilterBar } from './NotesFilterBar';
import { NoteCard } from './NoteCard';
import { NotesTable } from './NotesTable';
import { UploadNoteModal } from './UploadNoteModal';
import { VerificationQueue } from './VerificationQueue';
import { NotePreviewModal } from './NotePreviewModal';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  BookOpen,
  RotateCcw,
  Upload
} from 'lucide-react';

export function NotesVaultView() {
  const { user, isLoaded, isSignedIn } = useUser();

  // Role resolution: derive from Clerk metadata (checking unsafeMetadata & publicMetadata)
  const activeRole = getResolvedRole(user);
  const userName = user?.fullName || (activeRole === 'college' ? 'SETGOI Faculty' : activeRole === 'admin' ? 'SETGOI Admin' : 'Sanaka Student');

  const searchParams = useSearchParams();
  const initialQ = searchParams?.get('q') || searchParams?.get('search') || '';
  const initialBranch = (searchParams?.get('branch') as any) || 'ALL';
  const initialSem = searchParams?.get('sem') || searchParams?.get('semester');
  const initialCat = (searchParams?.get('category') as any) || 'ALL';

  // Notes state initialized lazily to avoid setState in effect
  const [notes, setNotes] = useState<NoteItem[]>(() => getInitialNotes());
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'pyq' | 'pending'>(
    initialCat === 'MAKAUT_PYQ' ? 'pyq' : 'all'
  );

  // Filter state
  const [filters, setFilters] = useState<NoteFilterState>(() => ({
    searchQuery: initialQ,
    branch: initialBranch,
    semester: initialSem && initialSem !== 'ALL' ? Number(initialSem) : 'ALL',
    category: initialCat,
    status: 'ALL',
  }));

  // Sync state if searchParams change dynamically
  useEffect(() => {
    if (!searchParams) return;
    const q = searchParams.get('q') || searchParams.get('search');
    const b = searchParams.get('branch');
    const s = searchParams.get('sem') || searchParams.get('semester');
    const c = searchParams.get('category');

    if (q !== null || b !== null || s !== null || c !== null) {
      setFilters((prev) => ({
        ...prev,
        ...(q !== null ? { searchQuery: q } : {}),
        ...(b !== null ? { branch: (b as any) || 'ALL' } : {}),
        ...(s !== null ? { semester: s !== 'ALL' ? Number(s) : 'ALL' } : {}),
        ...(c !== null ? { category: (c as any) || 'ALL' } : {}),
      }));
      if (c === 'MAKAUT_PYQ') {
        setActiveTab('pyq');
      }
    }
  }, [searchParams]);

  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewNote, setPreviewNote] = useState<NoteItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [authPromptReason, setAuthPromptReason] = useState<AuthPromptReason | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleOpenUpload = () => {
    if (!isSignedIn) {
      setAuthPromptReason('upload_notes');
      return;
    }
    setIsUploadOpen(true);
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      branch: 'ALL',
      semester: 'ALL',
      category: 'ALL',
      status: 'ALL',
    });
    setActiveTab('all');
  };

  // Compute live stats
  const stats = useMemo(() => getNoteStats(notes), [notes]);

  // Handle Tab changes
  const handleTabSelect = (tab: 'all' | 'pyq' | 'pending') => {
    setActiveTab(tab);
    if (tab === 'pyq') {
      setFilters((prev) => ({ ...prev, category: 'MAKAUT_PYQ', status: 'approved' }));
    } else if (tab === 'pending') {
      setFilters((prev) => ({ ...prev, status: 'pending', category: 'ALL' }));
    } else {
      setFilters((prev) => ({ ...prev, category: 'ALL', status: 'ALL' }));
    }
  };

  // Filtered notes
  const filteredNotes = useMemo(() => {
    return filterNotes(notes, filters);
  }, [notes, filters]);

  // Pending notes list
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
    showToast(`Downloading "${note.title}". Download counter updated to ${targetNote?.downloadsCount || note.downloadsCount + 1}!`);

    // Simulated download file trigger
    if (typeof window !== 'undefined') {
      const blob = new Blob(
        [
          `SETGOI MAKAUT VAULT DOCUMENT\nTitle: ${note.title}\nSubject: ${note.subjectName} (${note.subjectCode})\nDepartment: ${note.departmentCode}\nSemester: ${note.semester}\nAcademic Year: ${note.academicYear}\nVerified By: ${note.verifiedByName || 'SETGOI Faculty'}\nStatus: ${note.status}\n\n[Official MAKAUT Curriculum Verified Copy]`,
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

  const handleApprove = (noteId: string) => {
    if (!isSignedIn) {
      setAuthPromptReason('verify_notes');
      return;
    }
    if (activeRole !== 'college' && activeRole !== 'admin') {
      showToast('Faculty or Admin privileges required to verify or reject lecture notes.');
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
    showToast(`Approved "${targetNote?.title}". The note is now verified & published!`);
  };

  const handleReject = (noteId: string) => {
    if (!isSignedIn) {
      setAuthPromptReason('verify_notes');
      return;
    }
    if (activeRole !== 'college' && activeRole !== 'admin') {
      showToast('Faculty or Admin privileges required to verify or reject lecture notes.');
      setAuthPromptReason('verify_notes');
      return;
    }
    const verifier = {
      id: user?.id || `verifier-${activeRole}`,
      name: userName,
      role: activeRole,
    };
    const { updatedNotes, targetNote } = verifyNoteAction(notes, noteId, 'rejected', verifier);
    setNotes(updatedNotes);
    showToast(`Rejected "${targetNote?.title}". Marked as changes requested.`);
  };

  const handleUploadSubmit = (formData: UploadNoteFormData) => {
    const uploader = {
      id: user?.id || `uploader-${activeRole}`,
      name: userName,
      role: activeRole,
    };
    const { updatedNotes, newNote } = uploadNewNote(notes, formData, uploader);
    setNotes(updatedNotes);

    if (newNote.status === 'approved') {
      showToast(`Resource "${newNote.title}" published with faculty verification!`);
    } else {
      showToast(`Resource "${newNote.title}" submitted to faculty verification queue!`);
      setActiveTab('pending');
      setFilters((prev) => ({ ...prev, status: 'pending' }));
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] flex flex-col">
      

      {/* Hero Header with Metrics */}
      <NotesHero
        stats={stats}
        onOpenUpload={handleOpenUpload}
        onFilterPending={() => handleTabSelect('pending')}
        currentRole={activeRole}
      />

      {/* Vault Tabs */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-6 text-xs sm:text-sm font-medium">
            <button
              type="button"
              onClick={() => handleTabSelect('all')}
              className={`py-3.5 border-b-2 font-mono transition-colors flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'border-[#0F172A] text-[#0F172A] font-bold'
                  : 'border-transparent text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>All Vault Resources</span>
              <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-100 text-[#0F172A] font-mono">
                {stats.approvedCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSelect('pyq')}
              className={`py-3.5 border-b-2 font-mono transition-colors flex items-center gap-1.5 ${
                activeTab === 'pyq'
                  ? 'border-[#2563EB] text-[#2563EB] font-bold'
                  : 'border-transparent text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#2563EB]" />
              <span>MAKAUT Solved PYQs</span>
              <span className="text-[11px] px-1.5 py-0.2 rounded bg-blue-50 text-[#2563EB] font-mono font-medium">
                {stats.makautPyqs}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSelect('pending')}
              className={`py-3.5 border-b-2 font-mono transition-colors flex items-center gap-1.5 ${
                activeTab === 'pending'
                  ? 'border-amber-500 text-amber-900 font-bold'
                  : 'border-transparent text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Pending Review Queue</span>
              {stats.pendingCount > 0 && (
                <span className="text-[11px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold font-mono">
                  {stats.pendingCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Filter Bar */}
      <NotesFilterBar
        filters={filters}
        onFilterChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        resultCount={filteredNotes.length}
        onOpenUpload={handleOpenUpload}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 max-w-md bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1 font-sans">{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* If user is looking specifically at the pending queue tab */}
        {activeTab === 'pending' ? (
          <VerificationQueue
            pendingNotes={pendingNotesList}
            currentRole={activeRole}
            onApprove={handleApprove}
            onReject={handleReject}
            onPreview={(note) => setPreviewNote(note)}
            onDownload={handleDownload}
          />
        ) : (
          <>
            {filteredNotes.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-12 text-center my-6 shadow-xs">
                <FileText className="w-10 h-10 text-[#475569]/40 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-[#0F172A] font-display">
                  No matching MAKAUT notes found
                </h3>
                <p className="text-xs text-[#475569] mt-1 max-w-sm mx-auto font-sans">
                  Try clearing your search query or choosing another branch/semester. You can also upload notes for this subject code.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-2 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-medium hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 font-sans shadow-2xs cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Reset All Filters</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenUpload}
                    className="px-4 py-2 rounded-lg bg-[#0F172A] text-white text-xs font-medium hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 font-sans shadow-2xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-300" />
                    <span>Upload First Note for this Subject</span>
                  </button>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map((note) => (
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
            ) : (
              <NotesTable
                notes={filteredNotes}
                currentRole={activeRole}
                onPreview={(n) => setPreviewNote(n)}
                onDownload={handleDownload}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            )}
          </>
        )}

      </main>

      {/* Upload Modal */}
      <UploadNoteModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={handleUploadSubmit}
        currentRole={activeRole}
        uploaderName={userName}
      />

      {/* Document Preview Modal */}
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

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#0F172A] text-white text-xs font-mono rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
