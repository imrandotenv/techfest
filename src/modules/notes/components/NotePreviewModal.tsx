'use client';

import React, { useState } from 'react';
import {
  X,
  Download,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { NoteItem } from '@/types';
import { getStudyContentForSubject } from '@/lib/study-document-content';

interface NotePreviewModalProps {
  note: NoteItem | null;
  onClose: () => void;
  onDownload: (note: NoteItem) => void;
}

export function NotePreviewModal({ note, onClose, onDownload }: NotePreviewModalProps) {
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  if (!note) return null;

  const studyContent = getStudyContentForSubject(
    note.subjectCode,
    note.subjectName,
    note.title
  );

  const handleCopyCode = (snippet: string, idx: number) => {
    try {
      navigator.clipboard.writeText(snippet);
      setCopiedCodeIdx(idx);
      setTimeout(() => setCopiedCodeIdx(null), 2000);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/60 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-preview-title"
        className="bg-white border border-[#E4E4E7] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Modal Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 border-b border-[#E4E4E7] bg-zinc-50 print:hidden">
          <div className="flex items-center gap-2">
            <span
              id="note-preview-title"
              className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-[#09090B] text-white"
            >
              {note.subjectCode}
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              {note.departmentCode} • Sem {note.semester} • In-App Study Reader
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E4E4E7] bg-white hover:bg-zinc-100 text-xs font-sans font-medium text-[#09090B] transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={() => onDownload(note)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] text-white hover:bg-blue-700 text-xs font-sans font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/70 transition-colors cursor-pointer"
              aria-label="Close reader"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Distraction-Free Study Reader Sheet */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-[#09090B]">
          {/* Institutional Header */}
          <div className="border border-[#E4E4E7] rounded-xl p-5 bg-[#FAFAFA] flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#52525B]">
                SETGOI Durgapur • Official MAKAUT Academic Vault
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-[#09090B] mt-1 leading-snug">
                {note.title}
              </h3>
              <p className="text-xs text-[#52525B] mt-1">
                <strong>Subject:</strong> {note.subjectName} ({note.subjectCode})
              </p>
            </div>
            {note.status === 'approved' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-semibold shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Faculty Verified</span>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-sans">
            {studyContent.summary}
          </p>

          {/* Key Formulas & Invariants */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/70 space-y-2">
            <div className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Key Formulas &amp; Exam Quick Reference</span>
            </div>
            <ul className="space-y-1.5">
              {studyContent.keyFormulas.map((f, idx) => (
                <li key={idx} className="text-xs font-mono text-[#09090B] flex items-start gap-2">
                  <span className="text-[#2563EB] font-bold">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Module Sections + Syntax-Highlighted Code */}
          <div className="space-y-5">
            {studyContent.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2.5">
                <h4 className="text-sm font-bold font-display text-[#09090B] border-b border-[#E4E4E7] pb-1.5">
                  {sec.heading}
                </h4>
                <ul className="space-y-1.5">
                  {sec.bullets.map((b, bIdx) => (
                    <li
                      key={bIdx}
                      className="text-xs sm:text-sm text-[#3F3F46] leading-relaxed flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {sec.code && (
                  <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#09090B] text-zinc-100">
                    <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-900 border-b border-zinc-800 text-[11px] font-mono text-zinc-400">
                      <span className="uppercase">{sec.code.language}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(sec.code!.snippet, idx)}
                        className="inline-flex items-center gap-1 text-zinc-300 hover:text-white cursor-pointer"
                      >
                        {copiedCodeIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                      <code>{sec.code.snippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Solved PYQs */}
          <div className="space-y-2.5 pt-2 border-t border-[#E4E4E7]">
            <div className="text-xs font-mono font-bold text-[#09090B] uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Solved MAKAUT Previous Year Questions</span>
            </div>
            <div className="space-y-2.5">
              {studyContent.solvedPyqs.map((qa, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] space-y-1"
                >
                  <div className="text-xs font-bold text-[#09090B]">Q: {qa.q}</div>
                  <div className="text-xs text-[#52525B] leading-relaxed">
                    <strong className="text-[#09090B]">Answer:</strong> {qa.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
