'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  RotateCcw,
  Info,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Minus,
  Save,
  Check,
  Copy,
  Printer,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import {
  SYLLABUS_BRANCHES,
  SyllabusBranch,
  normalizeSyllabusBranch,
  getSubjectsForBranchAndSemester,
} from '@/lib/makaut-syllabus';
import { useAcademicProfile } from '@/hooks/useAcademicProfile';

export interface AttendanceSubject {
  id: string;
  code: string;
  name: string;
  attended: number;
  total: number;
}

const LOCAL_STORAGE_KEY = 'settech_attendance_records';

export function AttendanceTracker() {
  const { isLoaded, isSignedIn } = useUser();
  const { profile } = useAcademicProfile();

  const [selectedBranch, setSelectedBranch] = useState<SyllabusBranch>('CSE');
  const [selectedSemester, setSelectedSemester] = useState<number>(3);
  const [subjects, setSubjects] = useState<AttendanceSubject[]>(() =>
    getSubjectsForBranchAndSemester('CSE', 3)
      .filter((s) => s.type !== 'MANDATORY')
      .slice(0, 8)
      .map((s, idx) => ({
        id: `att-init-${idx}`,
        code: s.code,
        name: s.name,
        attended: 0,
        total: 0,
      }))
  );

  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [savingToDashboard, setSavingToDashboard] = useState(false);
  const [savedToDashboard, setSavedToDashboard] = useState(false);
  const [saveStatusMsg, setSaveStatusMsg] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [syncingSyllabus, setSyncingSyllabus] = useState(false);

  const syncFromLiveSyllabus = useCallback(
    async (branchToLoad: SyllabusBranch, semToLoad: number, showToast = true) => {
      setSyncingSyllabus(true);
      try {
        const res = await fetch(
          `/api/syllabus?branch=${encodeURIComponent(branchToLoad)}&semester=${semToLoad}`
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.subjects) && data.subjects.length > 0) {
            const loaded: AttendanceSubject[] = data.subjects
              .filter((s: any) => s.type !== 'MANDATORY')
              .map((s: any, idx: number) => ({
                id: `att-${branchToLoad}-${semToLoad}-${idx}`,
                code: s.code,
                name: s.name,
                attended: 0,
                total: 0,
              }));
            setSubjects(loaded);
            if (showToast) {
              setSaveStatusMsg(
                `Synced ${loaded.length} official ${branchToLoad} Sem ${semToLoad} subjects from Neon DB!`
              );
              setTimeout(() => setSaveStatusMsg(null), 3500);
            }
            return;
          }
        }
      } catch {
        // Fallback to local syllabus helper
      } finally {
        setSyncingSyllabus(false);
      }
    },
    []
  );

  // Hydrate from Neon PostgreSQL (/api/attendance) or localStorage on mount
  useEffect(() => {
    if (!isLoaded) return;
    if (profile?.branch) setSelectedBranch(normalizeSyllabusBranch(profile.branch));
    if (profile?.semester) setSelectedSemester(profile.semester);

    const loadInitial = async () => {
      if (isSignedIn) {
        try {
          const res = await fetch('/api/attendance');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.records) && data.records.length > 0) {
              setSubjects(
                data.records.map((r: any) => ({
                  id: r.id,
                  code: r.subjectCode,
                  name: r.subjectName,
                  attended: r.attended,
                  total: r.total,
                }))
              );
              return;
            }
          }
        } catch {}
      } else {
        try {
          const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSubjects(parsed);
              return;
            }
          }
        } catch {}
      }

      syncFromLiveSyllabus(
        normalizeSyllabusBranch(profile?.branch || 'CSE'),
        profile?.semester || 3,
        false
      );
    };

    loadInitial();
  }, [isLoaded, isSignedIn, profile?.branch, profile?.semester, syncFromLiveSyllabus]);

  // Overall aggregate
  const overallStats = useMemo(() => {
    const totalHeld = subjects.reduce((sum, s) => sum + s.total, 0);
    const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
    const percentage = totalHeld > 0 ? (totalAttended / totalHeld) * 100 : 0;

    let classesNeeded = 0;
    let safeBunks = 0;
    if (totalHeld > 0) {
      if (percentage < 75) {
        classesNeeded = Math.ceil((0.75 * totalHeld - totalAttended) / 0.25);
      } else {
        safeBunks = Math.floor((totalAttended - 0.75 * totalHeld) / 0.75);
      }
    }

    return {
      totalHeld,
      totalAttended,
      percentage: Number(percentage.toFixed(1)),
      classesNeeded: Math.max(0, classesNeeded),
      safeBunks: Math.max(0, safeBunks),
      isSafe: totalHeld === 0 || percentage >= 75,
    };
  }, [subjects]);

  const handleSaveToDashboard = async () => {
    setSavingToDashboard(true);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(subjects));
    } catch {}

    if (!isSignedIn) {
      setSavedToDashboard(true);
      setSaveStatusMsg('Saved locally in browser! Sign in to sync with Neon PostgreSQL.');
      setSavingToDashboard(false);
      setTimeout(() => setSavedToDashboard(false), 2500);
      setTimeout(() => setSaveStatusMsg(null), 3800);
      return;
    }

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch: selectedBranch,
          semester: selectedSemester,
          records: subjects.map((s) => ({
            subjectCode: s.code,
            subjectName: s.name,
            attended: s.attended,
            total: s.total,
          })),
        }),
      });
      if (!res.ok) throw new Error('Failed to save attendance');
      setSavedToDashboard(true);
      setSaveStatusMsg(`Saved attendance (${overallStats.percentage}%) to Neon PostgreSQL!`);
      setTimeout(() => setSavedToDashboard(false), 2500);
      setTimeout(() => setSaveStatusMsg(null), 3800);
    } catch {
      setSaveStatusMsg('Could not sync to Neon DB. Saved locally.');
      setTimeout(() => setSaveStatusMsg(null), 3800);
    } finally {
      setSavingToDashboard(false);
    }
  };

  const handleCopyAttendanceSummary = () => {
    const lines = [
      `SETGOI MAKAUT 75% ATTENDANCE SUMMARY (${selectedBranch} Sem ${selectedSemester})`,
      `Overall Attendance: ${overallStats.percentage}% (${overallStats.totalAttended}/${overallStats.totalHeld})`,
      `Status: ${
        overallStats.isSafe
          ? `ELIGIBLE (Cushion: ${overallStats.safeBunks} lectures)`
          : `DEBARRED RISK (Need ${overallStats.classesNeeded} classes)`
      }`,
      ...subjects.map(
        (s) =>
          `• ${s.code} (${s.name}): ${s.attended}/${s.total} (${
            s.total > 0 ? ((s.attended / s.total) * 100).toFixed(1) : '0.0'
          }%)`
      ),
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleUpdate = (id: string, field: 'attended' | 'total', delta: number) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (field === 'attended') {
          const nextAttended = Math.max(0, Math.min(s.total, s.attended + delta));
          return { ...s, attended: nextAttended };
        } else {
          const nextTotal = Math.max(s.attended, s.total + delta);
          return { ...s, total: nextTotal };
        }
      })
    );
  };

  const handleInputChange = (id: string, field: 'attended' | 'total', valStr: string) => {
    const val = parseInt(valStr, 10);
    if (isNaN(val)) return;
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (field === 'attended') {
          return { ...s, attended: Math.max(0, val) };
        } else {
          return { ...s, total: Math.max(0, val) };
        }
      })
    );
  };

  const handleRemove = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    const newSub: AttendanceSubject = {
      id: `att-${Date.now()}`,
      code: newCode.toUpperCase().trim(),
      name: newName.trim() || `${newCode.toUpperCase().trim()} Engineering`,
      attended: 0,
      total: 0,
    };
    setSubjects([...subjects, newSub]);
    setNewCode('');
    setNewName('');
  };

  const handleReset = () => {
    syncFromLiveSyllabus(selectedBranch, selectedSemester, true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB] border border-blue-200/70">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 font-display">
              MAKAUT 75% Mandatory Attendance Auditor
            </h2>
          </div>
          <p className="text-xs text-zinc-500 mt-1 font-sans">
            Synced with official 8-branch MAKAUT subjects. Track safe skips or classes needed per paper.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedBranch}
            onChange={(e) => {
              const b = e.target.value as SyllabusBranch;
              setSelectedBranch(b);
              syncFromLiveSyllabus(b, selectedSemester, true);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs font-mono font-semibold text-zinc-900"
            aria-label="Attendance Branch"
          >
            {SYLLABUS_BRANCHES.map((b) => (
              <option key={b.code} value={b.code}>
                {b.code}
              </option>
            ))}
          </select>

          <select
            value={selectedSemester}
            onChange={(e) => {
              const s = Number(e.target.value);
              setSelectedSemester(s);
              syncFromLiveSyllabus(selectedBranch, s, true);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs font-mono font-semibold text-[#2563EB]"
            aria-label="Attendance Semester"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Sem {s}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() =>
              syncFromLiveSyllabus(
                normalizeSyllabusBranch(profile?.branch || selectedBranch),
                profile?.semester || selectedSemester,
                true
              )
            }
            disabled={syncingSyllabus}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-sans font-semibold cursor-pointer transition-colors disabled:opacity-60"
          >
            {syncingSyllabus ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>Sync My Semester Subjects</span>
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-xs font-mono text-zinc-600 cursor-pointer transition-colors"
            title="Reset subjects"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Subjects List | Right Sticky Aggregate Scoreboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Subjects List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-3">
            {subjects.map((sub) => {
              const pct = sub.total > 0 ? (sub.attended / sub.total) * 100 : 0;
              const isSafe = sub.total === 0 || pct >= 75;
              let needed = 0;
              let bunks = 0;
              if (sub.total > 0) {
                if (!isSafe) {
                  needed = Math.ceil((0.75 * sub.total - sub.attended) / 0.25);
                } else {
                  bunks = Math.floor((sub.attended - 0.75 * sub.total) / 0.75);
                }
              }

              return (
                <div
                  key={sub.id}
                  className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-xs transition-all hover:border-zinc-300 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-zinc-100 text-zinc-800 border border-zinc-200">
                          {sub.code}
                        </span>
                        <h3 className="text-sm font-bold text-zinc-900 font-display">
                          {sub.name}
                        </h3>
                      </div>
                      <p className="text-xs font-mono text-zinc-500 mt-0.5">
                        Attended {sub.attended} of {sub.total} classes
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                          isSafe
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {isSafe ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        <span>{pct.toFixed(1)}%</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemove(sub.id)}
                        className="text-zinc-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="Remove subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden relative">
                    <div
                      className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-zinc-400 z-10"
                      title="75% Mandatory Threshold"
                    />
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        isSafe ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>

                  {/* Controls & Forecast Pill */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-xl p-1">
                        <span className="text-[11px] font-mono text-zinc-500 px-1.5">Attended:</span>
                        <button
                          type="button"
                          onClick={() => handleUpdate(sub.id, 'attended', -1)}
                          className="p-1 rounded-lg hover:bg-zinc-200 text-zinc-600 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          value={sub.attended}
                          onChange={(e) => handleInputChange(sub.id, 'attended', e.target.value)}
                          className="w-10 text-center bg-transparent font-mono text-xs font-bold text-zinc-900 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdate(sub.id, 'attended', 1)}
                          className="p-1 rounded-lg hover:bg-zinc-200 text-zinc-600 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-xl p-1">
                        <span className="text-[11px] font-mono text-zinc-500 px-1.5">Held:</span>
                        <button
                          type="button"
                          onClick={() => handleUpdate(sub.id, 'total', -1)}
                          className="p-1 rounded-lg hover:bg-zinc-200 text-zinc-600 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          value={sub.total}
                          onChange={(e) => handleInputChange(sub.id, 'total', e.target.value)}
                          className="w-10 text-center bg-transparent font-mono text-xs font-bold text-zinc-900 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdate(sub.id, 'total', 1)}
                          className="p-1 rounded-lg hover:bg-zinc-200 text-zinc-600 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs font-mono">
                      {sub.total === 0 ? (
                        <span className="text-zinc-500 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                          Enter held classes to calculate
                        </span>
                      ) : isSafe ? (
                        bunks > 0 ? (
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full inline-flex items-center gap-1 font-medium">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            <span>Can safely skip {bunks} class{bunks > 1 ? 'es' : ''}</span>
                          </span>
                        ) : (
                          <span className="text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full inline-flex items-center gap-1 font-medium">
                            On exact 75% border! Don&apos;t miss next class
                          </span>
                        )
                      ) : (
                        <span className="text-rose-700 bg-rose-50 border border-rose-200/80 px-2.5 py-1 rounded-full inline-flex items-center gap-1 font-medium">
                          <TrendingUp className="w-3 h-3 text-rose-600" />
                          <span>Attend next {needed} class{needed > 1 ? 'es' : ''} consecutively</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add New Subject Form */}
          <form
            onSubmit={handleAddSubject}
            className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-2.5"
          >
            <input
              type="text"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="Code (e.g. PCC-CS501)"
              className="w-full sm:w-36 px-3 py-2 border border-zinc-200 rounded-xl text-xs font-mono uppercase bg-white focus:border-[#2563EB] outline-none"
            />
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Paper Name (e.g. Compiler Design)"
              className="w-full sm:flex-1 px-3 py-2 border border-zinc-200 rounded-xl text-xs bg-white focus:border-[#2563EB] outline-none"
            />
            <button
              type="submit"
              disabled={!newCode.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-white text-xs font-medium cursor-pointer transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject</span>
            </button>
          </form>
        </div>

        {/* Right Column: Sticky Overall Attendance Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
          <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">
                Overall Attendance
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                  overallStats.isSafe
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {overallStats.isSafe ? 'ELIGIBLE' : 'DEBARRED RISK'}
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-zinc-900 tracking-tight font-mono">
                  {overallStats.percentage}%
                </span>
                <span className="text-sm font-mono text-zinc-400">/ 100%</span>
              </div>
              <p className="text-xs font-mono text-zinc-500 mt-1">
                {overallStats.totalAttended} attended of {overallStats.totalHeld} total lectures
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-zinc-600">
                <span>MAKAUT Rule:</span>
                <span className="font-bold text-zinc-900">75.0% Minimum</span>
              </div>
              <div className="flex items-center justify-between text-zinc-600">
                <span>Total Subjects:</span>
                <span className="text-zinc-900">{subjects.length} Papers</span>
              </div>
              <div className="pt-2 border-t border-zinc-200/80">
                {overallStats.totalHeld === 0 ? (
                  <div className="text-zinc-600 text-[11px] leading-relaxed">
                    Adjust your attended and held counts on the left to compute your live 75% safety margin.
                  </div>
                ) : overallStats.isSafe ? (
                  <div className="text-emerald-800 text-[11px] leading-relaxed">
                    You have a cushion of <strong>{overallStats.safeBunks}</strong> lectures across all subjects before dropping below 75%.
                  </div>
                ) : (
                  <div className="text-rose-800 text-[11px] leading-relaxed">
                    You need to attend the next <strong>{overallStats.classesNeeded}</strong> consecutive lectures without absence to reach 75%.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleSaveToDashboard}
                disabled={savingToDashboard}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold font-sans transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {savedToDashboard ? <Check className="w-3.5 h-3.5 text-white" /> : <Save className="w-3.5 h-3.5 text-white" />}
                <span>{savedToDashboard ? 'Saved to Dashboard!' : savingToDashboard ? 'Saving...' : 'Save to My Dashboard'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyAttendanceSummary}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#09090B] hover:bg-zinc-800 text-white text-xs font-semibold font-sans transition-colors cursor-pointer"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-[#E4E4E7] bg-white hover:bg-zinc-50 text-[#09090B] text-xs font-semibold font-sans transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {saveStatusMsg && (
              <p className="text-[11px] font-mono text-center text-emerald-700 bg-emerald-50 border border-emerald-200 py-1.5 px-2.5 rounded-lg">
                {saveStatusMsg}
              </p>
            )}

            <div className="text-[11px] text-zinc-500 font-sans leading-relaxed pt-2 border-t border-zinc-100 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
              <span>
                Attendance below 60% cannot be condoned even with medical certificates under MAKAUT exam ordinance.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
