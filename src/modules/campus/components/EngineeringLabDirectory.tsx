'use client';

import React, { useState } from 'react';
import { 
  FlaskConical, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Cpu, 
  Wrench,
  Search,
  Building2
} from 'lucide-react';
import { EngineeringLabInfo } from '@/types';

interface EngineeringLabDirectoryProps {
  labs: EngineeringLabInfo[];
}

export function EngineeringLabDirectory({ labs }: EngineeringLabDirectoryProps) {
  const [selectedDept, setSelectedDept] = useState<'ALL' | 'CSE' | 'ECE' | 'EE' | 'ME' | 'CE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLabs = labs.filter((lab) => {
    if (selectedDept !== 'ALL') {
      const deptCode = lab.department.includes('Computer')
        ? 'CSE'
        : lab.department.includes('Electronics')
        ? 'ECE'
        : lab.department.includes('Electrical')
        ? 'EE'
        : lab.department.includes('Mechanical')
        ? 'ME'
        : lab.department.includes('Civil')
        ? 'CE'
        : '';
      if (deptCode !== selectedDept) return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      lab.name.toLowerCase().includes(q) ||
      lab.department.toLowerCase().includes(q) ||
      lab.roomNumber.toLowerCase().includes(q) ||
      lab.inCharge.toLowerCase().includes(q) ||
      lab.equipment.some((eq) => eq.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full space-y-6">
      {/* Header Bar with Department Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white border border-zinc-200 rounded-xl shadow-xs">
        <div>
          <h2 className="text-base font-bold text-zinc-900 tracking-tight flex items-center gap-2 font-display">
            <FlaskConical className="w-4 h-4 text-[#2563EB]" />
            B.Tech Engineering Laboratories &amp; Workshop Facilities
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            MAKAUT accredited laboratories, advanced computing nodes, IoT benches, and machine workshops.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
          {(
            [
              { id: 'ALL', label: 'All Labs' },
              { id: 'CSE', label: 'CSE' },
              { id: 'ECE', label: 'ECE' },
              { id: 'EE', label: 'EE' },
              { id: 'ME', label: 'ME' },
              { id: 'CE', label: 'CE' },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedDept(filter.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border font-mono ${
                selectedDept === filter.id
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Lab Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLabs.map((lab) => (
          <div
            key={lab.id}
            className="bg-white border border-zinc-200 hover:border-[#2563EB]/40 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-200">
                  {lab.department}
                </span>
                <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-zinc-400" />
                  {lab.roomNumber}
                </span>
              </div>
              <h3 className="text-base font-bold text-zinc-900 font-display">
                {lab.name}
              </h3>
              <p className="text-xs text-zinc-500 font-mono mt-1">
                Faculty In-Charge: <strong className="text-zinc-800">{lab.inCharge}</strong> • {lab.contact}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-100">
              <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block mb-1.5">
                Specialized Apparatus &amp; Workstations:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {lab.equipment.map((eq, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded text-zinc-700"
                  >
                    ⚙ {eq}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
