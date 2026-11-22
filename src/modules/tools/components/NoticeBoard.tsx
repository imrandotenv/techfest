'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Clock, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  Filter, 
  Calendar,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { CampusNotice } from '@/modules/rbac/actions';
import { ExamCountdown } from '@/components/ExamCountdown';

interface NoticeBoardProps {
  initialNotices?: CampusNotice[];
}

const DEFAULT_NOTICES: CampusNotice[] = [
  {
    id: 'notice-01',
    title: 'MAKAUT Odd Semester 2026-27 Examination Form Fill-up',
    content:
      'All B.Tech students (Semesters 3, 5, 7) must complete MAKAUT odd semester examination forms and fee clearance by Nov 20, 2026. Admit cards will be distributed via respective department coordinators.',
    department: 'All Departments',
    category: 'Examination',
    priority: 'urgent',
    postedById: 'usr-admin-01',
    postedByName: 'SETGOI Examination Cell',
    postedByRole: 'admin',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'notice-02',
    title: 'Department of CSE: PCC-CS301 Mid-Term Syllabus & Lab Schedule',
    content:
      'Data Structures & Algorithms lab viva and component evaluation will commence on Monday in Lab 304. Verified lecture slides and lab manual have been uploaded to the Notes Vault.',
    department: 'CSE',
    category: 'Academic',
    priority: 'high',
    postedById: 'usr-faculty-01',
    postedByName: 'Dr. Sourav Sengupta',
    postedByRole: 'college',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'notice-03',
    title: 'Campus Evening Transit Route Adjustment (Bus Route #3 & #5)',
    content:
      'Evening departure from SETGOI Main Gate to Durgapur Railway Station is adjusted to 4:45 PM to facilitate post-lab departures. Route passes through City Centre and Muchipara.',
    department: 'Transport',
    category: 'Transit',
    priority: 'medium',
    postedById: 'usr-admin-02',
    postedByName: 'Campus Transport Desk',
    postedByRole: 'admin',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'notice-04',
    title: 'Central Computing & IoT Engineering Labs Extended Access for TechFest 2026',
    content:
      'Night lab access approved for B.Tech project teams and hackathon participants in Central Computing Labs 304/305 with biometric logging.',
    department: 'Laboratories',
    category: 'Laboratories',
    priority: 'medium',
    postedById: 'usr-admin-01',
    postedByName: 'Director of Engineering Labs',
    postedByRole: 'admin',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

export function NoticeBoard({ initialNotices = DEFAULT_NOTICES }: NoticeBoardProps) {
  const [notices] = useState<CampusNotice[]>(initialNotices);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Examination', 'Academic', 'Transit', 'Laboratories', 'Administration'];

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Live MAKAUT Semester Exam Countdown Strip */}
      <ExamCountdown variant="strip" />

      {/* Header & Controls */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono text-[11px] font-bold">
              OFFICIAL DISPATCH
            </span>
            <span className="text-xs text-zinc-500 font-mono">Real-time SETGOI Institutional Board</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Campus Priority Notice Board
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Verified academic circulars, MAKAUT examination updates, laboratory circulars, and transit bulletins.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter notices..."
              className="w-full pl-8 pr-3 py-1.5 text-xs font-mono border border-zinc-200 rounded-lg bg-zinc-50/50 focus:bg-white focus:outline-none focus:border-zinc-900"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-zinc-900 text-white font-medium shadow-xs'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            {cat === 'ALL' ? 'All Notices' : cat}
          </button>
        ))}
      </div>

      {/* Notice Cards List */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-10 text-center">
            <Bell className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-zinc-700">No notices found</p>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          filteredNotices.map((notice) => {
            const isUrgent = notice.priority === 'urgent';
            const isHigh = notice.priority === 'high';

            return (
              <div
                key={notice.id}
                className={`bg-white rounded-xl p-5 border transition-all ${
                  isUrgent
                    ? 'border-rose-300 bg-rose-50/20 shadow-xs'
                    : isHigh
                    ? 'border-amber-300 bg-amber-50/10 shadow-xs'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
                        isUrgent
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : isHigh
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {notice.priority}
                    </span>

                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                      {notice.category}
                    </span>

                    <span className="text-xs font-mono text-zinc-500">
                      {notice.department}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-zinc-900 tracking-tight">
                  {notice.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
                  {notice.content}
                </p>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                    <span>Published by: <strong className="text-zinc-800">{notice.postedByName}</strong></span>
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
