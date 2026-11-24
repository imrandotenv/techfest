'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit3, X, Check, Calculator, AlertCircle, Save } from 'lucide-react';

interface StudentStatsModalProps {
  initialStats: {
    cgpa: number;
    targetSgpa?: number;
    attendancePct: number;
    attendedClasses: number;
    totalClasses: number;
  };
}

export function StudentStatsModal({ initialStats }: StudentStatsModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [cgpa, setCgpa] = useState<string>(String(initialStats.cgpa || 8.84));
  const [targetSgpa, setTargetSgpa] = useState<string>(String(initialStats.targetSgpa || 9.10));
  const [attendedClasses, setAttendedClasses] = useState<string>(String(initialStats.attendedClasses || 48));
  const [totalClasses, setTotalClasses] = useState<string>(String(initialStats.totalClasses || 59));

  // Calculated attendance
  const attendedNum = parseInt(attendedClasses, 10) || 0;
  const totalNum = Math.max(1, parseInt(totalClasses, 10) || 1);
  const previewPct = totalNum > 0 ? parseFloat(((attendedNum / totalNum) * 100).toFixed(1)) : 0;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/student/stats', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cgpa: parseFloat(cgpa) || 8.84,
          targetSgpa: parseFloat(targetSgpa) || 9.0,
          attendedClasses: attendedNum,
          totalClasses: totalNum,
          attendancePct: previewPct,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save academic statistics');
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        router.refresh();
      }, 700);
    } catch (err: any) {
      setError(err?.message || 'Error updating academic stats');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-mono text-[11px] font-semibold inline-flex items-center gap-1 transition-colors border border-blue-200"
      >
        <Edit3 className="w-3 h-3" />
        <span>Update Stats</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-xl relative animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Update Academic Standing</h3>
                  <p className="text-[11px] font-mono text-zinc-500">Persists directly to your Neon account</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="mt-3.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mt-3.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Saved successfully! Refreshing dashboard...</span>
              </div>
            )}

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* CGPA */}
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-600 mb-1">
                    Cumulative CGPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 font-mono text-sm text-zinc-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]"
                    required
                  />
                </div>

                {/* Target SGPA */}
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-600 mb-1">
                    Semester Target
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={targetSgpa}
                    onChange={(e) => setTargetSgpa(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 font-mono text-sm text-zinc-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              {/* Attendance Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-600 mb-1">
                    Attended Lectures
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={attendedClasses}
                    onChange={(e) => setAttendedClasses(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 font-mono text-sm text-zinc-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-600 mb-1">
                    Total Delivered
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={totalClasses}
                    onChange={(e) => setTotalClasses(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 font-mono text-sm text-zinc-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]"
                    required
                  />
                </div>
              </div>

              {/* Live Preview Pill */}
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-600">Calculated Attendance:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded ${
                    previewPct >= 75
                      ? 'bg-emerald-100 text-emerald-800'
                      : previewPct >= 65
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {previewPct}% {previewPct >= 75 ? '✓ Safe' : '⚠ Below 75%'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
