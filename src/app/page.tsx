import React from 'react';
import Link from 'next/link';
import { Compass, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { AppWindowPreview } from '@/components/landing/AppWindowPreview';
import { AcademicVaultGrid } from '@/components/landing/AcademicVaultGrid';
import { DarkBentoSection } from '@/components/landing/DarkBentoSection';
import { GradientCtaBanner } from '@/components/landing/GradientCtaBanner';
import { HeroQuickSearch } from '@/components/landing/HeroQuickSearch';

export const metadata = {
  title: 'SanakaHub | Centralized SETGOI Student Utility & Academic Vault',
  description:
    'Effortlessly access MAKAUT notes, solved PYQs, 10-point SGPA calculators, and 3D campus navigation for Sanaka Educational Trust Group of Institutions (SETGOI) Durgapur.',
};

const DEPARTMENTS = [
  { name: 'MAKAUT WB', href: '/notes?category=MAKAUT_PYQ' },
  { name: 'Computer Science (CSE)', href: '/notes?branch=CSE' },
  { name: 'Electronics & Comm (ECE)', href: '/notes?branch=ECE' },
  { name: 'Electrical Engg (EE)', href: '/notes?branch=EE' },
  { name: 'Mechanical Engg (ME)', href: '/notes?branch=ME' },
  { name: 'Civil Engg (CE)', href: '/notes?branch=CE' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between overflow-x-hidden">
      {/* Background Subtle Radial Dot Pattern */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black_20%,transparent_75%)]"
        aria-hidden="true"
      />

      {/* Section 1: Above-the-Fold Hero & Live Vault Preview */}
      <section className="relative z-10 pt-20 sm:pt-24 pb-12 sm:pb-14 px-6 text-center max-w-6xl mx-auto w-full">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E2E8F0] shadow-2xs mb-3.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-[#475569] font-medium">
            SETGOI DURGAPUR • STUDENT PORTAL
          </span>
        </div>

        {/* Display Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-[-0.03em] text-[#0F172A] max-w-4xl mx-auto leading-[1.12]">
          Give your B.Tech journey a modern academic cockpit.
        </h1>

        {/* Subtitle */}
        <p className="mt-3.5 text-sm sm:text-base lg:text-lg font-sans text-[#475569] max-w-2xl mx-auto leading-relaxed">
          Join thousands of SETGOI students accessing verified MAKAUT notes, solved past papers, and instant SGPA calculations.
        </p>

        {/* Dual CTAs */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/sign-up"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs sm:text-sm font-sans font-semibold bg-[#0F172A] text-white hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Start in 30 seconds</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          </Link>
          <Link
            href="/notes"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs sm:text-sm font-sans font-medium bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-slate-50 transition-all shadow-2xs flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-[#2563EB]" />
            <span>Explore Vault</span>
          </Link>
        </div>

        {/* Inline Quick Course / Subject Search Bar */}
        <HeroQuickSearch />

        {/* Sub-CTA Trust Note */}
        <p className="mt-3 text-xs font-mono text-[#475569]/80">
          MAKAUT affiliated • 100% Free for SETGOI students • No subscription required
        </p>

        {/* Elevated SanakaHub App Window Preview */}
        <div className="mt-8 sm:mt-10">
          <AppWindowPreview />
        </div>

        {/* Affiliation / Department Logos Ticker with Interactive Links */}
        <div className="mt-12 sm:mt-14 pt-8 border-t border-[#E2E8F0]">
          <p className="text-xs font-mono uppercase tracking-widest text-[#475569] mb-4">
            Trusted by students &amp; faculty across SETGOI departments
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {DEPARTMENTS.map((dept) => (
              <Link
                key={dept.name}
                href={dept.href}
                className="group px-3.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] hover:border-[#0F172A] hover:bg-slate-50 transition-all shadow-2xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>{dept.name}</span>
                <span className="text-[10px] text-[#475569]/60 group-hover:text-[#2563EB] transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Split "Academic Vault" Feature with 2x2 Hairline Grid */}
      <AcademicVaultGrid />

      {/* Section 3: Refined Contained Dark-Ink Bento Showcase (#0F172A rounded-3xl) */}
      <DarkBentoSection />

      {/* Section 4: Soft Periwinkle-Blue Gradient CTA Banner */}
      <GradientCtaBanner />
    </div>
  );
}
