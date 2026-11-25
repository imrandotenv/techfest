'use client';

import React, { useState, useMemo } from 'react';
import {
  FlaskConical,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Search,
  HelpCircle,
  Plus,
  CheckCircle2,
  Copy,
  MapPin,
  X,
} from 'lucide-react';
import { BranchCode } from '../types';
import { LAB_PRACTICALS } from '../data/lab-practicals-data';
import { useSyllabusSubjects } from '@/hooks/useSyllabusSubjects';
import { NoteItem } from '@/types';
import { NotePreviewModal } from './NotePreviewModal';

interface LabPracticalsViewProps {
  branch: BranchCode | null;
  semester: number | null;
  onOpenUpload: (branch?: BranchCode, sem?: number) => void;
  onDownloadNote?: (note: NoteItem) => void;
}

const LAB_CODE_REGEX = /(391|392|393|491|492|493|494|591|592|593|594|681|691|692|693|694|695|781|782|791|792|881|882|891)/;

export function LabPracticalsView({
  branch,
  semester,
  onOpenUpload,
  onDownloadNote,
}: LabPracticalsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLabId, setExpandedLabId] = useState<string | null>(null);
  const [copiedQuestionId, setCopiedQuestionId] = useState<string | null>(null);
  const [activeManualNote, setActiveManualNote] = useState<NoteItem | null>(null);

  const liveSyllabus = useSyllabusSubjects(branch || 'CSE', semester || 3);

  // Merge live Neon DB LAB/SESSIONAL subjects with curated viva Q&As
  const filteredLabs = useMemo(() => {
    const dbLabs = liveSyllabus.filter(
      (s) =>
        s.type === 'LAB' ||
        s.type === 'SESSIONAL' ||
        LAB_CODE_REGEX.test(s.code.replace(/\s+/g, ''))
    );

    const merged = dbLabs.map((sub) => {
      const normCode = sub.code.toUpperCase().replace(/\s+/g, '');
      const matchedRich = LAB_PRACTICALS.find(
        (l) => l.courseCode.toUpperCase().replace(/\s+/g, '') === normCode
      );

      return {
        id: `lab-${branch || 'CSE'}-${semester || 3}-${normCode}`,
        courseCode: sub.code,
        title: sub.name,
        departmentCode: (branch || 'CSE') as BranchCode,
        semester: semester || 3,
        credits: sub.credits,
        labLocation:
          matchedRich?.labLocation ||
          `${branch || 'CSE'} Departmental Laboratory • SETGOI Academic Block`,
        vivaQuestions:
          matchedRich?.vivaQuestions || [
            {
              question: `What is the primary objective and experimental setup of ${sub.name}?`,
              answer: `Students implement, test, and verify core ${sub.name} (${sub.code}) concepts under MAKAUT practical assessment (PCA1/PCA2) rubrics.`,
            },
            {
              question: `How do you validate edge cases and error bounds in ${sub.code}?`,
              answer: `Compare theoretical expectations against observed outputs, verify boundary conditions, and document complexity/error tolerances in the lab record.`,
            },
          ],
      };
    });

    if (!searchQuery.trim()) return merged;

    const q = searchQuery.toLowerCase().trim();
    return merged.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.courseCode.toLowerCase().includes(q) ||
        l.labLocation.toLowerCase().includes(q) ||
        l.vivaQuestions.some(
          (v) =>
            v.question.toLowerCase().includes(q) ||
            v.answer.toLowerCase().includes(q)
        )
    );
  }, [liveSyllabus, branch, semester, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedLabId((prev) => (prev === id ? null : id));
  };

  const handleCopy = (text: string, id: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedQuestionId(id);
      setTimeout(() => setCopiedQuestionId(null), 2500);
    } catch {}
  };

  const handleOpenManual = (lab: (typeof filteredLabs)[number]) => {
    setActiveManualNote({
      id: lab.id,
      title: `${lab.title} — Official MAKAUT Lab Manual`,
      subjectCode: lab.courseCode,
      subjectName: lab.title,
      departmentCode: lab.departmentCode,
      semester: lab.semester,
      category: 'LAB_MANUAL',
      academicYear: '2026-2027',
      fileUrl: `/api/notes/${encodeURIComponent(lab.id)}/download`,
      fileSize: 2048000,
      downloadsCount: 0,
      status: 'approved',
      uploaderId: 'setgoi-faculty',
      uploaderName: 'SETGOI Lab Faculty',
      uploaderRole: 'college',
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-[#E4E4E7] rounded-2xl p-3.5 shadow-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[#52525B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${branch || 'all'} Sem ${semester || ''} lab manuals, code (e.g. PCC-CS391), or viva questions...`}
            className="w-full h-9 pl-9 pr-8 bg-zinc-50 border border-[#E4E4E7] rounded-xl text-xs text-[#09090B] placeholder:text-[#52525B]/60 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#09090B]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => onOpenUpload(branch || 'CSE', semester || 3)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-medium font-sans transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Lab Manual</span>
        </button>
      </div>

      {/* Lab Cards Grid */}
      {filteredLabs.length === 0 ? (
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-10 sm:p-14 text-center shadow-xs max-w-2xl mx-auto space-y-4 my-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center justify-center mx-auto">
            <FlaskConical className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-[#09090B] font-display">
              No Lab Manuals Found for {branch || 'this branch'} {semester ? `Sem ${semester}` : ''}
            </h3>
            <p className="text-xs text-[#52525B] max-w-md mx-auto leading-relaxed font-sans">
              Contribute a practical manual or try another semester filter.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredLabs.map((lab) => {
            const isExpanded = expandedLabId === lab.id;

            return (
              <div
                key={lab.id}
                className="bg-white border border-[#E4E4E7] hover:border-[#2563EB]/40 rounded-2xl p-5 shadow-xs transition-all duration-150 space-y-4"
              >
                {/* Top Badge Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-mono text-xs font-bold flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5" />
                      {lab.courseCode}
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      Sem {lab.semester} • {lab.departmentCode} • {lab.credits} Credits
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenManual(lab)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-sans font-semibold transition-colors self-start sm:self-auto shrink-0 cursor-pointer shadow-2xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Lab Manual</span>
                  </button>
                </div>

                {/* Lab Title & Physical Outpost */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#09090B] font-display">
                    {lab.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#52525B] mt-1 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{lab.labLocation}</span>
                  </div>
                </div>

                {/* Expandable Viva Questions Accordion Trigger */}
                <div className="pt-2 border-t border-[#F1F5F9]">
                  <button
                    onClick={() => toggleExpand(lab.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 text-xs font-mono font-semibold text-[#0F172A] hover:text-[#2563EB] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#2563EB]" />
                      <span>
                        {isExpanded
                          ? 'Hide External Viva Questions'
                          : `View External Viva Questions (${lab.vivaQuestions.length})`}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-zinc-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-3 pt-1 animate-in fade-in duration-200">
                      <div className="space-y-2.5">
                        {lab.vivaQuestions.map((vq, idx) => {
                          const qKey = `${lab.id}-q-${idx}`;
                          const isCopied = copiedQuestionId === qKey;

                          return (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl bg-white border border-[#E4E4E7] shadow-2xs space-y-1.5 relative group"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <h4 className="text-xs font-bold text-[#09090B] font-sans flex items-start gap-1.5 leading-snug">
                                  <span className="font-mono text-[#2563EB] shrink-0">
                                    Q{idx + 1}.
                                  </span>
                                  <span>{vq.question}</span>
                                </h4>

                                <button
                                  onClick={() => handleCopy(`Q: ${vq.question}\nA: ${vq.answer}`, qKey)}
                                  className="text-zinc-400 hover:text-zinc-700 p-1 rounded hover:bg-zinc-100 transition-colors shrink-0 cursor-pointer"
                                  title="Copy Question & Answer"
                                >
                                  {isCopied ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>

                              <p className="text-xs text-[#52525B] leading-relaxed font-sans pl-5 border-l-2 border-blue-100 mt-1">
                                <strong className="text-zinc-700 font-medium">Model Answer: </strong>
                                {vq.answer}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <NotePreviewModal
        note={activeManualNote}
        onClose={() => setActiveManualNote(null)}
        onDownload={(n) => {
          if (onDownloadNote) onDownloadNote(n);
        }}
      />
    </div>
  );
}
