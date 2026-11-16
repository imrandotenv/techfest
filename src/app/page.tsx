import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
  },
  {
    index: '02',
    title: 'Student Forum',
    description: 'Ask doubts and share placement or coding threads',
    href: '/forum',
  },
  {
    index: '03',
    title: 'Campus Directory',
    description: 'Departments, faculty contacts, hostel and bus timings',
    href: '/campus',
  },
  {
    index: '04',
    title: 'Academic Tools',
    description: 'MAKAUT 10-point SGPA calculator and official notices',
    href: '/tools',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between">
      {/* Section 1 — Quiet Hero */}
      <section className="pt-36 pb-20 max-w-4xl mx-auto px-6 w-full">
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">
          SETGOI DURGAPUR • STUDENT PORTAL
        </p>

        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-zinc-950">
          Everything for your B.Tech semester, in one place.
        </h1>

        <p className="mt-4 text-zinc-500 text-lg">
          MAKAUT notes, past papers, student Q&A, and campus info.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/notes"
            className="px-6 py-2.5 rounded-full text-sm font-medium bg-[#09090B] text-white hover:bg-zinc-800 transition-colors"
          >
            Explore Notes
          </Link>
          <Link
            href="/campus"
            className="px-6 py-2.5 rounded-full text-sm font-medium bg-transparent text-zinc-900 border border-[#D4D4D8] hover:bg-zinc-100 transition-colors"
          >
            Campus Info
          </Link>
        </div>
      </section>

      {/* Section 2 — Clean Editorial Index */}
      <section className="max-w-4xl mx-auto px-6 pb-24 w-full">
        <div className="border-t border-zinc-200">
          {DIRECTORY_ROWS.map((row) => (
            <Link
              key={row.index}
              href={row.href}
              className="py-7 border-b border-zinc-200 flex items-center justify-between group hover:pl-2 transition-all cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                <span className="font-mono text-xs sm:text-sm text-zinc-400 group-hover:text-zinc-900 transition-colors">
                  {row.index}
                </span>
                <span className="text-lg sm:text-xl font-semibold text-zinc-950">
                  {row.title}
                </span>
                <span className="text-xs sm:text-sm text-zinc-500 font-normal">
                  {row.description}
                </span>
              </div>

              <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-950 group-hover:translate-x-1 transition-all shrink-0 ml-4" />
            </Link>
          ))}
        </div>
      </section>

      {/* Section 3 — Single-Line Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-8 border-t border-zinc-200 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
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
