'use client';

import React from 'react';
import { Download, Eye } from 'lucide-react';
import { NoteItem, CustomUserRole } from '@/types';

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

export function NoteCard({
  note,
  onPreview,
  onDownload,
}: NoteCardProps) {
  const isApproved = note.status === 'approved';

  return (
    <div className="group bg-white rounded-xl border border-zinc-200/90 hover:border-zinc-300 hover:shadow-xs transition-all flex flex-col justify-between p-4 sm:p-5">
      <div className="space-y-2.5">
        
        {/* Top Header: Subject Code badge + Verified dot + Academic Year */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-zinc-950 text-white tracking-wide">
              {note.subjectCode}
            </span>
            
            {isApproved ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Pending
              </span>
            )}
          </div>

          <span className="text-[11px] font-mono text-zinc-400">
            {note.academicYear}
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onPreview(note)}
          className="text-sm sm:text-base font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 leading-snug"
          title={note.title}
        >
          {note.title}
        </h3>

        {/* 1-Line Metadata */}
        <p className="text-xs text-zinc-500 font-mono truncate">
          Sem {note.semester} • {note.departmentCode} • {note.subjectName}
        </p>

      </div>

      {/* Bottom Bar: Metadata & Compact Download Button on Right */}
      <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
        <div className="text-[11px] text-zinc-400 font-mono">
          <span>{formatBytes(note.fileSize)}</span>
          <span className="mx-1.5">•</span>
          <span>{note.downloadsCount} dl</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPreview(note)}
            className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
            title="Preview note"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDownload(note)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-medium transition-colors shadow-2xs"
          >
            <span>Download</span>
            <Download className="w-3.5 h-3.5 text-zinc-300" />
          </button>
        </div>
      </div>

    </div>
  );
}
