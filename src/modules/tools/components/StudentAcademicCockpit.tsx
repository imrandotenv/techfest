'use client';

import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Compass, 
  Calculator, 
  Sparkles,
  ExternalLink,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';

interface EnrolledCourse {
  code: string;
  name: string;
  category: 'Core Engineering' | 'Engineering Science' | 'Basic Science' | 'Humanities' | 'Mandatory';
  credits: number;
  faculty: string;
  room: string;
  status: 'Active';
}

const ENROLLED_COURSES: EnrolledCourse[] = [
  {
    code: 'PCC-CS301',
    name: 'Data Structures & Algorithms',
    category: 'Core Engineering',
    credits: 4.0,
    faculty: 'Dr. Sourav Sengupta',
    room: 'Lab 301 / Room 306',
    status: 'Active',
  },
  {
    code: 'ESC301',
    name: 'Digital Electronics & Logic Design',
    category: 'Engineering Science',
    credits: 3.0,
    faculty: 'Dr. Debabrata Roy',
    room: 'Digital Lab 204',
    status: 'Active',
  },
  {
    code: 'BS-M301',
    name: 'Mathematics-III (Differential Calculus)',
    category: 'Basic Science',
    credits: 4.0,
    faculty: 'Prof. Kaushik Chatterjee',
    room: 'Lecture Hall 102',
    status: 'Active',
  },
  {
    code: 'PCC-CS302',
    name: 'IT Workshop (Python & Linux Shell Automation)',
    category: 'Core Engineering',
    credits: 3.0,
    faculty: 'Prof. Riya Karmakar',
    room: 'Computer Center Lab 02',
    status: 'Active',
  },
  {
    code: 'HSMC301',
    name: 'Principles of Management & Engineering Economics',
    category: 'Humanities',
    credits: 2.0,
    faculty: 'Prof. Anirban Mukherjee',
    room: 'Lecture Hall 105',
    status: 'Active',
  },
  {
    code: 'MC301',
    name: 'Constitution of India (Mandatory Compliance)',
    category: 'Mandatory',
    credits: 0.0,
    faculty: 'Academic Cell Guest Lecturer',
    room: 'Central Seminar Hall',
    status: 'Active',
  },
];

const UPCOMING_EXAMINATIONS = [
  {
    id: 'exam-01',
    title: 'Continuous Assessment 2 (CA2) / Mid-Term Evaluation',
    date: '17 Nov – 21 Nov 2026',
    venue: 'Department Labs & Respective Lecture Rooms',
    type: 'Internal Assessment',
    status: 'Upcoming',
  },
  {
    id: 'exam-02',
    title: 'Odd Semester MAKAUT Theory Hall Examinations',
    date: '04 Dec – 19 Dec 2026',
    venue: 'SETGOI Main Examination Hall (Level 1 & 2)',
    type: 'University Exam',
    status: 'Scheduled',
  },
  {
    id: 'exam-03',
    title: 'Practical, Sessional & External Viva-Voce',
    date: '21 Dec – 24 Dec 2026',
    venue: 'Algorithm & Hardware Laboratories',
    type: 'Practical Viva',
    status: 'Scheduled',
  },
];

