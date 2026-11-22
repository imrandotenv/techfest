'use client';

import React from 'react';
import { 
  Building2, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';
import { CampusTab } from '../types';
import { PageHeader } from '@/components/PageHeader';

interface CampusHeaderProps {
  activeTab: CampusTab;
  onTabChange: (tab: CampusTab) => void;
  stats: {
    departmentsCount: number;
    facultyCount: number;
    labsCount?: number;
    busRoutesCount: number;
  };
}

export function CampusHeader({ activeTab, onTabChange, stats }: CampusHeaderProps) {
  const tabs: { id: CampusTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: '3d-map', label: '3D Campus Map', icon: MapPin, badge: 'Interactive' },
    { id: 'directory', label: 'Engineering Directory & Desks', icon: Building2, badge: 'B.Tech SETGOI' },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Unified Compact Page Header Strip */}
      <PageHeader
        badge="CAMPUS DIRECTORY"
        badgeCode="SETGOI DURGAPUR"
        title="Engineering Campus & 3D Explorer"
        subtitle="Official B.Tech academic directory for SETGOI Durgapur. Access HOD consultation hours, laboratory complexes, transit schedules, emergency contacts, and the 3D campus visualizer."
        action={
          <a
            href="https://icampus.setgoi.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="sanaka-btn-secondary px-3.5 py-2 text-xs font-mono inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>iCampus ERP</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>
        }
      />

      {/* Tactile Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="inline-flex items-center bg-zinc-100 p-1 rounded-full border border-zinc-200/80 shadow-2xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id || (tab.id === 'directory' && activeTab !== '3d-map');
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold font-sans transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#09090B] shadow-xs border border-zinc-200/80 font-bold'
                    : 'text-[#52525B] hover:text-[#09090B]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2563EB]' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-blue-50 text-[#2563EB] border border-blue-200/50'
                        : 'bg-zinc-200/60 text-zinc-600'
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
