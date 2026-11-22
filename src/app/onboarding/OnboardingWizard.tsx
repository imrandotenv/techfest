'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BTECH_BRANCHES, 
  BTechBranch, 
  getSemesterSubjects, 
  getSuggestedPassoutYear, 
  getBranchDetails 
} from '@/config/curriculum';
import { SetTechLogo } from '@/components/SetTechLogo';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Laptop, 
  Cpu, 
  Zap, 
  Cog, 
  Building2, 
  Network, 
  BrainCircuit, 
  CheckCircle2, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

interface OnboardingWizardProps {
  clerkId: string;
  initialEmail: string;
  initialName: string;
}

const BRANCH_ICONS: Record<BTechBranch, React.ElementType> = {
  CSE: Laptop,
  ECE: Cpu,
  EE: Zap,
  ME: Cog,
  CE: Building2,
  IT: Network,
  AIML: BrainCircuit,
};

const SEMESTERS = [
  { sem: 1, year: '1st Year', phase: 'Odd Sem' },
  { sem: 2, year: '1st Year', phase: 'Even Sem' },
  { sem: 3, year: '2nd Year', phase: 'Odd Sem' },
  { sem: 4, year: '2nd Year', phase: 'Even Sem' },
  { sem: 5, year: '3rd Year', phase: 'Odd Sem' },
  { sem: 6, year: '3rd Year', phase: 'Even Sem' },
  { sem: 7, year: '4th Year', phase: 'Odd Sem' },
  { sem: 8, year: '4th Year', phase: 'Even Sem' },
];

