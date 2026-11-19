'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Award, 
  BookOpen, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Copy, 
  Check, 
  ArrowRight, 
  Info,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { 
  SemesterDetail, 
  SubjectEntry, 
  LetterGrade 
} from '../types';
import { 
  DEFAULT_MAKAUT_SEMESTERS, 
  MAKAUT_GRADE_SYSTEM, 
  calculateCumulativeCGPA, 
  calculateSubjectSGPA,
  calculatePercentageFromGpa
} from '../utils/makaut-calculator';
import { MAKAUT_SEMESTER_PRESETS } from '../data/curriculum-data';

export function SgpaCgpaCalculator() {
  const [activeTab, setActiveTab] = useState<'cumulative' | 'subject'>('cumulative');
  const [semesters, setSemesters] = useState<SemesterDetail[]>(DEFAULT_MAKAUT_SEMESTERS);
  const [showGradeInfo, setShowGradeInfo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subject-wise calculator state
  const [selectedSemesterNum, setSelectedSemesterNum] = useState<number>(3);
  const [subjects, setSubjects] = useState<SubjectEntry[]>(() => {
    const preset = MAKAUT_SEMESTER_PRESETS.find((p) => p.semesterNumber === 3);
    if (!preset) return [];
    return preset.subjects.map((sub, idx) => ({
      ...sub,
      id: `subj-${idx}`,
      grade: 'A' as LetterGrade,
    }));
  });

  // Calculate Cumulative CGPA & YGPAs
  const cumulativeSummary = useMemo(() => {
    return calculateCumulativeCGPA(semesters);
  }, [semesters]);

  // Calculate Subject SGPA
  const subjectSummary = useMemo(() => {
    return calculateSubjectSGPA(subjects);
  }, [subjects]);

  // Handler: Change semester SGPA/Credits in Cumulative Mode
  const handleSemesterChange = (id: string, field: 'sgpa' | 'credits', value: string) => {
    const numVal = parseFloat(value);
    setSemesters((prev) =>
      prev.map((sem) => {
        if (sem.id === id) {
          return {
            ...sem,
            [field]: isNaN(numVal) ? 0 : Math.max(0, numVal),
          };
        }
        return sem;
      })
    );
  };

  // Handler: Select semester preset in Subject mode
  const handleSemesterPresetSelect = (semNum: number) => {
    setSelectedSemesterNum(semNum);
    const preset = MAKAUT_SEMESTER_PRESETS.find((p) => p.semesterNumber === semNum);
    if (preset) {
      setSubjects(
        preset.subjects.map((sub, idx) => ({
          ...sub,
          id: `subj-${semNum}-${idx}`,
          grade: 'A' as LetterGrade,
        }))
      );
    } else {
      setSubjects([
        { id: `subj-${semNum}-0`, code: `TH${semNum}01`, name: 'Theory Paper 1', credits: 4, grade: 'A' },
        { id: `subj-${semNum}-1`, code: `TH${semNum}02`, name: 'Theory Paper 2', credits: 3, grade: 'A' },
        { id: `subj-${semNum}-2`, code: `PR${semNum}91`, name: 'Laboratory 1', credits: 2, grade: 'E' },
      ]);
    }
  };

  // Handler: Update subject field
  const handleSubjectChange = (id: string, field: keyof SubjectEntry, value: any) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id === id) {
          return {
            ...sub,
            [field]: field === 'credits' ? Math.max(0, parseFloat(value) || 0) : value,
          };
        }
        return sub;
      })
    );
  };

  // Handler: Add custom subject
  const handleAddSubject = () => {
    const newId = `custom-subj-${Date.now()}`;
    setSubjects((prev) => [
      ...prev,
      { id: newId, code: `ELEC-${prev.length + 1}`, name: 'New Elective / Lab', credits: 3, grade: 'A' },
    ]);
  };

  // Handler: Remove subject
  const handleRemoveSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  // Push calculated SGPA into the cumulative calculator
  const handleApplyToCumulative = () => {
    setSemesters((prev) =>
      prev.map((sem) => {
        if (sem.semesterNumber === selectedSemesterNum) {
          return {
            ...sem,
            sgpa: subjectSummary.sgpa,
            credits: subjectSummary.totalCredits,
          };
        }
        return sem;
      })
    );
    setToastMessage(`Sem ${selectedSemesterNum} SGPA (${subjectSummary.sgpa.toFixed(2)}) applied to Cumulative Planner!`);
    setTimeout(() => setToastMessage(null), 3500);
    setActiveTab('cumulative');
  };

  // Reset cumulative
  const handleResetCumulative = () => {
    setSemesters(DEFAULT_MAKAUT_SEMESTERS);
    setToastMessage('Scoreboard reset to default MAKAUT curriculum benchmark.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Copy Summary Report
  const handleCopyReport = () => {
    const lines = [
      `MAKAUT ACADEMIC PERFORMANCE AUDIT (SETGOI)`,
      `Generated via SanakaHub Utilities • ${new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      `------------------------------------------`,
      `Cumulative CGPA: ${cumulativeSummary.cgpa.toFixed(2)} / 10.00`,
      `MAKAUT Equivalent: ${cumulativeSummary.percentage}%`,
      `Percentage Formula: (${cumulativeSummary.cgpa.toFixed(2)} - 0.75) × 10 = ${cumulativeSummary.percentage}%`,
      `Degree Division: ${cumulativeSummary.classification}`,
      `Total Completed Credits: ${cumulativeSummary.totalCredits}`,
      `Honours Eligibility: ${cumulativeSummary.isHonoursEligible ? 'QUALIFIED (CGPA ≥ 7.50)' : 'Not Yet Qualified'}`,
      `------------------------------------------`,
      `Year-Wise YGPA Breakdown:`,
      ...cumulativeSummary.yearWiseYgpa.map(
        (y) => ` • ${y.yearLabel}: YGPA ${y.ygpa > 0 ? y.ygpa.toFixed(2) : 'N/A'} (${y.creditsYear} Credits)`
      ),
      `------------------------------------------`,
      `Formula: MAKAUT % = (CGPA - 0.75) * 10 | YGPA = (Odd Index + Even Index) / Total Credits`,
      `Sanaka Educational Trust Group of Institutions (SETGOI Durgapur)`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setToastMessage(`Academic Audit copied to clipboard! (${cumulativeSummary.cgpa.toFixed(2)} CGPA • ${cumulativeSummary.percentage}%)`);
    setTimeout(() => setCopied(false), 2500);
    setTimeout(() => setToastMessage(null), 3800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
              <Calculator className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#0F172A]">
              MAKAUT 10-Point Credit Index Calculator
            </h2>
          </div>
          <p className="text-xs text-[#475569] mt-1">
            Compliant with MAKAUT official Academic Regulations: Credit Index = SGPA × Credits, YGPA, and % = (CGPA − 0.75) × 10
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg border border-[#E2E8F0] text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('cumulative')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'cumulative'
                ? 'bg-white text-[#0F172A] shadow-sm border border-[#E2E8F0] font-semibold'
                : 'text-zinc-600 hover:text-[#0F172A]'
            }`}
          >
            Cumulative CGPA & YGPA
          </button>
          <button
            onClick={() => setActiveTab('subject')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'subject'
                ? 'bg-white text-[#0F172A] shadow-sm border border-[#E2E8F0] font-semibold'
                : 'text-zinc-600 hover:text-[#0F172A]'
            }`}
          >
            Subject-wise SGPA
          </button>
        </div>
      </div>

      {/* Collapsible Grade Scale Reference Card */}
      <div className="border border-[#E2E8F0] rounded-lg bg-zinc-50/70 p-3 text-xs">
        <button
          onClick={() => setShowGradeInfo(!showGradeInfo)}
          className="flex items-center justify-between w-full text-zinc-700 font-medium hover:text-[#0F172A]"
        >
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>MAKAUT 10-Point Letter Grade & Point Matrix</span>
          </span>
          <span className="flex items-center gap-1 text-[#475569] text-[11px]">
            {showGradeInfo ? 'Hide Matrix' : 'View Matrix'}
            {showGradeInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </span>
        </button>

        {showGradeInfo && (
          <div className="mt-3 overflow-x-auto pt-2 border-t border-[#E2E8F0]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#475569] font-mono text-[11px] uppercase">
                  <th className="py-1 px-2">Letter</th>
                  <th className="py-1 px-2">Points</th>
                  <th className="py-1 px-2">Percentage Band</th>
                  <th className="py-1 px-2">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-zinc-800 font-mono text-xs">
                {MAKAUT_GRADE_SYSTEM.map((g) => (
                  <tr key={g.letter} className="hover:bg-white/80">
                    <td className="py-1.5 px-2 font-bold text-sky-700">{g.letter}</td>
                    <td className="py-1.5 px-2 font-semibold">{g.points}</td>
                    <td className="py-1.5 px-2">{g.percentageRange}</td>
                    <td className="py-1.5 px-2 font-sans text-zinc-600">{g.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* TAB 1: CUMULATIVE CGPA & YGPA */}
      {activeTab === 'cumulative' && (
        <div className="space-y-6">
          {/* Hero Academic Audit Performance Cockpit Card */}
          <div className="relative overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-xs">
            {/* Subtle blueprint grid watermark */}
            <div 
              className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#0F172A_1px,transparent_1px)] [background-size:16px_16px]" 
              aria-hidden="true" 
            />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-50 text-[#2563EB] border border-blue-200 font-semibold tracking-wider inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                    Live MAKAUT Academic Cockpit
                  </span>
                  <span className="text-[11px] font-mono text-[#475569] bg-slate-50 px-2 py-0.5 rounded border border-[#E2E8F0]">
                    Credit Index: {cumulativeSummary.totalCreditIndex.toFixed(1)} Points
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline gap-6 sm:gap-8">
                  <div>
                    <span className="text-xs font-mono uppercase text-[#475569] block mb-0.5">Calculated SGPA / CGPA</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight font-mono">
                        {cumulativeSummary.cgpa > 0 ? cumulativeSummary.cgpa.toFixed(2) : '8.42'}
                      </span>
                      <span className="text-sm font-mono text-[#475569]">/ 10.00</span>
                    </div>
                  </div>

                  <div className="h-10 w-px bg-[#E2E8F0] hidden sm:block self-center" />

                  <div>
                    <span className="text-xs font-mono uppercase text-[#475569] block mb-0.5">MAKAUT Equivalent</span>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#2563EB] tracking-tight font-mono">
                        {cumulativeSummary.percentage > 0 ? `${cumulativeSummary.percentage}%` : '76.7%'}
                      </span>
                    </div>
                  </div>

                  <div className="h-10 w-px bg-[#E2E8F0] hidden sm:block self-center" />

                  <div>
                    <span className="text-xs font-mono uppercase text-[#475569] block mb-0.5">Total Credits</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight font-mono">
                        {cumulativeSummary.totalCredits.toFixed(1)}
                      </span>
                      <span className="text-xs font-mono text-[#475569]">Completed</span>
                    </div>
                  </div>
                </div>

                {/* Formula & Status Badges */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-slate-100 text-[#0F172A] border border-[#E2E8F0]">
                    <TrendingUp className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Formula: (SGPA − 0.75) × 10 = {cumulativeSummary.percentage > 0 ? `${cumulativeSummary.percentage}%` : '76.7%'}</span>
                  </span>

                  {cumulativeSummary.isHonoursEligible ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Eligible (CGPA ≥ 7.50)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200">
                      <Info className="w-3.5 h-3.5 text-amber-600" />
                      <span>Target: CGPA ≥ 7.50 for Honours</span>
                    </span>
                  )}

                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-sans font-medium bg-blue-50 text-[#2563EB] border border-blue-200">
                    {cumulativeSummary.classification}
                  </span>
                </div>
              </div>

              {/* Primary CTA Buttons */}
              <div className="flex sm:flex-col items-center sm:items-end gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#E2E8F0]">
                <button
                  onClick={handleCopyReport}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-mono font-medium transition-all shadow-2xs cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Audit Copied!' : 'Copy Audit'}</span>
                </button>

                <button
                  onClick={handleResetCumulative}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-mono text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>
              </div>
            </div>
          </div>

          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* CGPA */}
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#475569]">
                  Cumulative CGPA
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#0F172A] tracking-tight font-mono">
                    {cumulativeSummary.cgpa > 0 ? cumulativeSummary.cgpa.toFixed(2) : '8.42'}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">/ 10.00</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-[#475569]">Credit Index:</span>
                <span className="font-mono font-semibold text-zinc-800">
                  {cumulativeSummary.totalCreditIndex.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Equivalent Percentage */}
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#475569]">
                  MAKAUT Percentage
                </p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#2563EB] tracking-tight font-mono">
                    {cumulativeSummary.percentage > 0 ? `${cumulativeSummary.percentage}%` : '76.7%'}
                  </span>
                </div>
              </div>
              <p className="mt-3 pt-2 border-t border-zinc-100 text-[11px] text-zinc-400 font-mono">
                Formula: (CGPA − 0.75) × 10
              </p>
            </div>

            {/* Classification */}
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#475569]">
                  Degree Division
                </p>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {cumulativeSummary.classification}
                  </span>
                </div>
              </div>
              <p className="mt-3 pt-2 border-t border-zinc-100 text-[11px] text-[#475569]">
                Total Credits: <span className="font-mono font-bold text-[#0F172A]">{cumulativeSummary.totalCredits}</span>
              </p>
            </div>

            {/* Honours Pacing */}
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-xs flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#475569]">
                  Honours Status
                </p>
                <div className="mt-1">
                  {cumulativeSummary.isHonoursEligible ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      Eligible (CGPA ≥ 7.50)
                    </span>
                  ) : (
                    <span className="text-xs text-[#475569]">
                      Requires CGPA ≥ 7.50 with 0 backlogs
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                <button
                  onClick={handleCopyReport}
                  className="inline-flex items-center gap-1 text-[#2563EB] hover:text-sky-700 font-medium cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Report Copied' : 'Copy Audit'}
                </button>
                <button
                  onClick={handleResetCumulative}
                  className="text-zinc-400 hover:text-zinc-600 inline-flex items-center gap-1 cursor-pointer"
                  title="Reset to default template"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* 4-Year YGPA Cards */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#475569] mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-zinc-600" />
              Yearly Grade Point Average (YGPA) Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {cumulativeSummary.yearWiseYgpa.map((y) => (
                <div
                  key={y.year}
                  className="p-3.5 rounded-lg border border-[#E2E8F0] bg-white flex flex-col justify-between hover:border-zinc-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F172A]">{y.yearLabel}</span>
                    {y.isHonoursPacing && y.ygpa > 0 && (
                      <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-1.5 py-0.5 rounded border border-amber-200">
                        Honours Pace
                      </span>
                    )}
                  </div>
                  <div className="my-2">
                    <span className="text-2xl font-bold font-mono text-[#0F172A]">
                      {y.ygpa > 0 ? y.ygpa.toFixed(2) : '—'}
                    </span>
                    <span className="text-xs text-zinc-400 ml-1 font-mono">YGPA</span>
                  </div>
                  <div className="text-[11px] text-[#475569] border-t border-zinc-100 pt-1.5 flex justify-between">
                    <span>Sem {y.oddSem.semesterNumber}: {y.oddSem.sgpa > 0 ? y.oddSem.sgpa : '0'}</span>
                    <span>Sem {y.evenSem.semesterNumber}: {y.evenSem.sgpa > 0 ? y.evenSem.sgpa : '0'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Semesters Table */}
          <div className="border border-[#E2E8F0] rounded-xl bg-white overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-zinc-50 border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-zinc-600" />
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-700">
                  Semester Scoreboard (Semesters 1 – 8)
                </h3>
              </div>
              <span className="text-xs text-zinc-400">
                Edit SGPA and Credits live below
              </span>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full min-w-[580px] text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-zinc-50/50 text-[#475569] font-mono text-[11px] uppercase">
                    <th className="py-2.5 px-4 font-semibold">Semester</th>
                    <th className="py-2.5 px-4 font-semibold">Credits</th>
                    <th className="py-2.5 px-4 font-semibold">SGPA (0.00 – 10.00)</th>
                    <th className="py-2.5 px-4 font-semibold">Credit Index</th>
                    <th className="py-2.5 px-4 font-semibold">Equivalent %</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-800 font-mono">
                  {semesters.map((sem) => {
                    const creditIndex = (sem.credits * sem.sgpa).toFixed(2);
                    const semPct = sem.sgpa > 0 ? calculatePercentageFromGpa(sem.sgpa) : 0;
                    return (
                      <tr key={sem.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-2.5 px-4 font-sans font-semibold text-[#0F172A]">
                          {sem.semesterName}
                        </td>
                        <td className="py-2 px-4">
                          <input
                            type="number"
                            min="0"
                            max="35"
                            step="0.5"
                            value={sem.credits || ''}
                            onChange={(e) => handleSemesterChange(sem.id, 'credits', e.target.value)}
                            className="w-20 px-2 py-1 border border-[#E2E8F0] rounded font-mono text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none bg-white"
                          />
                        </td>
                        <td className="py-2 px-4">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.01"
                            value={sem.sgpa || ''}
                            onChange={(e) => handleSemesterChange(sem.id, 'sgpa', e.target.value)}
                            className="w-24 px-2 py-1 border border-[#E2E8F0] rounded font-mono text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none bg-white font-bold text-sky-700"
                          />
                        </td>
                        <td className="py-2.5 px-4 text-zinc-700">{creditIndex}</td>
                        <td className="py-2.5 px-4 text-[#475569]">
                          {semPct > 0 ? `${semPct}%` : '—'}
                        </td>
                        <td className="py-2 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedSemesterNum(sem.semesterNumber);
                              handleSemesterPresetSelect(sem.semesterNumber);
                              setActiveTab('subject');
                            }}
                            className="inline-flex items-center gap-1 text-[11px] text-[#2563EB] hover:text-sky-700 font-sans font-medium"
                          >
                            Calculate via Subjects
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUBJECT-WISE SGPA CALCULATOR */}
      {activeTab === 'subject' && (
        <div className="space-y-6">
          {/* Header & Semester Preset Selection */}
          <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono uppercase text-[#475569]">Current Target Semester</p>
              <h3 className="text-lg font-bold text-[#0F172A] mt-0.5">
                Semester {selectedSemesterNum} (Computer Science & Engg Curriculum)
              </h3>
              <p className="text-xs text-[#475569] mt-0.5">
                Official MAKAUT subject codes with pre-loaded credit weighting.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sNum) => (
                <button
                  key={sNum}
                  onClick={() => handleSemesterPresetSelect(sNum)}
                  className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                    selectedSemesterNum === sNum
                      ? 'bg-zinc-900 text-white border-zinc-900 font-bold'
                      : 'bg-white text-zinc-700 border-[#E2E8F0] hover:bg-zinc-50'
                  }`}
                >
                  Sem {sNum}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Result Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
              <p className="text-[11px] font-mono uppercase text-[#475569]">Semester SGPA</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-[#0F172A]">
                  {subjectSummary.sgpa.toFixed(2)}
                </span>
                <span className="text-xs text-zinc-400 font-mono">/ 10.00</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono mt-1">
                Credit Index: {subjectSummary.creditIndex.toFixed(1)}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
              <p className="text-[11px] font-mono uppercase text-[#475569]">Equivalent Percentage</p>
              <div className="mt-1">
                <span className="text-3xl font-extrabold font-mono text-[#2563EB]">
                  {subjectSummary.percentage}%
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono mt-1">
                Total Credits: {subjectSummary.totalCredits}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-mono uppercase text-[#475569]">Backlog Warning</p>
                <div className="mt-1">
                  {subjectSummary.hasBacklog ? (
                    <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                      Contains 'F' Grade (Backlog)
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      All Subjects Cleared
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleApplyToCumulative}
                className="mt-3 w-full py-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                Apply to Sem {selectedSemesterNum} in Cumulative Planner
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subjects Table */}
          <div className="border border-[#E2E8F0] rounded-xl bg-white overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-zinc-50 border-b border-[#E2E8F0] flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-700">
                Subjects & Laboratory Assessments
              </h3>
              <button
                onClick={handleAddSubject}
                className="inline-flex items-center gap-1 text-xs text-[#2563EB] hover:text-sky-700 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Custom Paper
              </button>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full min-w-[580px] text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-zinc-50/50 text-[#475569] font-mono text-[11px] uppercase">
                    <th className="py-2.5 px-4 font-semibold">Subject Code</th>
                    <th className="py-2.5 px-4 font-semibold">Subject / Paper Name</th>
                    <th className="py-2.5 px-4 font-semibold">Credits</th>
                    <th className="py-2.5 px-4 font-semibold">Letter Grade</th>
                    <th className="py-2.5 px-4 font-semibold">Grade Points</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-800 font-mono">
                  {subjects.map((sub) => {
                    const points = MAKAUT_GRADE_SYSTEM.find((g) => g.letter === sub.grade)?.points || 0;
                    return (
                      <tr key={sub.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-2 px-4">
                          <input
                            type="text"
                            value={sub.code}
                            onChange={(e) => handleSubjectChange(sub.id, 'code', e.target.value)}
                            className="w-28 px-2 py-1 border border-[#E2E8F0] rounded font-mono text-xs uppercase bg-white focus:ring-1 focus:ring-sky-500 outline-none"
                          />
                        </td>
                        <td className="py-2 px-4 font-sans">
                          <input
                            type="text"
                            value={sub.name}
                            onChange={(e) => handleSubjectChange(sub.id, 'name', e.target.value)}
                            className="w-full px-2 py-1 border border-[#E2E8F0] rounded text-xs bg-white focus:ring-1 focus:ring-sky-500 outline-none"
                          />
                        </td>
                        <td className="py-2 px-4">
                          <input
                            type="number"
                            min="0.5"
                            max="10"
                            step="0.5"
                            value={sub.credits}
                            onChange={(e) => handleSubjectChange(sub.id, 'credits', e.target.value)}
                            className="w-16 px-2 py-1 border border-[#E2E8F0] rounded font-mono text-xs bg-white focus:ring-1 focus:ring-sky-500 outline-none"
                          />
                        </td>
                        <td className="py-2 px-4">
                          <select
                            value={sub.grade}
                            onChange={(e) => handleSubjectChange(sub.id, 'grade', e.target.value as LetterGrade)}
                            className="px-2.5 py-1 border border-[#E2E8F0] rounded font-mono font-bold text-xs bg-white text-sky-800 focus:ring-1 focus:ring-sky-500 outline-none cursor-pointer"
                          >
                            {MAKAUT_GRADE_SYSTEM.map((g) => (
                              <option key={g.letter} value={g.letter}>
                                {g.letter} ({g.points} pts - {g.percentageRange})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-4 font-bold text-zinc-700">
                          {points} pts
                        </td>
                        <td className="py-2 px-4 text-right">
                          <button
                            onClick={() => handleRemoveSubject(sub.id)}
                            className="text-zinc-400 hover:text-red-600 transition-colors p-1"
                            title="Remove subject"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Toast Confirmation Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#0F172A] text-white text-xs font-mono rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
