'use client';

import React from 'react';
import { 
  Building2, 
  PhoneCall, 
  ShieldAlert, 
  Bus, 
  Home, 
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
    hostelsCount: number;
    busRoutesCount: number;
  };
}

export function CampusHeader({ activeTab, onTabChange, stats }: CampusHeaderProps) {
  const tabs: { id: CampusTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'departments', label: 'Departments & Faculty', icon: Building2, badge: `${stats.departmentsCount}` },
    { id: 'hostel-bus', label: 'Hostel & Bus', icon: Home, badge: `${stats.hostelsCount} Halls • ${stats.busRoutesCount} Routes` },
    { id: 'contacts', label: 'Contacts & SOS', icon: ShieldAlert, badge: '24/7' },
    { id: 'overview', label: 'All Directory', icon: Compass },
    { id: '3d-map', label: '3D Campus Map', icon: MapPin, badge: 'Interactive' },
  ];

  return (
    <div className="w-full bg-white border-b border-zinc-200 pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-200 bg-zinc-50 text-[11px] font-mono uppercase tracking-wider text-zinc-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SETGOI Durgapur • MAKAUT
            </span>
            <span className="text-zinc-300">/</span>
            <span className="text-xs font-mono text-zinc-500">Campus Directory & Spatial Guide</span>
          </div>

          {/* Quick SOS Hotline Pill */}
          <div className="flex items-center gap-2">
            <a
              href="tel:+919434000001"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors text-xs font-mono font-medium"
              title="24/7 Medical Emergency & Ambulance"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-600" />
              <span>SOS Medical: <strong className="font-semibold">+91 94340 00001</strong></span>
            </a>
            <a
              href="tel:+919434000002"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors text-xs font-mono font-medium"
              title="Main Gate Security Outpost"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Security: <strong className="font-semibold">+91 94340 00002</strong></span>
            </a>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
            Campus Infrastructure & Directory
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500 max-w-3xl leading-relaxed">
            Centralized index of Sanaka Educational Trust&apos;s Group of Institutions (SETGOI).
            Explore academic departments, faculty office consultation hours, hostel regulations, bus schedules, 
            24/7 SOS hotlines, and the spatial 3D zone visualizer.
          </p>
        </div>

        {/* Responsive Swiss Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-zinc-100 pt-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all duration-150 border ${
                  isActive
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isActive
                        ? 'bg-zinc-700 text-zinc-200'
                        : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
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
