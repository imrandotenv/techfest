import { NoteItem, CustomUserRole, VerificationStatus } from '@/types';
import { COMPREHENSIVE_MOCK_NOTES } from '../data/mock-notes';
import { NoteFilterState, UploadNoteFormData } from '../types';

const STORAGE_KEY = 'sanakahub_notes_vault_v1';

// In-memory fallback / cache
let inMemoryNotes: NoteItem[] = [...COMPREHENSIVE_MOCK_NOTES];

export function getInitialNotes(): NoteItem[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          inMemoryNotes = parsed;
          return parsed;
        }
      }
    } catch {
      // Fallback to in-memory notes if localStorage fails
    }
  }
  return inMemoryNotes;
}

export function saveNotesToStorage(notes: NoteItem[]): void {
  inMemoryNotes = notes;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // Ignore storage write errors (e.g. quota/incognito)
    }
  }
}

export function filterNotes(notes: NoteItem[], filters: NoteFilterState): NoteItem[] {
  return notes.filter((note) => {
    // Search query check (subject code, title, subject name, uploader)
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      const matchQuery =
        note.subjectCode.toLowerCase().includes(query) ||
        note.title.toLowerCase().includes(query) ||
        note.subjectName.toLowerCase().includes(query) ||
        note.departmentCode.toLowerCase().includes(query) ||
        note.uploaderName.toLowerCase().includes(query);
      if (!matchQuery) return false;
    }

    // Branch filter
    if (filters.branch !== 'ALL' && note.departmentCode !== filters.branch) {
      return false;
    }

    // Semester filter
    if (filters.semester !== 'ALL' && note.semester !== Number(filters.semester)) {
      return false;
    }

    // Category filter
    if (filters.category !== 'ALL' && note.category !== filters.category) {
      return false;
    }

    // Status filter
    if (filters.status !== 'ALL' && note.status !== filters.status) {
      return false;
    }

    return true;
  });
}

export function getNoteStats(notes: NoteItem[]) {
  const approvedNotes = notes.filter((n) => n.status === 'approved');
  const pendingNotes = notes.filter((n) => n.status === 'pending');
  const totalDownloads = notes.reduce((acc, curr) => acc + (curr.downloadsCount || 0), 0);
  const makautPyqs = approvedNotes.filter((n) => n.category === 'MAKAUT_PYQ').length;

  const branchCounts: Record<string, number> = {
    CSE: 0,
    ECE: 0,
    EE: 0,
    ME: 0,
    CE: 0,
  };

  notes.forEach((n) => {
    if (branchCounts[n.departmentCode] !== undefined) {
      branchCounts[n.departmentCode]++;
    }
  });

  return {
    totalNotes: notes.length,
    approvedCount: approvedNotes.length,
    pendingCount: pendingNotes.length,
    totalDownloads,
    makautPyqs,
    branchCounts,
  };
}

export function incrementDownload(
  notes: NoteItem[],
  noteId: string
): { updatedNotes: NoteItem[]; targetNote?: NoteItem } {
  let targetNote: NoteItem | undefined;
  const updated = notes.map((item) => {
    if (item.id === noteId) {
      targetNote = {
        ...item,
        downloadsCount: (item.downloadsCount || 0) + 1,
      };
      return targetNote;
    }
    return item;
  });

  saveNotesToStorage(updated);
  return { updatedNotes: updated, targetNote };
}

export function verifyNoteAction(
  notes: NoteItem[],
  noteId: string,
  newStatus: 'approved' | 'rejected',
  verifier: { id: string; name: string; role: CustomUserRole }
): { updatedNotes: NoteItem[]; targetNote?: NoteItem } {
  let targetNote: NoteItem | undefined;
  const now = new Date().toISOString();

  const updated = notes.map((item) => {
    if (item.id === noteId) {
      targetNote = {
        ...item,
        status: newStatus,
        verifiedById: verifier.id,
        verifiedByName: verifier.name,
        verifiedAt: now,
      };
      return targetNote;
    }
    return item;
  });

  saveNotesToStorage(updated);
  return { updatedNotes: updated, targetNote };
}

export function uploadNewNote(
  notes: NoteItem[],
  data: UploadNoteFormData,
  uploader: { id: string; name: string; role: CustomUserRole }
): { updatedNotes: NoteItem[]; newNote: NoteItem } {
  const isPrivileged = uploader.role === 'college' || uploader.role === 'admin';
  const initialStatus: VerificationStatus = isPrivileged ? 'approved' : 'pending';
  const now = new Date().toISOString();

  const newNote: NoteItem = {
    id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: data.title.trim(),
    subjectCode: data.subjectCode.toUpperCase().trim(),
    subjectName: data.subjectName.trim(),
    departmentCode: data.departmentCode,
    semester: Number(data.semester),
    category: data.category,
    academicYear: data.academicYear || '2026-2027',
    fileUrl: data.fileUrl || `/mock-files/${data.subjectCode.toLowerCase()}-doc.pdf`,
    fileSize: data.fileSize || Math.floor(Math.random() * 3000000) + 1500000,
    downloadsCount: 0,
    status: initialStatus,
    uploaderId: uploader.id,
    uploaderName: uploader.name,
    uploaderRole: uploader.role,
    verifiedById: isPrivileged ? uploader.id : undefined,
    verifiedByName: isPrivileged ? uploader.name : undefined,
    verifiedAt: isPrivileged ? now : undefined,
    createdAt: now,
  };

  const updated = [newNote, ...notes];
  saveNotesToStorage(updated);
  return { updatedNotes: updated, newNote };
}
