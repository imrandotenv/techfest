'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  Calendar, 
  AlertCircle, 
  Edit3, 
  RotateCcw, 
  Check, 
  X, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export interface ExamCountdownProps {
  variant?: 'strip' | 'pill' | 'card';
  className?: string;
}

interface ExamTarget {
  id: string;
  label: string;
  shortLabel: string;
  defaultDate: string; // ISO string
  description: string;
  officialNoticeUrl?: string;
}

const DEFAULT_TARGETS: ExamTarget[] = [
  {
    id: 'odd-theory',
    label: 'MAKAUT Odd Semester Theory Examinations (2026-27)',
    shortLabel: 'Theory Exam',
    defaultDate: '2026-12-04T10:00:00+05:30',
    description: 'B.Tech Semesters 3, 5 & 7 university written theory examinations.',
    officialNoticeUrl: 'https://makautexam.net/',
  },
  {
    id: 'practical-viva',
    label: 'MAKAUT Practical & Viva Voce Window',
    shortLabel: 'Practical & Viva',
    defaultDate: '2026-12-21T09:30:00+05:30',
    description: 'Laboratory experiment evaluations & External Viva Voce.',
    officialNoticeUrl: 'https://makautexam.net/',
  },
  {
    id: 'mid-term-ca2',
    label: 'Continuous Assessment 2 (CA2) Class Tests',
    shortLabel: 'CA2 Tests',
    defaultDate: '2026-11-28T10:00:00+05:30',
    description: 'Internal departmental assessment covering Modules 3 & 4.',
  },
];

interface TimeRemaining {
  totalSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateTimeRemaining(targetIso: string): TimeRemaining {
  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const diffMs = target - now;

  if (diffMs <= 0) {
    return {
      totalSeconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { totalSeconds, days, hours, minutes, seconds, isPast: false };
}

export function ExamCountdown({ variant = 'strip', className = '' }: ExamCountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTargetId, setActiveTargetId] = useState<string>('odd-theory');
  const [customDates, setCustomDates] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempEditDate, setTempEditDate] = useState<string>('');

  // Active target object
  const activeTarget = DEFAULT_TARGETS.find((t) => t.id === activeTargetId) || DEFAULT_TARGETS[0];
  const activeTargetDate = customDates[activeTarget.id] || activeTarget.defaultDate;

  // Live timer state
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(activeTarget.defaultDate)
  );

