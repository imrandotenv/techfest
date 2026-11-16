'use client';

import React from 'react';
import { 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Check, 
  X 
} from 'lucide-react';
import { NoteItem, CustomUserRole, NoteCategory } from '@/types';

interface NoteCardProps {
  note: NoteItem;
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
        label: 'Syllabus Copy',
        className: 'bg-zinc-100 text-zinc-700 border-zinc-200',
      };
  }
}

export function NoteCard({
  note,
  currentRole,
  onPreview,
  onDownload,
  onApprove,
  onReject,
}: NoteCardProps) {
  const categoryBadge = getCategoryBadge(note.category);
  const isPrivileged = currentRole === 'college' || currentRole === 'admin';
  const isPending = note.status === 'pending';

  return (
    <div className={`group bg-white rounded-lg border transition-all flex flex-col justify-between p-4 sm:p-5 ${
      isPending
        ? 'border-amber-200 bg-amber-50/20 hover:border-amber-300'
        : 'border-zinc-200 hover:border-zinc-300 shadow-2xs hover:shadow-xs'
    }`}>
      
      {/* Top Header: Subject Code & Category Pill */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-zinc-900 text-white tracking-wide">
              {note.subjectCode}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border border-zinc-200 bg-zinc-50 text-zinc-600">
              {note.departmentCode} • Sem {note.semester}
            </span>
          </div>

          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${categoryBadge.className}`}
          >
            {categoryBadge.label}
          </span>
        </div>

        {/* Title & Subject */}
        <h3 className="text-sm sm:text-base font-semibold text-zinc-900 line-clamp-2 leading-snug group-hover:text-sky-700 transition-colors">
          {note.title}
        </h3>
        
        <p className="text-xs text-zinc-500 mt-1 line-clamp-1 font-sans">
          {note.subjectName} • Academic Year {note.academicYear}
        </p>

        {/* Verification Status Banner */}
        <div className="mt-3.5 pt-3 border-t border-zinc-100">
          {note.status === 'approved' && (
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">
                Verified{note.verifiedByName ? ` by ${note.verifiedByName}` : ''}
              </span>
            </div>
          )}

          {note.status === 'pending' && (
            <div className="flex items-center gap-1.5 text-amber-700 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-pulse" />
              <span>Pending Faculty Verification</span>
            </div>
          )}

          {note.status === 'rejected' && (
            <div className="flex items-center gap-1.5 text-rose-700 text-xs font-medium">
              <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Verification Rejected</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-4 pt-3 border-t border-zinc-100">
        
        {/* Metadata info */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono mb-3">
          <span>{formatBytes(note.fileSize)}</span>
          <span className="flex items-center gap-1 text-zinc-700 font-medium">
            <Download className="w-3 h-3 text-zinc-400" />
            <span className="tabular-nums font-semibold">{note.downloadsCount}</span> dl
          </span>
        </div>

        {/* Faculty/Admin Review Controls for Pending Items */}
        {isPending && isPrivileged && onApprove && onReject && (
          <div className="mb-3 p-2 rounded bg-amber-50 border border-amber-200">
            <div className="text-[11px] text-amber-900 font-medium mb-1.5 flex items-center justify-between">
              <span>Faculty Action Required:</span>
              <span className="text-[10px] text-amber-700 uppercase font-mono">Review</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onApprove(note.id)}
                className="inline-flex items-center justify-center gap-1 px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors"
              >
                <Check className="w-3 h-3" />
                Approve
              </button>
              <button
                type="button"
                onClick={() => onReject(note.id)}
                className="inline-flex items-center justify-center gap-1 px-2 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors"
              >
                <X className="w-3 h-3" />
                Reject
              </button>
            </div>
          </div>
        )}

        {/* Regular Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPreview(note)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 text-xs font-medium transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-500" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => onDownload(note)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-zinc-300" />
            <span>Download</span>
          </button>
        </div>

        {/* Uploader note */}
        <div className="mt-2 text-[10px] text-zinc-400 font-mono truncate text-center">
          by {note.uploaderName} ({note.uploaderRole})
        </div>

      </div>

    </div>
  );
}
