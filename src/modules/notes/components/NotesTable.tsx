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
        className: 'bg-slate-100 text-[#475569] border-[#E2E8F0]',
      };
    case 'CHEAT_SHEET':
      return {
        label: 'Cheat Sheet',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
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
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-12 text-center shadow-xs">
        <FileText className="w-8 h-8 text-[#475569]/60 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-[#0F172A] font-display">No resources matched</h3>
        <p className="text-xs text-[#475569] mt-1 font-mono">
          Try adjusting your branch, semester, or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
      <table className="w-full text-left border-collapse text-xs">
        
        {/* Table Head */}
        <thead>
          <tr className="border-b border-[#E2E8F0] bg-slate-50/80 text-[#475569] font-mono text-[11px] uppercase tracking-wider">
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
        <tbody className="divide-y divide-[#E2E8F0]/70">
          {notes.map((note) => {
            const cat = getCategoryBadge(note.category);
            const isPending = note.status === 'pending';

            return (
              <tr
                key={note.id}
                className={`hover:bg-slate-50/70 transition-colors ${
                  isPending ? 'bg-amber-50/30' : ''
                }`}
              >
                {/* Code */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded font-mono font-bold text-xs bg-[#0F172A] text-white">
                    {note.subjectCode}
                  </span>
                </td>

                {/* Title */}
                <td className="py-3 px-4 max-w-xs">
                  <div className="font-semibold text-[#0F172A] line-clamp-1 font-display">{note.title}</div>
                  <div className="text-[11px] text-[#475569] line-clamp-1 font-sans">
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
                <td className="py-3 px-4 whitespace-nowrap font-mono text-[#475569]">
                  {note.departmentCode} • Sem {note.semester}
                </td>

                {/* Size */}
                <td className="py-3 px-4 whitespace-nowrap font-mono text-[#475569]/80">
                  {formatBytes(note.fileSize)}
                </td>

                {/* Downloads */}
                <td className="py-3 px-4 whitespace-nowrap font-mono">
                  <span className="font-semibold text-[#0F172A] tabular-nums">
                    {note.downloadsCount}
                  </span>
                </td>

                {/* Verification */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {note.status === 'approved' && (
                    <div className="flex items-center gap-1 text-emerald-700 font-medium font-mono text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {note.verifiedByName ? note.verifiedByName.split(' ')[0] : 'Verified'}
                      </span>
                    </div>
                  )}
                  {note.status === 'pending' && (
                    <div className="flex items-center gap-1 text-amber-700 font-medium font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      <span>Pending</span>
                    </div>
                  )}
                  {note.status === 'rejected' && (
                    <div className="flex items-center gap-1 text-rose-700 font-medium font-mono text-[11px]">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Rejected</span>
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
                      className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#0F172A] font-medium transition-colors font-sans text-xs"
                    >
                      Preview
                    </button>

                    <button
                      type="button"
                      onClick={() => onDownload(note)}
                      className="px-2.5 py-1 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white font-medium transition-colors inline-flex items-center gap-1 font-sans text-xs shadow-2xs"
                    >
                      <Download className="w-3 h-3 text-slate-300" />
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