  // Load custom dates from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('settech_exam_targets') || localStorage.getItem('sanakahub_exam_targets');
      if (stored) {
        setCustomDates(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // Update countdown tick every second
  useEffect(() => {
    if (!mounted) return;

    setTimeRemaining(calculateTimeRemaining(activeTargetDate));

    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(activeTargetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [mounted, activeTargetDate]);

  // Save customized date
  const handleSaveCustomDate = () => {
    if (!tempEditDate) return;
    const newCustom = { ...customDates, [activeTarget.id]: new Date(tempEditDate).toISOString() };
    setCustomDates(newCustom);
    try {
      localStorage.setItem('settech_exam_targets', JSON.stringify(newCustom));
    } catch {}
    setIsEditing(false);
  };

  // Reset to official date
  const handleResetDate = () => {
    const updated = { ...customDates };
    delete updated[activeTarget.id];
    setCustomDates(updated);
    try {
      localStorage.setItem('settech_exam_targets', JSON.stringify(updated));
    } catch {}
    setIsEditing(false);
  };

  // -------------------------------------------------------------
  // VARIANT: PILL (Used in Landing Page Campus Pulse Strip / Hero)
  // -------------------------------------------------------------
  if (variant === 'pill') {
    if (!mounted) {
      return (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] shadow-2xs text-xs font-mono text-[#475569] ${className}`}>
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>MAKAUT Exam Countdown: Initializing...</span>
        </div>
      );
    }

    return (
      <Link
        href="/tools?tab=notices"
        className={`group inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white hover:bg-slate-50 border border-[#E2E8F0] hover:border-[#2563EB]/40 shadow-2xs text-xs font-mono transition-all cursor-pointer ${className}`}
        title="View full MAKAUT Exam Timetable and live countdown"
      >
        <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse shrink-0" />
        <span className="text-zinc-500 font-medium">MAKAUT Odd Sem Theory:</span>
        <span className="font-bold text-zinc-900 group-hover:text-[#2563EB] transition-colors">
          {timeRemaining.isPast ? (
            'Exams in Progress'
          ) : (
            `${timeRemaining.days}d ${timeRemaining.hours}h ${timeRemaining.minutes}m left`
          )}
        </span>
        <ChevronRight className="w-3 h-3 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    );
  }

  // -------------------------------------------------------------
  // VARIANT: STRIP (Used in /tools Notice Board & Exam Timeline)
  // -------------------------------------------------------------
  return (
    <div className={`bg-gradient-to-br from-white to-slate-50/70 border border-[#E4E4E7] rounded-xl p-4 sm:p-5 shadow-xs space-y-4 ${className}`}>
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-rose-50 text-rose-700 border border-rose-200 font-mono text-[11px] font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              LIVE EXAM COUNTDOWN
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              MAKAUT Academic Session 2026-27
            </span>
          </div>
          <h3 className="text-base font-bold text-zinc-900 tracking-tight font-display">
            {activeTarget.label}
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5 font-sans">
            {activeTarget.description}
          </p>
        </div>

        {/* Target Switcher Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {DEFAULT_TARGETS.map((target) => (
            <button
              key={target.id}
              onClick={() => {
                setActiveTargetId(target.id);
                setIsEditing(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all shrink-0 cursor-pointer ${
                activeTargetId === target.id
                  ? 'bg-zinc-900 text-white shadow-2xs font-bold'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              {target.shortLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Main Countdown Digits Display */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto text-center py-1">
        {[
          { label: 'DAYS', value: mounted ? timeRemaining.days : '--' },
          { label: 'HOURS', value: mounted ? String(timeRemaining.hours).padStart(2, '0') : '--' },
          { label: 'MINUTES', value: mounted ? String(timeRemaining.minutes).padStart(2, '0') : '--' },
          { label: 'SECONDS', value: mounted ? String(timeRemaining.seconds).padStart(2, '0') : '--' },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#E4E4E7] rounded-xl p-3 sm:p-4 shadow-2xs flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#2563EB]/40 transition-colors"
          >
            <span className="font-mono text-2xl sm:text-4xl font-bold tracking-tight text-zinc-900 group-hover:text-[#2563EB] transition-colors">
              {item.value}
            </span>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-zinc-400 mt-1 font-semibold">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Control Bar: Edit Date Toggle & Links */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-1 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-zinc-600">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            Target: <strong className="text-zinc-900">{new Date(activeTargetDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>
          </span>

          {customDates[activeTarget.id] && (
            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-200 text-[10px] font-bold">
              Custom Date
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Edit Date Button */}
          {!isEditing ? (
            <button
              onClick={() => {
                setTempEditDate(activeTargetDate.slice(0, 16));
                setIsEditing(true);
              }}
              className="inline-flex items-center gap-1 text-[#2563EB] hover:text-blue-700 hover:underline cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Target Date</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-lg p-1 shadow-2xs">
              <input
                type="datetime-local"
                value={tempEditDate}
                onChange={(e) => setTempEditDate(e.target.value)}
                className="text-xs font-mono px-2 py-0.5 border-0 focus:outline-none text-zinc-900"
              />
              <button
                onClick={handleSaveCustomDate}
                className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                title="Save Date"
              >
                <Check className="w-3 h-3" />
              </button>
              {customDates[activeTarget.id] && (
                <button
                  onClick={handleResetDate}
                  className="p-1 rounded bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
                  title="Reset to Official MAKAUT Date"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                title="Cancel"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Official Portal Link */}
          {activeTarget.officialNoticeUrl && (
            <a
              href={activeTarget.officialNoticeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-900 transition-colors ml-2"
            >
              <span>makautexam.net</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
