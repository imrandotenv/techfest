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
  ArrowUpRight,
  PhoneCall,
  Maximize2,
  X
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
import { CampusDetailDrawer, CampusDrawerType } from './CampusDetailDrawer';

export function CampusDirectoryView() {
  const [activeTab, setActiveTab] = useState<CampusTab>('overview');
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedDeptForFaculty, setSelectedDeptForFaculty] = useState<string | undefined>(undefined);
  const [activeDrawer, setActiveDrawer] = useState<CampusDrawerType>(null);
  const [isFull3DModalOpen, setIsFull3DModalOpen] = useState(false);

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
            {/* Architectural Grid 3D Map Preview Banner */}
            <div className="relative overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-xs">
              {/* Blueprint Grid Watermark Background */}
              <div 
                className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#0F172A_1px,transparent_1px)] [background-size:16px_16px]" 
                aria-hidden="true" 
              />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-50 text-[#2563EB] border border-blue-200 font-semibold tracking-wider inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                      LOD-300 Architectural Grid
                    </span>
                    <span className="text-[11px] font-mono text-[#475569] bg-slate-50 px-2 py-0.5 rounded border border-[#E2E8F0]">
                      23°31&apos;48.2&quot;N 87°18&apos;22.1&quot;E • 74m ASL
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight font-display">
                    SETGOI 3D Digital Twin &amp; Campus Explorer
                  </h3>

                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed max-w-2xl font-sans">
                    Spatial multi-level visualizer modeled directly on SETGOI Durgapur infrastructure: 
                    6-level U-shaped academic core, departmental lab wings (CSE, ECE, EE, ME, CE), central portico, and transit corridors.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsFull3DModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-mono font-medium transition-colors shadow-2xs cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Launch Full 3D Map</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Embedded 3D Map in Overview */}
            <CampusVisualizer3D onSelectDepartment={handleSelectDeptFaculty} />

            {/* 6 Equal-Height Directory Cards in 3x2 Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] font-display">
                    Campus Directory &amp; Fast Resource Desks
                  </h3>
                  <p className="text-xs text-[#475569] font-mono mt-0.5">
                    Click any resource card below to open its dedicated quick-access drawer
                  </p>
                </div>
                <span className="text-xs font-mono text-[#475569] hidden sm:inline-block">
                  6 Desks Verified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 1. Academic Departments */}
                <div 
                  onClick={() => setActiveDrawer('departments')}
                  className="group bg-white border border-[#E2E8F0] hover:border-[#2563EB]/40 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all cursor-pointer h-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-50 group-hover:text-[#2563EB] border border-[#E2E8F0] text-[#0F172A] transition-colors">
                        <Building2 className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-mono font-semibold text-[#0F172A] bg-slate-50 px-2 py-0.5 rounded border border-[#E2E8F0]">
                        {DEPARTMENTS.length} Depts
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-[#0F172A] mb-1 font-display group-hover:text-[#2563EB] transition-colors">
                      Academic Departments
                    </h4>
                    <p className="text-xs text-[#475569] leading-relaxed mb-4 font-sans">
                      CSE, ECE, Electrical, Mechanical, Civil Engineering, and Sanaka Institute of Pharmacy.
                    </p>
                  </div>
                  <div className="inline-flex items-center justify-between text-xs font-mono font-medium text-[#2563EB] pt-3 border-t border-[#E2E8F0]">
                    <span>View All Departments</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* 2. Faculty Directory */}
                <div 
                  onClick={() => setActiveDrawer('faculty')}
                  className="group bg-white border border-[#E2E8F0] hover:border-[#2563EB]/40 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all cursor-pointer h-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-50 group-hover:text-[#2563EB] border border-[#E2E8F0] text-[#0F172A] transition-colors">
                        <Users className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-mono font-semibold text-[#0F172A] bg-slate-50 px-2 py-0.5 rounded border border-[#E2E8F0]">
                        {ALL_FACULTY.length} Faculty
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-[#0F172A] mb-1 font-display group-hover:text-[#2563EB] transition-colors">
                      Faculty Directory
                    </h4>
                    <p className="text-xs text-[#475569] leading-relaxed mb-4 font-sans">
                      Office cabins, consultation hours, research domains, email contacts, and phone extensions.
                    </p>
                  </div>
                  <div className="inline-flex items-center justify-between text-xs font-mono font-medium text-[#2563EB] pt-3 border-t border-[#E2E8F0]">
                    <span>Search Faculty Profiles</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* 3. Hostels & Mess Timings */}
                <div 
                  onClick={() => setActiveDrawer('hostels')}
                  className="group bg-white border border-[#E2E8F0] hover:border-[#2563EB]/40 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all cursor-pointer h-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-50 group-hover:text-[#2563EB] border border-[#E2E8F0] text-[#0F172A] transition-colors">
                        <Home className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-mono font-semibold text-[#0F172A] bg-slate-50 px-2 py-0.5 rounded border border-[#E2E8F0]">
                        {HOSTELS.length} Halls
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-[#0F172A] mb-1 font-display group-hover:text-[#2563EB] transition-colors">
                      Hostels &amp; Mess Timings
                    </h4>
                    <p className="text-xs text-[#475569] leading-relaxed mb-4 font-sans">
                      Aryabhatta (Boys) &amp; Kalpana Chawla (Girls) halls, biometric curfews, warden numbers, and meal tables.
                    </p>
                  </div>
                  <div className="inline-flex items-center justify-between text-xs font-mono font-medium text-[#2563EB] pt-3 border-t border-[#E2E8F0]">
                    <span>View Hostel &amp; Mess Rules</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* 4. Bus Transit Schedule */}
                <div 
                  onClick={() => setActiveDrawer('buses')}
                  className="group bg-white border border-[#E2E8F0] hover:border-[#2563EB]/40 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all cursor-pointer h-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-50 group-hover:text-[#2563EB] border border-[#E2E8F0] text-[#0F172A] transition-colors">
                        <Bus className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-mono font-semibold text-[#0F172A] bg-slate-50 px-2 py-0.5 rounded border border-[#E2E8F0]">
                        {BUS_ROUTES.length} Routes
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-[#0F172A] mb-1 font-display group-hover:text-[#2563EB] transition-colors">
                      Bus Transit Schedule
                    </h4>
                    <p className="text-xs text-[#475569] leading-relaxed mb-4 font-sans">
                      Daily shuttle routes covering Asansol, Raniganj, Andal, and Durgapur Station to campus.
                    </p>
                  </div>
                  <div className="inline-flex items-center justify-between text-xs font-mono font-medium text-[#2563EB] pt-3 border-t border-[#E2E8F0]">
                    <span>Check Bus Timetable</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* 5. Emergency SOS & Campus Security */}
                <div 
                  onClick={() => setActiveDrawer('emergency')}
                  className="group bg-white border border-rose-200 hover:border-rose-300 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all cursor-pointer h-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600">
                        <ShieldAlert className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Immediate SOS
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-[#0F172A] mb-1 font-display group-hover:text-rose-600 transition-colors">
                      Emergency SOS &amp; Security
                    </h4>
                    <p className="text-xs text-[#475569] leading-relaxed mb-4 font-sans">
                      Campus Medical Centre ambulance (+91 94340 00001), Main Gate Security (+91 94340 00002), and hospital link.
                    </p>
                  </div>
                  <div className="inline-flex items-center justify-between text-xs font-mono font-medium text-rose-600 pt-3 border-t border-rose-100">
                    <span>Emergency SOS Contacts</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* 6. 24/7 Helplines */}
                <div 
                  onClick={() => setActiveDrawer('helplines')}
                  className="group bg-white border border-[#E2E8F0] hover:border-[#2563EB]/40 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all cursor-pointer h-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-50 group-hover:text-[#2563EB] border border-[#E2E8F0] text-[#0F172A] transition-colors">
                        <PhoneCall className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-mono font-semibold text-[#0F172A] bg-slate-50 px-2 py-0.5 rounded border border-[#E2E8F0]">
                        24/7 Toll-Free
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-[#0F172A] mb-1 font-display group-hover:text-[#2563EB] transition-colors">
                      24/7 Helplines &amp; Support
                    </h4>
                    <p className="text-xs text-[#475569] leading-relaxed mb-4 font-sans">
                      UGC Anti-Ragging toll-free desk (1800-180-5522), Women&apos;s Safety Cell, and Student Grievance desks.
                    </p>
                  </div>
                  <div className="inline-flex items-center justify-between text-xs font-mono font-medium text-[#2563EB] pt-3 border-t border-[#E2E8F0]">
                    <span>View 24/7 Helplines</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
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

      {/* Slide-over Fast Resource Detail Drawer */}
      <CampusDetailDrawer
        type={activeDrawer}
        onClose={() => setActiveDrawer(null)}
        onSelectDepartmentFaculty={(deptCode) => {
          setActiveDrawer(null);
          handleSelectDeptFaculty(deptCode);
        }}
      />

      {/* Full Immersion 3D Map Modal */}
      {isFull3DModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Bar */}
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm sm:text-base text-[#0F172A]">
                    SETGOI 3D Digital Twin &amp; Campus Explorer
                  </h3>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-200 font-semibold">
                    Full CAD View
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#475569] mt-0.5">
                  23°31&apos;48.2&quot;N 87°18&apos;22.1&quot;E • Sanaka Educational Trust Group of Institutions
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsFull3DModalOpen(false);
                    setActiveTab('3d-map');
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-mono text-[#0F172A] transition-colors"
                >
                  <span>Open as Tab</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#475569]" />
                </button>
                <button
                  onClick={() => setIsFull3DModalOpen(false)}
                  className="p-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-100 text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
                  aria-label="Close Full 3D Map Modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(92vh-70px)]">
              <CampusVisualizer3D
                onSelectDepartment={(deptCode) => {
                  setIsFull3DModalOpen(false);
                  handleSelectDeptFaculty(deptCode);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
