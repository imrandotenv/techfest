'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  Check,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { SetTechLogo } from '@/components/SetTechLogo';
import { SYLLABUS_BRANCHES, SyllabusBranch } from '@/lib/makaut-syllabus';

type OnboardingMode = 'STUDENT' | 'FACULTY' | 'ADMIN';

interface OnboardingWizardProps {
  clerkId: string;
  initialEmail: string;
  initialName: string;
}

const MASTER_ADMIN_EMAIL = 'mdimransps955@gmail.com';
const PASSOUT_YEARS = [2026, 2027, 2028, 2029, 2030];
const ALL_SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const SCOPE_SEMESTERS = [3, 4, 5, 6, 7, 8];
const FACULTY_DESIGNATIONS = [
  'Assistant Professor',
  'Associate Professor',
  'Professor',
  'Head of Department (HOD)',
  'Lab Instructor',
];
const ADMIN_ROLES = [
  'Principal',
  'Dean Academics',
  'Exam Cell Coordinator',
  'Registrar',
  'Department Admin',
];

export function OnboardingWizard({
  initialEmail,
  initialName,
}: OnboardingWizardProps) {
  const router = useRouter();
  const { user } = useUser();

  const isMasterAdmin = initialEmail.trim().toLowerCase() === MASTER_ADMIN_EMAIL;

  const [mode, setMode] = useState<OnboardingMode>('STUDENT');
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  // Shared
  const [fullName, setFullName] = useState(initialName || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mode A: Student
  const [studentBranch, setStudentBranch] = useState<SyllabusBranch>('CSE');
  const [studentSemester, setStudentSemester] = useState<number>(3);
  const [passoutYear, setPassoutYear] = useState<number>(2028);
  const [universityRoll, setUniversityRoll] = useState<string>('');

  // Mode B: Faculty
  const [facultyEmployeeId, setFacultyEmployeeId] = useState('');
  const [facultyDesignation, setFacultyDesignation] = useState(FACULTY_DESIGNATIONS[0]);
  const [facultyDepartment, setFacultyDepartment] = useState<SyllabusBranch>('CSE');
  const [requestedScopes, setRequestedScopes] = useState<Record<string, number[]>>({
    CSE: [3],
  });
  const [facultyNote, setFacultyNote] = useState('');

  // Mode C: Admin
  const [adminEmployeeId, setAdminEmployeeId] = useState('');
  const [adminRoleTitle, setAdminRoleTitle] = useState(
    isMasterAdmin ? 'System Architect & Master Admin' : ADMIN_ROLES[0]
  );
  const [adminDepartment, setAdminDepartment] = useState('ADMINISTRATION');
  const [adminNote, setAdminNote] = useState('');

  const toggleScopeSemester = (branchCode: string, sem: number) => {
    setRequestedScopes((prev) => {
      const current = prev[branchCode] || [];
      const next = current.includes(sem)
        ? current.filter((s) => s !== sem)
        : [...current, sem].sort((a, b) => a - b);
      const updated = { ...prev };
      if (next.length === 0) {
        delete updated[branchCode];
      } else {
        updated[branchCode] = next;
      }
      return updated;
    });
  };

  const openRoleSwitcher = (targetMode?: OnboardingMode) => {
    setShowRoleSwitcher(true);
    if (targetMode) setMode(targetMode);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Full Name is required.');
      return;
    }

    let payload: Record<string, any> = {
      mode,
      fullName: fullName.trim(),
    };

    if (mode === 'STUDENT') {
      payload = {
        ...payload,
        branch: studentBranch,
        semester: studentSemester,
        passoutYear,
        universityRoll: universityRoll.trim() || null,
      };
    } else if (mode === 'FACULTY') {
      if (!facultyEmployeeId.trim()) {
        setError('Faculty / Employee ID is required.');
        return;
      }
      const formattedScopes = Object.entries(requestedScopes)
        .filter(([, sems]) => sems.length > 0)
        .map(([branch, semesters]) => ({ branch, semesters }));

      if (formattedScopes.length === 0) {
        setError('Select at least one Branch & Semester in Requested Teaching Scope.');
        return;
      }

      payload = {
        ...payload,
        employeeId: facultyEmployeeId.trim(),
        designation: facultyDesignation,
        department: facultyDepartment,
        requestedScopes: formattedScopes,
        onboardingNote: facultyNote.trim() || null,
      };
    } else {
      if (!isMasterAdmin && !adminEmployeeId.trim()) {
        setError('Employee / Office ID is required for Admin verification.');
        return;
      }
      payload = {
        ...payload,
        employeeId: adminEmployeeId.trim() || (isMasterAdmin ? 'MASTER-001' : ''),
        designation: adminRoleTitle.trim() || 'System Architect & Master Admin',
        department: adminDepartment.trim() || 'ADMINISTRATION',
        onboardingNote: adminNote.trim() || null,
      };
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to complete onboarding.');
        setSubmitting(false);
        return;
      }

      try {
        await user?.reload();
      } catch {}

      router.push(data.redirectTo || '/dashboard');
      router.refresh();
    } catch {
      setError('Network error saving onboarding profile. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#09090B] flex flex-col justify-between py-8 px-4 sm:px-6">
      <div className="max-w-3xl w-full mx-auto space-y-6">
        {/* Top Bar with Brand & Role Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SetTechLogo />
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block">
                SETGOI Durgapur • MAKAUT Portal
              </span>
              <span className="text-xs font-medium text-zinc-700">{initialEmail}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openRoleSwitcher(mode === 'STUDENT' ? 'FACULTY' : 'STUDENT')}
            className="px-3.5 py-2 rounded-xl border border-[#E4E4E7] bg-white hover:bg-zinc-100 text-xs font-semibold text-[#09090B] transition-colors cursor-pointer"
          >
            {mode === 'STUDENT' ? 'Are you Faculty or Admin?' : '← Back to Student Setup'}
          </button>
        </div>

        {/* Segmented Role Selector (revealed when toggled or non-student mode active) */}
        {(showRoleSwitcher || mode !== 'STUDENT') && (
          <div className="bg-white border border-[#E4E4E7] rounded-2xl p-1.5 grid grid-cols-3 gap-1.5 shadow-xs">
            <button
              type="button"
              onClick={() => {
                setMode('STUDENT');
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                mode === 'STUDENT'
                  ? 'bg-[#09090B] text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('FACULTY');
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                mode === 'FACULTY'
                  ? 'bg-[#09090B] text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Faculty</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('ADMIN');
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                mode === 'ADMIN'
                  ? 'bg-[#09090B] text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        )}

        {/* Main Swiss Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6"
        >
          {/* Header */}
          <div className="space-y-1.5 border-b border-[#E4E4E7] pb-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-[#E4E4E7] font-mono text-[11px] font-semibold text-zinc-700">
                {mode === 'STUDENT'
                  ? 'Mode A • Student Setup'
                  : mode === 'FACULTY'
                  ? 'Mode B • Faculty Verification'
                  : 'Mode C • Admin Governance'}
              </span>
              {mode === 'ADMIN' && isMasterAdmin && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[11px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Master Admin Recognized
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-[#09090B]">
              {mode === 'STUDENT'
                ? 'Configure Your B.Tech Workspace'
                : mode === 'FACULTY'
                ? 'Faculty Academic Verification'
                : isMasterAdmin
                ? 'Master Admin Workspace Setup'
                : 'Administrative Access Request'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500">
              {mode === 'STUDENT'
                ? 'Select your official SETGOI B.Tech branch and semester to pre-load your MAKAUT syllabus, notes, and AI Viva.'
                : mode === 'FACULTY'
                ? 'Provide your faculty credentials and requested teaching scopes. An Admin will verify and assign your active branches & semesters.'
                : isMasterAdmin
                ? 'Your account is recognized as the protected SETTech Master Admin. Confirm your title to enter /admin immediately.'
                : 'Submit your administrative credentials for Master Admin approval.'}
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name (shared across all 3 modes) */}
          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-sm text-[#09090B] focus:outline-none focus:ring-2 focus:ring-zinc-900"
              required
            />
          </div>

          {/* MODE A: STUDENT */}
          {mode === 'STUDENT' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-700 mb-2">
                  B.Tech Branch (All 8 SETGOI Departments) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SYLLABUS_BRANCHES.map((b) => {
                    const selected = studentBranch === b.code;
                    return (
                      <button
                        key={b.code}
                        type="button"
                        onClick={() => setStudentBranch(b.code)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          selected
                            ? 'bg-[#09090B] text-white border-[#09090B]'
                            : 'bg-[#FAFAFA] text-zinc-800 border-[#E4E4E7] hover:border-zinc-400'
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="font-mono text-xs font-bold block">{b.code}</span>
                          <span
                            className={`text-[11px] truncate block ${
                              selected ? 'text-zinc-300' : 'text-zinc-500'
                            }`}
                          >
                            {b.name}
                          </span>
                        </div>
                        {selected && <Check className="w-4 h-4 shrink-0 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1.5">
                    Current Semester <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {ALL_SEMESTERS.map((sem) => {
                      const active = studentSemester === sem;
                      return (
                        <button
                          key={sem}
                          type="button"
                          onClick={() => setStudentSemester(sem)}
                          className={`py-2 px-2 rounded-xl border font-mono text-xs font-semibold transition-all cursor-pointer ${
                            active
                              ? 'bg-[#09090B] text-white border-[#09090B]'
                              : 'bg-[#FAFAFA] text-zinc-700 border-[#E4E4E7] hover:border-zinc-400'
                          }`}
                        >
                          Sem {sem}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1.5">
                    Passout Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={passoutYear}
                    onChange={(e) => setPassoutYear(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-sm font-medium text-[#09090B]"
                  >
                    {PASSOUT_YEARS.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1.5">
                  MAKAUT University Roll No. (Optional)
                </label>
                <input
                  type="text"
                  value={universityRoll}
                  onChange={(e) => setUniversityRoll(e.target.value)}
                  placeholder="e.g. 12000123045"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-sm font-mono text-[#09090B]"
                />
              </div>
            </div>
          )}

          {/* MODE B: FACULTY */}
          {mode === 'FACULTY' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1.5">
                    Faculty / Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={facultyEmployeeId}
                    onChange={(e) => setFacultyEmployeeId(e.target.value)}
                    placeholder="e.g. SETGOI-FAC-104"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-sm font-mono text-[#09090B]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1.5">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={facultyDesignation}
                    onChange={(e) => setFacultyDesignation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-sm text-[#09090B]"
                  >
                    {FACULTY_DESIGNATIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1.5">
                  Primary Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={facultyDepartment}
                  onChange={(e) => setFacultyDepartment(e.target.value as SyllabusBranch)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-sm text-[#09090B]"
                >
                  {SYLLABUS_BRANCHES.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.code} — {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1">
                  Requested Teaching Scope (Branches &amp; Semesters 3–8){' '}
                  <span className="text-red-500">*</span>
                </label>
                <p className="text-[11px] text-zinc-500 mb-2.5">
                  Select the branch and semester combinations you teach. Final scopes are assigned by Admin.
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {SYLLABUS_BRANCHES.map((b) => {
                    const selectedSems = requestedScopes[b.code] || [];
                    return (
                      <div
                        key={b.code}
                        className="p-3 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Building2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span className="font-mono text-xs font-bold text-[#09090B]">
                            {b.code}
                          </span>
                          <span className="text-[11px] text-zinc-500 truncate">{b.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 shrink-0">
                          {SCOPE_SEMESTERS.map((sem) => {
                            const active = selectedSems.includes(sem);
                            return (
                              <button
                                key={sem}
                                type="button"
                                onClick={() => toggleScopeSemester(b.code, sem)}
                                className={`px-2 py-1 rounded-lg border font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                                  active
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-white text-zinc-600 border-[#E4E4E7] hover:border-zinc-400'
                                }`}
                              >
                                S{sem}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1.5">
                  Cabin / Contact Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={facultyNote}
                  onChange={(e) => setFacultyNote(e.target.value)}
                  placeholder="e.g. CSE Block Room 204 • Teaching DSA & OS"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs text-[#09090B]"
                />
              </div>
            </div>
          )}

          {/* MODE C: ADMIN */}
          {mode === 'ADMIN' && (
            <div className="space-y-4">
              {isMasterAdmin ? (
                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1.5">
                    Administrative Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={adminRoleTitle}
                    onChange={(e) => setAdminRoleTitle(e.target.value)}
                    placeholder="System Architect & Master Admin"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-sm text-[#09090B]"
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1.5">
                        Employee / Office ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={adminEmployeeId}
                        onChange={(e) => setAdminEmployeeId(e.target.value)}
                        placeholder="e.g. SETGOI-ADM-012"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-sm font-mono text-[#09090B]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1.5">
                        Administrative Role <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={adminRoleTitle}
                        onChange={(e) => setAdminRoleTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-sm text-[#09090B]"
                      >
                        {ADMIN_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1.5">
                      Department / Office <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={adminDepartment}
                      onChange={(e) => setAdminDepartment(e.target.value)}
                      placeholder="e.g. Exam Cell / Registrar Office / CSE"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-sm text-[#09090B]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-zinc-700 mb-1.5">
                      Verification Note (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Brief justification for Master Admin review..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs text-[#09090B]"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Submit + Bottom Switcher Link */}
          <div className="pt-2 space-y-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-5 rounded-xl bg-[#09090B] hover:bg-zinc-800 disabled:opacity-50 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Configuration...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'STUDENT'
                      ? 'Activate Student Workspace'
                      : mode === 'FACULTY'
                      ? 'Submit Faculty Verification Request'
                      : isMasterAdmin
                      ? 'Enter Master Admin Console'
                      : 'Submit Admin Verification Request'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => openRoleSwitcher(mode === 'STUDENT' ? 'FACULTY' : 'STUDENT')}
                className="text-xs font-medium text-zinc-500 hover:text-[#09090B] underline underline-offset-4 cursor-pointer"
              >
                {mode === 'STUDENT'
                  ? 'Are you Faculty or Admin? Switch onboarding mode'
                  : 'Setting up a Student account? Switch back to Student'}
              </button>
            </div>
          </div>
        </form>

        <footer className="text-center text-[11px] text-zinc-500 flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/privacy" className="hover:text-[#09090B] underline underline-offset-4">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-[#09090B] underline underline-offset-4">
            Terms of Use
          </Link>
          <span>•</span>
          <Link href="/cookies" className="hover:text-[#09090B] underline underline-offset-4">
            Cookie Policy
          </Link>
        </footer>
      </div>
    </div>
  );
}
