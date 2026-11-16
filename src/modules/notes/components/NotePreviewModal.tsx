'use client';

import React from 'react';
import { 
  X, 
  Download, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { NoteItem } from '@/types';

interface NotePreviewModalProps {
  note: NoteItem | null;
  onClose: () => void;
  onDownload: (note: NoteItem) => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function NotePreviewModal({
  note,
  onClose,
  onDownload,
}: NotePreviewModalProps) {
  if (!note) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
      <div className="bg-white border border-zinc-200 rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-zinc-200 bg-zinc-50">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-zinc-900 text-white">
              {note.subjectCode}
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              Document Preview • {formatBytes(note.fileSize)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDownload(note)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ({note.downloadsCount} dl)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content / Simulated Document Sheet */}
        <div className="p-6 overflow-y-auto space-y-6 text-zinc-800 text-xs">
          
          {/* Institutional Document Header */}
          <div className="border border-zinc-200 rounded-lg p-5 bg-zinc-50/40 relative overflow-hidden">
            <div className="absolute right-4 top-4 opacity-5 pointer-events-none select-none font-bold text-6xl text-zinc-900 font-mono">
              SETGOI
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  Sanaka Educational Trust&apos;s Group of Institutions • Durgapur
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mt-1 leading-snug">
                  {note.title}
                </h3>
                <p className="text-xs text-zinc-600 mt-1">
                  <strong>Course:</strong> {note.subjectName} ({note.subjectCode})
                </p>
              </div>

              {note.status === 'approved' ? (
                <div className="shrink-0 text-right">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Resource
                  </div>
                  {note.verifiedByName && (
                    <div className="text-[10px] text-zinc-500 font-mono mt-1">
                      By {note.verifiedByName}
                    </div>
                  )}
                </div>
              ) : (
                <div className="shrink-0 text-right">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Pending Verification
                  </div>
                </div>
              )}
            </div>

            {/* Curriculum Metadata Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-zinc-200 text-[11px] font-mono">
              <div>
                <span className="text-zinc-400 block">Department</span>
                <span className="font-semibold text-zinc-800">{note.departmentCode}</span>
              </div>
              <div>
                <span className="text-zinc-400 block">Semester</span>
                <span className="font-semibold text-zinc-800">Semester {note.semester}</span>
              </div>
              <div>
                <span className="text-zinc-400 block">Category</span>
                <span className="font-semibold text-zinc-800">{note.category}</span>
              </div>
              <div>
                <span className="text-zinc-400 block">Academic Year</span>
                <span className="font-semibold text-zinc-800">{note.academicYear}</span>
              </div>
            </div>
          </div>

          {/* Simulated Document Body & Units Index */}
          <div className="border border-zinc-200 rounded-lg p-5 bg-white space-y-4">
            <h4 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider font-mono border-b border-zinc-100 pb-2 flex items-center justify-between">
              <span>Syllabus Modules &amp; Chapters Covered</span>
              <span className="text-zinc-400 font-normal">MAKAUT 2026-27</span>
            </h4>

            <div className="space-y-2 text-zinc-700">
              <div className="p-2.5 rounded bg-zinc-50 border border-zinc-100 flex items-start gap-2">
                <span className="font-mono text-zinc-400 font-bold">01</span>
                <div>
                  <strong className="text-zinc-900 block text-xs">Module 1: Foundations &amp; Theoretical Concepts</strong>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Formal definitions, time &amp; space complexity bounds, asymptotic notations, and fundamental theorems.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded bg-zinc-50 border border-zinc-100 flex items-start gap-2">
                <span className="font-mono text-zinc-400 font-bold">02</span>
                <div>
                  <strong className="text-zinc-900 block text-xs">Module 2: Core Architectures &amp; Standard Models</strong>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Implementation mechanics, memory organization, state diagrams, and pipeline analysis.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded bg-zinc-50 border border-zinc-100 flex items-start gap-2">
                <span className="font-mono text-zinc-400 font-bold">03</span>
                <div>
                  <strong className="text-zinc-900 block text-xs">Module 3: Solved Problems &amp; MAKAUT PYQ Exercises</strong>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Step-by-step mathematical solutions for past 5 years university examination questions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Verification Log */}
          <div className="p-3 rounded bg-zinc-50 border border-zinc-200 text-[11px] font-mono text-zinc-600 flex items-center justify-between">
            <div>
              <span>Uploaded: <strong>{new Date(note.createdAt).toLocaleString()}</strong></span>
              <span className="mx-2">•</span>
              <span>Uploader: <strong>{note.uploaderName}</strong> ({note.uploaderRole})</span>
            </div>
            {note.verifiedAt && (
              <span className="text-emerald-700 font-semibold">
                Audit Verified: {new Date(note.verifiedAt).toLocaleDateString()}
              </span>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-200 bg-zinc-50 text-xs">
          <span className="font-mono text-zinc-500">
            Vault downloads increment on confirmation
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onDownload(note)}
              className="px-4 py-1.5 rounded bg-zinc-900 text-white hover:bg-zinc-800 font-medium inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download Full File
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