export function OnboardingWizard({ initialEmail, initialName }: OnboardingWizardProps) {
  const router = useRouter();

  // Wizard state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBranch, setSelectedBranch] = useState<BTechBranch>('CSE');
  const [selectedSemester, setSelectedSemester] = useState<number>(3);
  const [passoutYear, setPassoutYear] = useState<number>(() => getSuggestedPassoutYear(3));
  const [universityRoll, setUniversityRoll] = useState<string>('');
  const [fullName, setFullName] = useState<string>(initialName);
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const branchDetails = getBranchDetails(selectedBranch);
  const semesterSubjects = getSemesterSubjects(selectedBranch, selectedSemester);

  const handleSemesterChange = (sem: number) => {
    setSelectedSemester(sem);
    setPassoutYear(getSuggestedPassoutYear(sem));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim() || initialName,
          branch: selectedBranch,
          semester: Number(selectedSemester),
          passoutYear: Number(passoutYear),
          universityRoll: universityRoll.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete onboarding');
      }

      // Success: redirect to student dashboard
      router.push('/student');
      router.refresh();
    } catch (err: any) {
      console.error('[Onboarding] Error submitting:', err);
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col min-h-screen justify-between">
      {/* Header & Brand */}
      <div>
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-zinc-200/80 gap-4">
          <div className="flex items-center gap-3">
            <SetTechLogo variant="full" size={28} textClassName="text-lg font-bold" />
            <span className="text-zinc-300">/</span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/60 text-[#2563EB] text-xs font-mono font-medium">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>B.Tech Onboarding</span>
            </div>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-semibold transition-all ${
                    step === s
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : step > s
                      ? 'bg-blue-100 text-[#2563EB]'
                      : 'bg-zinc-100 text-zinc-400'
                  }`}
                >
                  {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
                {s < 3 && <div className={`w-6 h-0.5 ${step > s ? 'bg-blue-300' : 'bg-zinc-200'}`} />}
              </div>
            ))}
          </div>
        </header>

        {/* Step Content */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {/* STEP 1: Select Branch */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#09090B]">
                    Select Your Engineering Branch
                  </h1>
                  <p className="text-sm text-zinc-500 mt-1">
                    Choose your MAKAUT-affiliated B.Tech department at SETGOI to personalize syllabus notes, lab vivas, and exam trackers.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                  {(Object.keys(BTECH_BRANCHES) as BTechBranch[]).map((branchKey) => {
                    const info = BTECH_BRANCHES[branchKey];
                    const Icon = BRANCH_ICONS[branchKey] || Laptop;
                    const isSelected = selectedBranch === branchKey;

                    return (
                      <button
                        key={branchKey}
                        type="button"
                        onClick={() => setSelectedBranch(branchKey)}
                        className={`text-left p-4 rounded-xl border transition-all relative flex flex-col justify-between h-36 ${
                          isSelected
                            ? 'bg-white border-[#2563EB] shadow-md ring-2 ring-[#2563EB]/10'
                            : 'bg-white/70 border-zinc-200 hover:border-zinc-300 hover:bg-white shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className={`p-2 rounded-lg ${info.badgeBg} ${info.badgeText}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-zinc-800">{info.code}</span>
                            <span className="text-xs text-zinc-400">•</span>
                            <span className="text-xs font-medium text-zinc-600 truncate">{info.name}</span>
                          </div>
                          <p className="text-xs text-zinc-400 font-mono mt-1 truncate">
                            {info.departmentOffice}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Semester & Passout Year */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#09090B]">
                    Semester & Graduation Batch
                  </h1>
                  <p className="text-sm text-zinc-500 mt-1">
                    Selected: <strong className="text-zinc-800 font-medium">{branchDetails.fullTitle}</strong> ({branchDetails.code})
                  </p>
                </div>

                {/* Semester Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-500 block">
                    Current Semester (1–8)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {SEMESTERS.map(({ sem, year, phase }) => {
                      const isSelected = selectedSemester === sem;
                      return (
                        <button
                          key={sem}
                          type="button"
                          onClick={() => handleSemesterChange(sem)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-xs'
                              : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-sm">Sem {sem}</span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500'
                            }`}>
                              {phase}
                            </span>
                          </div>
                          <p className={`text-xs mt-1 ${isSelected ? 'text-blue-100' : 'text-zinc-400'}`}>
                            {year}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Expected Graduation Batch */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                      Expected Passout Year
                    </label>
                    <span className="text-xs font-mono text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      Auto-calculated: Class of {passoutYear}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => setPassoutYear(year)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                          passoutYear === year
                            ? 'bg-zinc-900 text-white border-zinc-900 font-semibold'
                            : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instant MAKAUT Subject Preview */}
                <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono font-medium text-zinc-700">
                      <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>MAKAUT Curriculum Preview: Sem {selectedSemester} {selectedBranch}</span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {semesterSubjects.length} Core Modules
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {semesterSubjects.map((sub) => (
                      <div
                        key={sub.code}
                        className="p-2.5 rounded-lg bg-zinc-50/80 border border-zinc-200/60 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-medium text-zinc-800">{sub.name}</div>
                          <div className="text-[11px] font-mono text-zinc-400">{sub.code} • {sub.credits} Credits</div>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/60 text-zinc-600">
                          {sub.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: University Roll & Final Confirmation */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#09090B]">
                    Confirm Your Academic Identity
                  </h1>
                  <p className="text-sm text-zinc-500 mt-1">
                    Review your details below. You can update your branch or semester at any time from your profile settings.
                  </p>
                </div>

                {/* Inputs: Full Name & Optional Roll No */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 block">
                      Student Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all shadow-2xs font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 flex items-center justify-between">
                      <span>MAKAUT University Roll No.</span>
                      <span className="text-zinc-400 lowercase text-[11px]">optional</span>
                    </label>
                    <input
                      type="text"
                      value={universityRoll}
                      onChange={(e) => setUniversityRoll(e.target.value)}
                      placeholder="e.g. 12000123045"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-sm font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Live Preview Card */}
                <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#2563EB] flex items-center justify-center font-bold">
                        {selectedBranch}
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-900 text-base">{fullName || 'B.Tech Scholar'}</h3>
                        <p className="text-xs text-zinc-400 font-mono">{initialEmail}</p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Ready to Launch
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
                    <div>
                      <span className="text-zinc-400 font-mono text-[11px] block">DEGREE</span>
                      <span className="font-medium text-zinc-800">B.Tech (4 Years)</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 font-mono text-[11px] block">BRANCH</span>
                      <span className="font-medium text-zinc-800">{branchDetails.name}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 font-mono text-[11px] block">SEMESTER</span>
                      <span className="font-medium text-zinc-800">Semester {selectedSemester}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 font-mono text-[11px] block">BATCH</span>
                      <span className="font-medium text-zinc-800">Class of {passoutYear}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-2 text-xs text-zinc-500">
                    <Sparkles className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                    <span>Your notes vault, AI viva examiner, and academic tools will be pre-configured for Sem {selectedSemester} {selectedBranch}.</span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Buttons Footer */}
      <footer className="mt-8 pt-6 border-t border-zinc-200/80 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s - 1) as 1 | 2)}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s + 1) as 2 | 3)}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Configuring B.Tech Workspace...</span>
              </>
            ) : (
              <>
                <span>Launch My B.Tech Workspace</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </footer>
    </div>
  );
}
