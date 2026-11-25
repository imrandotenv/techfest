'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  TrendingUp,
  Save,
  Loader2,
  Download,
  Printer
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
import { SYLLABUS_BRANCHES, SyllabusBranch, normalizeSyllabusBranch } from '@/lib/makaut-syllabus';
import { useAcademicProfile } from '@/hooks/useAcademicProfile';

export function SgpaCgpaCalculator() {
  const [activeTab, setActiveTab] = useState<'cumulative' | 'subject'>('cumulative');
  const [semesters, setSemesters] = useState<SemesterDetail[]>(DEFAULT_MAKAUT_SEMESTERS);
  const [showGradeInfo, setShowGradeInfo] = useState(false);
  const [showYgpaBreakdown, setShowYgpaBreakdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savingToDashboard, setSavingToDashboard] = useState(false);
  const [savedToDashboard, setSavedToDashboard] = useState(false);

  const handleSaveToDashboard = async () => {
    setSavingToDashboard(true);
    try {
      const gpaToSave = activeTab === 'cumulative' ? cumulativeSummary.cgpa : subjectSummary.sgpa;
      const res = await fetch('/api/student/stats', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cgpa: parseFloat(gpaToSave.toFixed(2)),
        }),
      });
      if (!res.ok) throw new Error('Failed to update stats');
      setSavedToDashboard(true);
      setToastMessage(`Saved CGPA ${gpaToSave.toFixed(2)} to your Neon student dashboard!`);
      setTimeout(() => setSavedToDashboard(false), 2500);
      setTimeout(() => setToastMessage(null), 3800);
    } catch {
      setToastMessage('Could not save to dashboard. Sign in required.');
      setTimeout(() => setToastMessage(null), 3800);
    } finally {
      setSavingToDashboard(false);
    }
  };

  // Subject-wise calculator state
  const { profile } = useAcademicProfile();
  const [selectedBranch, setSelectedBranch] = useState<SyllabusBranch>('CSE');
  const [selectedSemesterNum, setSelectedSemesterNum] = useState<number>(3);
  const [loadingLiveSyllabus, setLoadingLiveSyllabus] = useState<boolean>(false);
  const [subjects, setSubjects] = useState<SubjectEntry[]>(() => {
    const preset = MAKAUT_SEMESTER_PRESETS.find((p) => p.semesterNumber === 3);
    if (!preset) return [];
    return preset.subjects.map((sub, idx) => ({
      ...sub,
      id: `subj-${idx}`,
      grade: 'A' as LetterGrade,
    }));
  });

  useEffect(() => {
    if (profile?.branch) {
      setSelectedBranch(normalizeSyllabusBranch(profile.branch));
    }
    if (profile?.semester) {
      setSelectedSemesterNum(profile.semester);
    }
  }, [profile?.branch, profile?.semester]);

  const handleLoadFromLiveSyllabus = async (
    targetBranch: SyllabusBranch = selectedBranch,
    targetSem: number = selectedSemesterNum
  ) => {
    setLoadingLiveSyllabus(true);
    try {
      const res = await fetch(
        `/api/syllabus?branch=${encodeURIComponent(targetBranch)}&semester=${targetSem}`
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.subjects) && data.subjects.length > 0) {
          setSubjects(
            data.subjects.map((s: any, idx: number) => ({
              id: `live-${targetBranch}-${targetSem}-${idx}`,
              code: s.code,
              name: s.name,
              credits: typeof s.credits === 'number' ? s.credits : parseFloat(s.credits) || 0,
              grade: 'A' as LetterGrade,
            }))
          );
          setToastMessage(
            `Loaded ${data.subjects.length} official ${targetBranch} Sem ${targetSem} subjects & credits from Neon DB!`
          );
          setTimeout(() => setToastMessage(null), 3500);
          return;
        }
      }
      setToastMessage('No subjects found for that branch/semester.');
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      setToastMessage('Failed to load live syllabus.');
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setLoadingLiveSyllabus(false);
    }
  };

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
    handleLoadFromLiveSyllabus(selectedBranch, semNum);
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
      `Generated via SETTech Utilities • ${new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}`,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E4E7] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB] border border-blue-200/60">
              <Calculator className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#09090B] font-display">
              MAKAUT 10-Point Credit Index Calculator
            </h2>
          </div>
          <p className="text-xs text-[#52525B] mt-1 font-sans">
            Compliant with MAKAUT official Academic Regulations: Credit Index = SGPA × Credits, YGPA, and % = (CGPA − 0.75) × 10
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-full border border-[#E4E4E7] text-xs font-medium self-start sm:self-auto font-sans">
          <button
            onClick={() => setActiveTab('cumulative')}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === 'cumulative'
                ? 'bg-[#2563EB] text-white shadow-xs font-semibold'
                : 'text-[#52525B] hover:text-[#09090B]'
            }`}
          >
            Cumulative CGPA &amp; YGPA
          </button>
          <button
            onClick={() => setActiveTab('subject')}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === 'subject'
                ? 'bg-[#2563EB] text-white shadow-xs font-semibold'
                : 'text-[#52525B] hover:text-[#09090B]'
            }`}
          >
            Subject-wise SGPA
          </button>
        </div>
      </div>

      {/* Collapsible Grade Scale Reference Card */}
      <div className="border border-[#E4E4E7] rounded-xl bg-zinc-50/70 p-3.5 text-xs">
        <button
          onClick={() => setShowGradeInfo(!showGradeInfo)}
          className="flex items-center justify-between w-full text-[#52525B] font-medium hover:text-[#09090B] cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>MAKAUT 10-Point Letter Grade &amp; Point Matrix</span>
          </span>
          <span className="flex items-center gap-1 text-[#52525B] text-[11px] font-mono">
            {showGradeInfo ? 'Hide Matrix' : 'View Matrix'}
            {showGradeInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </span>
        </button>

        {showGradeInfo && (
          <div className="mt-3 overflow-x-auto pt-2 border-t border-[#E4E4E7]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E4E4E7] text-[#52525B] font-mono text-[11px] uppercase">
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

      {/* 2-Column Responsive Layout: Left Input Table | Right Sticky Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Compact Semester/Subject Input Table (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'cumulative' ? (
            <>
              {/* Semesters Table: Airy Padding and Clean Borders */}
              <div className="border border-[#E4E4E7] rounded-2xl bg-white overflow-hidden shadow-xs">
                <div className="px-4 py-3 bg-zinc-50 border-b border-[#E4E4E7] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#2563EB]" />
                    <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#09090B]">
                      Semester Scoreboard (Semesters 1 – 8)
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#52525B] font-mono hidden sm:inline">
                    Edit SGPA and Credits live below
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[540px] text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#E4E4E7] bg-zinc-50/70 text-[#52525B] font-mono text-[11px] uppercase">
                        <th className="py-3 px-4 font-semibold">Semester</th>
                        <th className="py-3 px-4 font-semibold">Credits</th>
                        <th className="py-3 px-4 font-semibold">SGPA</th>
                        <th className="py-3 px-4 font-semibold">Index</th>
                        <th className="py-3 px-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4E4E7] text-zinc-800 font-mono">
                      {semesters.map((sem) => {
                        const creditIndex = (sem.credits * sem.sgpa).toFixed(2);
                        return (
                          <tr key={sem.id} className="hover:bg-zinc-50/80 transition-colors">
                            <td className="py-3 px-4 font-sans font-semibold text-[#09090B]">
                              {sem.semesterName}
                            </td>
                            <td className="py-2.5 px-4">
                              <input
                                type="number"
                                min="0"
                                max="35"
                                step="0.5"
                                value={sem.credits || ''}
                                onChange={(e) => handleSemesterChange(sem.id, 'credits', e.target.value)}
                                className="w-16 px-2 py-1 border border-[#E4E4E7] rounded-lg font-mono text-xs focus:ring-1 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none bg-white text-[#09090B]"
                              />
                            </td>
                            <td className="py-2.5 px-4">
                              <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.01"
                                value={sem.sgpa || ''}
                                onChange={(e) => handleSemesterChange(sem.id, 'sgpa', e.target.value)}
                                className="w-20 px-2 py-1 border border-[#E4E4E7] rounded-lg font-mono text-xs focus:ring-1 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none bg-white font-bold text-[#2563EB]"
                              />
                            </td>
                            <td className="py-3 px-4 text-[#09090B] font-semibold">{creditIndex}</td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedSemesterNum(sem.semesterNumber);
                                  handleSemesterPresetSelect(sem.semesterNumber);
                                  setActiveTab('subject');
                                }}
                                className="inline-flex items-center gap-1 text-[11px] text-[#2563EB] hover:underline font-sans font-medium cursor-pointer"
                              >
                                <span>Calculate Subjects</span>
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

              {/* Collapsible 4-Year YGPA Breakdown */}
              <div className="border border-[#E4E4E7] rounded-2xl bg-white overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setShowYgpaBreakdown(!showYgpaBreakdown)}
                  className="w-full px-4 py-3 bg-zinc-50 hover:bg-zinc-100/80 transition-colors flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-zinc-600" />
                    <span className="text-xs font-mono font-bold text-[#09090B] uppercase">
                      Yearly YGPA Breakdown (Year 1 to 4)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#2563EB]">
                    <span>{showYgpaBreakdown ? 'Hide Breakdown' : 'View Yearly YGPA Breakdown'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showYgpaBreakdown ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {showYgpaBreakdown && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-[#E4E4E7] animate-in fade-in duration-150">
                    {cumulativeSummary.yearWiseYgpa.map((y) => (
                      <div
                        key={y.year}
                        className="p-3.5 rounded-xl border border-[#E4E4E7] bg-zinc-50/50 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#09090B] font-display">{y.yearLabel}</span>
                          {y.isHonoursPacing && y.ygpa > 0 && (
                            <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                              Honours Pace
                            </span>
                          )}
                        </div>
                        <div className="my-2">
                          <span className="text-2xl font-bold font-mono text-[#09090B]">
                            {y.ygpa > 0 ? y.ygpa.toFixed(2) : '—'}
                          </span>
                          <span className="text-xs text-[#52525B] ml-1 font-mono">YGPA</span>
                        </div>
                        <div className="text-[11px] text-[#52525B] border-t border-[#E4E4E7] pt-1.5 flex justify-between font-mono">
                          <span>Sem {y.oddSem.semesterNumber}: {y.oddSem.sgpa > 0 ? y.oddSem.sgpa : '0'}</span>
                          <span>Sem {y.evenSem.semesterNumber}: {y.evenSem.sgpa > 0 ? y.evenSem.sgpa : '0'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Header & Branch + Semester Live Syllabus Loader */}
              <div className="p-4 sm:p-5 rounded-2xl border border-[#E4E4E7] bg-white shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-mono uppercase text-[#52525B]">Current Target Curriculum</p>
                    <h3 className="text-base sm:text-lg font-bold text-[#09090B] mt-0.5 font-display">
                      {selectedBranch} • Semester {selectedSemesterNum}
                    </h3>
                    <p className="text-xs text-[#52525B] mt-0.5 font-sans">
                      Official MAKAUT subject codes with exact credit weighting from Neon DB.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={selectedBranch}
                      onChange={(e) => {
                        const nextBranch = e.target.value as SyllabusBranch;
                        setSelectedBranch(nextBranch);
                        handleLoadFromLiveSyllabus(nextBranch, selectedSemesterNum);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono font-semibold text-[#09090B]"
                      aria-label="Select B.Tech Branch"
                    >
                      {SYLLABUS_BRANCHES.map((b) => (
                        <option key={b.code} value={b.code}>
                          {b.code} — {b.name}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        handleLoadFromLiveSyllabus(
                          normalizeSyllabusBranch(profile?.branch || selectedBranch),
                          profile?.semester || selectedSemesterNum
                        )
                      }
                      disabled={loadingLiveSyllabus}
                      className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-sans font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {loadingLiveSyllabus ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>Load My Branch &amp; Semester Subjects</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-100">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sNum) => (
                    <button
                      key={sNum}
                      onClick={() => handleSemesterPresetSelect(sNum)}
                      className={`px-2.5 py-1 text-xs font-mono rounded-full border transition-colors cursor-pointer ${
                        selectedSemesterNum === sNum
                          ? 'bg-[#2563EB] text-white border-[#2563EB] font-bold shadow-xs'
                          : 'bg-white text-[#52525B] border-[#E4E4E7] hover:bg-zinc-50 hover:text-[#09090B]'
                      }`}
                    >
                      Sem {sNum}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subjects Table */}
              <div className="border border-[#E4E4E7] rounded-2xl bg-white overflow-hidden shadow-xs">
                <div className="px-4 py-3 bg-zinc-50 border-b border-[#E4E4E7] flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#09090B]">
                    Subjects &amp; Lab Assessments
                  </h3>
                  <button
                    onClick={handleAddSubject}
                    className="inline-flex items-center gap-1 text-xs text-[#2563EB] hover:underline font-medium cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Paper</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[540px] text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#E4E4E7] bg-zinc-50/70 text-[#52525B] font-mono text-[11px] uppercase">
                        <th className="py-2.5 px-3 font-semibold">Subject Code</th>
                        <th className="py-2.5 px-3 font-semibold">Paper Name</th>
                        <th className="py-2.5 px-3 font-semibold">Credits</th>
                        <th className="py-2.5 px-3 font-semibold">Grade</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4E4E7] text-zinc-800 font-mono">
                      {subjects.map((sub) => (
                        <tr key={sub.id} className="hover:bg-zinc-50/80 transition-colors">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={sub.code}
                              onChange={(e) => handleSubjectChange(sub.id, 'code', e.target.value)}
                              className="w-24 px-2 py-1 border border-[#E4E4E7] rounded-lg font-mono text-xs uppercase bg-white focus:border-[#2563EB] outline-none text-[#09090B]"
                            />
                          </td>
                          <td className="py-2 px-3 font-sans">
                            <input
                              type="text"
                              value={sub.name}
                              onChange={(e) => handleSubjectChange(sub.id, 'name', e.target.value)}
                              className="w-full px-2 py-1 border border-[#E4E4E7] rounded-lg text-xs bg-white focus:border-[#2563EB] outline-none text-[#09090B]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              min="0.5"
                              max="10"
                              step="0.5"
                              value={sub.credits}
                              onChange={(e) => handleSubjectChange(sub.id, 'credits', e.target.value)}
                              className="w-14 px-2 py-1 border border-[#E4E4E7] rounded-lg font-mono text-xs bg-white focus:border-[#2563EB] outline-none text-[#09090B]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={sub.grade}
                              onChange={(e) => handleSubjectChange(sub.id, 'grade', e.target.value as LetterGrade)}
                              className="px-2 py-1 border border-[#E4E4E7] rounded-lg font-mono font-bold text-xs bg-white text-[#2563EB] focus:border-[#2563EB] outline-none cursor-pointer"
                            >
                              {MAKAUT_GRADE_SYSTEM.map((g) => (
                                <option key={g.letter} value={g.letter}>
                                  {g.letter} ({g.points} pts)
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              onClick={() => handleRemoveSubject(sub.id)}
                              className="text-[#52525B] hover:text-red-600 transition-colors p-1 cursor-pointer"
                              title="Remove subject"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Column: Sticky, Minimal SGPA/CGPA Summary Card (4 cols on lg) */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl border border-[#E4E4E7] bg-white shadow-xs space-y-5">
            {/* Header / Eyebrow */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#52525B] font-semibold">
                {activeTab === 'cumulative' ? 'Cumulative Summary' : `Semester ${selectedSemesterNum} Summary`}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/60 font-semibold">
                Live Score
              </span>
            </div>

            {/* Score Headline */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#09090B] tracking-tight font-mono">
                  {activeTab === 'cumulative'
                    ? (cumulativeSummary.cgpa > 0 ? cumulativeSummary.cgpa.toFixed(2) : '8.42')
                    : (subjectSummary.sgpa > 0 ? subjectSummary.sgpa.toFixed(2) : '0.00')}
                </span>
                <span className="text-sm font-mono text-[#52525B]">/ 10.00</span>
              </div>
              <p className="text-xs font-mono text-[#52525B] mt-1">
                {activeTab === 'cumulative'
                  ? `${cumulativeSummary.totalCredits.toFixed(1)} Credits Completed`
                  : `${subjectSummary.totalCredits.toFixed(1)} Credits in Sem ${selectedSemesterNum}`}
              </p>
            </div>

            {/* Percentage & Division */}
            <div className="pt-4 border-t border-[#E4E4E7] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#52525B] font-mono">MAKAUT Equivalent</span>
                <span className="text-xl font-bold font-mono text-[#2563EB]">
                  {activeTab === 'cumulative'
                    ? (cumulativeSummary.percentage > 0 ? `${cumulativeSummary.percentage}%` : '76.7%')
                    : `${subjectSummary.percentage}%`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#52525B] font-mono">Classification</span>
                <span className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-mono">
                  {activeTab === 'cumulative'
                    ? cumulativeSummary.classification
                    : (subjectSummary.sgpa >= 7.5 ? 'First Class with Distinction' : subjectSummary.sgpa >= 6.5 ? 'First Class' : subjectSummary.sgpa >= 5.0 ? 'Second Class' : 'Pass')}
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#52525B] pt-0.5">
                Formula: (GPA − 0.75) × 10
              </div>
            </div>

            {/* Honours Status */}
            <div className="pt-3 border-t border-[#E4E4E7]">
              {activeTab === 'cumulative' ? (
                cumulativeSummary.isHonoursEligible ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-mono">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Honours Eligible (CGPA ≥ 7.50)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 p-2.5 rounded-xl font-mono">
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Target: CGPA ≥ 7.50 for Honours</span>
                  </div>
                )
              ) : (
                <button
                  onClick={handleApplyToCumulative}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer font-sans"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Apply to Cumulative Scoreboard</span>
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleSaveToDashboard}
                disabled={savingToDashboard}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold font-sans transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {savedToDashboard ? <Check className="w-3.5 h-3.5 text-white" /> : <Save className="w-3.5 h-3.5 text-white" />}
                <span>{savedToDashboard ? 'Saved to Dashboard!' : savingToDashboard ? 'Saving to Neon...' : 'Save to My Dashboard'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyReport}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#09090B] hover:bg-zinc-800 text-white text-xs font-semibold font-sans transition-all shadow-xs cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-[#E4E4E7] bg-white hover:bg-zinc-50 text-[#09090B] text-xs font-semibold font-sans transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Summary</span>
                </button>
              </div>

              <button
                onClick={handleResetCumulative}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border border-[#E4E4E7] bg-white hover:bg-zinc-50 text-xs font-mono text-[#52525B] hover:text-[#09090B] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Toast Confirmation Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#09090B] text-white text-xs font-mono rounded-full shadow-xl border border-zinc-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-zinc-400 hover:text-white p-0.5 cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
