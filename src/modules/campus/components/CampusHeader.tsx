'use client';

import React from 'react';
import { 
  Building2, 
  PhoneCall, 
  ShieldAlert, 
  Bus, 
  FlaskConical, 
  Users, 
  Compass, 
  MapPin
} from 'lucide-react';
import { CampusTab } from '../types';

interface CampusHeaderProps {
  activeTab: CampusTab;
  onTabChange: (tab: CampusTab) => void;
  stats: {
    departmentsCount: number;
    facultyCount: number;
    hostelsCount?: number;
    labsCount?: number;
    busRoutesCount: number;
  };
}

export function CampusHeader({ activeTab, onTabChange, stats }: CampusHeaderProps) {
  const tabs: { id: CampusTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: '3d-map', label: '3D Campus Map', icon: MapPin, badge: 'Interactive' },
    { id: 'directory', label: 'Engineering Directory & Contacts', icon: Building2, badge: 'B.Tech SETGOI' },
  ];

  return (
    <div className="w-full bg-white border-b border-[#E4E4E7] pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#E4E4E7] bg-zinc-50 text-[11px] font-mono uppercase tracking-wider text-[#52525B] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SETGOI Durgapur • Affiliated with MAKAUT
            </span>
            <span className="text-zinc-300">/</span>
            <span className="text-xs font-mono text-[#52525B]">Malandighi, Durgapur 713212</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#09090B] font-display">
            Engineering Campus &amp; Directory
          </h1>
          <p className="mt-1.5 text-sm text-[#52525B] max-w-3xl leading-relaxed font-sans">
            Official B.Tech academic directory for Sanaka Educational Trust&apos;s Group of Institutions.
            Access Principal &amp; HOD consultation hours, laboratory complexes, transit schedules, emergency contacts, and the 3D campus visualizer.
          </p>
        </div>

        {/* Responsive Swiss Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-[#E4E4E7] pt-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id || (tab.id === 'directory' && activeTab !== '3d-map');
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-150 border font-sans cursor-pointer ${
                  isActive
                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                    : 'bg-white text-[#52525B] border-[#E4E4E7] hover:bg-zinc-50 hover:text-[#09090B] hover:border-zinc-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#52525B]'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-blue-700 text-white'
                        : 'bg-zinc-100 text-[#52525B] border border-[#E4E4E7]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
