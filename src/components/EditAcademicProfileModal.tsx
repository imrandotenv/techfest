'use client';

import React, { useState } from 'react';
import { 
  BTECH_BRANCHES, 
  BTechBranch, 
  getSuggestedPassoutYear, 
  getBranchDetails 
} from '@/config/curriculum';
import { AcademicProfile } from '@/hooks/useAcademicProfile';
import { X, Check, Loader2, GraduationCap, AlertCircle } from 'lucide-react';

interface EditAcademicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AcademicProfile;
  onSave: (updates: {
    branch: BTechBranch;
    semester: number;
    passoutYear: number;
    universityRoll?: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

export function EditAcademicProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
}: EditAcademicProfileModalProps) {
  const [branch, setBranch] = useState<BTechBranch>(profile.branch || 'CSE');
  const [semester, setSemester] = useState<number>(profile.semester || 3);
  const [passoutYear, setPassoutYear] = useState<number>(profile.passoutYear || getSuggestedPassoutYear(3));
  const [universityRoll, setUniversityRoll] = useState<string>(profile.universityRoll || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSemesterChange = (newSem: number) => {
    setSemester(newSem);
    setPassoutYear(getSuggestedPassoutYear(newSem));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const res = await onSave({
      branch,
      semester,
      passoutYear,
      universityRoll: universityRoll.trim() || undefined,
    });

    setIsSaving(false);
    if (res.success) {
      onClose();
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } else {
      setError(res.error || 'Failed to update profile.');
    }
  };

  const branchInfo = getBranchDetails(branch);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900">Edit Academic Profile</h2>
              <p className="text-[11px] font-mono text-zinc-500">SETGOI B.Tech • MAKAUT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Branch Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 block">
              Department / Branch
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value as BTechBranch)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              {(Object.keys(BTECH_BRANCHES) as BTechBranch[]).map((b) => (
                <option key={b} value={b}>
                  {b} — {BTECH_BRANCHES[b].name}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 block">
              Current Semester (1–8)
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSemesterChange(s)}
                  className={`py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    semester === s
                      ? 'bg-[#2563EB] border-[#2563EB] text-white font-bold shadow-2xs'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  Sem {s}
                </button>
              ))}
            </div>
          </div>

          {/* Passout Year */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-600">
                Graduation Batch
              </label>
              <span className="text-[11px] font-mono text-zinc-400">Class of {passoutYear}</span>
            </div>
            <select
              value={passoutYear}
              onChange={(e) => setPassoutYear(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                <option key={y} value={y}>
                  Class of {y}
                </option>
              ))}
            </select>
          </div>

          {/* Roll Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 block">
              University Roll Number (Optional)
            </label>
            <input
              type="text"
              value={universityRoll}
              onChange={(e) => setUniversityRoll(e.target.value)}
              placeholder="e.g. 12000123042"
              className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-3.5 py-2 rounded-xl border border-zinc-200 text-zinc-600 hover:text-zinc-900 text-xs font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
