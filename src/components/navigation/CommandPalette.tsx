'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  BookOpen, 
  Calculator, 
  Calendar, 
  MessageSquare, 
  Compass, 
  ExternalLink, 
  ArrowRight, 
  X, 
  Percent, 
  CheckCheck,
  Building2,
  FileText,
  Bot,
  GraduationCap,
  Sparkles
} from 'lucide-react';

export interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Branches' | 'Core Subjects' | 'Engineering Tools' | 'Official Portals';
  href: string;
  isExternal?: boolean;
  code?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const COMMAND_ITEMS: CommandItem[] = [
  // B.Tech Branches
  {
    id: 'branch-cse',
    title: 'Computer Science & Engineering Notes',
    subtitle: 'Semesters 1 – 8 MAKAUT syllabus & notes',
    category: 'Branches',
    href: '/notes?branch=CSE',
    code: 'CSE',
    icon: BookOpen,
  },
  {
    id: 'branch-ece',
    title: 'Electronics & Communication Notes',
    subtitle: 'VLSI, Signals, DSP & IoT curriculum',
    category: 'Branches',
    href: '/notes?branch=ECE',
    code: 'ECE',
    icon: BookOpen,
  },
  {
    id: 'branch-ee',
    title: 'Electrical Engineering Notes',
    subtitle: 'Power Systems, Machines & Circuit Theory',
    category: 'Branches',
    href: '/notes?branch=EE',
    code: 'EE',
    icon: BookOpen,
  },
  {
    id: 'branch-me',
    title: 'Mechanical Engineering Notes',
    subtitle: 'Thermodynamics, Fluid Mechanics & CAD/CAM',
    category: 'Branches',
    href: '/notes?branch=ME',
    code: 'ME',
    icon: BookOpen,
  },
  {
    id: 'branch-ce',
    title: 'Civil Engineering Notes',
    subtitle: 'Structural Analysis, Geotech & Surveying',
    category: 'Branches',
    href: '/notes?branch=CE',
    code: 'CE',
    icon: BookOpen,
  },

  // Core Subjects
  {
    id: 'sub-pcc-cs301',
    title: 'Data Structures & Algorithms',
    subtitle: 'Trees, Graphs, Sorting & Complexity',
    category: 'Core Subjects',
    href: '/notes?branch=CSE&sem=3',
    code: 'PCC-CS301',
    icon: FileText,
  },
  {
    id: 'sub-esc301',
    title: 'Analog & Digital Electronics',
    subtitle: 'Op-Amps, K-Maps & Flip-Flops',
    category: 'Core Subjects',
    href: '/notes?branch=CSE&sem=3',
    code: 'ESC301',
    icon: FileText,
  },
  {
    id: 'sub-pcc-cs302',
    title: 'Computer Organization & Architecture',
    subtitle: 'Pipelining, Cache Memory & ALU Design',
    category: 'Core Subjects',
    href: '/notes?branch=CSE&sem=3',
    code: 'PCC-CS302',
    icon: FileText,
  },
  {
    id: 'sub-bs-m301',
    title: 'Mathematics III (Differential Calculus)',
    subtitle: 'Fourier Series, Laplace & PDE',
    category: 'Core Subjects',
    href: '/notes?branch=CSE&sem=3',
    code: 'BS-M301',
    icon: FileText,
  },
  {
    id: 'sub-pcc-cs401',
    title: 'Discrete Mathematics',
    subtitle: 'Set Theory, Relations, Graph Theory & Combinatorics',
    category: 'Core Subjects',
    href: '/notes?branch=CSE&sem=4',
    code: 'PCC-CS401',
    icon: FileText,
  },
  {
    id: 'sub-pcc-cs501',
    title: 'Compiler Design',
    subtitle: 'Lexical Analysis, Parsers & Code Optimization',
    category: 'Core Subjects',
    href: '/notes?branch=CSE&sem=5',
    code: 'PCC-CS501',
    icon: FileText,
  },
  {
    id: 'sub-pcc-cs502',
    title: 'Operating Systems',
    subtitle: 'Process Scheduling, Deadlocks & Virtual Memory',
    category: 'Core Subjects',
    href: '/notes?branch=CSE&sem=5',
    code: 'PCC-CS502',
    icon: FileText,
  },

  // Engineering Tools
  {
    id: 'tool-viva-studio',
    title: 'AI Viva Studio (Expressive Examiner)',
    subtitle: 'Rapid-fire B.Tech viva in English & Hinglish with live animated feedback',
    category: 'Engineering Tools',
    href: '/viva',
    icon: Sparkles,
  },
  {
    id: 'tool-cockpit',
    title: 'Student Academic Dashboard & Course Roster',
    subtitle: 'Enrolled subjects, upcoming CA assessments & live metrics',
    category: 'Engineering Tools',
    href: '/tools?tab=dashboard',
    icon: GraduationCap,
  },
  {
    id: 'tool-calculator',
    title: 'MAKAUT 10-Point SGPA / CGPA Calculator',
    subtitle: 'Calculate exact semester GPA, % formula & honours status',
    category: 'Engineering Tools',
    href: '/tools?tab=calculator',
    icon: Calculator,
  },
  {
    id: 'tool-attendance',
    title: '75% Attendance Tracker',
    subtitle: 'Calculate required attendance & safe bunk quota for MAKAUT',
    category: 'Engineering Tools',
    href: '/tools?tab=attendance',
    icon: Percent,
  },
  {
    id: 'tool-events',
    title: 'TechFest 2026 & Campus Events Board',
    subtitle: 'Hackathons, cultural fests, workshops & digital pass desk',
    category: 'Engineering Tools',
    href: '/tools?tab=events',
    icon: Sparkles,
  },
  {
    id: 'tool-forum',
    title: 'SETGOI Engineering Discussions & Q&A',
    subtitle: 'Academic queries, DSA code doubts & faculty answers',
    category: 'Engineering Tools',
    href: '/forum',
    icon: MessageSquare,
  },
  {
    id: 'tool-campus-map',
    title: 'SETGOI 3D Campus Explorer & Lab Map',
    subtitle: 'Interactive architectural visualizer & floor directory',
    category: 'Engineering Tools',
    href: '/campus?tab=3d-map',
    icon: Compass,
  },
  {
    id: 'tool-directory',
    title: 'Engineering HOD & Department Directory',
    subtitle: 'Contact Principal, HODs, Exam Cell & Placement Office',
    category: 'Engineering Tools',
    href: '/campus?tab=directory',
    icon: Building2,
  },
  {
    id: 'tool-ai-companion',
    title: 'AI Syllabus & Study Companion',
    subtitle: 'Instant engineering doubt-solver & concept explainer',
    category: 'Engineering Tools',
    href: '/tools?tab=ai-companion',
    icon: Bot,
  },

  // Official Portals
  {
    id: 'portal-icampus',
    title: 'SETGOI iCampus Official Portal',
    subtitle: 'Attendance, semester fees, and internal marks portal',
    category: 'Official Portals',
    href: 'https://icampus.setgoi.ac.in/',
    isExternal: true,
    code: 'Official Portal',
    icon: ExternalLink,
  },
  {
    id: 'portal-makaut-exam',
    title: 'MAKAUT Exam Portal (makautexam.net)',
    subtitle: 'Semester exam forms, admit cards & provisional results',
    category: 'Official Portals',
    href: 'https://makautexam.net/',
    isExternal: true,
    code: 'MAKAUT WB',
    icon: ExternalLink,
  },
  {
    id: 'portal-nptel',
    title: 'NPTEL SWAYAM Engineering Courses',
    subtitle: 'IIT-certified video lectures, lecture notes & assignments',
    category: 'Official Portals',
    href: 'https://nptel.ac.in/',
    isExternal: true,
    code: 'NPTEL',
    icon: ExternalLink,
  },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return COMMAND_ITEMS;
    const q = query.toLowerCase().trim();
    return COMMAND_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        (item.code && item.code.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query]);

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  const handleSelect = (item: CommandItem) => {
    onClose();
    if (item.isExternal) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else {
      router.push(item.href);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#E4E4E7] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-[#E4E4E7] px-4 py-3.5 bg-white">
          <Search className="w-4 h-4 text-[#52525B] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search B.Tech branch, subject code (PCC-CS301), SGPA, attendance, or iCampus..."
            className="w-full text-sm font-sans text-[#09090B] placeholder:text-[#52525B]/70 bg-transparent outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#52525B] hover:text-[#09090B] p-1 text-xs"
              title="Clear input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono text-[#52525B] bg-zinc-100 border border-[#E4E4E7] ml-2">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-zinc-100/60 max-h-[60vh] scrollbar-thin">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-sm font-sans font-medium text-[#09090B]">No matching engineering resources found</p>
              <p className="text-xs font-sans text-[#52525B] mt-1">
                Try searching by branch (`CSE`), code (`CS301`), or tool (`attendance`).
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-xs ${
                    isSelected ? 'bg-blue-50/80 text-[#09090B]' : 'hover:bg-zinc-50 text-[#09090B]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-white text-[#2563EB] border-blue-200 shadow-2xs'
                          : 'bg-zinc-100 text-[#52525B] border-[#E4E4E7]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate font-display">
                          {item.title}
                        </span>
                        {item.code && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white border border-[#E4E4E7] text-[#2563EB] font-bold">
                            {item.code}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-[#52525B] truncate font-sans mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-[#52525B] px-2 py-0.5 rounded-full bg-white border border-[#E4E4E7]">
                      {item.category}
                    </span>
                    {item.isExternal ? (
                      <ExternalLink className="w-3.5 h-3.5 text-[#52525B]" />
                    ) : (
                      <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#2563EB]' : 'text-zinc-300'}`} />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2.5 bg-zinc-50 border-t border-[#E4E4E7] flex items-center justify-between text-[11px] font-mono text-[#52525B]">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-[#E4E4E7]">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-[#E4E4E7]">↵</kbd> Select</span>
          </div>
          <span className="text-[10px] text-zinc-400">SETGOI Engineering Navigator</span>
        </div>
      </div>
    </div>
  );
}
