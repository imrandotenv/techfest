'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PlayCircle, Plus, Trash2, RefreshCw, ExternalLink, CheckCircle2, AlertTriangle } from 'lucide-react';
import {
  SYLLABUS_BRANCHES,
  SyllabusBranch,
  getSubjectsForBranchAndSemester,
} from '@/lib/makaut-syllabus';

interface LectureItem {
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
}

export function CourseLectureManager() {
  const [branch, setBranch] = useState<SyllabusBranch>('CSE');
  const [semester, setSemester] = useState<number>(3);
  const availableSubjects = getSubjectsForBranchAndSemester(branch, semester);
  const [subjectCode, setSubjectCode] = useState<string>(availableSubjects[0]?.code || 'PCC-CS301');

  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<'NPTEL' | 'SWAYAM' | 'YOUTUBE'>('NPTEL');
  const [courseUrl, setCourseUrl] = useState('');
  const [instructor, setInstructor] = useState('');
  const [institute, setInstitute] = useState('');
  const [duration, setDuration] = useState('12 Weeks');

  const [lectures, setLectures] = useState<LectureItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ text: string; isError?: boolean } | null>(null);

  const showToast = (text: string, isError = false) => {
    setToast({ text, isError });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const subs = getSubjectsForBranchAndSemester(branch, semester);
    if (subs.length > 0 && !subs.some((s) => s.code === subjectCode)) {
      setSubjectCode(subs[0].code);
    }
  }, [branch, semester, subjectCode]);

  const fetchLectures = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/lectures?branch=${branch}&semester=${semester}`);
      if (res.ok) {
        const data = await res.json();
        setLectures(data.lectures || []);
      }
    } finally {
      setLoading(false);
    }
  }, [branch, semester]);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseUrl.trim()) return;
    setSaving(true);

    const matchedSubject = availableSubjects.find((s) => s.code === subjectCode);

    try {
      const res = await fetch('/api/lectures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subjectCode,
          subjectName: matchedSubject?.name || subjectCode,
          branch,
          semester,
          platform,
          courseUrl,
          instructor,
          institute,
          duration,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add lecture');

      showToast('SWAYAM / NPTEL course lecture added to /lectures!');
      setTitle('');
      setCourseUrl('');
      setInstructor('');
      setInstitute('');
      fetchLectures();
    } catch (err: any) {
      showToast(err?.message || 'Error saving lecture', true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/lectures?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Course lecture removed.');
      fetchLectures();
    }
  };

  return (
    <div className="space-y-4">
      {toast && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            toast.isError
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          {toast.isError ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{toast.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Add Course Lecture Form */}
        <div className="lg:col-span-5 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 h-fit">
          <div className="pb-3 border-b border-zinc-100">
            <h2 className="text-sm font-bold text-[#09090B] flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-emerald-600" />
              <span>Add SWAYAM / NPTEL Course Lecture</span>
            </h2>
            <p className="text-xs text-zinc-500">Cascading MAKAUT syllabus selector</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value as SyllabusBranch)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
                >
                  {SYLLABUS_BRANCHES.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.code}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Sem {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-500 mb-1">MAKAUT Subject</label>
              <select
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
              >
                {availableSubjects.map((sub) => (
                  <option key={sub.code} value={sub.code}>
                    {sub.code} — {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-500 mb-1">Course Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Programming, Data Structures & Algorithms"
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
                >
                  <option value="NPTEL">NPTEL</option>
                  <option value="SWAYAM">SWAYAM</option>
                  <option value="YOUTUBE">YOUTUBE</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="12 Weeks"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-500 mb-1">Official Course URL</label>
              <input
                type="url"
                value={courseUrl}
                onChange={(e) => setCourseUrl(e.target.value)}
                placeholder="https://nptel.ac.in/courses/..."
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">Instructor</label>
                <input
                  type="text"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  placeholder="Prof. Name"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">Institute</label>
                <input
                  type="text"
                  value={institute}
                  onChange={(e) => setInstitute(e.target.value)}
                  placeholder="IIT Kharagpur"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-xl bg-[#09090B] hover:bg-zinc-800 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Publish Course Lecture'}</span>
            </button>
          </form>
        </div>

        {/* Existing Lectures List */}
        <div className="lg:col-span-7 bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-sm font-bold text-[#09090B]">
                {branch} Sem {semester} Course Lectures ({lectures.length})
              </h2>
              <p className="text-xs text-zinc-500">Live in Neon DB &amp; visible on /lectures</p>
            </div>
            <button onClick={fetchLectures} className="p-1.5 rounded-lg border border-zinc-200 cursor-pointer">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {lectures.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
              No lectures for {branch} Sem {semester} yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {lectures.map((l) => (
                <div key={l.id} className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-[#2563EB] font-mono text-[10px] font-bold">
                        {l.subjectCode}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                        {l.platform}
                      </span>
                      {l.duration && (
                        <span className="text-[10px] font-mono text-zinc-500">{l.duration}</span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-[#09090B]">{l.title}</div>
                    <div className="text-[11px] font-mono text-zinc-500">
                      {l.instructor || 'IIT Faculty'} {l.institute ? `• ${l.institute}` : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={l.courseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-white text-[#2563EB]"
                      title="Open course"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDelete(l.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
