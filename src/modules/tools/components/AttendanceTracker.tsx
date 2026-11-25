'use client';

import React, { useState, useMemo } from 'react';
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
  Printer
} from 'lucide-react';

export interface AttendanceSubject {
  id: string;
  code: string;
  name: string;
  attended: number;
  total: number;
}

const DEFAULT_SUBJECTS: AttendanceSubject[] = [
  { id: 'att-1', code: 'PCC-CS301', name: 'Data Structures & Algorithms', attended: 26, total: 32 },
  { id: 'att-2', code: 'ESC301', name: 'Digital Electronics & Logic', attended: 22, total: 30 },
  { id: 'att-3', code: 'PCC-CS302', name: 'Computer Organization & Architecture', attended: 16, total: 24 },
  { id: 'att-4', code: 'BS-M301', name: 'Mathematics-III (Differential Calculus)', attended: 28, total: 32 },
  { id: 'att-5', code: 'PCC-CS391', name: 'Data Structures Lab (Practical)', attended: 12, total: 14 },
];

export function AttendanceTracker() {
  const [subjects, setSubjects] = useState<AttendanceSubject[]>(DEFAULT_SUBJECTS);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [savingToDashboard, setSavingToDashboard] = useState(false);
  const [savedToDashboard, setSavedToDashboard] = useState(false);
  const [saveStatusMsg, setSaveStatusMsg] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleCopyAttendanceSummary = () => {
    const lines = [
      `SETGOI MAKAUT 75% ATTENDANCE SUMMARY`,
      `Overall Attendance: ${overallStats.percentage}% (${overallStats.totalAttended}/${overallStats.totalHeld})`,
      `Status: ${overallStats.isSafe ? `ELIGIBLE (Cushion: ${overallStats.safeBunks} lectures)` : `DEBARRED RISK (Need ${overallStats.classesNeeded} classes)`}`,
      ...subjects.map((s) => `• ${s.code} (${s.name}): ${s.attended}/${s.total} (${s.total > 0 ? ((s.attended / s.total) * 100).toFixed(1) : '0.0'}%)`),
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleSaveToDashboard = async () => {
    setSavingToDashboard(true);
    try {
      const res = await fetch('/api/student/stats', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendancePct: overallStats.percentage,
          attendedClasses: overallStats.totalAttended,
          totalClasses: overallStats.totalHeld,
        }),
      });
      if (!res.ok) throw new Error('Failed to update stats');
      setSavedToDashboard(true);
      setSaveStatusMsg(`Saved attendance (${overallStats.percentage}%) to your Neon dashboard!`);
      setTimeout(() => setSavedToDashboard(false), 2500);
      setTimeout(() => setSaveStatusMsg(null), 3800);
    } catch {
      setSaveStatusMsg('Could not save to dashboard. Sign in required.');
      setTimeout(() => setSaveStatusMsg(null), 3800);
    } finally {
      setSavingToDashboard(false);
    }
  };

  // Overall aggregate
  const overallStats = useMemo(() => {
    const totalHeld = subjects.reduce((sum, s) => sum + s.total, 0);
    const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
    const percentage = totalHeld > 0 ? (totalAttended / totalHeld) * 100 : 0;
    
    // Classes needed or bunks allowed for overall
    let classesNeeded = 0;
    let safeBunks = 0;
    if (percentage < 75) {
      classesNeeded = Math.ceil((0.75 * totalHeld - totalAttended) / 0.25);
    } else {
      safeBunks = Math.floor((totalAttended - 0.75 * totalHeld) / 0.75);
    }

    return {
      totalHeld,
      totalAttended,
      percentage: Number(percentage.toFixed(1)),
      classesNeeded: Math.max(0, classesNeeded),
      safeBunks: Math.max(0, safeBunks),
      isSafe: percentage >= 75,
    };
  }, [subjects]);

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

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    const newSub: AttendanceSubject = {
      id: `att-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      name: newName.trim() || 'Core Engineering Paper',
      attended: 0,
      total: 0,
    };
    setSubjects((prev) => [...prev, newSub]);
    setNewCode('');
    setNewName('');
  };

  const handleRemove = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const handleReset = () => {
    setSubjects(DEFAULT_SUBJECTS);
  };

  return (
    <div className="space-y-6">
      {/* Header and MAKAUT 75% Rule Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB] border border-blue-200">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 font-display">
              MAKAUT 75% Attendance &amp; Safe Bunk Tracker
            </h2>
          </div>
          <p className="text-xs text-zinc-600 mt-1 font-sans">
            Under MAKAUT regulations, 75% minimum attendance is mandatory to sit for semester examinations without condonation fines.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 hover:bg-zinc-100 text-xs font-mono text-zinc-600 self-start sm:self-auto cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Main Grid: Left Subjects List | Right Sticky Aggregate Scoreboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Subjects List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-3">
            {subjects.map((sub) => {
              const pct = sub.total > 0 ? (sub.attended / sub.total) * 100 : 0;
              const isSafe = pct >= 75;
              let needed = 0;
              let bunks = 0;
              if (!isSafe) {
                needed = Math.ceil((0.75 * sub.total - sub.attended) / 0.25);
              } else {
                bunks = Math.floor((sub.attended - 0.75 * sub.total) / 0.75);
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

                    {/* Percentage Pill */}
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
                    {/* 75% Benchmark Marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-zinc-400 z-10"
                      style={{ left: '75%' }}
                      title="75% Mandatory MAKAUT Threshold"
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isSafe ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>

                  {/* Recommendation and Controls Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs font-mono">
                    <div className="text-[11px]">
                      {isSafe ? (
                        <span className="text-emerald-700 font-medium">
                          ✓ On track! You can safely bunk <strong>{bunks}</strong> more {bunks === 1 ? 'class' : 'classes'}.
                        </span>
                      ) : (
                        <span className="text-rose-700 font-medium">
                          ⚠ Must attend <strong>{needed}</strong> consecutive {needed === 1 ? 'class' : 'classes'} to reach 75%.
                        </span>
                      )}
                    </div>

                    {/* Stepper Buttons for Live Log */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleUpdate(sub.id, 'attended', -1)}
                          disabled={sub.attended <= 0}
                          className="px-2 py-1 text-zinc-600 hover:bg-zinc-200 disabled:opacity-30 cursor-pointer"
                          title="Decrease attended"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 py-1 text-xs font-mono font-semibold text-zinc-900 bg-white border-x border-zinc-200 min-w-[28px] text-center">
                          {sub.attended}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdate(sub.id, 'attended', 1)}
                          className="px-2 py-1 text-zinc-600 hover:bg-zinc-200 cursor-pointer"
                          title="Increase attended"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-zinc-400">/</span>

                      <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleUpdate(sub.id, 'total', -1)}
                          disabled={sub.total <= sub.attended}
                          className="px-2 py-1 text-zinc-600 hover:bg-zinc-200 disabled:opacity-30 cursor-pointer"
                          title="Decrease total classes"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 py-1 text-xs font-mono font-semibold text-zinc-900 bg-white border-x border-zinc-200 min-w-[28px] text-center">
                          {sub.total}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdate(sub.id, 'total', 1)}
                          className="px-2 py-1 text-zinc-600 hover:bg-zinc-200 cursor-pointer"
                          title="Increase total classes"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Subject Card */}
          <form
            onSubmit={handleAddSubject}
            className="p-4 rounded-2xl border border-zinc-200 bg-white shadow-xs flex flex-col sm:flex-row items-center gap-3"
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

            {/* Headline Percentage */}
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

            {/* Threshold Analysis Card */}
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
                {overallStats.isSafe ? (
                  <div className="text-emerald-800 text-[11px] leading-relaxed">
                    ✨ You have a cushion of <strong>{overallStats.safeBunks}</strong> lectures across all subjects before dropping below 75%.
                  </div>
                ) : (
                  <div className="text-rose-800 text-[11px] leading-relaxed">
                    ⚠ You need to attend the next <strong>{overallStats.classesNeeded}</strong> consecutive lectures without absence to reach 75%.
                  </div>
                )}
              </div>
            </div>

            {/* Save, Copy & Print Summary Buttons */}
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
              <p className="text-[11px] font-mono text-center text-emerald-700 bg-emerald-50 border border-emerald-200 py-1 px-2 rounded-lg">
                {saveStatusMsg}
              </p>
            )}

            {/* Guidance Footer */}
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