'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Search, Clock, ShieldCheck, Calendar, BookOpen } from 'lucide-react';
import { ExamCountdown } from '@/components/ExamCountdown';

interface LiveNotice {
  id: string;
  title: string;
  content: string;
  category: string;
  subjectCode?: string | null;
  subjectName?: string | null;
  targetBranch: string;
  targetSemester?: number | null;
  targetBranches?: string[];
  targetSemesters?: number[];
  examDate?: string | null;
  eventDate?: string | null;
  isPinned: boolean;
  authorName?: string | null;
  authorRole?: string | null;
  createdAt: string;
  author?: { fullName?: string | null; role?: string | null } | null;
}

export function NoticeBoard() {
  const [notices, setNotices] = useState<LiveNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    fetch('/api/notices')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.notices)) {
          setNotices(data.notices);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ['ALL', 'EXAM', 'LAB_VIVA', 'ASSIGNMENT', 'ACADEMIC', 'URGENT'];

  const filteredNotices = notices.filter((n) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      (n.subjectCode || '').toLowerCase().includes(q) ||
      (n.targetBranch || '').toLowerCase().includes(q);
    const matchesCategory =
      selectedCategory === 'ALL' || n.category.toUpperCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <ExamCountdown variant="strip" />

      <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono text-[11px] font-bold">
              OFFICIAL DISPATCH
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              Live SETGOI Departmental &amp; Subject Feed
            </span>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Campus Priority Notice Board
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Targeted academic circulars, CA/Lab Viva schedules, and assignment deadlines from your faculty &amp; admin.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by title or subject..."
            className="w-full pl-8 pr-3 py-1.5 text-xs font-mono border border-zinc-200 rounded-lg bg-zinc-50/50 focus:bg-white focus:outline-none focus:border-zinc-900"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-zinc-900 text-white font-medium shadow-xs'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            {cat === 'ALL' ? 'All Notices' : cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-10 text-center text-xs text-zinc-500">
            Loading live notices...
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-10 text-center">
            <Bell className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-zinc-700">No notices found</p>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              No active circulars match your branch, semester, or filter.
            </p>
          </div>
        ) : (
          filteredNotices.map((notice) => {
            const branches = notice.targetBranches?.length
              ? notice.targetBranches
              : [notice.targetBranch];
            const sems = notice.targetSemesters?.length
              ? notice.targetSemesters
              : notice.targetSemester
              ? [notice.targetSemester]
              : [];
            const dueDate = notice.eventDate || notice.examDate;
            const authorLabel =
              notice.authorName || notice.author?.fullName || 'SETGOI Faculty Desk';

            return (
              <div
                key={notice.id}
                className={`bg-white rounded-xl p-5 border transition-all ${
                  notice.category === 'URGENT'
                    ? 'border-rose-300 bg-rose-50/20 shadow-xs'
                    : notice.isPinned
                    ? 'border-amber-300 bg-amber-50/10 shadow-xs'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 font-semibold">
                      {notice.category.replace('_', ' ')}
                    </span>

                    {notice.subjectCode && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                        <BookOpen className="w-3 h-3" />
                        {notice.subjectCode}
                        {notice.subjectName ? ` • ${notice.subjectName}` : ''}
                      </span>
                    )}

                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {branches.includes('ALL')
                        ? 'All B.Tech'
                        : `${branches.join(', ')}${sems.length ? ` • Sem ${sems.join(', ')}` : ''}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                    {dueDate && (
                      <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                        <Calendar className="w-3 h-3" />
                        Due: {new Date(dueDate).toLocaleDateString('en-IN')}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(notice.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-zinc-900 tracking-tight">
                  {notice.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed whitespace-pre-wrap">
                  {notice.content}
                </p>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                    <span>
                      Published by: <strong className="text-zinc-800">{authorLabel}</strong>
                    </span>
                  </div>

                  <span className="text-[11px] text-emerald-600 font-medium">
                    Verified SETGOI Circular
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
