'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Download, 
  ArrowRight, 
  Sparkles,
  BookOpen
} from 'lucide-react';

const FEATURES = [
  {
    icon: CheckCircle2,
    title: 'Verified Syllabus Notes',
    description: '100% aligned with latest MAKAUT curriculum across all branches.',
  },
  {
    icon: FileText,
    title: 'Solved PYQ Archive',
    description: '10-year semester question papers with step-by-step solutions.',
  },
  {
    icon: ShieldCheck,
    title: 'Faculty Reviewed',
    description: 'Checked and vetted by SETGOI department professors and HoDs.',
  },
  {
    icon: Download,
    title: 'Instant PDF Downloads',
    description: 'Direct high-speed downloads without ad-block walls or surveys.',
  },
];

export function AcademicVaultGrid() {
  return (
    <section className="py-12 sm:py-16 max-w-6xl mx-auto px-6 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column (55%) */}
        <div className="lg:col-span-7 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 mb-4 text-[#2563EB] text-xs font-mono font-medium">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Vault</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-[-0.02em] text-[#0F172A] leading-[1.14]">
            The modern study engine for MAKAUT notes and PYQs.
          </h2>

          <p className="mt-3.5 text-[#475569] font-sans text-sm sm:text-base max-w-xl leading-relaxed">
            Curated semester notes, syllabus handbooks, and faculty-verified past papers. Built for SETGOI B.Tech students who value speed, accuracy, and zero ads.
          </p>

          <div className="mt-5">
            <Link
              href="/notes"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-sans font-medium bg-[#0F172A] text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <span>Explore Notes Vault</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 2x2 Hairline Feature Grid with Crisp Icon Containers & Consistent Heights */}
          <div className="mt-8 w-full rounded-2xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {FEATURES.map((feat, index) => {
                const Icon = feat.icon;
                const isTop = index < 2;
                const isLeft = index % 2 === 0;

                return (
                  <div
                    key={feat.title}
                    className={`p-5 sm:p-6 transition-colors hover:bg-slate-50/70 min-h-[140px] flex flex-col justify-between ${
                      !isTop ? 'border-t border-[#E2E8F0]' : ''
                    } ${
                      isLeft ? 'sm:border-r border-[#E2E8F0]' : ''
                    }`}
                  >
                    <div>
                      <div className="w-9 h-9 rounded-lg bg-slate-50 border border-[#E2E8F0] flex items-center justify-center text-[#2563EB] mb-2.5">
                        <Icon className="w-4 h-4 text-[#2563EB]" />
                      </div>
                      <h3 className="text-sm font-display font-bold text-[#0F172A] mb-1">
                        {feat.title}
                      </h3>
                      <p className="text-xs font-sans text-[#475569] leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (45%) — Elevated Note Document Preview Card + Quote */}
        <div className="lg:col-span-5 w-full space-y-4">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-[0_12px_40px_rgba(15,23,42,0.05)] hover:shadow-[0_16px_50px_rgba(15,23,42,0.07)] transition-all space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-[#0F172A] text-white">
                PCC-CS301
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" /> Faculty Verified
              </span>
            </div>

            <div>
              <div className="text-xs font-mono text-[#475569] mb-1">
                MAKAUT B.Tech • Semester 3
              </div>
              <h3 className="text-base sm:text-lg font-display font-bold text-[#0F172A] leading-snug">
                Data Structures &amp; Algorithms - Complete Unit 1 to 5 Hand-Written Notes
              </h3>
              <p className="text-xs font-sans text-[#475569] mt-2 leading-relaxed">
                Stacks, Queues, Trees (AVL, B-Trees), Graph traversals (BFS, DFS, Dijkstra), and Dynamic Programming with solved university questions.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] text-xs font-mono text-[#475569]">
              <span>PDF • 4.2 MB</span>
              <span>384 Downloads</span>
            </div>

            <Link
              href="/notes"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-sans font-medium transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Lecture Notes (Free)</span>
            </Link>
          </div>

          {/* Testimonial Quote Pill matching Hashnode */}
          <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-2xs text-xs text-[#475569] leading-relaxed">
            <p className="italic text-slate-700 font-sans">
              &ldquo;SETTech&apos;s vault made studying for MAKAUT end-sems straightforward. Having verified handwritten notes and past questions in one spot saved hours of frantic hunting.&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white font-mono text-xs flex items-center justify-center font-bold">
                AC
              </div>
              <div>
                <div className="font-sans font-semibold text-[#0F172A]">Arjun Chatterjee</div>
                <div className="text-[11px] text-[#475569] font-mono">CSE Class Representative, SETGOI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
