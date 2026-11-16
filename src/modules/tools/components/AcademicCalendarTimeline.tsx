'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Download, 
  Copy, 
  Check, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { ACADEMIC_CALENDAR_EVENTS } from '@/lib/seed-data';
import { AcademicCalendarEvent } from '../types';

export function AcademicCalendarTimeline() {
  const [selectedTerm, setSelectedTerm] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyCrucial, setOnlyCrucial] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Filter events
  const filteredEvents = useMemo(() => {
    return ACADEMIC_CALENDAR_EVENTS.filter((event: AcademicCalendarEvent) => {
      // Term filter
      if (selectedTerm === 'odd' && !event.term.includes('Odd')) return false;
      if (selectedTerm === 'even' && !event.term.includes('Even')) return false;

      // Category / CA/PCA filter
      if (selectedCategory === 'capca') {
        const isCaPca = 
          event.title.includes('CA') || 
          event.title.includes('PCA') || 
          event.category === 'Class Test';
        if (!isCaPca) return false;
      } else if (selectedCategory === 'exams') {
        if (event.category !== 'Examination') return false;
      } else if (selectedCategory === 'enrollment') {
        if (event.category !== 'Enrollment' && event.category !== 'Academic') return false;
      } else if (selectedCategory === 'internship') {
        if (event.category !== 'Internship') return false;
      }

      // Crucial filter
      if (onlyCrucial && !event.isCrucial) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesCategory = event.category.toLowerCase().includes(q);
        const matchesTerm = event.term.toLowerCase().includes(q);
        const matchesDate = event.startDate.toLowerCase().includes(q) || (event.endDate?.toLowerCase().includes(q) ?? false);
        if (!matchesTitle && !matchesCategory && !matchesTerm && !matchesDate) {
          return false;
        }
      }

      return true;
    });
  }, [selectedTerm, selectedCategory, searchQuery, onlyCrucial]);

  // Copy schedule as text
  const handleCopySchedule = () => {
    const textLines = [
      'MAKAUT ACADEMIC CALENDAR 2026–27 (SETGOI DURGAPUR)',
      '====================================================',
      ...filteredEvents.map(
        (ev: AcademicCalendarEvent) =>
          `[${ev.startDate}${ev.endDate ? ` – ${ev.endDate}` : ''}] ${ev.title} (${ev.category}) ${
            ev.isCrucial ? '★ CRUCIAL' : ''
          }`
      ),
      '====================================================',
      'Source: SETGOI Official Academic Administration / MAKAUT Guidelines',
    ];
    navigator.clipboard.writeText(textLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              <Calendar className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">
              Official MAKAUT 2026–27 Academic Calendar
            </h2>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Complete schedule for Odd & Even semesters, Continuous Assessments (CA1–CA4), Practical Assessments (PCA1–PCA2), and University Examinations.
          </p>
        </div>

        <button
          onClick={handleCopySchedule}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 shadow-sm transition-colors self-start sm:self-auto"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
          {copied ? 'Schedule Copied' : 'Copy Schedule'}
        </button>
      </div>

      {/* Quick Milestone Notice Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-lg border border-zinc-200 bg-white shadow-sm flex items-start gap-3">
          <div className="p-2 rounded bg-sky-50 text-sky-600 border border-sky-100 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase text-zinc-500">Upcoming Milestone</p>
            <h4 className="text-xs font-bold text-zinc-900 mt-0.5">
              CA1 (Class Test 1) Assessment Window
            </h4>
            <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">
              07 Sep 2026 – 12 Sep 2026
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-zinc-200 bg-white shadow-sm flex items-start gap-3">
          <div className="p-2 rounded bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase text-zinc-500">University Theory Exams</p>
            <h4 className="text-xs font-bold text-zinc-900 mt-0.5">
              Odd Semester Theory Examinations
            </h4>
            <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">
              04 Dec 2026 – 19 Dec 2026
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-zinc-200 bg-white shadow-sm flex items-start gap-3">
          <div className="p-2 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase text-zinc-500">Even Semester Opening</p>
            <h4 className="text-xs font-bold text-zinc-900 mt-0.5">
              Even Semester Commencement (Sem 2, 4, 6, 8)
            </h4>
            <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">
              04 Jan 2027
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-xl border border-zinc-200 bg-white shadow-sm space-y-3">
        {/* Term Tabs & Crucial Checkbox */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg border border-zinc-200 text-xs font-medium">
            <button
              onClick={() => setSelectedTerm('all')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedTerm === 'all'
                  ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              All Semesters (2026–27)
            </button>
            <button
              onClick={() => setSelectedTerm('odd')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedTerm === 'odd'
                  ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Odd Sem (Jul–Dec 2026)
            </button>
            <button
              onClick={() => setSelectedTerm('even')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedTerm === 'even'
                  ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Even Sem (Jan–Jul 2027)
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyCrucial}
              onChange={(e) => setOnlyCrucial(e.target.checked)}
              className="rounded border-zinc-300 text-sky-600 focus:ring-sky-500 w-3.5 h-3.5"
            />
            <span className="font-medium">Show Crucial University Deadlines Only</span>
          </label>
        </div>

        {/* Filter Chips & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-zinc-100">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-zinc-400 font-mono text-[11px] mr-1">Filter:</span>
            {[
              { id: 'all', label: 'All Items' },
              { id: 'capca', label: '🎯 CA / PCA Only' },
              { id: 'exams', label: '📝 Theory & Practical Exams' },
              { id: 'enrollment', label: '📋 Enrollment & Commencement' },
              { id: 'internship', label: '💼 Internships' },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setSelectedCategory(chip.id)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors border ${
                  selectedCategory === chip.id
                    ? 'bg-zinc-900 text-white border-zinc-900 font-medium'
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search event, CA date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs placeholder:text-zinc-400 focus:bg-white focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Timeline View */}
      <div className="border border-zinc-200 rounded-xl bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
          <span className="text-xs font-mono uppercase text-zinc-500 font-semibold tracking-wider">
            Chronological Timeline ({filteredEvents.length} Events Listed)
          </span>
          <span className="text-xs text-zinc-400 font-mono">
            Source: MAKAUT Academic Calendar 2026–27
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 text-xs">
            No academic events match your selected filters. Try resetting the search or category pills.
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
            {filteredEvents.map((event: AcademicCalendarEvent) => {
              const isCa = event.title.includes('CA') || event.title.includes('PCA');
              const isExam = event.category === 'Examination';
              const dotColor = event.isCrucial
                ? 'bg-red-500 ring-4 ring-red-100'
                : isCa
                ? 'bg-sky-500 ring-4 ring-sky-100'
                : 'bg-zinc-400 ring-4 ring-zinc-100';

              return (
                <div key={event.id} className="relative group">
                  {/* Timeline Node Dot */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1.5 w-3 h-3 rounded-full transition-transform group-hover:scale-125 ${dotColor}`}
                  />

                  {/* Event Card */}
                  <div
                    className={`p-4 rounded-xl border transition-all ${
                      event.isCrucial
                        ? 'border-amber-200 bg-amber-50/30 hover:border-amber-300'
                        : isCa
                        ? 'border-sky-200 bg-sky-50/20 hover:border-sky-300'
                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                          {event.startDate}
                          {event.endDate ? ` – ${event.endDate}` : ''}
                        </span>

                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                            event.category === 'Class Test'
                              ? 'bg-sky-100 text-sky-800'
                              : event.category === 'Examination'
                              ? 'bg-red-100 text-red-800'
                              : event.category === 'Enrollment'
                              ? 'bg-purple-100 text-purple-800'
                              : event.category === 'Internship'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          {event.category}
                        </span>

                        {event.isCrucial && (
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
                            ★ Crucial Deadline
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-zinc-400 font-mono">
                        {event.term}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-900 mt-2 tracking-tight">
                      {event.title}
                    </h4>

                    {/* Explanatory notes for Continuous Assessments */}
                    {isCa && (
                      <p className="text-xs text-zinc-500 mt-1">
                        Mandatory internal evaluation as per MAKAUT autonomy & continuous evaluation guidelines. Marks contribute to semester grade calculation.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
