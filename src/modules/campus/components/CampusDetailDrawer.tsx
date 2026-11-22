'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  Users, 
  Home, 
  Bus, 
  ShieldAlert, 
  PhoneCall, 
  Phone, 
  MapPin, 
  Clock, 
  Check, 
  Copy, 
  Search, 
  ArrowRight,
  FlaskConical,
  Wrench,
  Cpu
} from 'lucide-react';
import { 
  DEPARTMENTS, 
  ALL_FACULTY, 
  ENGINEERING_LABS, 
  BUS_ROUTES, 
  EMERGENCY_CONTACTS 
} from '../data';

export type CampusDrawerType = 
  | 'departments' 
  | 'faculty' 
  | 'labs' 
  | 'buses' 
  | 'emergency' 
  | 'helplines' 
  | null;

interface CampusDetailDrawerProps {
  type: CampusDrawerType;
  onClose: () => void;
  onSelectDepartmentFaculty?: (deptCode: string) => void;
}

export function CampusDetailDrawer({
  type,
  onClose,
  onSelectDepartmentFaculty,
}: CampusDetailDrawerProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && type) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [type, onClose]);

  if (!type) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getHeaderMeta = () => {
    switch (type) {
      case 'departments':
        return {
          title: 'Academic Departments',
          subtitle: '5 MAKAUT accredited B.Tech engineering degree programs (CSE, ECE, EE, ME, CE)',
          icon: Building2,
          badge: `${DEPARTMENTS.length} B.Tech Depts`,
          badgeColor: 'bg-blue-50 text-[#2563EB] border-blue-200',
        };
      case 'faculty':
        return {
          title: 'Faculty Directory',
          subtitle: 'Office cabins, consultation timings, research domains & contacts',
          icon: Users,
          badge: `${ALL_FACULTY.length} Faculty Profiles`,
          badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'labs':
        return {
          title: 'B.Tech Engineering Labs & Workshops',
          subtitle: 'Advanced computing hubs, IoT testbeds, electrical motor bays, and CNC workshops',
          icon: FlaskConical,
          badge: `${ENGINEERING_LABS.length} Laboratories`,
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'buses':
        return {
          title: 'Bus Transit Schedule',
          subtitle: 'Daily student & staff shuttle routes across Asansol, Raniganj & Andal',
          icon: Bus,
          badge: `${BUS_ROUTES.length} Shuttle Routes`,
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'emergency':
        return {
          title: 'Emergency SOS & Campus Security',
          subtitle: '24/7 on-campus first-aid ambulance & main security checkpost',
          icon: ShieldAlert,
          badge: '24/7 Priority Emergency',
          badgeColor: 'bg-red-50 text-red-700 border-red-200',
        };
      case 'helplines':
        return {
          title: '24/7 Helplines & Student Welfare',
          subtitle: 'Anti-Ragging toll-free, women safety cell & mental counselling',
          icon: PhoneCall,
          badge: 'Zero Tolerance Welfare',
          badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
        };
    }
  };

  const meta = getHeaderMeta();
  const Icon = meta.icon;

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="campus-drawer-title"
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-[#E2E8F0] animate-in slide-in-from-right duration-250 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F172A] flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="campus-drawer-title" className="text-base sm:text-lg font-bold text-[#0F172A] font-display">
                  {meta.title}
                </h2>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${meta.badgeColor}`}>
                  {meta.badge}
                </span>
              </div>
              <p className="text-xs text-[#475569] font-sans mt-0.5">
                {meta.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Search Filter (for faculty/departments) */}
        {(type === 'faculty' || type === 'departments') && (
          <div className="px-6 py-3 border-b border-[#E2E8F0] bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={type === 'faculty' ? 'Search faculty by name, department, or cabin...' : 'Search department by name or code...'}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] placeholder:text-[#475569]/60 focus:outline-hidden focus:bg-white focus:border-[#0F172A] transition-colors"
              />
            </div>
          </div>
        )}

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans text-xs">
          
          {/* DEPARTMENTS VIEW */}
          {type === 'departments' && (
            <div className="space-y-4">
              {DEPARTMENTS.filter(
                (d) =>
                  !searchQuery.trim() ||
                  d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  d.hodName.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((dept) => (
                <div 
                  key={dept.id}
                  className="bg-white border border-[#E2E8F0] rounded-xl p-4 hover:border-slate-300 transition-all shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#0F172A] text-white">
                          {dept.code}
                        </span>
                        <h3 className="text-sm font-bold text-[#0F172A] font-display">
                          {dept.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[#475569] mt-1 font-sans">
                        {dept.description}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-[#475569] bg-slate-50 border border-[#E2E8F0] px-2 py-0.5 rounded shrink-0">
                      Intake: {dept.intakeCapacity} / yr
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono bg-slate-50/80 p-2.5 rounded-lg border border-[#E2E8F0]">
                    <div>
                      <span className="text-[#475569]">HOD:</span>{' '}
                      <strong className="text-[#0F172A]">{dept.hodName}</strong>
                    </div>
                    <div>
                      <span className="text-[#475569]">Location:</span>{' '}
                      <span className="text-[#0F172A]">{dept.locationBuilding}</span>
                    </div>
                    <div>
                      <span className="text-[#475569]">HOD Contact:</span>{' '}
                      <span className="text-[#2563EB]">{dept.hodEmail}</span>
                    </div>
                    <div>
                      <span className="text-[#475569]">Affiliation:</span>{' '}
                      <span className="text-[#0F172A]">MAKAUT Kolkata (Est. {dept.establishedYear})</span>
                    </div>
                  </div>

                  {onSelectDepartmentFaculty && (
                    <div className="pt-2 border-t border-[#E2E8F0] flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectDepartmentFaculty(dept.code);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:underline cursor-pointer"
                      >
                        <span>View {dept.code} Faculty Cabins &amp; Timings</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* FACULTY DIRECTORY VIEW */}
          {type === 'faculty' && (
            <div className="space-y-3.5">
              {ALL_FACULTY.filter(
                (f) =>
                  !searchQuery.trim() ||
                  f.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  f.departmentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  f.officeRoom.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((fac) => (
                <div 
                  key={fac.id}
                  className="bg-white border border-[#E2E8F0] rounded-xl p-4 hover:border-slate-300 transition-all shadow-2xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-[#0F172A] border border-[#E2E8F0]">
                          {fac.departmentCode}
                        </span>
                        <h3 className="text-sm font-bold text-[#0F172A] font-display">
                          {fac.fullName}
                        </h3>
                      </div>
                      <p className="text-xs text-[#2563EB] font-medium font-sans mt-0.5">
                        {fac.designation}
                      </p>
                    </div>

                    <span className="text-[11px] font-mono bg-slate-50 border border-[#E2E8F0] px-2 py-0.5 rounded text-[#475569] shrink-0">
                      {fac.officeRoom}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-[#475569] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#475569]" />
                    <span>Office Hours: {fac.officeHours}</span>
                  </div>

                  {fac.researchInterests && fac.researchInterests.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {fac.researchInterests.map((r, rIdx) => (
                        <span 
                          key={rIdx}
                          className="text-[10px] font-sans bg-slate-50 border border-[#E2E8F0] px-2 py-0.5 rounded text-[#475569]"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono text-[#475569] text-[11px] truncate">
                        {fac.email}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(fac.email, fac.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 border border-[#E2E8F0] text-[#0F172A] text-[11px] font-mono cursor-pointer transition-colors"
                      >
                        {copiedKey === fac.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-[#475569]" />
                            <span>Copy Email</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[#52525B] bg-zinc-50 p-2 rounded-lg border border-zinc-200/80">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-zinc-400" />
                        <span className="text-zinc-500">Phone:</span>
                        <span className="text-zinc-700 font-medium">{fac.phone || 'Contact via Dept. Office / Admin Editable'}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-sans">Official Record</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* B.TECH ENGINEERING LABS & WORKSHOPS VIEW */}
          {type === 'labs' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-start gap-2">
                <FlaskConical className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">MAKAUT Accredited Engineering Laboratories</strong>
                  <p className="text-[11px] leading-relaxed mt-0.5">
                    Laboratories are equipped with high-spec equipment, workstations, and safety apparatus for B.Tech academic practicals and research.
                  </p>
                </div>
              </div>

              {ENGINEERING_LABS.map((lab) => (
                <div 
                  key={lab.id}
                  className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-2xs space-y-3.5 hover:border-[#2563EB]/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-200">
                          {lab.department}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#0F172A] font-display mt-1">
                        {lab.name}
                      </h3>
                      <p className="text-xs text-[#475569] mt-0.5 font-mono flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{lab.roomNumber}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-[#475569] block">Faculty In-Charge:</span>
                      <strong className="text-xs text-[#0F172A] block">{lab.inCharge}</strong>
                      <span className="text-[11px] font-mono text-[#2563EB]">{lab.contact}</span>
                    </div>
                  </div>

                  {/* Equipment Chips */}
                  <div className="pt-2 border-t border-[#E2E8F0]">
                    <span className="text-[10px] font-mono uppercase text-[#475569] font-semibold block mb-1.5">
                      Key Equipment & Workstations:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {lab.equipment.map((eq: string, idx: number) => (
                        <span 
                          key={idx}
                          className="text-[11px] font-mono bg-slate-50 border border-[#E2E8F0] px-2.5 py-1 rounded text-[#0F172A]"
                        >
                          ⚙ {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* BUS TRANSIT SCHEDULE VIEW */}
          {type === 'buses' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                <Bus className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Campus Fleet Service Advisory</strong>
                  <p className="text-[11px] leading-relaxed mt-0.5">
                    SETGOI buses operate on college working days and exam schedules. Show student ID pass at entry. Transport Supervisor Desk: +91 94340 12399.
                  </p>
                </div>
              </div>

              {BUS_ROUTES.map((route) => (
                <div 
                  key={route.id}
                  className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#0F172A] text-white">
                        {route.routeNumber}
                      </span>
                      <h3 className="text-sm font-bold text-[#0F172A] font-display">
                        {route.routeName}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-[#475569] bg-slate-50 border border-[#E2E8F0] px-2 py-0.5 rounded">
                      Bus: {route.busNumber}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-[#475569] flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-[#E2E8F0]">
                    <span>Driver: <strong className="text-[#0F172A]">{route.driverName}</strong></span>
                    <span>Contact: <strong className="text-[#2563EB]">{route.driverContact}</strong></span>
                  </div>

                  {/* Stops Timeline */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono uppercase text-[#475569] font-semibold block">
                      Stops &amp; Pickup / Drop Timetable:
                    </span>
                    <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-lg overflow-hidden text-[11px]">
                      {route.stops.map((stop, sIdx) => (
                        <div key={sIdx} className="p-2 flex items-center justify-between hover:bg-slate-50">
                          <span className="font-medium text-[#0F172A] flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-[#2563EB]" />
                            {stop.stopName}
                          </span>
                          <span className="font-mono text-[#475569]">
                            Morning: <strong className="text-[#0F172A]">{stop.timeMorning}</strong> • Return: {stop.timeEvening}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EMERGENCY SOS & CAMPUS SECURITY VIEW */}
          {type === 'emergency' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>Immediate Campus First-Aid &amp; Emergency Action</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  The SETGOI Emergency Health Post is located at the Main Administration Complex with 24/7 on-duty attendant, basic life support response, and emergency first-aid station.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {EMERGENCY_CONTACTS.map((em) => (
                  <div 
                    key={em.id}
                    className="p-4 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <h4 className="text-sm font-bold text-[#0F172A] font-display">
                          {em.service}
                        </h4>
                      </div>
                      <p className="text-xs text-[#475569] mt-0.5 font-sans">
                        {em.department} • {em.location}
                      </p>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded mt-1.5 inline-block font-semibold">
                        Available: {em.availableHours}
                      </span>
                    </div>

                    <a
                      href={`tel:${em.phone.replace(/[^0-9+]/g, '')}`}
                      className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold inline-flex items-center gap-1.5 shrink-0 shadow-2xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{em.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 24/7 HELPLINES & STUDENT WELFARE VIEW */}
          {type === 'helplines' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 text-xs">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <PhoneCall className="w-4 h-4 text-[#2563EB]" />
                  <span>Statutory Anti-Ragging &amp; Student Rights Protection</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  SETGOI maintains strict zero tolerance towards ragging or harassment. Confidential complaints can be logged directly with faculty mentors or the national statutory hotline.
                </p>
              </div>

              <div className="space-y-3">
                {/* National Anti-Ragging Helpline */}
                <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded font-bold">
                        National Statutory Desk
                      </span>
                      <h4 className="text-sm font-bold text-[#0F172A] mt-1 font-display">
                        National Anti-Ragging Helpline (UGC / MAKAUT)
                      </h4>
                      <p className="text-xs text-[#475569] font-sans">
                        24x7 Toll-Free National Hotline • Immediate Intervention
                      </p>
                    </div>
                    <a
                      href="tel:18001805522"
                      className="px-3 py-1.5 rounded-lg bg-[#0F172A] text-white font-mono text-xs font-bold hover:bg-slate-800 transition-colors shrink-0"
                    >
                      1800-180-5522
                    </a>
                  </div>
                </div>

                {/* Women's Safety & Internal Complaints Committee */}
                <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded font-bold">
                        Campus Welfare
                      </span>
                      <h4 className="text-sm font-bold text-[#0F172A] mt-1 font-display">
                        Women&apos;s Safety &amp; Internal Complaints Cell (ICC)
                      </h4>
                      <p className="text-xs text-[#475569] font-sans">
                        Presiding Officer: Prof. Sangeeta Mitra • Confidential Desk
                      </p>
                    </div>
                    <a
                      href="tel:+919434012312"
                      className="px-3 py-1.5 rounded-lg bg-purple-700 text-white font-mono text-xs font-bold hover:bg-purple-800 transition-colors shrink-0"
                    >
                      +91 94340 12312
                    </a>
                  </div>
                </div>

                {/* Student Mental Health & Psychological Counselling */}
                <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                        Wellbeing &amp; Guidance
                      </span>
                      <h4 className="text-sm font-bold text-[#0F172A] mt-1 font-display">
                        Student Mental Health &amp; Psychological Support
                      </h4>
                      <p className="text-xs text-[#475569] font-sans">
                        Certified Campus Counselor • 1-on-1 Confidential Sessions
                      </p>
                    </div>
                    <a
                      href="tel:+919434000005"
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-mono text-xs font-bold hover:bg-emerald-800 transition-colors shrink-0"
                    >
                      +91 94340 00005
                    </a>
                  </div>
                </div>

                {/* Student Grievance Redressal Portal */}
                <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase bg-blue-50 text-[#2563EB] border border-blue-200 px-1.5 py-0.5 rounded font-bold">
                        Academic Affairs
                      </span>
                      <h4 className="text-sm font-bold text-[#0F172A] mt-1 font-display">
                        Student Grievance Redressal Committee (SGRC)
                      </h4>
                      <p className="text-xs text-[#475569] font-sans">
                        Dean of Student Affairs Office • Main Academic Building Level 2
                      </p>
                    </div>
                    <span className="font-mono text-xs text-[#2563EB] font-bold">
                      grievance@setgoi.ac.in
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-3 border-t border-[#E2E8F0] bg-slate-50/70 flex items-center justify-between text-xs text-[#475569]">
          <span className="font-mono text-[11px]">
            SETGOI Durgapur • Official Campus Information Service
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] text-[#0F172A] hover:bg-slate-100 transition-colors font-medium font-sans cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}