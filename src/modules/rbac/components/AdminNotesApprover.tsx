'use client';

import React, { useState } from 'react';
import { NoteItem } from '@/types';
import { verifyNoteAction } from '../actions';
import { CheckCircle2, XCircle, Clock, FileCheck2, User, Check, X, AlertCircle } from 'lucide-react';

interface AdminNotesApproverProps {
  initialPendingNotes: NoteItem[];
}

export function AdminNotesApprover({ initialPendingNotes }: AdminNotesApproverProps) {
  const [pendingNotes, setPendingNotes] = useState<NoteItem[]>(initialPendingNotes);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAction = async (noteId: string, status: 'approved' | 'rejected') => {
    setBusyId(noteId);
    setFeedback(null);
    try {
      const res = await verifyNoteAction({ noteId, status });
      if (res.success) {
        setPendingNotes((prev) => prev.filter((n) => n.id !== noteId));
        setFeedback(
          status === 'approved'
            ? `Note "${noteId}" approved and published to Notes Vault.`
            : `Note "${noteId}" rejected.`
        );
      } else {
        setFeedback(`Action failed: ${res.error}`);
      }
    } catch (err: any) {
      setFeedback(`Error: ${err.message}`);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-zinc-200 bg-zinc-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <FileCheck2 className="w-5 h-5 text-amber-600" />
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
              MAKAUT Notes & PYQ Vault Approval Queue
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Super-Admin queue for reviewing pending student submissions before public vault indexation.
            </p>
          </div>
        </div>

        <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-semibold self-start sm:self-auto">
          {pendingNotes.length} Pending Approval
        </span>
      </div>

      {feedback && (
        <div className="p-3 bg-zinc-900 text-white text-xs font-mono flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-zinc-400 hover:text-white">
            ×
          </button>
        </div>
      )}

      {/* Body */}
      {pendingNotes.length === 0 ? (
        <div className="p-10 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-zinc-900">Zero Pending Submissions</h4>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            All submitted lecture notes and MAKAUT PYQ solutions are currently verified.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-200">
          {pendingNotes.map((note) => {
            const isBusy = busyId === note.id;

            return (
              <div
                key={note.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-zinc-50/50 transition-colors"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-zinc-900 text-white">
                      {note.subjectCode}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-100 text-zinc-700 border border-zinc-200">
                      {note.departmentCode} • Sem {note.semester}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-sky-50 text-sky-700 border border-sky-200">
                      {note.category}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-zinc-900 leading-snug">
                    {note.title}
                  </h4>
                  <p className="text-xs text-zinc-500 font-mono">
                    {note.subjectName} • Academic Year: {note.academicYear}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 pt-1">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Uploaded by: <strong className="text-zinc-700">{note.uploaderName}</strong></span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="font-mono text-[11px]">{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-center">
                  <button
                    disabled={isBusy}
                    onClick={() => handleAction(note.id, 'approved')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Publish</span>
                  </button>

                  <button
                    disabled={isBusy}
                    onClick={() => handleAction(note.id, 'rejected')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
