import React from 'react';
import Link from 'next/link';
import { Compass, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AppWindowPreview } from '@/components/landing/AppWindowPreview';
import { AcademicVaultGrid } from '@/components/landing/AcademicVaultGrid';
import { DarkBentoSection } from '@/components/landing/DarkBentoSection';
import { GradientCtaBanner } from '@/components/landing/GradientCtaBanner';
import { LandingFooter } from '@/components/landing/LandingFooter';

export const metadata = {
  title: 'SanakaHub | Centralized SETGOI Student Utility & Academic Vault',
  description:
    'Effortlessly access MAKAUT notes, solved PYQs, 10-point SGPA calculators, and 3D campus navigation for Sanaka Educational Trust Group of Institutions (SETGOI) Durgapur.',
};

const DEPARTMENTS = [
  'MAKAUT WB',
  'Computer Science (CSE)',
  'Electronics & Comm (ECE)',
  'Electrical Engg (EE)',
  'Mechanical Engg (ME)',
  'Civil Engg (CE)',
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between overflow-x-hidden">
      {/* Background Subtle Radial Dot Pattern */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black_20%,transparent_75%)]"
        aria-hidden="true"
      />

      {/* Section 1: Hashnode-style Centered Bold Hero */}
      <section className="relative z-10 pt-32 sm:pt-40 pb-16 px-6 text-center max-w-6xl mx-auto w-full">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-zinc-200/90 shadow-2xs mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-600 font-medium">
            SETGOI DURGAPUR • STUDENT PORTAL
          </span>
        </div>

        {/* Display Headline matching Hashnode reference */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-zinc-950 max-w-4xl mx-auto leading-[1.08]">
          Create, collaborate, and excel across your B.Tech semesters.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
          Effortlessly access MAKAUT syllabus notes, solved PYQs, 10-point SGPA calculators, and 3D campus navigation with zero bloat.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/notes"
            className="w-full sm:w-auto px-7 py-3 rounded-full text-sm font-semibold bg-[#09090B] text-white hover:bg-zinc-800 transition-all shadow-sm"
          >
            Explore Notes Vault
          </Link>
          <Link
            href="/campus"
            className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-medium bg-white text-zinc-900 border border-zinc-200/90 hover:bg-zinc-50 transition-all shadow-2xs flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-blue-600" />
            <span>Launch 3D Campus Tour</span>
          </Link>
        </div>

        {/* Sub-CTA Trust Note */}
        <p className="mt-3 text-xs font-mono text-zinc-400">
          MAKAUT affiliated • 100% Free for SETGOI students • No subscription required
        </p>

        {/* Elevated SanakaHub App Window Preview */}
        <div className="mt-12 sm:mt-16">
          <AppWindowPreview />
        </div>

        {/* Affiliation / Department Logos Ticker */}
        <div className="mt-16 pt-10 border-t border-zinc-200/70">
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-6">
            Trusted by students & faculty across SETGOI departments
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {DEPARTMENTS.map((dept) => (
              <span
                key={dept}
                className="px-3.5 py-1.5 rounded-lg bg-white border border-zinc-200/80 text-xs font-mono text-zinc-600 shadow-2xs"
              >
                {dept}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Split "Academic Vault" Feature with 2x2 Hairline Grid */}
      <AcademicVaultGrid />

      {/* Section 3: High-Contrast Dark Bento Band (#09090B + Indigo Radial Glow) */}
      <DarkBentoSection />

      {/* Section 4: Soft Periwinkle-Blue Gradient CTA Banner */}
      <GradientCtaBanner />

      {/* Section 5: Multi-Column White Footer with Live Campus Status */}
      <LandingFooter />
    </div>
  );
}
