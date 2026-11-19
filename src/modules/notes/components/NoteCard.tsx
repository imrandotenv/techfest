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
    <div className="group bg-white rounded-xl border border-[#E2E8F0] hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between p-4 sm:p-5">
      <div className="space-y-3">
        {/* Top Header: Monospace Course Badge + Verified/Pending Pill + Academic Year */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#0F172A] text-white tracking-wide">
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

          <span className="text-[11px] font-mono text-[#475569]">
            {note.academicYear}
          </span>
        </div>

        {/* Middle Block: Bold 2-line clamped title + Sem X • Branch • File Size • Download Count */}
        <div className="space-y-1.5">
          <h3
            onClick={() => onPreview(note)}
            className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors cursor-pointer line-clamp-2 leading-snug font-display min-h-[2.75rem]"
            title={note.title}
          >
            {note.title}
          </h3>

          <p className="text-xs text-[#475569] font-mono truncate">
            Sem {note.semester} • {note.departmentCode} • {formatBytes(note.fileSize)} • {note.downloadsCount} downloads
          </p>
        </div>
      </div>

      {/* Bottom Bar: Clean Download button and quick Preview icon button */}
      <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
        <span className="text-[10px] font-mono font-medium text-[#475569] uppercase tracking-wider bg-slate-50 border border-[#E2E8F0] px-2 py-0.5 rounded">
          {note.category === 'MAKAUT_PYQ' ? 'Solved PYQ' : note.category === 'CHEAT_SHEET' ? 'Cheat Sheet' : note.category === 'LAB_MANUAL' ? 'Lab Manual' : note.category === 'SYLLABUS_COPY' ? 'Syllabus' : 'Lecture Notes'}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPreview(note)}
            className="p-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
            title="Preview note"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDownload(note)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F172A] text-white hover:bg-slate-800 text-xs font-medium transition-colors shadow-2xs font-sans cursor-pointer"
          >
            <span>Download</span>
            <Download className="w-3.5 h-3.5 text-slate-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
