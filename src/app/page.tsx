import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { QuickSearchBar } from '@/components/landing/QuickSearchBar';
import { CampusPreviewCard } from '@/components/landing/CampusPreviewCard';

export const metadata = {
  title: 'SanakaHub | Centralized SETGOI Student Portal',
  description:
    'MAKAUT notes, past papers, student Q&A, and campus info for Sanaka Educational Trust Group of Institutions (SETGOI) Durgapur.',
};

const DIRECTORY_ROWS = [
  {
    index: '01',
    title: 'Notes & PYQs',
    description: 'Semester-wise notes and MAKAUT question papers',
    href: '/notes',
    badge: '14 PDFs',
  },
  {
    index: '02',
    title: 'Student Forum',
    description: 'Ask doubts and share placement or coding threads',
    href: '/forum',
    badge: 'Active Q&A',
  },
  {
    index: '03',
    title: 'Campus Directory',
    description: 'Departments, faculty contacts, hostel and bus timings',
    href: '/campus',
    badge: '3D Map',
  },
  {
    index: '04',
    title: 'Academic Tools',
    description: 'MAKAUT 10-point SGPA calculator and official notices',
    href: '/tools',
    badge: '10-Pt Scale',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden flex flex-col justify-between">
      {/* Architectural Dot Grid Background with Bottom Fade */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_90%)]"
        aria-hidden="true"
      />

      {/* Section 1 — Split Hero */}
      <section className="relative z-10 pt-32 sm:pt-36 pb-16 lg:pb-20 max-w-6xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column (58%) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200/80 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-600 font-medium">
                SETGOI DURGAPUR • STUDENT PORTAL
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-950 leading-[1.12]">
              Everything for your{' '}
              <span className="text-blue-600">B.Tech semester</span>, in one place.
            </h1>

            <p className="mt-4 text-zinc-500 text-base sm:text-lg max-w-xl leading-relaxed">
              MAKAUT notes, past papers, student Q&A, and campus info.
            </p>

            {/* Quick Search Bar */}
            <QuickSearchBar />

            {/* Primary Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/notes"
                className="px-6 py-2.5 rounded-full text-sm font-medium bg-[#09090B] text-white hover:bg-zinc-800 transition-colors shadow-xs"
              >
                Explore Notes
              </Link>
              <Link
                href="/campus"
                className="px-6 py-2.5 rounded-full text-sm font-medium bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 transition-colors shadow-2xs"
              >
                Campus Info
              </Link>
              <Link
                href="/tools"
                className="px-4 py-2.5 rounded-full text-sm font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
              >
                SGPA Calc →
              </Link>
            </div>
          </div>

          {/* Right Column (42%) - Interactive Campus Preview Card */}
          <div className="lg:col-span-5 w-full">
            <CampusPreviewCard />
          </div>
        </div>
      </section>

      {/* Section 2 — Clean Editorial Index */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24 w-full">
        <div className="border-t border-zinc-200">
          {DIRECTORY_ROWS.map((row) => (
            <Link
              key={row.index}
              href={row.href}
              className="py-6 px-4 -mx-4 rounded-xl border-b border-zinc-200/90 flex items-center justify-between group hover:bg-white/90 hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-zinc-300 transition-all cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-w-0">
                <span className="font-mono text-xs sm:text-sm text-zinc-400 group-hover:text-blue-600 transition-colors shrink-0">
                  {row.index}
                </span>
                <span className="text-lg sm:text-xl font-semibold text-zinc-950 group-hover:text-zinc-950 transition-colors">
                  {row.title}
                </span>
                <span className="text-xs sm:text-sm text-zinc-500 font-normal truncate">
                  {row.description}
                </span>
              </div>

              <div className="flex items-center gap-4 shrink-0 ml-4">
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-zinc-100 text-zinc-600 border border-zinc-200/70 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200 transition-colors">
                  {row.badge}
                </span>
                <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-950 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 3 — Single-Line Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto px-6 py-8 border-t border-zinc-200 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
        <span>SanakaHub • SETGOI</span>
        <span>
          Anti-Ragging & Medical Helpline:{' '}
          <a
            href="tel:18001805522"
            className="text-zinc-700 hover:text-zinc-950 font-medium"
          >
            1800-180-5522
          </a>
        </span>
      </footer>
    </div>
  );
}
