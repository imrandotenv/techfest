'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  Compass, 
  MessageSquare, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Zap, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

export function DarkBentoSection() {
  return (
    <section className="w-full py-12 sm:py-16 bg-gradient-to-b from-[#F8FAFF] to-[#EEF2FF] border-y border-zinc-200/80 my-8">
      <div className="max-w-6xl mx-auto px-6 w-full">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-blue-200/80 text-[#2563EB] text-xs font-mono mb-3 shadow-2xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Do more with SanakaHub Tools</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-[#09090B] leading-[1.14]">
            The AI-powered academic cockpit for every student.
          </h2>

          <p className="mt-3 text-[#52525B] font-sans text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            SanakaHub tools help students and faculty move faster through semesters with 100% MAKAUT precision.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-10 sm:mb-12">
          {/* Card 1: SGPA Calculator (6 cols) */}
          <div className="lg:col-span-6 rounded-2xl border border-[#E4E4E7] bg-white p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E4E4E7]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#2563EB]">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-display font-bold text-[#09090B]">MAKAUT SGPA Calculator</h3>
                    <p className="text-[11px] font-mono text-[#52525B]">10-Point Scale Multiplier</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  Accurate
                </span>
              </div>

              {/* Interactive Mock Preview */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50/80 border border-[#E4E4E7] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#52525B]">Target SGPA</span>
                  <span className="text-base font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    8.92
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#2563EB] to-emerald-500 h-1.5 rounded-full w-[89%]" />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#52525B]">
                  <span>Credits: 21.0</span>
                  <span>Grade: E (Outstanding)</span>
                </div>
              </div>

              <p className="mt-3.5 text-xs text-[#52525B] leading-relaxed font-sans">
                Weight your marks according to official MAKAUT credits and calculate semester SGPA or cumulative YGPA with instant copyable audit reports.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E4E4E7]">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#2563EB] hover:text-blue-700 transition-colors group-hover:translate-x-0.5 transition-transform"
              >
                <span>Calculate Your SGPA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: 3D Campus Spatial Map (6 cols) */}
          <div className="lg:col-span-6 rounded-2xl border border-[#E4E4E7] bg-white p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E4E4E7]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#2563EB]">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-display font-bold text-[#09090B]">SETGOI 3D Digital Twin</h3>
                    <p className="text-[11px] font-mono text-[#52525B]">Interactive Spatial Visualizer</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-[#2563EB] border border-blue-200 font-semibold">
                  Interactive
                </span>
              </div>

              {/* Interactive Mock Preview */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50/80 border border-[#E4E4E7] space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-[#09090B] pb-1.5 border-b border-[#E4E4E7]">
                  <span>Zone A • Academic Core</span>
                  <span className="text-emerald-700 font-semibold">Active</span>
                </div>
                <div className="flex items-center justify-between text-[#09090B] pb-1.5 border-b border-[#E4E4E7]">
                  <span>Zone B • Portico &amp; Transit Bay</span>
                  <span className="text-[#2563EB] font-semibold">Buses Ready</span>
                </div>
                <div className="flex items-center justify-between text-[#52525B]">
                  <span>Zone C • Advanced B.Tech Labs &amp; Workshops</span>
                  <span className="text-[#52525B]">24/7 SOS</span>
                </div>
              </div>

              <p className="mt-3.5 text-xs text-[#52525B] leading-relaxed font-sans">
                Explore the entire Malandighi campus in full 3D. Locate faculty chambers, exam venues, engineering workshops, and bus routes in seconds.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E4E4E7]">
              <Link
                href="/campus"
                className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#2563EB] hover:text-blue-700 transition-colors group-hover:translate-x-0.5 transition-transform"
              >
                <span>Launch 3D Explorer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Student Forum (12 cols full width) */}
          <div className="lg:col-span-12 rounded-2xl border border-[#E4E4E7] bg-white p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#2563EB]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-display font-bold text-[#09090B]">Student Forum &amp; Academic Q&amp;A</h3>
                  <p className="text-[11px] font-mono text-[#52525B]">Peer Discussions, Coding Queries &amp; Placement Insights</p>
                </div>
              </div>

              <Link
                href="/forum"
                className="px-3.5 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-mono font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors border border-blue-200/80 shadow-2xs"
              >
                <span>Join Student Forum</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Thread Rows */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-[#E4E4E7] space-y-1.5 hover:bg-slate-50 transition-colors">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-[#2563EB] border border-blue-200 font-bold">
                  PCC-CS301
                </span>
                <h4 className="text-xs font-sans font-semibold text-[#09090B] line-clamp-2">
                  Best reference books for Graph Algorithms in MAKAUT Sem 3?
                </h4>
                <div className="text-[11px] font-mono text-[#52525B]">14 replies • Verified Answer</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-[#E4E4E7] space-y-1.5 hover:bg-slate-50 transition-colors">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                  T&amp;P Cell
                </span>
                <h4 className="text-xs font-sans font-semibold text-[#09090B] line-clamp-2">
                  TCS Ninja &amp; Cognizant on-campus placement preparation guidelines
                </h4>
                <div className="text-[11px] font-mono text-[#52525B]">38 replies • Senior Advice</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-[#E4E4E7] space-y-1.5 hover:bg-slate-50 transition-colors">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                  Transit
                </span>
                <h4 className="text-xs font-sans font-semibold text-[#09090B] line-clamp-2">
                  Updated Route 4 Bus Timings from Muchipara &amp; Durgapur Station
                </h4>
                <div className="text-[11px] font-mono text-[#52525B]">8 replies • Official Notice</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Reasons to Choose SanakaHub */}
        <div className="mb-10 sm:mb-12">
          <h3 className="text-center text-lg sm:text-2xl font-display font-bold tracking-tight text-[#09090B] mb-6">
            3 reasons to choose SanakaHub.
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-[#E4E4E7] bg-white shadow-2xs space-y-2">
              <h4 className="text-xs sm:text-sm font-sans font-semibold text-[#09090B]">
                No context switching — One platform for notes, tools &amp; campus
              </h4>
              <p className="text-xs text-[#52525B] leading-relaxed font-sans">
                Never jump between fragmented WhatsApp groups, slow university portals, and lost Google Drive links again.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#E4E4E7] bg-white shadow-2xs space-y-2">
              <h4 className="text-xs sm:text-sm font-sans font-semibold text-[#09090B]">
                10-Point MAKAUT Precision — Tailored to university rules
              </h4>
              <p className="text-xs text-[#52525B] leading-relaxed font-sans">
                Every calculation and grade point is pre-configured to match the official MAKAUT credit-multiplier grading scale.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#E4E4E7] bg-white shadow-2xs space-y-2">
              <h4 className="text-xs sm:text-sm font-sans font-semibold text-[#09090B]">
                Zero cost &amp; student-first — Built for SETGOI Durgapur
              </h4>
              <p className="text-xs text-[#52525B] leading-relaxed font-sans">
                Open, community-driven, and completely free of commercial paywalls or third-party ads.
              </p>
            </div>
          </div>
        </div>

        {/* Crisp Light-Mode Campus Utility Benchmark */}
        <div className="rounded-2xl bg-white border border-[#E4E4E7] p-6 sm:p-10 text-center shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-semibold">
              Campus Utility Benchmark
            </div>
            <div className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-[#09090B]">
              10,000+
            </div>
            <p className="text-xs sm:text-sm text-[#52525B] font-sans font-medium">
              Verified Downloads &amp; Solved University Question Papers
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-[#E4E4E7] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#09090B]">3.5k+</div>
              <div className="text-xs text-[#52525B] mt-0.5 font-sans">Lecture Handouts &amp; Lab Manuals</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#2563EB]">100%</div>
              <div className="text-xs text-[#52525B] mt-0.5 font-sans">MAKAUT Syllabus Aligned</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#09090B]">5 Zones</div>
              <div className="text-xs text-[#52525B] mt-0.5 font-sans">Interactive 3D Campus Engine</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
