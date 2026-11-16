'use client';

import React, { useState } from 'react';
import { 
  Home, 
  Clock, 
  Phone, 
  ShieldAlert, 
  Utensils, 
  CheckCircle2, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { HostelInfo } from '@/types';

interface HostelDirectoryProps {
  hostels: HostelInfo[];
}

export function HostelDirectory({ hostels }: HostelDirectoryProps) {
  const [selectedGender, setSelectedGender] = useState<'ALL' | 'Boys' | 'Girls'>('ALL');

  const filteredHostels = hostels.filter((h) => {
    if (selectedGender === 'ALL') return true;
    return h.gender === selectedGender;
  });

  return (
    <div className="w-full space-y-6">
      {/* Header Bar with Gender Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white border border-zinc-200 rounded-lg shadow-xs">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
            <Home className="w-4 h-4 text-sky-600" />
            Halls of Residence & Mess Facilities
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            On-campus residential accommodation, dining schedules, and institutional discipline policies.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          {(
            [
              { id: 'ALL', label: 'All Residences' },
              { id: 'Boys', label: 'Boys Hall' },
              { id: 'Girls', label: 'Girls Hall' },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedGender(filter.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border ${
                selectedGender === filter.id
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hostel Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHostels.map((hostel) => {
          const isBoys = hostel.gender === 'Boys';

          return (
            <div
              key={hostel.id}
              className="bg-white border border-zinc-200 rounded-lg p-6 shadow-xs space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-zinc-100">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded ${
                        isBoys
                          ? 'bg-sky-100 text-sky-800 border border-sky-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {hostel.gender} Residence
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      Capacity: {hostel.capacity} Residents
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">
                    {hostel.name}
                  </h3>
                </div>

                {/* Curfew Alert Pill */}
                <div className="text-right shrink-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Curfew: <strong>{hostel.curfewTime}</strong></span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-1">Biometric Attendance</div>
                </div>
              </div>

              {/* Warden / Admin Contact Card */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-md p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="text-[11px] font-mono uppercase text-zinc-500">Chief Warden:</div>
                  <div className="font-semibold text-zinc-900 mt-0.5">{hostel.wardenName}</div>
                </div>

                <a
                  href={`tel:${hostel.wardenContact}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 font-mono text-xs font-medium transition-colors shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call: {hostel.wardenContact}</span>
                </a>
              </div>

              {/* Mess Timings Table (Swiss Clean Layout) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase font-semibold text-zinc-700 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-zinc-500" />
                    Daily Mess & Dining Schedule
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">All 7 Days</span>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 rounded divide-y divide-zinc-200 text-xs">
                  <div className="flex items-center justify-between p-2.5">
                    <span className="font-medium text-zinc-700">Breakfast</span>
                    <span className="font-mono text-zinc-900">{hostel.messTimings.breakfast}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5">
                    <span className="font-medium text-zinc-700">Lunch</span>
                    <span className="font-mono text-zinc-900">{hostel.messTimings.lunch}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5">
                    <span className="font-medium text-zinc-700">Evening Tea & Snacks</span>
                    <span className="font-mono text-zinc-900">{hostel.messTimings.snacks}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5">
                    <span className="font-medium text-zinc-700">Dinner</span>
                    <span className="font-mono text-zinc-900">{hostel.messTimings.dinner}</span>
                  </div>
                </div>
              </div>

              {/* Code of Conduct & Rules */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase font-semibold text-zinc-700 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-zinc-500" />
                  Mandatory Regulations
                </span>

                <ul className="space-y-1.5 text-xs text-zinc-600">
                  {hostel.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hostel Administration Notice Box */}
      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg flex items-start gap-3 text-xs text-zinc-600">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-zinc-900 block font-semibold mb-0.5">
            Hostel Leave & Night Out Pass Protocol
          </strong>
          Students requiring night leave or weekend absence must submit their request via the SanakaHub student dashboard at least 24 hours prior for parental verification and warden approval. Biometric gate records are cross-checked daily.
        </div>
      </div>
    </div>
  );
}
