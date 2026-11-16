'use client';

import React from 'react';
import { 
  Download, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Check, 
  X,
  FileText
} from 'lucide-react';
import { NoteItem, CustomUserRole, NoteCategory } from '@/types';

interface NotesTableProps {
  notes: NoteItem[];
  currentRole: CustomUserRole;
  onPreview: (note: NoteItem) => void;
  onDownload: (note: NoteItem) => void;
  onApprove?: (noteId: string) => void;
  onReject?: (noteId: string) => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getCategoryBadge(category: NoteCategory) {
  switch (category) {
    case 'MAKAUT_PYQ':
      return {
        label: 'MAKAUT PYQ',
        className: 'bg-violet-50 text-violet-700 border-violet-200',
      };
    case 'LECTURE_NOTE':
      return {
        label: 'Lecture Note',
        className: 'bg-sky-50 text-sky-700 border-sky-200',
      };
    case 'LAB_MANUAL':
      return {
        label: 'Lab Manual',
        className: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    case 'SYLLABUS_COPY':
      return {
        label: 'Syllabus',
        className: 'bg-zinc-100 text-zinc-700 border-zinc-200',
      };
  }
}

export function NotesTable({
  notes,
  currentRole,
  onPreview,
  onDownload,
  onApprove,
  onReject,
}: NotesTableProps) {
  const isPrivileged = currentRole === 'college' || currentRole === 'admin';

  if (notes.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center">
        <FileText className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-zinc-900">No resources matched</h3>
        <p className="text-xs text-zinc-500 mt-1 font-mono">
          Try adjusting your branch, semester, or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white border border-zinc-200 rounded-lg shadow-2xs">
      <table className="w-full text-left border-collapse text-xs">
        
        {/* Table Head */}
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-mono text-[11px] uppercase tracking-wider">
            <th className="py-3 px-4 font-semibold">Subject Code</th>
            <th className="py-3 px-4 font-semibold">Resource Title &amp; Subject</th>
            <th className="py-3 px-4 font-semibold">Category</th>
            <th className="py-3 px-4 font-semibold">Dept / Sem</th>
            <th className="py-3 px-4 font-semibold">Size</th>
            <th className="py-3 px-4 font-semibold">Downloads</th>
            <th className="py-3 px-4 font-semibold">Status / Verified</th>
            <th className="py-3 px-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-zinc-100">
          {notes.map((note) => {
            const cat = getCategoryBadge(note.category);
            const isPending = note.status === 'pending';

            return (
              <tr
                key={note.id}
                className={`hover:bg-zinc-50/70 transition-colors ${
                  isPending ? 'bg-amber-50/30' : ''
                }`}
              >
                {/* Code */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded font-mono font-bold text-xs bg-zinc-900 text-white">
                    {note.subjectCode}
                  </span>
                </td>

                {/* Title */}
                <td className="py-3 px-4 max-w-xs">
                  <div className="font-medium text-zinc-900 line-clamp-1">{note.title}</div>
                  <div className="text-[11px] text-zinc-500 line-clamp-1 font-sans">
                    {note.subjectName} ({note.academicYear})
                  </div>
                </td>

                {/* Category */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] border font-medium ${cat.className}`}
                  >
                    {cat.label}
                  </span>
                </td>

                {/* Dept / Sem */}
                <td className="py-3 px-4 whitespace-nowrap font-mono text-zinc-600">
                  {note.departmentCode} • Sem {note.semester}
                </td>

                {/* Size */}
                <td className="py-3 px-4 whitespace-nowrap font-mono text-zinc-500">
                  {formatBytes(note.fileSize)}
                </td>

                {/* Downloads */}
                <td className="py-3 px-4 whitespace-nowrap font-mono">
                  <span className="font-semibold text-zinc-900 tabular-nums">
                    {note.downloadsCount}
                  </span>
                </td>

                {/* Verification */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {note.status === 'approved' && (
                    <div className="flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px]">
                        {note.verifiedByName ? note.verifiedByName.split(' ')[0] : 'Verified'}
                      </span>
                    </div>
                  )}
                  {note.status === 'pending' && (
                    <div className="flex items-center gap-1 text-amber-700 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      <span className="text-[11px]">Pending</span>
                    </div>
                  )}
                  {note.status === 'rejected' && (
                    <div className="flex items-center gap-1 text-rose-700 font-medium">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span className="text-[11px]">Rejected</span>
                    </div>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    
                    {/* Faculty/Admin Approve/Reject for Pending */}
                    {isPending && isPrivileged && onApprove && onReject && (
                      <>
                        <button
                          type="button"
                          onClick={() => onApprove(note.id)}
                          title="Approve & Publish"
                          className="p-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onReject(note.id)}
                          title="Reject"
                          className="p-1 rounded bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => onPreview(note)}
                      className="px-2 py-1 rounded border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-medium transition-colors"
                    >
                      Preview
                    </button>

                    <button
                      type="button"
                      onClick={() => onDownload(note)}
                      className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-white font-medium transition-colors inline-flex items-center gap-1"
                    >
                      <Download className="w-3 h-3 text-zinc-300" />
                      Download
                    </button>

                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
}
