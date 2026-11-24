'use client';

import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  User, 
  Check, 
  X, 
  Eye, 
  Download 
} from 'lucide-react';
import { NoteItem, CustomUserRole } from '@/types';

interface VerificationQueueProps {
  pendingNotes: NoteItem[];
  currentRole: CustomUserRole;
  onApprove: (noteId: string) => void;
  onReject: (noteId: string) => void;
  onPreview: (note: NoteItem) => void;
  onDownload: (note: NoteItem) => void;
}

export function VerificationQueue({
  pendingNotes,
  currentRole,
  onApprove,
  onReject,
  onPreview,
  onDownload,
}: VerificationQueueProps) {
  const isPrivileged = currentRole === 'college' || currentRole === 'admin';

  if (pendingNotes.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-lg p-10 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-zinc-900">Verification Queue is Empty</h3>
        <p className="text-xs text-zinc-500 mt-1">
          All submitted notes and MAKAUT PYQs have been verified by faculty.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Notice */}
      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg flex items-start justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-900 block">
              SETGOI Faculty Review Workflow ({pendingNotes.length} Pending)
            </span>
            <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
              {isPrivileged
                ? 'As college faculty/admin, review student submissions against the MAKAUT syllabus before approving them for public vault visibility.'
                : 'Student submissions are kept in this pending state until verified by authorized SETGOI faculty members.'}
            </p>
          </div>
        </div>
      </div>

      {/* Pending Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pendingNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white border border-amber-200 rounded-lg p-5 flex flex-col justify-between shadow-2xs hover:border-amber-300 transition-colors"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-zinc-900 text-white">
                    {note.subjectCode}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-100 text-zinc-700">
                    {note.departmentCode} • Sem {note.semester}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-100 text-amber-800 font-semibold border border-amber-200 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                  Awaiting Review
                </span>
              </div>

              {/* Title & Subject */}
              <h4 className="text-sm font-semibold text-zinc-900 line-clamp-2">
                {note.title}
              </h4>
              <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">
                {note.subjectName} ({note.academicYear})
              </p>

              {/* Uploader details */}
              <div className="mt-3 py-2 px-3 rounded bg-zinc-50 border border-zinc-100 text-[11px] text-zinc-600 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  <span>
                    Uploaded by <strong className="text-zinc-800">{note.uploaderName}</strong>
                  </span>
                </div>
                <span className="font-mono text-zinc-400">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-zinc-100 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onPreview(note)}
                  className="flex-1 py-1.5 px-2 rounded border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-zinc-400" />
                  Inspect Note
                </button>
                <button
                  type="button"
                  onClick={() => onDownload(note)}
                  className="flex-1 py-1.5 px-2 rounded border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-400" />
                  File Sample
                </button>
              </div>

              {isPrivileged ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onApprove(note.id)}
                    className="py-1.5 px-3 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve &amp; Publish
                  </button>
                  <button
                    type="button"
                    onClick={() => onReject(note.id)}
                    className="py-1.5 px-3 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject Submission
                  </button>
                </div>
              ) : (
                <div className="text-[11px] text-zinc-400 font-mono text-center py-1">
                  Only College Faculty or Admin can approve this item
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
