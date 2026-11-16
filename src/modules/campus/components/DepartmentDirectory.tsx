'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  ArrowUpRight, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { Department, FacultyMember } from '@/types';

interface DepartmentDirectoryProps {
  departments: Department[];
  faculty: FacultyMember[];
  onSelectDepartmentFaculty?: (deptCode: string) => void;
}

export function DepartmentDirectory({ 
  departments, 
  faculty,
  onSelectDepartmentFaculty 
}: DepartmentDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'ENGG' | 'PHARM'>('ALL');
  const [expandedDeptId, setExpandedDeptId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const filteredDepartments = departments.filter((dept) => {
    // Category filter
    if (categoryFilter === 'ENGG' && dept.code === 'PHARM') return false;
    if (categoryFilter === 'PHARM' && dept.code !== 'PHARM') return false;

    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      dept.name.toLowerCase().includes(q) ||
      dept.code.toLowerCase().includes(q) ||
      dept.hodName.toLowerCase().includes(q) ||
      dept.locationBuilding.toLowerCase().includes(q) ||
      dept.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full space-y-5">
      {/* Search & Filter Header (Swiss Control Bar) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white border border-zinc-200 rounded-lg shadow-xs">
        {/* Search input with 1px border */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search departments by code (e.g. CSE), HOD, or building..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-zinc-50 border border-zinc-200 rounded-md text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-zinc-900 focus:bg-white transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          {(
            [
              { id: 'ALL', label: 'All Departments' },
              { id: 'ENGG', label: 'Engineering (B.Tech)' },
              { id: 'PHARM', label: 'Pharmacy (B.Pharm)' },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              onClick={() => setCategoryFilter(filter.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border ${
                categoryFilter === filter.id
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Department Cards Grid */}
      {filteredDepartments.length === 0 ? (
        <div className="text-center py-12 bg-white border border-zinc-200 rounded-lg p-6">
          <Building2 className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-zinc-900">No departments match your query</p>
          <p className="text-xs text-zinc-500 mt-1">Try searching for &quot;CSE&quot;, &quot;Civil&quot;, or &quot;Pharmacy&quot;.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDepartments.map((dept) => {
            const deptFaculty = faculty.filter((f) => f.departmentCode === dept.code);
            const isExpanded = expandedDeptId === dept.id;

            return (
              <div
                key={dept.id}
                className="bg-white border border-zinc-200 rounded-lg p-5 hover:border-zinc-300 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 text-xs font-mono font-bold rounded bg-zinc-900 text-white">
                        {dept.code}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded">
                        <Calendar className="w-3 h-3 text-zinc-400" />
                        Est. {dept.establishedYear}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                      <Users className="w-3 h-3 text-emerald-600" />
                      {dept.intakeCapacity} Intake / Yr
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-base font-semibold text-zinc-900 tracking-tight mb-1.5">
                    {dept.name}
                  </h3>

                  <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                    {dept.description}
                  </p>

                  {/* Meta Specs Table */}
                  <div className="bg-zinc-50 rounded border border-zinc-200 p-3 text-xs space-y-2 mb-4">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-zinc-500 font-mono text-[11px] uppercase">Head of Department:</span>
                      <span className="font-medium text-zinc-900 text-right">{dept.hodName}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-zinc-500 font-mono text-[11px] uppercase">HOD Email:</span>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`mailto:${dept.hodEmail}`}
                          className="font-mono text-sky-600 hover:underline text-[11px]"
                        >
                          {dept.hodEmail}
                        </a>
                        <button
                          onClick={() => handleCopyEmail(dept.hodEmail)}
                          className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 transition-colors"
                          title="Copy email"
                        >
                          {copiedEmail === dept.hodEmail ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Mail className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-start justify-between gap-2 pt-1 border-t border-zinc-200/60">
                      <span className="text-zinc-500 font-mono text-[11px] uppercase">Campus Location:</span>
                      <span className="font-mono text-zinc-700 text-right text-[11px] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                        {dept.locationBuilding}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Faculty Preview & Expand Toggle */}
                <div className="pt-2 border-t border-zinc-100">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setExpandedDeptId(isExpanded ? null : dept.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-600 hover:text-zinc-900 font-medium"
                    >
                      <span>
                        {deptFaculty.length} Faculty Profiles
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {onSelectDepartmentFaculty && (
                      <button
                        onClick={() => onSelectDepartmentFaculty(dept.code)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-700 hover:underline"
                      >
                        <span>View Faculty</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Expanded Faculty list preview */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-zinc-200 space-y-2">
                      {deptFaculty.length === 0 ? (
                        <p className="text-xs text-zinc-400 italic">No faculty profiles loaded for this department.</p>
                      ) : (
                        deptFaculty.map((f) => (
                          <div
                            key={f.id}
                            className="p-2 rounded bg-zinc-50 border border-zinc-200/80 text-xs flex items-center justify-between gap-2"
                          >
                            <div>
                              <div className="font-medium text-zinc-900">{f.fullName}</div>
                              <div className="text-[11px] text-zinc-500 font-mono">{f.designation} • {f.officeRoom}</div>
                            </div>
                            <a
                              href={`mailto:${f.email}`}
                              className="text-sky-600 hover:text-sky-700 p-1"
                              title="Email faculty"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
