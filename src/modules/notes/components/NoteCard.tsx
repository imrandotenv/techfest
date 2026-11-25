'use client';

import React from 'react';
import { ArrowDown, BookOpen, Bookmark } from 'lucide-react';
import { NoteItem, CustomUserRole } from '@/types';

interface NoteCardProps {
  note: NoteItem;
  currentRole: CustomUserRole;
  isBookmarked?: boolean;
  onToggleBookmark?: (noteId: string) => void;
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
  isBookmarked = false,
  onToggleBookmark,
  onPreview,
  onDownload,
}: NoteCardProps) {
  const isApproved = note.status === 'approved';

  return (
    <div className="group sanaka-card-interactive rounded-2xl flex flex-col justify-between p-5 space-y-4">
      <div className="space-y-3">
        {/* Top Header: Subject Pill + Verified/Pending Dot + Bookmark */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 tracking-tight">
              {note.subjectCode}
            </span>

            {isApproved ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50/80 border border-emerald-200 px-2 py-0.5 rounded-full font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50/80 border border-amber-200 px-2 py-0.5 rounded-full font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Pending
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#52525B]">{note.academicYear}</span>
            {onToggleBookmark && (
              <button
                type="button"
                onClick={() => onToggleBookmark(note.id)}
                className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'bg-amber-50 border-amber-200 text-amber-600'
                    : 'bg-white border-[#E4E4E7] text-zinc-400 hover:text-[#09090B]'
                }`}
                title={isBookmarked ? 'Saved for Exam' : 'Bookmark for Exam'}
                aria-label="Bookmark for Exam"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <h3
            onClick={() => onPreview(note)}
            className="text-sm sm:text-base font-bold text-[#09090B] group-hover:text-[#2563EB] transition-colors cursor-pointer line-clamp-2 leading-snug font-display min-h-[2.5rem]"
            title={note.title}
          >
            {note.title}
          </h3>

          <p className="text-xs text-[#52525B] mt-1.5 truncate">
            Sem {note.semester} • {note.departmentCode} •{' '}
            <span className="font-mono">{formatBytes(note.fileSize)}</span> •{' '}
            <span className="font-mono">{note.downloadsCount}</span> dl
          </p>
        </div>
      </div>

      {/* Bottom Bar: Category Badge + Read Notes & Download HTML */}
      <div className="pt-3 border-t border-[#E4E4E7] flex items-center justify-between gap-2">
        <span className="text-[10px] font-mono font-medium text-[#52525B] uppercase tracking-wider bg-slate-50 border border-[#E4E4E7] px-2 py-0.5 rounded-full">
          {note.category === 'MAKAUT_PYQ'
            ? 'Solved PYQ'
            : note.category === 'CHEAT_SHEET'
            ? 'Cheat Sheet'
            : note.category === 'SYLLABUS_COPY'
            ? 'Syllabus'
            : 'Lecture Notes'}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPreview(note)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-sans font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read Notes</span>
          </button>

          <button
            type="button"
            onClick={() => onDownload(note)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E4E4E7] text-[#09090B] hover:border-[#2563EB] hover:text-[#2563EB] bg-white text-xs font-sans font-medium transition-colors shadow-2xs cursor-pointer group/btn"
            title="Download print-ready HTML study document"
          >
            <span>Download</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#52525B] group-hover/btn:text-[#2563EB] transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
