'use client';

import React, { useState, useMemo } from 'react';
import { 
  FlaskConical, 
  BookOpen, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  HelpCircle, 
  Plus, 
  FileText, 
  UploadCloud,
  CheckCircle2,
  Copy,
  Sparkles,
  MapPin,
  X
} from 'lucide-react';
import { BranchCode } from '../types';
import { LAB_PRACTICALS, LabPracticalItem } from '../data/lab-practicals-data';

interface LabPracticalsViewProps {
  branch: BranchCode | null;
  semester: number | null;
  onOpenUpload: (branch?: BranchCode, sem?: number) => void;
}

export function LabPracticalsView({
  branch,
  semester,
  onOpenUpload,
}: LabPracticalsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLabId, setExpandedLabId] = useState<string | null>(null);
  const [copiedQuestionId, setCopiedQuestionId] = useState<string | null>(null);

  // Filtered practical labs
  const filteredLabs = useMemo(() => {
    let list = LAB_PRACTICALS;

    if (branch) {
      list = list.filter((l) => l.departmentCode === branch);
    }
    if (semester) {
      list = list.filter((l) => l.semester === semester);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
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
    }

    return list;
  }, [branch, semester, searchQuery]);

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
            placeholder={`Search ${branch || 'all'} Sem ${semester || ''} lab manuals, code (e.g. CS391), or viva questions...`}
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
          <span>+ Upload Lab Manual</span>
        </button>
      </div>

      {/* Lab Cards Grid */}
      {filteredLabs.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-10 sm:p-14 text-center shadow-xs max-w-2xl mx-auto space-y-4 my-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center justify-center mx-auto">
            <FlaskConical className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-[#09090B] font-display">
              No Lab Manuals Uploaded for {branch || 'this branch'} {semester ? `Sem ${semester}` : ''}
            </h3>
            <p className="text-xs text-[#52525B] max-w-md mx-auto leading-relaxed font-sans">
              Be the first SETGOI engineer to contribute the practical manual or syllabus guide for this laboratory subject.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => onOpenUpload(branch || 'CSE', semester || 3)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold font-sans transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Contribute Lab Manual</span>
            </button>
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
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-200/60 font-mono text-xs font-bold flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5" />
                      {lab.courseCode}
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      Sem {lab.semester} • {lab.departmentCode} • {lab.credits} Credits
                    </span>
                  </div>

                  <a
                    href={lab.manualUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-50 hover:bg-blue-50 hover:text-[#2563EB] border border-zinc-200 text-xs font-mono font-medium text-zinc-700 transition-colors self-start sm:self-auto shrink-0 cursor-pointer"
                  >
                    <span>Open Lab Manual</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
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

                  {/* Expandable Viva Questions List */}
                  {isExpanded && (
                    <div className="mt-3 space-y-3 pt-1 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1">
                        <span>Top 5 Frequently Asked External Examiner Viva Questions:</span>
                        <span className="text-[#2563EB] font-medium">MAKAUT Lab Prep</span>
                      </div>

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
    </div>
  );
}
