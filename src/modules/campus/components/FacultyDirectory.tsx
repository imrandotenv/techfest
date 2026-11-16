'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  BookOpen, 
  Check, 
  LayoutGrid, 
  Table as TableIcon,
  Sparkles
} from 'lucide-react';
import { FacultyMember } from '@/types';

interface FacultyDirectoryProps {
  faculty: FacultyMember[];
  selectedDepartmentCode?: string;
  onClearDepartmentFilter?: () => void;
}

export function FacultyDirectory({
  faculty,
  selectedDepartmentCode,
  onClearDepartmentFilter,
}: FacultyDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDept, setActiveDept] = useState<string>(selectedDepartmentCode || 'ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const departmentsList = ['ALL', 'CSE', 'ECE', 'EE', 'ME', 'CE', 'PHARM'];

  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const filteredFaculty = faculty.filter((member) => {
    // Dept filter
    if (activeDept !== 'ALL' && member.departmentCode !== activeDept) {
      return false;
    }

    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      member.fullName.toLowerCase().includes(q) ||
      member.designation.toLowerCase().includes(q) ||
      member.departmentCode.toLowerCase().includes(q) ||
      member.officeRoom.toLowerCase().includes(q) ||
      member.officeHours.toLowerCase().includes(q) ||
      member.researchInterests.some((r) => r.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full space-y-5">
      {/* Control Bar */}
      <div className="p-4 bg-white border border-zinc-200 rounded-lg shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculty by name, research area (e.g. AI, VLSI), room..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-zinc-50 border border-zinc-200 rounded-md text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-zinc-900 focus:bg-white transition-colors"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded border transition-colors ${
                viewMode === 'grid'
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
              title="Grid Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded border transition-colors ${
                viewMode === 'table'
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
              title="Swiss Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Department Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-zinc-100">
          <span className="text-[11px] font-mono text-zinc-400 uppercase mr-1">Dept:</span>
          {departmentsList.map((code) => (
            <button
              key={code}
              onClick={() => setActiveDept(code)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors border ${
                activeDept === code
                  ? 'bg-zinc-900 text-white border-zinc-900 font-bold'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              {code}
            </button>
          ))}
          {selectedDepartmentCode && activeDept !== 'ALL' && (
            <button
              onClick={() => {
                setActiveDept('ALL');
                if (onClearDepartmentFilter) onClearDepartmentFilter();
              }}
              className="text-xs text-sky-600 hover:underline ml-2 font-mono"
            >
              Reset filter
            </button>
          )}
        </div>
      </div>

      {/* Faculty Count indicator */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-500 px-1">
        <span>Showing {filteredFaculty.length} of {faculty.length} Faculty Members</span>
        <span>SETGOI Academic Staff</span>
      </div>

      {/* Main Content: Grid or Table */}
      {filteredFaculty.length === 0 ? (
        <div className="text-center py-12 bg-white border border-zinc-200 rounded-lg p-6">
          <Users className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-zinc-900">No faculty members found</p>
          <p className="text-xs text-zinc-500 mt-1">Try clearing filters or searching for another keyword.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFaculty.map((member) => (
            <div
              key={member.id}
              className="bg-white border border-zinc-200 rounded-lg p-5 flex flex-col justify-between hover:border-zinc-300 transition-all shadow-xs"
            >
              <div>
                {/* Header with Department Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-800 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                    {member.fullName
                      .split(' ')
                      .filter((n) => !n.startsWith('Dr.') && !n.startsWith('Prof.'))
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-zinc-900 text-white">
                    {member.departmentCode}
                  </span>
                </div>

                {/* Identity */}
                <h4 className="text-base font-semibold text-zinc-900 tracking-tight leading-snug">
                  {member.fullName}
                </h4>
                <div className="text-xs text-zinc-500 font-mono mt-0.5 mb-3">
                  {member.designation}
                </div>

                {/* Office & Consultation Hours */}
                <div className="bg-zinc-50 border border-zinc-200 rounded p-2.5 space-y-1.5 text-xs mb-3">
                  <div className="flex items-center gap-1.5 text-zinc-700">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="font-mono text-[11px] truncate">{member.officeRoom}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-600">
                    <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="font-mono text-[11px] truncate">{member.officeHours}</span>
                  </div>
                </div>

                {/* Research Interests */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                    Specializations:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {member.researchInterests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded border border-zinc-200"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-mono transition-colors"
                    title="Send Email"
                  >
                    <Mail className="w-3 h-3 text-zinc-600" />
                    <span className="hidden sm:inline">Email</span>
                  </a>
                  <button
                    onClick={() => handleCopy(member.email)}
                    className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                    title="Copy Email Address"
                  >
                    {copiedEmail === member.email ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-500">Copy</span>
                    )}
                  </button>
                </div>

                {member.phone ? (
                  <a
                    href={`tel:${member.phone}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-mono transition-colors"
                  >
                    <Phone className="w-3 h-3 text-zinc-500" />
                    <span>Call</span>
                  </a>
                ) : (
                  <span className="text-[11px] font-mono text-zinc-400">Extension 101</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Swiss Tabular View */
        <div className="w-full bg-white border border-zinc-200 rounded-lg overflow-x-auto shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 font-mono text-zinc-500 uppercase text-[11px]">
                <th className="py-2.5 px-4 font-semibold">Faculty Member</th>
                <th className="py-2.5 px-3 font-semibold">Dept</th>
                <th className="py-2.5 px-3 font-semibold">Designation</th>
                <th className="py-2.5 px-3 font-semibold">Office Cabin</th>
                <th className="py-2.5 px-3 font-semibold">Consultation Hours</th>
                <th className="py-2.5 px-3 font-semibold">Research Domain</th>
                <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredFaculty.map((member) => (
                <tr key={member.id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3 px-4 font-medium text-zinc-900 whitespace-nowrap">
                    {member.fullName}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-zinc-900 text-white">
                      {member.departmentCode}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-zinc-600 font-mono text-[11px]">
                    {member.designation}
                  </td>
                  <td className="py-3 px-3 text-zinc-600 font-mono text-[11px] whitespace-nowrap">
                    {member.officeRoom}
                  </td>
                  <td className="py-3 px-3 text-zinc-500 font-mono text-[11px] whitespace-nowrap">
                    {member.officeHours}
                  </td>
                  <td className="py-3 px-3 text-zinc-600 max-w-xs truncate text-[11px]">
                    {member.researchInterests.join(', ')}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <a
                        href={`mailto:${member.email}`}
                        className="p-1 rounded text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                        title={member.email}
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="p-1 rounded text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                          title={member.phone}
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
