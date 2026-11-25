'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  PlayCircle,
  Bookmark,
  ExternalLink,
  Search,
  GraduationCap,
  Clock,
  Building2,
  BookOpen,
  Award,
  Sparkles,
} from 'lucide-react';
import { useAcademicProfile } from '@/hooks/useAcademicProfile';
import {
  SYLLABUS_BRANCHES,
  SyllabusBranch,
  normalizeSyllabusBranch,
  getSubjectsForBranchAndSemester,
} from '@/lib/makaut-syllabus';

interface LectureRecord {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  branch: string;
  semester: number;
  platform: string;
  courseUrl: string;
  instructor: string | null;
  institute: string | null;
  duration: string | null;
  verified: boolean;
}

const BOOKMARK_KEY = 'settech_bookmarked_lectures';

export function LecturesView() {
  const { profile } = useAcademicProfile();
  const [branch, setBranch] = useState<SyllabusBranch>('CSE');
  const [semester, setSemester] = useState<number>(3);
  const [hasAppliedDefaults, setHasAppliedDefaults] = useState(false);

  const [lectures, setLectures] = useState<LectureRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Hydrate bookmarks
  useEffect(() => {
    try {
      const saved = localStorage.getItem(BOOKMARK_KEY);
      if (saved) setBookmarks(JSON.parse(saved));
    } catch {}
  }, []);

  // Auto-select logged-in student's branch & semester on load
  useEffect(() => {
    if (hasAppliedDefaults) return;
    if (profile.branch || profile.semester) {
      setBranch(normalizeSyllabusBranch(profile.branch));
      if (profile.semester >= 1 && profile.semester <= 8) {
        setSemester(profile.semester);
      }
      setHasAppliedDefaults(true);
    }
  }, [profile, hasAppliedDefaults]);

  // Fetch courses from Neon DB (/api/lectures)
  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/lectures?branch=${encodeURIComponent(branch)}&semester=${semester}`)
      .then((res) => res.json())
      .then((json) => {
        if (active && json.success) {
          setLectures(json.lectures || []);
        }
      })
      .catch((err) => console.warn('[LecturesView] Fetch error:', err))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [branch, semester]);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const syllabusSubjects = useMemo(
    () => getSubjectsForBranchAndSemester(branch, semester),
    [branch, semester]
  );

  // Group lectures by official MAKAUT subject
  const groupedBySubject = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const filtered = lectures.filter((l) => {
      if (bookmarkedOnly && !bookmarks.includes(l.id)) return false;
      if (!q) return true;
      return (
        l.title.toLowerCase().includes(q) ||
        l.subjectCode.toLowerCase().includes(q) ||
        l.subjectName.toLowerCase().includes(q) ||
        (l.instructor || '').toLowerCase().includes(q)
      );
    });

    const groups: Array<{
      code: string;
      name: string;
      credits?: number;
      category?: string;
      courses: LectureRecord[];
    }> = [];

    const seenCodes = new Set<string>();

    // First, group along official MAKAUT syllabus order
    for (const sub of syllabusSubjects) {
      const matching = filtered.filter(
        (l) => l.subjectCode.toUpperCase() === sub.code.toUpperCase()
      );
      if (matching.length > 0 || (!q && !bookmarkedOnly)) {
        seenCodes.add(sub.code.toUpperCase());
        groups.push({
          code: sub.code,
          name: sub.name,
          credits: sub.credits,
          category: sub.category,
          courses: matching,
        });
      }
    }

    // Any extra custom lectures added by faculty for this branch/semester
    for (const l of filtered) {
      const codeUpper = l.subjectCode.toUpperCase();
      if (!seenCodes.has(codeUpper)) {
        seenCodes.add(codeUpper);
        groups.push({
          code: l.subjectCode,
          name: l.subjectName,
          courses: filtered.filter((x) => x.subjectCode.toUpperCase() === codeUpper),
        });
      }
    }

    return groups;
  }, [lectures, syllabusSubjects, searchQuery, bookmarkedOnly, bookmarks]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#09090B] pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] font-mono text-[11px] font-bold">
                SWAYAM • NPTEL • IIT / IISc
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 font-mono text-[11px]">
                MAKAUT B.Tech Mapped
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-[#09090B]">
              Official Course Lectures (SWAYAM &amp; NPTEL)
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl leading-relaxed">
              Curated IIT &amp; IISc video lecture series mapped directly to your MAKAUT semester subjects. Earn MAR points and master core engineering concepts.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setBookmarkedOnly((prev) => !prev)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold border inline-flex items-center gap-2 transition-colors cursor-pointer ${
                bookmarkedOnly
                  ? 'bg-[#09090B] text-white border-[#09090B]'
                  : 'bg-white text-zinc-700 border-[#E4E4E7] hover:bg-zinc-50'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Bookmarked ({bookmarks.length})</span>
            </button>
          </div>
        </div>

        {/* Filter Bar: Branch, Semester & Search */}
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Branch Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono text-zinc-400 uppercase mr-1">Branch:</span>
              {SYLLABUS_BRANCHES.map((b) => (
                <button
                  key={b.code}
                  type="button"
                  onClick={() => setBranch(b.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer ${
                    branch === b.code
                      ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-2xs'
                      : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  {b.code}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-72">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject, NPTEL course, professor..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs text-[#09090B] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Semester Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-100">
            <span className="text-[11px] font-mono text-zinc-400 uppercase mr-1">Semester:</span>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <button
                key={sem}
                type="button"
                onClick={() => setSemester(sem)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer tabular-nums ${
                  semester === sem
                    ? 'bg-[#09090B] text-white border-[#09090B]'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                Sem {sem}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped Subject Lecture Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-white border border-[#E4E4E7] animate-pulse p-6" />
            ))}
          </div>
        ) : groupedBySubject.length === 0 ? (
          <div className="bg-white border border-dashed border-zinc-300 rounded-2xl p-10 text-center space-y-2">
            <PlayCircle className="w-8 h-8 text-zinc-400 mx-auto" />
            <h3 className="text-sm font-bold text-[#09090B]">No matching courses found</h3>
            <p className="text-xs text-zinc-500">
              Try clearing your search query or switching to another semester.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedBySubject.map((group) => (
              <div
                key={group.code}
                className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
              >
                {/* Subject Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-[#2563EB] border border-blue-200 font-mono text-xs font-bold">
                      {group.code}
                    </span>
                    <h2 className="text-base font-display font-bold text-[#09090B]">
                      {group.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                    {group.category && (
                      <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200">
                        {group.category}
                      </span>
                    )}
                    {group.credits !== undefined && (
                      <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 tabular-nums">
                        {group.credits} Credits
                      </span>
                    )}
                  </div>
                </div>

                {/* Course Cards for this Subject */}
                {group.courses.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">
                    No video lectures mapped yet for this subject. Faculty can add courses from the Faculty Desk.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.courses.map((course) => {
                      const isBookmarked = bookmarks.includes(course.id);
                      return (
                        <div
                          key={course.id}
                          className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] hover:border-blue-300 transition-all flex flex-col justify-between gap-4"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border ${
                                  course.platform === 'SWAYAM'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                }`}
                              >
                                {course.platform} OFFICIAL
                              </span>
                              {course.duration && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 tabular-nums">
                                  <Clock className="w-3 h-3" />
                                  {course.duration}
                                </span>
                              )}
                            </div>

                            <h3 className="text-sm font-bold text-[#09090B] leading-snug">
                              {course.title}
                            </h3>

                            <div className="text-xs text-zinc-600 space-y-0.5">
                              {course.instructor && (
                                <div className="flex items-center gap-1.5">
                                  <GraduationCap className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                  <span>{course.instructor}</span>
                                </div>
                              )}
                              {course.institute && (
                                <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-500">
                                  <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                  <span>{course.institute}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-200/70">
                            <a
                              href={course.courseUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-2 px-3 rounded-xl bg-[#09090B] hover:bg-zinc-800 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <span>Open on {course.platform}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            <button
                              type="button"
                              onClick={() => toggleBookmark(course.id)}
                              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                isBookmarked
                                  ? 'bg-blue-50 text-[#2563EB] border-blue-200'
                                  : 'bg-white text-zinc-500 border-zinc-200 hover:text-zinc-900'
                              }`}
                              title={isBookmarked ? 'Remove bookmark' : 'Bookmark course'}
                            >
                              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
