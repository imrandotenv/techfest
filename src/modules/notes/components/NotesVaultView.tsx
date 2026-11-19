'use client';

import React, { useState, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { NoteItem, CustomUserRole } from '@/types';
import { NoteFilterState, UploadNoteFormData } from '../types';
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
  BookOpen
} from 'lucide-react';

export function NotesVaultView() {
  const { user } = useUser();

  // Role resolution: derive from Clerk metadata, default to student
  const activeRole = (user?.publicMetadata?.role as CustomUserRole) || 'student';
  const userName = user?.fullName || (activeRole === 'college' ? 'SETGOI Faculty' : activeRole === 'admin' ? 'SETGOI Admin' : 'Sanaka Student');

  // Notes state initialized lazily to avoid setState in effect
  const [notes, setNotes] = useState<NoteItem[]>(() => getInitialNotes());
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'pyq' | 'pending'>('all');

  // Filter state
  const [filters, setFilters] = useState<NoteFilterState>({
    searchQuery: '',
    branch: 'ALL',
    semester: 'ALL',
    category: 'ALL',
    status: 'ALL',
  });

  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewNote, setPreviewNote] = useState<NoteItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
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
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col">
      

      {/* Hero Header with Metrics */}
      <NotesHero
        stats={stats}
        onOpenUpload={() => setIsUploadOpen(true)}
        onFilterPending={() => handleTabSelect('pending')}
        currentRole={activeRole}
      />

      {/* Vault Tabs */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-6 text-xs sm:text-sm font-medium">
            <button
              type="button"
              onClick={() => handleTabSelect('all')}
              className={`py-3.5 border-b-2 font-mono transition-colors flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'border-zinc-900 text-zinc-900 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>All Vault Resources</span>
              <span className="text-[11px] px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 font-mono">
                {stats.approvedCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSelect('pyq')}
              className={`py-3.5 border-b-2 font-mono transition-colors flex items-center gap-1.5 ${
                activeTab === 'pyq'
                  ? 'border-violet-600 text-violet-900 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <BookOpen className="w-4 h-4 text-violet-600" />
              <span>MAKAUT Solved PYQs</span>
              <span className="text-[11px] px-1.5 py-0.2 rounded bg-violet-100 text-violet-700 font-mono">
                {stats.makautPyqs}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSelect('pending')}
              className={`py-3.5 border-b-2 font-mono transition-colors flex items-center gap-1.5 ${
                activeTab === 'pending'
                  ? 'border-amber-500 text-amber-900 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
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
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 max-w-md bg-zinc-900 text-white px-4 py-3 rounded-lg shadow-xl border border-zinc-700 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1">{toastMessage}</span>
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
              <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center my-6">
                <FileText className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-zinc-900">
                  No matching MAKAUT notes found
                </h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  Try clearing your search query or choosing another branch/semester. You can also upload notes for this subject code.
                </p>
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(true)}
                  className="mt-4 px-4 py-2 rounded bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors inline-flex items-center gap-1.5"
                >
                  Upload First Note for this Subject
                </button>
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

    </div>
  );
}
