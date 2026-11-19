'use client';

import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Users, 
  Home, 
  Bus, 
  ShieldAlert, 
  MapPin, 
  Search, 
  ArrowRight, 
  ExternalLink,
  SlidersHorizontal,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { 
  DEPARTMENTS, 
  ALL_FACULTY, 
  HOSTELS, 
  BUS_ROUTES, 
  EMERGENCY_CONTACTS, 
  EXTENDED_CAMPUS_ZONES 
} from '../data';
import { CampusTab, UniversalSearchResult } from '../types';
import { CampusHeader } from './CampusHeader';
import { CampusVisualizer3D } from './CampusVisualizer3D';
import { DepartmentDirectory } from './DepartmentDirectory';
import { FacultyDirectory } from './FacultyDirectory';
import { HostelDirectory } from './HostelDirectory';
import { BusTimingsDirectory } from './BusTimingsDirectory';
import { EmergencySosSection } from './EmergencySosSection';

export function CampusDirectoryView() {
  const [activeTab, setActiveTab] = useState<CampusTab>('overview');
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedDeptForFaculty, setSelectedDeptForFaculty] = useState<string | undefined>(undefined);

  // Global search across all datasets
  const universalResults = useMemo<UniversalSearchResult[]>(() => {
    if (!globalSearch.trim()) return [];
    const q = globalSearch.toLowerCase();
    const results: UniversalSearchResult[] = [];

    // Search Departments
    DEPARTMENTS.forEach((d) => {
      if (
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.hodName.toLowerCase().includes(q)
      ) {
        results.push({
          id: d.id,
          title: `${d.code} - ${d.name}`,
          subtitle: `HOD: ${d.hodName} • ${d.locationBuilding}`,
          category: 'Department',
          badge: d.code,
          targetTab: 'departments',
          actionPayload: d.code,
        });
      }
    });

    // Search Faculty
    ALL_FACULTY.forEach((f) => {
      if (
        f.fullName.toLowerCase().includes(q) ||
        f.departmentCode.toLowerCase().includes(q) ||
        f.officeRoom.toLowerCase().includes(q) ||
        f.researchInterests.some((r) => r.toLowerCase().includes(q))
      ) {
        results.push({
          id: f.id,
          title: f.fullName,
          subtitle: `${f.designation} (${f.departmentCode}) • ${f.officeRoom}`,
          category: 'Faculty',
          badge: f.departmentCode,
          targetTab: 'faculty',
          actionPayload: f.departmentCode,
        });
      }
    });

    // Search Hostels
    HOSTELS.forEach((h) => {
      if (
        h.name.toLowerCase().includes(q) ||
        h.gender.toLowerCase().includes(q) ||
        h.wardenName.toLowerCase().includes(q)
      ) {
        results.push({
          id: h.id,
          title: h.name,
          subtitle: `Warden: ${h.wardenName} • Curfew: ${h.curfewTime}`,
          category: 'Hostel',
          badge: `${h.gender} Hall`,
          targetTab: 'hostels',
        });
      }
    });

    // Search Bus Stops
    BUS_ROUTES.forEach((r) => {
      r.stops.forEach((st) => {
        if (st.stopName.toLowerCase().includes(q)) {
          results.push({
            id: `${r.id}-${st.stopName}`,
            title: st.stopName,
            subtitle: `${r.routeNumber} • Pickup ${st.timeMorning} / Drop ${st.timeEvening}`,
            category: 'Bus Stop',
            badge: r.routeNumber,
            targetTab: 'buses',
          });
        }
      });
    });

    // Search Emergency
    EMERGENCY_CONTACTS.forEach((em) => {
      if (
        em.service.toLowerCase().includes(q) ||
        em.department.toLowerCase().includes(q) ||
        em.phone.includes(q)
      ) {
        results.push({
          id: em.id,
          title: em.service,
          subtitle: `${em.phone} • ${em.availableHours}`,
          category: 'Emergency SOS',
          badge: '24/7',
          targetTab: 'emergency',
        });
      }
    });

    // Search 3D Zones
    EXTENDED_CAMPUS_ZONES.forEach((z) => {
      if (
        z.name.toLowerCase().includes(q) ||
        z.tag.toLowerCase().includes(q) ||
        z.departmentsHoused.some((dh) => dh.toLowerCase().includes(q))
      ) {
        results.push({
          id: z.id,
          title: z.name,
          subtitle: `${z.tag} • ${z.levels} Levels`,
          category: 'Campus Zone',
          badge: '3D Map',
          targetTab: '3d-map',
        });
      }
    });

    return results.slice(0, 8); // Top 8 matches
  }, [globalSearch]);

  const handleSelectSearchResult = (result: UniversalSearchResult) => {
    setActiveTab(result.targetTab);
    if (result.category === 'Faculty' && result.actionPayload) {
      setSelectedDeptForFaculty(result.actionPayload);
    }
    setGlobalSearch('');
  };

  const handleSelectDeptFaculty = (deptCode: string) => {
    setSelectedDeptForFaculty(deptCode);
    setActiveTab('faculty');
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-[#0F172A] pb-24">
      {/* Swiss Clean Header with Tabs */}
      <CampusHeader
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'faculty') {
            setSelectedDeptForFaculty(undefined);
          }
        }}
        stats={{
          departmentsCount: DEPARTMENTS.length,
          facultyCount: ALL_FACULTY.length,
          hostelsCount: HOSTELS.length,
          busRoutesCount: BUS_ROUTES.length,
        }}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Universal Global Search Bar */}
        <div className="relative">
          <div className="flex items-center gap-2 p-2.5 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
            <Search className="w-4 h-4 text-[#475569] ml-2 shrink-0" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Universal Campus Search: type faculty, department code, bus stop, hostel, or emergency..."
              className="w-full text-xs sm:text-sm bg-transparent border-none text-[#0F172A] placeholder-[#475569]/60 focus:outline-hidden font-sans"
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="text-xs font-mono text-[#475569] hover:text-[#0F172A] px-2 shrink-0"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Dropdown Modal/Pill list */}
          {globalSearch.trim() && (
            <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg overflow-hidden divide-y divide-[#E2E8F0]/80">
              <div className="px-3 py-2 bg-slate-50 text-[10px] font-mono uppercase text-[#475569] font-semibold flex items-center justify-between">
                <span>Universal Matching Results ({universalResults.length})</span>
                <span>Click to jump</span>
              </div>
              {universalResults.length === 0 ? (
                <div className="p-4 text-xs text-[#475569] text-center font-sans">
                  No records matching &quot;{globalSearch}&quot; found in SETGOI directory.
                </div>
              ) : (
                universalResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSearchResult(item)}
                    className="w-full p-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-[#0F172A] flex items-center gap-2 font-display">
                        <span>{item.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 border border-[#E2E8F0] text-[#0F172A]">
                          {item.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#475569] font-mono mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-mono text-[#2563EB] shrink-0">
                      <span>{item.category}</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Dynamic Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick 3D Map Preview Banner */}
            <div className="p-5 bg-white border border-[#E2E8F0] rounded-xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-50 text-[#2563EB] border border-blue-200 font-semibold mb-1 inline-block">
                  Spatial Interactive Visualization
                </span>
                <h3 className="text-base font-bold text-[#0F172A] tracking-tight font-display">
                  SETGOI 3D Digital Twin &amp; Campus Explorer
                </h3>
                <p className="text-xs text-[#475569] mt-0.5 max-w-xl font-sans">
                  Interactive real-time spatial visualizer modeled after the actual SETGOI Durgapur infrastructure: 
                  6-level U-shaped academic core, portico gates, transit bays, and residential zones.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('3d-map')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-mono font-medium transition-colors shrink-0 shadow-2xs"
              >
                <span>Launch Full 3D Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Embedded 3D Map in Overview */}
            <CampusVisualizer3D onSelectDepartment={handleSelectDeptFaculty} />

            {/* Quick Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Departments Quick Box */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 rounded-lg bg-slate-100 border border-[#E2E8F0] text-[#0F172A]">
                      <Building2 className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-mono font-semibold text-[#0F172A] bg-slate-50 px-2 py-0.5 rounded border border-[#E2E8F0]">
                      {DEPARTMENTS.length} Depts
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-[#0F172A] mb-1 font-display">Academic Departments</h4>
                  <p className="text-xs text-[#475569] leading-relaxed mb-3 font-sans">
                    CSE, ECE, Electrical, Mechanical, Civil Engineering, and Sanaka Institute of Pharmacy.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('departments')}
                  className="inline-flex items-center gap-1 text-xs font-mono font-medium text-[#2563EB] hover:text-[#1D4ED8] pt-2 border-t border-[#E2E8F0]"
                >
                  <span>Explore All Departments</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Faculty Quick Box */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 rounded-lg bg-slate-100 border border-[#E2E8F0] text-[#0F172A]">
                      <Users className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-mono font-semibold text-[#0F172A] bg-slate-50 px-2 py-0.5 rounded border border-[#E2E8F0]">
                      {ALL_FACULTY.length} Faculty
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-[#0F172A] mb-1 font-display">Faculty Directory</h4>
                  <p className="text-xs text-[#475569] leading-relaxed mb-3 font-sans">
                    Office cabins, consultation hours, research domains, email contacts, and phone extensions.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('faculty')}
                  className="inline-flex items-center gap-1 text-xs font-mono font-medium text-[#2563EB] hover:text-[#1D4ED8] pt-2 border-t border-[#E2E8F0]"
                >
                  <span>Search Faculty Profiles</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Hostels & Mess Quick Box */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 rounded-lg bg-slate-100 border border-[#E2E8F0] text-[#0F172A]">
                      <Home className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-mono font-semibold text-[#0F172A] bg-slate-50 px-2 py-0.5 rounded border border-[#E2E8F0]">
                      {HOSTELS.length} Halls
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-[#0F172A] mb-1 font-display">Hostels &amp; Mess Timings</h4>
                  <p className="text-xs text-[#475569] leading-relaxed mb-3 font-sans">
                    Aryabhatta (Boys) &amp; Kalpana Chawla (Girls) halls, biometric curfews, warden numbers, and meal tables.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('hostels')}
                  className="inline-flex items-center gap-1 text-xs font-mono font-medium text-[#2563EB] hover:text-[#1D4ED8] pt-2 border-t border-[#E2E8F0]"
                >
                  <span>View Hostel Rules &amp; Mess</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Bus Routes Quick Box */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 rounded-lg bg-slate-100 border border-[#E2E8F0] text-[#0F172A]">
                      <Bus className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-mono font-semibold text-[#0F172A] bg-slate-50 px-2 py-0.5 rounded border border-[#E2E8F0]">
                      {BUS_ROUTES.length} Routes
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-[#0F172A] mb-1 font-display">Bus Transit Schedule</h4>
                  <p className="text-xs text-[#475569] leading-relaxed mb-3 font-sans">
                    Daily shuttle routes covering Asansol, Raniganj, Andal, and Durgapur Station to campus.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('buses')}
                  className="inline-flex items-center gap-1 text-xs font-mono font-medium text-[#2563EB] hover:text-[#1D4ED8] pt-2 border-t border-[#E2E8F0]"
                >
                  <span>Check Bus Timetable</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* 24/7 SOS Hotlines Quick Box */}
              <div className="bg-white border border-red-200 rounded-xl p-5 shadow-xs flex flex-col justify-between md:col-span-2">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 rounded-lg bg-red-100 border border-red-200 text-red-700">
                      <ShieldAlert className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      24/7 Hotlines
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-[#0F172A] mb-1 font-display">Emergency SOS &amp; Campus Security</h4>
                  <p className="text-xs text-[#475569] leading-relaxed mb-3 font-sans">
                    Instant access to Campus Medical Centre ambulance (+91 94340 00001), Main Gate Security (+91 94340 00002), and Anti-Ragging Hotline (1800-180-5522).
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('emergency')}
                  className="inline-flex items-center gap-1 text-xs font-mono font-medium text-red-600 hover:text-red-700 pt-2 border-t border-[#E2E8F0]"
                >
                  <span>View All SOS Emergency Desks</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === '3d-map' && (
          <CampusVisualizer3D onSelectDepartment={handleSelectDeptFaculty} />
        )}

        {activeTab === 'departments' && (
          <div className="space-y-10">
            <DepartmentDirectory
              departments={DEPARTMENTS}
              faculty={ALL_FACULTY}
              onSelectDepartmentFaculty={handleSelectDeptFaculty}
            />
            <div className="pt-6 border-t border-[#E2E8F0]">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-[#0F172A] tracking-tight font-display">Faculty Directory</h3>
                <p className="text-xs text-[#475569] font-mono">Office rooms, designations, consultation hours &amp; email contacts</p>
              </div>
              <FacultyDirectory
                faculty={ALL_FACULTY}
                selectedDepartmentCode={selectedDeptForFaculty}
                onClearDepartmentFilter={() => setSelectedDeptForFaculty(undefined)}
              />
            </div>
          </div>
        )}

        {activeTab === 'hostel-bus' && (
          <div className="space-y-10">
            <HostelDirectory hostels={HOSTELS} />
            <div className="pt-6 border-t border-[#E2E8F0]">
              <BusTimingsDirectory busRoutes={BUS_ROUTES} />
            </div>
          </div>
        )}

        {(activeTab === 'contacts' || activeTab === 'emergency') && (
          <EmergencySosSection emergencyContacts={EMERGENCY_CONTACTS} />
        )}

        {activeTab === 'faculty' && (
          <FacultyDirectory
            faculty={ALL_FACULTY}
            selectedDepartmentCode={selectedDeptForFaculty}
            onClearDepartmentFilter={() => setSelectedDeptForFaculty(undefined)}
          />
        )}

        {activeTab === 'hostels' && (
          <HostelDirectory hostels={HOSTELS} />
        )}

        {activeTab === 'buses' && (
          <BusTimingsDirectory busRoutes={BUS_ROUTES} />
        )}
      </div>
    </div>
  );
}
