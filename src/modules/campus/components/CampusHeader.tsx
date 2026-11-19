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
    <div className="w-full bg-white border-b border-[#E2E8F0] pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#E2E8F0] bg-slate-50 text-[11px] font-mono uppercase tracking-wider text-[#475569] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SETGOI Durgapur • MAKAUT
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-mono text-[#475569]">Campus Directory &amp; Spatial Guide</span>
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] font-display">
            Campus Infrastructure &amp; Directory
          </h1>
          <p className="mt-1.5 text-sm text-[#475569] max-w-3xl leading-relaxed font-sans">
            Centralized index of Sanaka Educational Trust&apos;s Group of Institutions (SETGOI).
            Explore academic departments, faculty office consultation hours, hostel regulations, bus schedules, 
            24/7 SOS hotlines, and the spatial 3D zone visualizer.
          </p>
        </div>

        {/* Responsive Swiss Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-[#E2E8F0] pt-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-150 border font-sans ${
                  isActive
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
                    : 'bg-white text-[#475569] border-[#E2E8F0] hover:bg-slate-50 hover:text-[#0F172A]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#475569]'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isActive
                        ? 'bg-slate-800 text-slate-200'
                        : 'bg-slate-100 text-[#475569] border border-[#E2E8F0]'
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