export function StudentAcademicCockpit() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Student Profile Card (Ported & Elevated from student-dashboard.html) */}
      <div className="rounded-2xl border border-[#E4E4E7] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#E4E4E7]">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-blue-500 text-white flex items-center justify-center font-display font-bold text-2xl shadow-xs shrink-0">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase font-semibold text-[#2563EB] tracking-wider">
                  STUDENT PORTAL
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Enrollment
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-[#09090B] tracking-tight mt-1">
                Welcome back, Engineer!
              </h2>
              <p className="text-xs text-[#52525B] font-sans mt-0.5">
                B.Tech Computer Science &amp; Engineering • Semester 3 • SETGOI Durgapur (MAKAUT Affiliated)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-[#E4E4E7] text-right font-mono">
              <span className="text-[10px] text-[#52525B] block uppercase tracking-wider">ACADEMIC SESSION</span>
              <strong className="text-xs sm:text-sm text-[#09090B] font-bold">2026–2027</strong>
            </div>
          </div>
        </div>

        {/* 4 Performance Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {/* Metric 1: Attendance */}
          <div className="p-4 rounded-xl border border-[#E4E4E7] bg-slate-50/60 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#52525B] block font-medium">
                OVERALL ATTENDANCE
              </span>
              <div className="text-2xl font-bold font-mono text-[#09090B] mt-1">
                85.4%
              </div>
              <span className="text-[11px] font-sans text-emerald-700 font-medium block mt-0.5">
                ✓ Safe to bunk 3 classes
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Metric 2: Target CGPA */}
          <div className="p-4 rounded-xl border border-[#E4E4E7] bg-slate-50/60 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#52525B] block font-medium">
                TARGET CGPA
              </span>
              <div className="text-2xl font-bold font-mono text-[#09090B] mt-1">
                8.52 <span className="text-xs text-[#52525B] font-normal">/ 10</span>
              </div>
              <span className="text-[11px] font-sans text-emerald-700 font-medium block mt-0.5">
                First Class with Distinction
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Award className="w-5 h-5" />
            </div>
          </div>

          {/* Metric 3: Enrolled Courses */}
          <div className="p-4 rounded-xl border border-[#E4E4E7] bg-slate-50/60 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#52525B] block font-medium">
                ENROLLED COURSES
              </span>
              <div className="text-2xl font-bold font-mono text-[#09090B] mt-1">
                06 <span className="text-xs text-[#52525B] font-normal">Subjects</span>
              </div>
              <span className="text-[11px] font-sans text-[#52525B] block mt-0.5">
                21.0 Total Registered Credits
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          {/* Metric 4: Upcoming Exams */}
          <div className="p-4 rounded-xl border border-[#E4E4E7] bg-slate-50/60 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#52525B] block font-medium">
                UPCOMING EXAMS
              </span>
              <div className="text-2xl font-bold font-mono text-[#09090B] mt-1">
                02 <span className="text-xs text-[#52525B] font-normal">Assessments</span>
              </div>
              <span className="text-[11px] font-sans text-amber-700 font-medium block mt-0.5">
                CA2 commences next week
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Enrolled Courses & Upcoming Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Enrolled Courses Roster (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E7]">
              <div>
                <span className="text-xs font-mono uppercase text-[#2563EB] font-semibold">
                  SEMESTER 3 CBCS CURRICULUM
                </span>
                <h3 className="text-lg font-bold font-display text-[#09090B]">
                  My Enrolled Courses
                </h3>
              </div>
              <Link
                href="/notes"
                className="text-xs font-mono text-[#2563EB] hover:underline inline-flex items-center gap-1 font-medium"
              >
                <span>View Full Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-[#E4E4E7] mt-2">
              {ENROLLED_COURSES.map((course) => (
                <div key={course.code} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#09090B] bg-slate-100 px-2 py-0.5 rounded border border-[#E4E4E7]">
                        {course.code}
                      </span>
                      <span className="text-[11px] font-mono text-[#52525B]">
                        {course.credits} Credits • {course.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-[#09090B] font-sans mt-1">
                      {course.name}
                    </h4>
                    <p className="text-[11px] text-[#52525B] font-sans">
                      Faculty: {course.faculty} • {course.room}
                    </p>
                  </div>

                  <Link
                    href={`/notes?q=${course.code}`}
                    className="self-start sm:self-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-[#2563EB] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shrink-0"
                  >
                    <span>Notes</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Examination Timelines & Quick Links (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Examinations Card */}
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E7]">
              <div>
                <span className="text-xs font-mono uppercase text-[#2563EB] font-semibold">
                  EXAMINATION CELL
                </span>
                <h3 className="text-lg font-bold font-display text-[#09090B]">
                  Upcoming Examinations
                </h3>
              </div>
              <Link
                href="/calendar"
                className="text-xs font-mono text-[#2563EB] hover:underline inline-flex items-center gap-1 font-medium"
              >
                <span>Full Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3.5 mt-4">
              {UPCOMING_EXAMINATIONS.map((exam) => (
                <div key={exam.id} className="p-3.5 rounded-xl border border-[#E4E4E7] bg-slate-50/70 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      {exam.type}
                    </span>
                    <span className="text-[11px] font-mono text-[#52525B] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {exam.date}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-[#09090B] font-sans leading-snug">
                    {exam.title}
                  </h4>
                  <p className="text-[11px] text-[#52525B] font-sans">
                    Venue: {exam.venue}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access Utility Cards (Ported from legacy student-dashboard.html) */}
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-6 shadow-xs">
            <span className="text-xs font-mono uppercase text-[#2563EB] font-semibold block mb-1">
              CAMPUS UTILITIES
            </span>
            <h3 className="text-base font-bold font-display text-[#09090B] pb-3 border-b border-[#E4E4E7]">
              Quick Academic Actions
            </h3>

            <div className="space-y-2.5 mt-3.5 font-sans">
              <Link
                href="/tools?tab=attendance"
                className="flex items-center justify-between p-3 rounded-xl border border-[#E4E4E7] hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-xs font-semibold text-[#09090B]">75% Attendance Tracker</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#52525B] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/tools?tab=calculator"
                className="flex items-center justify-between p-3 rounded-xl border border-[#E4E4E7] hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-xs font-semibold text-[#09090B]">MAKAUT SGPA &amp; CGPA Calculator</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#52525B] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/campus"
                className="flex items-center justify-between p-3 rounded-xl border border-[#E4E4E7] hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-xs font-semibold text-[#09090B]">3D Digital Twin &amp; Campus Map</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#52525B] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/tools?tab=events"
                className="flex items-center justify-between p-3 rounded-xl border border-[#E4E4E7] hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-xs font-semibold text-[#09090B]">TechFest &amp; Cultural Fest Passes</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#52525B] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
